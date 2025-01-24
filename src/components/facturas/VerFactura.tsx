import { FacturaType } from "@/types/facturas";
import { modalVisible } from "./Facturas";
import { X } from "lucide-react";

export const VerFactura = ({
  visible,
  setVisible,
  factura,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<modalVisible>>;
  factura: FacturaType;
}) => {
  return (
    <div
      onClick={() => setVisible(null)}
      className={`${
        visible ? "flex" : "hidden"
      } w-screen h-screen bg-black/50 justify-center items-center fixed top-0 left-0`}
    >
      <div className="bg-white w-11/12 h-5/6 rounded-md px-3 py-2 relative max-w-96">
        <button
          onClick={() => setVisible(null)}
          className="absolute top-2 right-2 w-8"
        >
          <X size={20} />
        </button>
        <p className="text-center font-bold text-xl">Ari-Cab</p>
        <p className="text-center font-semibold">cliente: {factura.nombre}</p>
        <p className="text-center font-semibold">Estado: {factura.tipo}</p>
        <p className="text-center font-semibold">
          Fecha: {new Date(factura.fecha).toLocaleDateString()}
        </p>
        <div className="div-steps"></div>

        <div className="flex flex-row justify-between items-center">
          <p className="font-semibold text-base">Producto</p>
          <p className="font-semibold text-base">Monto</p>
        </div>
        <div className="div-steps"></div>

        <div className="mt-2">
          {factura.productos.map((producto) => (
            <div
              key={producto.id}
              className="flex flex-row justify-between items-center mx-1 rounded-md"
            >
              <div>
                <p className="text-base font-medium m-0 p-0 text-zinc-800">
                  {producto.nombre}
                </p>
                <p className="text-[14px] -mt-1 text-zinc-800">
                  {producto.precio} x {producto.cantidad}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-800">
                  C$ {producto.precio * producto.cantidad}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="div-steps"></div>

        <div className="flex flex-row justify-between items-center">
          <p className="font-semibold text-sm">Gran total</p>
          <p className="font-semibold text-sm">C$ {factura.total}</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-semibold text-sm">Pagado</p>
          <p className="font-semibold text-sm">C$ {factura.pagado}</p>
        </div>
        <div className="div-steps"></div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-semibold text-sm">Saldo</p>
          <p className="font-semibold text-sm">
            C$ {factura.total - factura.pagado}
          </p>
        </div>
      </div>
    </div>
  );
};
