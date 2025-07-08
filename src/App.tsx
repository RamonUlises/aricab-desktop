import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Inicio } from "./routes/Inicio";
import { Productos } from "./routes/Productos";
import { Rutas } from "./routes/Rutas";
import { Personal } from "./routes/Personal";
import { ProductosRuta } from "./routes/ProductosRuta";
import { Clientes } from "./routes/Clientes";
import { Facturas } from "./routes/Facturas";
import { useEffect, useState } from "react";
import { TresEnRaya } from "./components/TresEnRaya";
import { ResumenRegistro } from "./routes/ResumenRegistro";
import { Creditos } from "./routes/Creditos";
import { useCreditos } from "./providers/Creditos";
import { verificarCreditosFecha } from "./utils/verificarCreditosFecha";

function App() {
  const [connection, setConnectio] = useState(true);
  const [verified, setVerired] = useState(false);
  const { creditos } = useCreditos();

  useEffect(() => {
    window.addEventListener("online", () => {
      setConnectio(true);
    });

    window.addEventListener("offline", () => {
      setConnectio(false);
    });

    if (!verified) {
      verificarCreditosFecha(creditos);
      setVerired(true);
    }
  }, []);

  return (
    <>
      {connection ? (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/rutas" element={<Rutas />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/facturas" element={<Facturas />} />
            <Route path="/creditos" element={<Creditos />} />
            <Route path="/:id/productos" element={<ProductosRuta />} />
            <Route path="/registros/:id" element={<ResumenRegistro />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className="bg-slate-200 w-screen h-screen flex flex-col justify-center items-center">
          <TresEnRaya />
        </div>
      )}
    </>
  );
}

export default App;
