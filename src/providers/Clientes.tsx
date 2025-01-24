import { io } from "socket.io-client";
import { server } from "../lib/server";
import { createContext, useContext, useEffect, useState } from "react";
import { ClienteType } from "../types/clientes";

const socket = io(server.url);

const ClientesContext = createContext({
  clientes: [] as ClienteType[],
});

export default function Clientes({ children }: { children: React.ReactNode}) {
  const [clientes, setClientes] = useState<ClienteType[]>([])
  const [loading, setLoading] = useState(true);

  async function obtenerClientes() {
    try {
      const response = await fetch(`${server.url}/clientes`, {
        method: "GET",
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data = await response.json();

      if(Array.isArray(data)) {
        setClientes(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    socket.on('clienteAdd', (cliente: ClienteType) => {
      addCliente(cliente);
    });

    socket.on('clienteUpdate', (cliente: ClienteType) => {
      updateCliente(cliente);
    });

    socket.on('clienteDelete', (id: string) => {
      setClientes((prevClientes) => prevClientes.filter((prevCliente) => prevCliente.id !== id));
    });

    obtenerClientes();

    return () => {
      socket.off('clienteAdd');
      socket.off('clienteUpdate');
      socket.off('clienteDelete');
    };
  }, []);

  function addCliente(cliente: ClienteType){
    setClientes((prevClientes) => {
      const updateClientes = [...prevClientes, cliente];

      updateClientes.sort((a, b) => a.nombres.localeCompare(b.nombres));
      return updateClientes;
    });
  }

  function updateCliente(cliente: ClienteType){
    setClientes((prevClientes) => {
      const updateClientes = prevClientes.map((prevCliente) => {
        if(prevCliente.id === cliente.id){
          return { id: cliente.id, nombres: cliente.nombres, direccion: cliente.direccion, telefono: cliente.telefono };
        }

        return prevCliente;
      });

      updateClientes.sort((a, b) => a.nombres.localeCompare(b.nombres));
      return updateClientes;
    });
  }

  if(loading) {
    return (
      <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando...</h1>
      </div>
    )
  }

  return (
    <ClientesContext.Provider value={{ clientes }}>
      {children}
    </ClientesContext.Provider>
  )
}

export const useClientes = () => useContext(ClientesContext);
