import { useEffect, useState } from "react";
import { Layout } from "../layouts/Layout";
import { actualizacion } from "../utils/actualizacion";
import { getFacturasCreditos } from "@/lib/facturas";
import ComparacionSemanalChart from "@/components/inicio/ComparacionSemanal";

export const Inicio = () => {
  const [facturasCount, setFacturasCount] = useState<{ count: number, total: number }>({ count: 0, total: 0 });


  useEffect(() => {
    (async () => {
      await actualizacion();
      const facturas: { count: number, total: number } = await getFacturasCreditos();
      setFacturasCount(facturas);

    })();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col px-2">
        <h1 className="text-xl font-bold text-center mt-4">
          Bienvenido a Aricab
        </h1>
        {/* <h3 className="font-semibold">Total de crédito</h3> */}
        <div className="flex items-center justify-center mt-3">
          <div className="bg-green-600 text-white border-2 border-green-600 rounded-s-md px-4">
            <p>Total de facturas de crédito</p>
          </div>
          <div className="border-2 border-green-600 px-4 rounded-e-md">
            <p>{facturasCount.count ?? 0}</p>
          </div>
        </div>
        <div className="flex items-center justify-center mt-3">
          <div className="bg-green-600 text-white border-2 border-green-600 rounded-s-md px-4">
            <p>Monto total de facturas</p>
          </div>
          <div className="border-2 border-green-600 px-4 rounded-e-md">
            <p>C$ {facturasCount.total ?? 0}</p>
          </div>
        </div>
        <h3 className="text-center font-semibold mt-8 text-xl">Comparación de ventas por semana</h3>
        <ComparacionSemanalChart />
      </div>
    </Layout>
  );
};
