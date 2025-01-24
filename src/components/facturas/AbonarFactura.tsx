import { useEffect, useState } from "react";
import { modalVisible } from "./Facturas";
import { abonarFacturaServer } from "@/lib/facturas";

export const AbonarFactura = ({
  cliente,
  visible,
  saldo,
  setModalVisible,
  id,
}: {
  cliente: string;
  visible: boolean;
  saldo: number;
  setModalVisible: React.Dispatch<React.SetStateAction<modalVisible>>;
  id: string;
}) => {
  const [abono, setAbono] = useState(0);
  const [loading, setLoading] = useState(false);

  async function abonarFactura() {
    if (abono === 0) return;
    setLoading(true);
    try {
      await abonarFacturaServer({ id, abono });
    } finally {
      setModalVisible(null);
    }
  }

  useEffect(() => {
    setAbono(0);
    setLoading(false);
  }, [visible]);

  return (
    <div
      style={{ display: visible ? "flex" : "none" }}
      className="justify-center items-center h-screen fixed top-0 left-0 bg-black/40 w-screen"
    >
      <div className="bg-white py-3 rounded-md px-4 w-full max-w-[400px] flex flex-col">
        <h3 className="text-center font-bold text-lg">Abonar a {cliente}</h3>
        <p className="mt-2">Saldo: C$ {saldo}</p>
        <input
          type="text"
          placeholder="Monto"
          className="border px-2 py-2 rounded mt-8 w-48 mx-auto outline-none"
          value={abono === 0 ? "" : String(abono)}
          onChange={(event) => {
            const text = event.target.value;
            if (!text) return setAbono(0);
            if (isNaN(Number(text))) return;
            if (Number(text) > saldo) return;

            setAbono(Number(text));
          }}
        />
        <div className="flex flex-row justify-end gap-2 mt-4">
          <button
            onClick={() => setModalVisible(null)}
            className="border border-red-600 px-2 py-1 rounded text-red-600"
          >
            Cancelar
          </button>
          <button
            onClick={abonarFactura}
            className="bg-green-600 disabled:bg-green-400 px-2 py-1 rounded text-white"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );
};
