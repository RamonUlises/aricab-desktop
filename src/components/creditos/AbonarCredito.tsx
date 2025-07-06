import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { server } from "@/lib/server";
import { useRef, useState } from "react";

export function AbonarCredito({
  id,
  monto,
  abono,
}: {
  id: string;
  monto: number;
  abono: number;
}) {
  const [abonoCredito, setAbonoCredito] = useState(0);
  const cancelRef = useRef<HTMLButtonElement>(null);

  async function abonarCredito() {
    try {
      const response = await window.pet.put(
        `${server.url}/creditos/abonar/${id}`,
        {
          abono: abonoCredito,
        }
      ) as { message: string };

      if (response.message === "Credito abonado") {
        alert("Crédito abonado correctamente");

        setTimeout(() => {
          setAbonoCredito(0);
          if (cancelRef.current) {
            cancelRef.current.click();
          }
        }, 1000);
        return;
      }

      alert("Error al actualizar crédito");
    } catch {
      alert("Error al actualizar crédito");
    }
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <button className="text-sm bg-green-500 text-white rounded-md px-2 py-1">
            Abonar
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Abonar crédito</DialogTitle>
          </DialogHeader>
          <div className="">
            <p className="text-sm">Saldo pendiente: C${monto - abono}</p>

            <input
              type="number"
              className="bg-slate-100 text-black rounded-md px-2 py-1 w-full max-w-[360px] outline-none mt-3"
              placeholder="Monto a abonar"
              value={abonoCredito}
              onChange={(e) => {
                const value = e.target.value;
                if (isNaN(parseFloat(value))) return;
                if (parseFloat(value) > monto - abono) return;
                setAbonoCredito(parseFloat(value));
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button ref={cancelRef} variant="outline">Cancelar</Button>
            </DialogClose>
            <button
              onClick={abonarCredito}
              className="text-sm bg-green-500 text-white rounded-md px-2 py-1"
              type="button"
            >
              Abonar
            </button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
