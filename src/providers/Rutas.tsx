import io from 'socket.io-client';
import { server } from '../lib/server';
import { createContext, useContext, useEffect, useState } from 'react';
import { RutasTypes } from '../types/Rutas';

const socket = io(server.url);

const RutasContext = createContext({
  rutas: [] as RutasTypes[],
});

export default function RutasProvider ({ children }: { children: React.ReactNode}) {
  const [rutas, setRutas] = useState([] as RutasTypes[]);
  const [loading, setLoading] = useState(true);

  const fetchRutas = async () => {
    try {
      const response = await fetch(`${server.url}/rutas`, {
        headers:{
          'Authorization': `Basic ${server.credetials}`
        }
      });
      const data: RutasTypes[] = await response.json();
      
      setRutas([]);
      
      if(Array.isArray(data)){
        setRutas(data);
      }

      setLoading(false);
    } catch {
      setRutas([]);
      setLoading(false);
    }
  };

  const addRuta = (ruta: RutasTypes) => {
    setRutas((prevRutas) => [ruta, ...prevRutas]);
  };

  useEffect(() => {
    socket.on('rutaAdd', (ruta: RutasTypes) => {
      addRuta(ruta);
    });

    socket.on('rutaUpdate', (ruta: RutasTypes) => {
      setRutas((prevRuta) => {
        const updateProductos = prevRuta.map((prevProducto) => {
          if (prevProducto.id === ruta.id) {
            return ruta;
          }
          return prevProducto;
        });

        return updateProductos;
      });
    });

    socket.on('rutaDelete', (id: string) => {
      setRutas((prevRuta) => prevRuta.filter((ruta) => ruta.id !== id));
    });

    fetchRutas();

    return () => {
      socket.off('rutaAdd');
      socket.off('rutaUpdate');
      socket.off('rutaDelete');
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
    <RutasContext.Provider value={{ rutas }}>
      {children}
    </RutasContext.Provider>
  );
}

export const useRutas = () => useContext(RutasContext);