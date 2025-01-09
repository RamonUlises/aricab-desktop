import io from 'socket.io-client';
import { server } from '../lib/server';
import { createContext, useContext, useEffect, useState } from 'react';
import { ProductoType } from '../types/productos';

const socket = io(server.url);

const ProductosContext = createContext({
  productos: [] as ProductoType[],
});

export default function ProductosProvider ({ children }: { children: React.ReactNode}) {
  const [productos, setProductos] = useState([] as ProductoType[]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${server.url}/productos`, {
        method: "GET",
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: ProductoType[] = await response.json();
      
      setProductos([]);
      
      data.forEach((producto) => {
        setProductos((prevProductos) => [...prevProductos, { nombre: producto.nombre, precioCompra: producto.precioCompra, precioVenta: producto.precioVenta, cantidad: producto.cantidad, id: producto.id }]);
      });

      setLoading(false);
    } catch {
      setProductos([]);
      setLoading(false);
    }
  };

  const addProducto = (producto: ProductoType) => {
    setProductos((prevProductos) => {
      const updateProductos = [...prevProductos, producto];

      updateProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
      return updateProductos
    });
  };

  useEffect(() => {
    socket.on('productAdd', (producto: ProductoType) => {
      addProducto(producto);
    });

    socket.on('productUpdate', (producto: ProductoType) => {
      setProductos((prevProductos) => {
        const updateProductos = prevProductos.map((prevProducto) => {
          if (prevProducto.id === producto.id) {
            return producto;
          }
          return prevProducto;
        });

        updateProductos.sort((a, b) => a.nombre.localeCompare(b.nombre));
        return updateProductos;
      });
    });
    
    socket.on('productDelete', (productoId: string) => {
      setProductos((prevProductos) => prevProductos.filter((prevProducto) => prevProducto.id !== productoId));
    });
    
    socket.on("updateProd", () => {
      fetchProductos()
    });

    fetchProductos();

    return () => {
      socket.off('productAdd');
      socket.off('productUpdate');
      socket.off('productDelete');
      socket.off("updateProd");
    };
  }, []);

  if(loading) {
    return (
      <div className="bg-zinc-800 w-full h-full justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando...</h1>
      </div>
    )
  }

  return (
    <ProductosContext.Provider value={{ productos }}>
      {children}
    </ProductosContext.Provider>
  );
}

export const useProductos = () => useContext(ProductosContext);