import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Layout } from "../layouts/Layout";
import { Card, CardContent } from "../components/ui/card";
import { useFacturas } from "@/providers/FacturasProvider";
import { useEffect, useState } from "react";
import { FacturasMostar } from "@/components/facturas/Facturas";

export const Facturas = () => {
  const { facturas } = useFacturas();
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState(facturas);

  useEffect(() => {
    setFacturasSeleccionadas(facturas);
  }, [facturas]);
  
  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Clientes</h1>

      {facturasSeleccionadas.length === 0 ? (
        <h3>Sin Facturas</h3>
      ) : (
        <Tabs defaultValue="todas" className="w-full my-4 h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="pagadas">Pagadas</TabsTrigger>
            <TabsTrigger value="nopagadas">No pagadas</TabsTrigger>
          </TabsList>
          <TabsContent value="todas" className="w-full h-full">
            <Card>
              <CardContent className="space-y-2">
                <FacturasMostar facturas={facturasSeleccionadas} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pagadas" className="w-full h-full">
            <Card>
              <CardContent className="space-y-2">
                <FacturasMostar
                  facturas={facturasSeleccionadas.filter(
                    (factura) => factura.tipo === "contado"
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nopagadas" className="w-full h-full">
            <Card>
              <CardContent className="space-y-2">
                <FacturasMostar
                  facturas={facturasSeleccionadas.filter(
                    (factura) => factura.tipo === "crédito"
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};
