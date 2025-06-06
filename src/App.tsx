import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Inicio } from "./routes/Inicio";
import { Productos } from "./routes/Productos";
import { Rutas } from "./routes/Rutas";
import { Personal } from "./routes/Personal";
import { ProductosRuta } from "./routes/ProductosRuta";
import { Clientes } from "./routes/Clientes";
import { Facturas } from "./routes/Facturas";
import Providers from "./providers/Providers";
import { useEffect, useState } from "react";
import { TresEnRaya } from "./components/TresEnRaya";
import { ResumenRegistro } from "./routes/ResumenRegistro";

function App() {
  // Verificar conexión a internet
  const [connection, setConnectio] = useState(true);

  useEffect(() => {
    window.addEventListener("online", () => {
      setConnectio(true);
    });

    window.addEventListener("offline", () => {
      setConnectio(false);
    });
  }, []);

  return (
    <>
      {connection ? (
        <Providers>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/rutas" element={<Rutas />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/facturas" element={<Facturas />} />
              <Route path="/:id/productos" element={<ProductosRuta />} />
              <Route path="/registros/:id" element={<ResumenRegistro />} />
            </Routes>
          </BrowserRouter>
        </Providers>
      ) : (
        <div className="bg-slate-200 w-screen h-screen flex flex-col justify-center items-center">
          <TresEnRaya />
        </div>
      )}
    </>
  );
}

export default App;
