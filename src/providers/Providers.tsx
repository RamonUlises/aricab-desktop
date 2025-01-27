import ProductosProvider from "./Productos";
import RutasProvider from "./Rutas";
import ClientesProvider from "./Clientes";
import FacturasProvider from "./FacturasProvider";
import PersonalProvider from "./Personal";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductosProvider>
      <FacturasProvider>
        <RutasProvider>
          <ClientesProvider>
            <PersonalProvider>{children}</PersonalProvider>
          </ClientesProvider>
        </RutasProvider>
      </FacturasProvider>
    </ProductosProvider>
  );
}
