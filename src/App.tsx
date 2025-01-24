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

function App() {
  return (
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
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}

export default App;
