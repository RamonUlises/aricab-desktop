import { FacturaType } from "@/types/facturas";
import { useState } from "react";
import { VerFactura } from "./VerFactura";
import { AbonarFactura } from "./AbonarFactura";
import { CircleDollarSign, Eye, Printer, Save, Trash2 } from "lucide-react";
import { deleteFactura } from "@/lib/facturas";
import { createPDF } from "@/utils/createPDF";
import { useClientes } from "@/providers/Clientes";
import { invoke } from "@tauri-apps/api/core";

export type modalVisible = null | "ver" | "abonar" | "menu";

export function FacturasMostar({ facturas }: { facturas: FacturaType[] }) {
  const { clientes } = useClientes();

  // Agrupar facturas por fecha y hora (sin segundos) para mostrarlas en la lista, ordenar
  const facturasPorFecha = facturas.reduce(
    (acc: Record<string, FacturaType[]>, factura) => {
      const fechaKey = new Date(factura.fecha).toLocaleDateString(); // Convertir fecha a string
      if (!acc[fechaKey]) {
        acc[fechaKey] = [];
      }
      acc[fechaKey].push(factura);
      return acc;
    },
    {}
  );

  Object.keys(facturasPorFecha).forEach((fechaKey) => {
    facturasPorFecha[fechaKey].sort((b, a) => {
      const horaA = new Date(a.fecha).getTime();
      const horaB = new Date(b.fecha).getTime();
      return horaA - horaB; // Más recientes primero
    });
  });

  // Ordenar por fecha y hora, entre más reciente primero
  const fechasOrdenadas = Object.keys(facturasPorFecha).sort((a, b) => {
    // Convertir las cadenas de fecha a objetos Date usando un formato consistente
    const fechaA = new Date(a.split("/").reverse().join("/")).getTime();
    const fechaB = new Date(b.split("/").reverse().join("/")).getTime();
    return fechaB - fechaA; // Más recientes primero
  });

  const [selectedFactura, setSelectedFactura] = useState({} as FacturaType);
  const [modalVisible, setModalVisible] = useState<modalVisible>(null);

  return (
    <div>
      {facturas.length > 0 ? (
        fechasOrdenadas.map((fecha) => (
          <div key={fecha}>
            {/* Título de la fecha */}
            <h3 className="text-lg font-semibold text-zinc-800 px-4 py-2 text-center">
              {fecha}
            </h3>
            {/* Facturas de esta fecha */}
            <div className="flex flex-wrap justify-center">
              {facturasPorFecha[fecha].map((factura) => {
                // Calcular la hora de la factura no usar formato de 24 horas y agregar ceros a la izquierda, usar am/pm
                const hora = new Date(factura.fecha).toLocaleTimeString(
                  "en-US",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <button
                    className="flex flex-row justify-between items-center px-4 py-4 m-1 rounded border-black border-[0.5px] w-full max-w-[400px] gap-2"
                    key={factura.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedFactura(factura);
                      setModalVisible("menu");
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <h3 className="text-base font-medium m-0 p-0 text-zinc-800 text-start">
                        {factura.nombre}
                      </h3>
                      <p className="text-[12px] -mt-1 text-zinc-800">
                        Fecha: {new Date(factura.fecha).toLocaleDateString()}
                      </p>
                      <p className="text-[12px] -mt-1 text-zinc-800">
                        Hora: {hora}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-800">
                        C$ {factura.total - factura.pagado}
                      </p>
                    </div>
                  </button>
                );
              })}

              <div
                className="w-screen h-screen fixed bg-black/40 z-50 top-0 left-0 over-hidden justify-center items-center cursor-pointer "
                style={{
                  display: modalVisible === "menu" ? "flex" : "none",
                }}
                onClick={(event) => {
                  event.stopPropagation();

                  setModalVisible(null);
                  setSelectedFactura({} as FacturaType);
                }}
              >
                <div className="bg-white overflow-hidden w-56">
                  <button
                    className="py-4 border-b-[0.8px] flex flex-row pl-2 gap-4 w-full text-sm hover:bg-slate-200 transition-colors duration-500"
                    onClick={(event) => {
                      event.stopPropagation();

                      setModalVisible("ver");
                    }}
                  >
                    <Eye size={20} />
                    Ver factura
                  </button>
                  <button
                    className="py-4 border-b-[0.8px] flex flex-row pl-2 gap-4 w-full text-sm hover:bg-slate-200 transition-colors duration-500"
                    onClick={async (event) => {
                      event.stopPropagation();

                      const pagadoo =
                        selectedFactura.tipo === "crédito"
                          ? selectedFactura.pagado
                          : selectedFactura.productos.reduce(
                              (acc, prod) => acc + prod.precio * prod.cantidad,
                              0
                            );

                      try {
                        const { pdf } = await createPDF(
                          selectedFactura.productos,
                          selectedFactura.nombre,
                          selectedFactura.id,
                          selectedFactura.fecha,
                          selectedFactura.tipo,
                          pagadoo,
                          clientes
                        );

                        const res = await invoke("save_pdf", { pdfData: pdf });

                        console.log(res);
                        
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  >
                    <Save size={20} />
                    Guardar
                  </button>
                  <button
                    className="py-4 border-b-[0.8px] flex flex-row pl-2 gap-4 w-full text-sm hover:bg-slate-200 transition-colors duration-500"
                    onClick={async (event) => {
                      event.stopPropagation();
                      const pagadoo =
                        selectedFactura.tipo === "crédito"
                          ? selectedFactura.pagado
                          : selectedFactura.productos.reduce(
                              (acc, prod) => acc + prod.precio * prod.cantidad,
                              0
                            );

                      const { pdf } = await createPDF(
                        selectedFactura.productos,
                        selectedFactura.nombre,
                        selectedFactura.id,
                        selectedFactura.fecha,
                        selectedFactura.tipo,
                        pagadoo,
                        clientes
                      );

                      await invoke("share_pdf", { pdf });
                    }}
                  >
                    <Printer size={20} />
                    Imprimir
                  </button>
                  <button
                    disabled={
                      !(selectedFactura.total - selectedFactura.pagado !== 0)
                    }
                    className="py-4 border-b-[0.8px] flex flex-row pl-2 gap-4 w-full text-sm hover:bg-slate-200 transition-colors duration-500"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (!selectedFactura.id) return;
                      setModalVisible("abonar");
                    }}
                  >
                    <CircleDollarSign size={20} />
                    Abonar a factura
                  </button>
                  <button
                    className="py-4 border-b-[0.8px] flex flex-row pl-2 gap-4 w-full text-sm hover:bg-red-600 transition-colors duration-500 hover:text-white"
                    onClick={async (event) => {
                      event.stopPropagation();

                      const res = confirm(
                        "¿Estás seguro de eliminar esta factura?"
                      );
                      if (!res) return;

                      await deleteFactura(selectedFactura.id);
                      setModalVisible(null);
                    }}
                  >
                    <Trash2 size={20} />
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h2 className="text-center text-xl py-4 font-semibold text-zinc-800">
          No hay facturas
        </h2>
      )}
      <AbonarFactura
        id={selectedFactura.id}
        visible={modalVisible === "abonar"}
        saldo={selectedFactura.total - selectedFactura.pagado}
        cliente={selectedFactura.nombre}
        setModalVisible={setModalVisible}
      />
      {selectedFactura.id !== undefined && (
        <VerFactura
          visible={modalVisible === "ver"}
          setVisible={setModalVisible}
          factura={selectedFactura}
        />
      )}
    </div>
  );
}
