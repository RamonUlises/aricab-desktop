import { useEffect, useState } from "react";
import { Layout } from "../layouts/Layout";
import { useClientes } from "../providers/Clientes";
import { useFacturas } from "../providers/FacturasProvider";
import { AgregarClientes } from "../components/clientes/AgregarClientes";
import { EditarCliente } from "../components/clientes/EditarClientes";

export const Clientes = () => {
  const { clientes } = useClientes();
  const { facturas } = useFacturas();
  const [clientesSeleccionados, setClientesSeleccionados] = useState(clientes);
  const [busqueda, setBusqueda] = useState("");

  function filtrar(event: React.ChangeEvent<HTMLInputElement>) {
    setBusqueda(event.target.value);

    if (event.target.value === "") {
      setClientesSeleccionados(clientes);
      return;
    }

    const clientesFiltrados = clientes.filter((cliente) =>
      cliente.nombres.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setClientesSeleccionados(clientesFiltrados);
  }

  useEffect(() => {
    setClientesSeleccionados(clientes);
  }, [clientes]);

  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Clientes</h1>
      <div className="flex justify-between items-center px-3">
        <AgregarClientes />
        <input
          value={busqueda}
          onChange={filtrar}
          type="search"
          placeholder="Buscar clientes"
          className="bg-slate-400 text-black placeholder:text-black px-2 w-full max-w-[360px] outline-none rounded-md py-1 text-sm"
        />
      </div>
      <div className="px-3 mt-2">
        {clientesSeleccionados.length === 0 ? (
          <div className="flex justify-center items-center h-96">
            <h1 className="text-3xl font-bold">No hay clientes</h1>
          </div>
        ) : (
          clientesSeleccionados.map((cliente) => {
            const totalCredito = facturas
              .filter((factura) => factura.nombre === cliente.nombres)
              .reduce(
                (acc, factura) => acc + factura.total - factura.pagado,
                0
              );
            return (
              <div
                key={cliente.id}
                className="bg-slate-100 border border-black px-4 py-2 rounded-md flex items-center justify-between gap-3"
              >
                <div>
                  <EditarCliente clienteA={cliente}>
                    <h1 className="text-lg font-bold">{cliente.nombres}</h1>
                  </EditarCliente>
                  <p className="text-sm p-0">{cliente.telefono}</p>
                  <p className="text-sm -mt-1">{cliente.direccion}</p>
                </div>
                <div>
                  <h1 className="text-sm font-bold">Credito:</h1>
                  <p className="text-sm p-0">C$ {totalCredito}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Layout>
  );
};
