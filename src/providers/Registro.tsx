import io from 'socket.io-client';
import { server } from '../lib/server';
import { createContext, useContext, useEffect, useState } from 'react';
import { RegistroType } from '@/types/registro';

const socket = io(server.url);

const RegistroContext = createContext({
  registros: [] as RegistroType[],
});

export default function RegistroProvider ({ children }: { children: React.ReactNode}) {
  const [registro, setRegistro] = useState([] as RegistroType[]);
  const [loading, setLoading] = useState(true);

  const fetchRutas = async () => {
    try {
      const response = await fetch(`${server.url}/registros`, {
        headers:{
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: RegistroType[] = await response.json();
      
      setRegistro([]);
      
      if(Array.isArray(data)){
        setRegistro(data);
      }

      setLoading(false);
    } catch {
      setRegistro([]);
      setLoading(false);
    }
  };

  const addRegistro = (registro: RegistroType) => {
    setRegistro((prevReg) => [registro, ...prevReg]);
  };

  useEffect(() => {
    socket.on('registroAdd', (registro: RegistroType) => {
      addRegistro(registro);
    });

    socket.on('registroUpdate', (registro: RegistroType) => {
      setRegistro((prevRegis) => prevRegis.map((reg) => reg.id === registro.id ? registro : reg));
    });

    socket.on('registroDelete', (id: string) => {
      setRegistro((prevRegis) => prevRegis.filter((reg) => reg.id !== id));
    });

    socket.on('registroTerminada', ({ id, sobrantes}: { id: string, sobrantes: Record<string, number> }) => {
      setRegistro((prevRegis) => prevRegis.map((reg) => reg.id === id ? {...reg, terminada: true, sobrantes} : reg));
    });

    fetchRutas();

    return () => {
      socket.off('registroAdd');
      socket.off('registroUpdate');
      socket.off('registroDelete');
      socket.off('registroTerminada');
    };
  }, []);

  if(loading) {
    return (
      <div className="bg-slate-200 w-screen h-screen flex justify-center items-center">
        <h1 className='text-3xl font-bold'>Cargando registros...</h1>
      </div>
    )
  }

  return (
    <RegistroContext.Provider value={{ registros: registro }}>
      {children}
    </RegistroContext.Provider>
  );
}

export const useRegistro = () => useContext(RegistroContext);