import { Layout } from "@/layouts/Layout";
import { useProductos } from "@/providers/Productos";
import { useRegistro } from "@/providers/Registro";
import { useRutas } from "@/providers/Rutas";
import { useParams } from "react-router-dom";

export function ResumenRegistro() {
  const { id } = useParams();
  const { registros } = useRegistro();
  const { rutas } = useRutas();
  const { productos } = useProductos();

  const registro = registros.find((reg) => reg.id === id);
  const ruta = rutas.find((ruta) => ruta.id === registro?.ruta);

  if (!registro || !ruta) {
    return (
      <h1 className="text-center font-bold mt-4 text-zinc-800">
        Registro no encontrado
      </h1>
    );
  }

  let totalCompra = 0;
  let totalVenta = 0;

  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">
        Resumen de registro
      </h1>
      <div className="mt-5 w-[97%] mx-auto pb-7">
        <table className="table-products w-full border-collapse ">
          <thead className="bg-green-400">
            <tr className="text-sm">
              <th className="py-2 pl-2">Productos</th>
              {ruta.dias.map((dia) => (
                <th className="py-2 pl-2 w-[80px]">{dia}</th>
              ))}
              <th className="py-2 pl-2 w-[80px]">Cambios</th>
              <th className="py-2 pl-2 w-[90px]">Sobrantes</th>
              <th className="py-2 pl-2 w-[90px]">Total</th>
              <th className="py-2 pl-2 w-[120px]">Total compra</th>
              <th className="py-2 pl-2 w-[120px]">Total venta</th>
              <th className="py-2 pl-2 w-[120px]">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => {
              const sobrante = registro.sobrantes?.[producto.nombre] ?? 0;
              const cambio = registro.cambios?.[producto.nombre] ?? 0;
              const total =
                Object.values(registro.productos).reduce((acc, dia) => {
                  const value = dia[producto.nombre];
                  return acc + (value === 0 || value == undefined ? 0 : value);
                }, 0) -
                sobrante -
                cambio;

              const totalCompraValue = (total * producto.precioCompra)
                .toString()
                .includes(".")
                ? parseFloat((total * producto.precioCompra).toFixed(2))
                : total * producto.precioCompra;
              const totalVentaValue = (total * producto.precioVenta)
                .toString()
                .includes(".")
                ? parseFloat((total * producto.precioVenta).toFixed(2))
                : total * producto.precioVenta;
              const diferenciaValue = (totalVentaValue - totalCompraValue)
                .toString()
                .includes(".")
                ? parseFloat((totalVentaValue - totalCompraValue).toFixed(2))
                : totalVentaValue - totalCompraValue;

              totalCompra += totalCompraValue;
              totalVenta += totalVentaValue;

              return (
                <tr key={producto.id} className="text-sm text-zinc-800">
                  <td className="border">
                    <p className="text-zinc-800 ml-2">{producto.nombre}</p>
                  </td>
                  {ruta.dias.map((dia) => {
                    const value = registro.productos[dia]?.[producto.nombre];
                    return (
                      <td className="border px-2 py-2 text-center">
                        {value === 0 || value == undefined ? "" : value}
                      </td>
                    );
                  })}
                  <td className="border px-2 py-2 text-center">
                    {cambio === 0 || cambio == null ? "" : cambio}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    {sobrante === 0 || sobrante == null ? "" : sobrante}
                  </td>
                  <td className="border px-2 py-2 text-center">{total}</td>
                  <td className="border px-2 py-2 text-center">
                    C$ {totalCompraValue}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    C$ {totalVentaValue}
                  </td>
                  <td className="border px-2 py-2 text-center">
                    C$ {diferenciaValue}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="w-full flex justify-end mt-5 text-sm">
          <div className="w-[120px] border border-black">
            <p className="text-center bg-green-400">Total compra</p>
            <p className="text-zinc-800 text-center">C$ {totalCompra.toString().includes(".") ? (totalCompra).toFixed(2) : totalCompra}</p>
          </div>
          <div className="w-[120px] border border-black">
            <p className="text-center bg-green-400 ">Total venta</p>
            <p className="text-zinc-800 text-center">C$ {totalVenta.toString().includes(".") ? (totalVenta).toFixed(2) : totalVenta}</p>
          </div>
          <div className="w-[120px] border border-black">
            <p className="text-center bg-green-400">Diferencia </p>
            <p className="text-zinc-800 text-center">C$ {(totalVenta - totalCompra).toString().includes(".") ? ((totalVenta - totalCompra)).toFixed(2) : (totalVenta - totalCompra)}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
