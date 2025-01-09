import { useEffect, useState } from "react";
import { AgregarProductos } from "../components/productos/AgregarProductos";
import { MostarProductos } from "../components/productos/MostarProductos";
import { Layout } from "../layouts/Layout";
import { useProductos } from "../providers/Productos";
import { busquedaProductos } from "../utils/busquedaProductos";

export const Productos = () => {
  const { productos } = useProductos();
  const [productosFiltrados, setProductosFiltrados] = useState(productos);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setProductosFiltrados(productos);
    setBusqueda("");
  }, [productos]);

  function filtrar(event: React.ChangeEvent<HTMLInputElement>) {
    setBusqueda(event.target.value);

    if(event.target.value === "") {
      setProductosFiltrados(productos);
      return;
    }

    setProductosFiltrados(busquedaProductos(productos, event.target.value) || []);
  }

  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Productos</h1>
      <div className="flex justify-between items-center px-3">
        <AgregarProductos />
        <input value={busqueda} onChange={filtrar} type="search" placeholder="Buscar productos" className="bg-slate-400 text-black placeholder:text-black px-2 w-full max-w-[360px] outline-none rounded-md py-1 text-sm" />
      </div>
      {productos.length === 0 ? (
        <div className="flex justify-center items-center h-[250px]">
          <h1 className="text-3xl font-bold text-zinc-800">
            No hay productos
          </h1>
        </div>
      ) : <MostarProductos productos={productosFiltrados} /> }
      
    </Layout>
  );
};
