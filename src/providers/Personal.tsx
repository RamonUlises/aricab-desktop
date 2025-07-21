import io from 'socket.io-client';
import { server } from '../lib/server';
import { createContext, useContext, useEffect, useState } from 'react';
import { PersonalType } from '@/types/personal';

const socket = io(server.url);

const PersonalContext = createContext({
  personal: [] as PersonalType[],
});

export default function PersonalProvider ({ children }: { children: React.ReactNode}) {
  const [personal, setPersonal] = useState([] as PersonalType[]);
  const [loading, setLoading] = useState(true);

  const fetchPersonal = async () => {
    try {
      const response = await fetch(`${server.url}/personal`, {
        method: "GET",
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: PersonalType[] = await response.json();
      
      setPersonal([]);
      
      if(response.status === 200) {
        setPersonal(data);
      }

      setLoading(false);
    } catch {
      setPersonal([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on('personalAdd', (personalNew: PersonalType) => {
      setPersonal((prev) => [...prev, personalNew]);
    });

    socket.on('personalUpdate', (personalNew: PersonalType) => {
      setPersonal((prevPersonal) => {
        const updateProductos = prevPersonal.map((prev) => {
          if (prev.id === personalNew.id) {
            return personalNew;
          }
          return prev;
        });

        return updateProductos;
      });
    });
    
    socket.on('personalDelete', (id: string) => {
      setPersonal((prevPersonal) => prevPersonal.filter((prev) => prev.id !== id));
    });

    fetchPersonal();

    return () => {
      socket.off('personalAdd');
      socket.off('personalUpdate');
      socket.off('personalDelete');
    };
  }, []);

  if(loading) {
    return (
      <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando personal...</h1>
      </div>
    )
  }

  return (
    <PersonalContext.Provider value={{ personal }}>
      {children}
    </PersonalContext.Provider>
  );
}

export const usePersonal = () => useContext(PersonalContext);