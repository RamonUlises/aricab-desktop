import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "../layouts/Layout";
import { useRutas } from "../providers/Rutas";
import { useEffect, useState } from "react";
import { RutasProductosType } from "../types/rutasProductos";
import { actualizarProductosRuta, obtenerProductosRuta } from "../lib/rutas";
import { useProductos } from "../providers/Productos";
import { ProductoType } from "../types/productos";

export const ProductosRuta = () => {
  const { id } = useParams();
  const { rutas } = useRutas();
  const { productos } = useProductos();
  const ruta = rutas.find((ruta) => ruta.id === id);
  const navigate = useNavigate();

  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [resProd, setResProd] = useState<Record<string, number>>({});
  const [rutaPrd, setRutaPrd] = useState<RutasProductosType>(
    {} as RutasProductosType
  );

  const [newProductos, setNewProductos] = useState(productos);

  async function obtenerProductos() {
    try {
      if (!id) {
        return;
      }

      const prd = (await obtenerProductosRuta(
        id
      )) as unknown as RutasProductosType;

      setRutaPrd(prd);
    } catch {
      setRutaPrd({} as RutasProductosType);
    }
  }

  useEffect(() => {
    obtenerProductos();
  }, []);

  function change(event: React.ChangeEvent<HTMLInputElement>, id: string) {
    if (event.target.value === "") {
      setCantidades((prev) => ({
        ...prev,
        [id]: 0,
      }));
      return;
    }

    if (isNaN(Number(event.target.value))) return;

    setCantidades((prev) => ({
      ...prev,
      [id]: parseFloat(event.target.value),
    }));
  }

  function addCantidad(
    id: string,
    nombre: string,
    precio: number,
    cantidad: number
  ) {
    setRutaPrd((prevState) => {
      const productosActuales = prevState.productos;

      // Verificar si el producto ya existe
      const productoExistente = productosActuales.find(
        (producto) => producto.id === id
      );

      let nuevosProductos;
      if (productoExistente) {
        // Si existe, actualizar la cantidad
        nuevosProductos = productosActuales.map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: producto.cantidad + cantidad }
            : producto
        );
      } else {
        // Si no existe, agregarlo al arreglo
        nuevosProductos = [
          ...productosActuales,
          { id, nombre, precio, cantidad },
        ];
      }

      // Devolver el nuevo estado actualizado
      return { ...prevState, productos: nuevosProductos };
    });
    setNewProductos((prev) => {
      const nuevosProductos: ProductoType[] = [];

      prev.forEach(prd => {
        if(prd.id === id){
          nuevosProductos.push({ ...prd, cantidad: prd.cantidad - cantidad })
        } else {
          nuevosProductos.push(prd);
        }
      })

      return nuevosProductos;
    })
    setCantidades((prev) => ({ ...prev, [id]: 0 }));
    const res = resProd[id] ?? 0;
    setResProd((prev) => ({ ...prev, [id]: res + cantidad}))
  }

  function removeCantidad(id: string, cantidad: number) {
    setRutaPrd((prevState) => {
      const productosActuales = prevState.productos;

      // Verificar si el producto ya existe
      const productoExistente = productosActuales.find(
        (producto) => producto.id === id
      );

      if (!productoExistente) {
        // Si el producto no existe, simplemente devolvemos el estado actual
        return prevState;
      }

      let nuevosProductos;
      if (productoExistente.cantidad > cantidad) {
        // Si la resta no llega a 0, actualizar la cantidad
        nuevosProductos = productosActuales.map((producto) =>
          producto.id === id
            ? { ...producto, cantidad: producto.cantidad - cantidad }
            : producto
        );
      } else {
        // Si la resta llega a 0 o menos, eliminar el producto del arreglo
        nuevosProductos = productosActuales.filter(
          (producto) => producto.id !== id
        );
      }

      // Devolver el nuevo estado actualizado
      return { ...prevState, productos: nuevosProductos };
    });
    setNewProductos((prev) => {
      const nuevosProductos: ProductoType[] = [];

      prev.forEach(prd => {
        if(prd.id === id){
          nuevosProductos.push({ ...prd, cantidad: prd.cantidad + cantidad })
        } else {
          nuevosProductos.push(prd);
        }
      })

      return nuevosProductos;
    })
    setCantidades((prev) => ({ ...prev, [id]: 0 }));
    const res = resProd[id] ?? 0;
    setResProd((prev) => ({ ...prev, [id]: res - cantidad}))
  }

  async function actualizarProductos(){
    try {
      await actualizarProductosRuta(rutaPrd.id, rutaPrd.productos, newProductos)
    } finally {
      navigate("/rutas");
    }
  }

  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-slate-200">
        Productos {ruta?.usuario}
      </h1>
      {rutaPrd.productos && productos.length === 0 ? (
        <h2 className="text-center text-slate-200 mt-4">No hay productos</h2>
      ) : (
        <>
          <table className="w-[97%] mx-auto mt-4 border-collapse table-products">
            <thead className="text-sm bg-green-400">
              <tr>
                <th className="py-2 pl-2">Producto</th>
                <th className="py-2 pl-2 w-24">Cantidad</th>
                <th className="py-2 pl-2 w-24">Opciones</th>
                <th className="py-2 pl-2 w-24">Stok</th>
              </tr>
            </thead>
            <tbody className="text-zinc-800 text-sm">
              {productos.map((producto) => {
                let cantidad = 0;

                if (rutaPrd.productos) {
                  cantidad =
                    rutaPrd.productos.find((prd) => prd.id === producto.id)
                      ?.cantidad || 0;
                }

                const exist =
                  cantidades[producto.id] === 0 ||
                  cantidades[producto.id] == undefined;

                const resta = resProd[producto.id] ?? 0;

                return (
                  <tr key={producto.id}>
                    <td className="border p-2 left-text">{producto.nombre}</td>
                    <td className="border p-2 text-center">{cantidad}</td>
                    <td className="p-2 text-center flex">
                      <button
                        onClick={() =>
                          addCantidad(
                            producto.id,
                            producto.nombre,
                            producto.precioVenta,
                            cantidades[producto.id]
                          )
                        }
                        disabled={
                          exist || producto.cantidad < cantidades[producto.id]
                        }
                        className="bg-green-500 rounded-full w-7 h-7 disabled:bg-green-400"
                      >
                        +
                      </button>
                      <input
                        value={cantidades[producto.id] ?? 0}
                        onChange={(event) => change(event, producto.id)}
                        type="text"
                        className="mx-2 w-20 bg-white rounded-md outline-none px-2"
                      />
                      <button
                        onClick={() =>
                          removeCantidad(producto.id, cantidades[producto.id])
                        }
                        disabled={exist || cantidad < cantidades[producto.id]}
                        className="disabled:bg-red-400 bg-red-500 rounded-full w-7 h-7"
                      >
                        -
                      </button>
                    </td>
                    <td className="border p-2 text-center">
                      {producto.cantidad - resta}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
      <button onClick={actualizarProductos} className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-300 absolute bottom-0 right-0 m-8 z-50 px-4 py-2 rounded-md">Guardar</button>
    </Layout>
  );
};
