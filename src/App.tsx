import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Inicio } from "./routes/Inicio";
import { Productos } from "./routes/Productos";
import { Rutas } from "./routes/Rutas";
import { Personal } from "./routes/Personal";
import { ProductosRuta } from "./routes/ProductosRuta";
import ProductosProvider from "./providers/Productos";
import RutasProvider from "./providers/Rutas";

function App() {
  return (
    <ProductosProvider>
      <RutasProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/rutas" element={<Rutas />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/:id/productos" element={<ProductosRuta />} />
          </Routes>
        </BrowserRouter>
      </RutasProvider>
    </ProductosProvider>
  );
}

export default App;
