import io from 'socket.io-client';
import { server } from '../lib/server';
import { createContext, useContext, useEffect, useState } from 'react';
import { CreditosType } from '@/types/creditos';

const socket = io(server.url);

const CreditosContext = createContext({
  creditos: [] as CreditosType[],
});

export default function CreditosProvider ({ children }: { children: React.ReactNode}) {
  const [creditos, setCreditos] = useState([] as CreditosType[]);
  const [loading, setLoading] = useState(true);

  const fetchCreditos = async () => {
    try {
      const response = await fetch(`${server.url}/creditos`, {
        method: "GET",
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: CreditosType[] = await response.json();
      
      setCreditos([]);
      
      if(response.status === 200) {
        setCreditos(data);
      }

      setLoading(false);
    } catch {
      setCreditos([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on('creditosAdd', (creditoNew: CreditosType) => {
      console.log(creditoNew);
      setCreditos((prev) => [creditoNew,...prev]);
    });

  
    socket.on('creditosDelete', (id: string) => {
      setCreditos((prevPersonal) => prevPersonal.filter((prev) => prev.id !== id));
    });

    socket.on('creditosAbonar', ({ id, abono}: { id: string, abono: number }) => {
      setCreditos((prevPersonal) => prevPersonal.map((prev) => {
        if (prev.id === id) {
          return {
            ...prev,
            abono: abono,
          }
        }
        return prev;
      }));
    });

    fetchCreditos();

    return () => {
      socket.off('creditosAdd');
      socket.off('creditosDelete');
    };
  }, []);

  if(loading) {
    return (
      <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando creditos...</h1>
      </div>
    )
  }

  return (
    <CreditosContext.Provider value={{ creditos }}>
      {children}
    </CreditosContext.Provider>
  );
}

export const useCreditos = () => useContext(CreditosContext);