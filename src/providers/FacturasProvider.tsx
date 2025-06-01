import { createContext, useContext, useEffect, useState } from "react";
import { FacturaType, ProductoFacturaType } from "../types/facturas";
import { server } from "../lib/server";
import { io } from "socket.io-client";

const FacturasContext = createContext({
  facturas: [] as FacturaType[],
});

const socket = io(server.url);

export default function FacturasProvider ({ children }: { children: React.ReactNode}) {
  const [facturas, setFacturas] = useState([] as FacturaType[]);
  const [loading, setLoading] = useState(true);

  const fetchFacturas = async () => {
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() es 0-indexado
      const dd = String(today.getDate()).padStart(2, "0");

      const formattedDate = `${yyyy}-${mm}-${dd}`;

      const hoy = new Date(formattedDate);
      const response = await fetch(`${server.url}/facturas/fecha/${hoy}`, {
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: FacturaType[] = await response.json();

      if(Array.isArray(data)){
        setFacturas(data);
      }

      setLoading(false);
    } catch {
      setFacturas([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on('facturaAdd', (factura: FacturaType) => {
      setFacturas((prevFacturas) => [factura, ...prevFacturas]);
    });

    socket.on('facturaUpdate', ({ id, productos, total, tipo, pagado }: { id: string, productos: ProductoFacturaType[], total: number, tipo: string, pagado: number }) => {
      setFacturas((prevFacturas) => {
        const updatedFacturas = prevFacturas.map((prevFactura) => {
          if(prevFactura.id === id){
            return { ...prevFactura, productos, total, tipo, pagado };
          }

          return prevFactura;
        });

        return updatedFacturas;
      });
    });

    socket.on('facturaDelete', (id: string) => {
      setFacturas((prevFacturas) => prevFacturas.filter((prevFactura) => prevFactura.id !== id));
    });

    socket.on('facturaAbonar', ({ id, total }: {id: string, total: number}) => {
      setFacturas((prevFacturas) => {
        const updatedFacturas = prevFacturas.map((prevFactura) => {
          if(prevFactura.id === id){
            return { ...prevFactura, pagado: total };
          }

          return prevFactura;
        });

        return updatedFacturas;
      });
    });

    socket.on('updateName', async () => {
      setFacturas([]);
      await fetchFacturas();
    });

    fetchFacturas();

    return () => {
      socket.off('facturaAdd');
      socket.off('facturaUpdate');
      socket.off('facturaDelete');
      socket.off('facturaAbonar');
      socket.off('updateName');
    }
  }, []);

  if(loading) {
    return (
      <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando...</h1>
      </div>
    )
  }

  return (
    <FacturasContext.Provider value={{ facturas }}>
      {children}
    </FacturasContext.Provider>
  );
}

export const useFacturas = () => useContext(FacturasContext);