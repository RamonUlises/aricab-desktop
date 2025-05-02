import { useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { actualizacion } from "../utils/actualizacion";

export const Inicio = () => {
  useEffect(() => {
    (async () => {
      await actualizacion();
    })();
  }, []);
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-green-500 mb-16">
          Bienvenido a Aricab...
        </h1>
      </div>
    </Layout>
  );
};
