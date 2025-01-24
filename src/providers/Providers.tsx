import ProductosProvider from "./Productos";
import RutasProvider from "./Rutas";
import ClientesProvider from "./Clientes";
import FacturasProvider from "./FacturasProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductosProvider>
      <FacturasProvider>
        <RutasProvider>
          <ClientesProvider>{children}</ClientesProvider>
        </RutasProvider>
      </FacturasProvider>
    </ProductosProvider>
  );
}
