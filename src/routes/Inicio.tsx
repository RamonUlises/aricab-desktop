import { useEffect } from "react"
import { Layout } from "../layouts/Layout"
import { actualizacion } from "../utils/actualizacion"

export const Inicio = () => {
  useEffect(() => {
    (async () => {
      await actualizacion();
    })();
  }, [])
  return (
    <Layout>
      <h1 className="text-center my-auto text-3xl font-bold text-green-500">Bienvenido a Aricab...</h1>
    </Layout>
  )
}
