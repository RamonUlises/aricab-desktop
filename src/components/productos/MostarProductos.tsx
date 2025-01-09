import { ProductoType } from "../../types/productos";
import { EditarProducto } from "./EditarProducto";

export const MostarProductos = ({
  productos,
}: {
  productos: ProductoType[];
}) => {
  const totalCompra = productos.reduce(
    (acc, producto) => acc + producto.cantidad * producto.precioCompra,
    0
  );

  const totalVenta = productos.reduce(
    (acc, producto) => acc + producto.cantidad * producto.precioVenta,
    0
  );

  return (
    <div className="mt-5 w-[97%] mx-auto">
      <table className="table-products w-full border-collapse ">
        <thead className="bg-green-400">
          <tr className="text-sm">
            <th className="py-2 pl-2">Nombre</th>
            <th className="py-2 pl-2 w-[90px]">Cantidad</th>
            <th className="py-2 pl-2 w-[120px]">Precio compra</th>
            <th className="py-2 pl-2 w-[120px]">Precio venta</th>
            <th className="py-2 pl-2 w-[120px]">Total compra</th>
            <th className="py-2 pl-2 w-[120px]">Total venta</th>
            <th className="py-2 pl-2 w-[120px]">Diferencia</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className="text-sm text-zinc-800">
              <td className="border">
                <EditarProducto productoA={producto}>{producto.nombre}</EditarProducto>
              </td>
              <td className="border px-2 py-2 text-center">{producto.cantidad}</td>
              <td className="border px-2 py-2 text-center">C${producto.precioCompra}</td>
              <td className="border px-2 py-2 text-center">C${producto.precioVenta}</td>
              <td className="border px-2 py-2 text-center">
                C${producto.cantidad * producto.precioCompra}
              </td>
              <td className="border px-2 py-2 text-center">
                C${producto.cantidad * producto.precioVenta}
              </td>
              <td className="border px-2 py-2 text-center">
                C${producto.cantidad * producto.precioVenta - producto.cantidad * producto.precioCompra}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="w-full flex justify-end mt-5 text-sm">
        <div className="w-[120px] border border-black">
          <p className="text-center bg-green-400">Total compra</p>
          <p className="text-zinc-800 text-center">C$ {totalCompra}</p>
        </div>
        <div className="w-[120px] border border-black">
          <p className="text-center bg-green-400 ">Total </p>
          <p className="text-zinc-800 text-center">C$ {totalVenta}</p>
        </div>
        <div className="w-[120px] border border-black">
          <p className="text-center bg-green-400">Diferencia </p>
          <p className="text-zinc-800 text-center">C$ {totalVenta - totalCompra}</p>
        </div>
      </div>
    </div>
  );
};
