import { CrearCredito } from "@/components/creditos/CrearCredito";
import { CreditosMostrar } from "@/components/creditos/CreditosMostrar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/layouts/Layout";
import { useCreditos } from "@/providers/Creditos";
import { CreditosType } from "@/types/creditos";
import { useEffect, useState } from "react";

export const Creditos = () => {
  const { creditos } = useCreditos();

  const [creditosSeleccionados, setCreditosSeleccionados] = useState<CreditosType[]>(creditos);

  useEffect(() => {
    setCreditosSeleccionados(creditos);
  }, [creditos]);
  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Créditos</h1>
      <div className="px-5 flex justify-between">
        <CrearCredito />
        <p>Total: C${creditos.reduce((acum, credito) => acum + (credito.monto - credito.abono), 0).toFixed(2)}</p>
      </div>
      {creditos.length === 0 ? (
        <p className="text-center font-bold mt-4 text-zinc-800">
          No hay créditos
        </p>
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
                <CreditosMostrar creditos={creditosSeleccionados} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pagadas" className="w-full h-full">
            <Card>
              <CardContent className="space-y-2">
                <CreditosMostrar creditos={creditos.filter((credito) => credito.abono === credito.monto)} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="nopagadas" className="w-full h-full">
            <Card>
              <CardContent className="space-y-2">
                <CreditosMostrar creditos={creditos.filter((credito) => credito.abono !== credito.monto)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};
