import { deleteCreditos } from "@/lib/creditos";
import { CreditosType } from "@/types/creditos";
import { confirm } from "@tauri-apps/plugin-dialog";
import { AbonarCredito } from "./AbonarCredito";

export function CreditosMostrar({ creditos }: { creditos: CreditosType[] }) {
  async function deleteCredito(id: string) {
    try {
      const response = await deleteCreditos(id);

      if (response) {
        alert("Crédito eliminado correctamente");
        return;
      }

      alert("Error al eliminar crédito");
    } catch {
      alert("Error al eliminar crédito");
    }
  }
  return (
    <>
      <div className="py-3 flex flex-wrap justify-center">
        {creditos.length === 0 ? (
          <p className="text-center font-bold mt-4 text-zinc-800">
            No hay créditos
          </p>
        ) : (
          creditos.map((credito) => (
            <div
              key={credito.id}
              className="flex flex-col justify-between items-center px-4 py-4 m-1 rounded border-black border-[0.5px] w-full max-w-[400px] gap-2"
            >
              <h3 className="text-xl font-semibold">{credito.proveedor}</h3>
              <p className="text-sm">
                <strong>Monto total: </strong>C${credito.monto}
              </p>
              <p className="text-sm">
                <strong>Monto pagado: </strong>C${credito.abono}
              </p>
              <p className="text-sm">
                <strong>Monto restante: </strong>C${credito.monto - credito.abono}
              </p>
              <p className="text-sm">
                <strong>Fecha creación: </strong>
                {new Date(credito.fechaInicio).toLocaleDateString()}
                <br />
                <strong>Fecha expiración: </strong>
                {new Date(credito.fechaFin).toLocaleDateString()}
              </p>
              <div className="w-full flex justify-end gap-2 mt-2">
                <AbonarCredito id={credito.id} monto={credito.monto} abono={credito.abono} />
                <button
                  onClick={async () => {
                    const res = await confirm(
                      "¿Estás seguro de eliminar este crédito?"
                    );
                    if (!res) return;
                    deleteCredito(credito.id);
                  }}
                  className="text-sm bg-red-500 text-white rounded-md px-2 py-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
