import ProductosProvider from "./Productos";
import RutasProvider from "./Rutas";
import ClientesProvider from "./Clientes";
import FacturasProvider from "./FacturasProvider";
import PersonalProvider from "./Personal";
import RegistroProvider from "./Registro";
import CreditosProvider from "./Creditos";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProductosProvider>
      <FacturasProvider>
        <RutasProvider>
          <ClientesProvider>
            <PersonalProvider>
              <RegistroProvider>
                <CreditosProvider>{children}</CreditosProvider>
              </RegistroProvider>
            </PersonalProvider>
          </ClientesProvider>
        </RutasProvider>
      </FacturasProvider>
    </ProductosProvider>
  );
}
