import { Button } from "@/components/ui/button";
import { InputBottom } from "../InputBottom";
import { useEffect, useState } from "react";
import { CreditosType } from "@/types/creditos";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/utils/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { es } from "date-fns/locale";
import { X } from "@/icons/X";
import { crearCreditos } from "@/lib/creditos";

export function CrearCredito() {
  const [credito, setCredito] = useState<CreditosType>({
    id: "",
    proveedor: "",
    monto: 0,
    abono: 0,
    fechaInicio: "",
    fechaFin: "",
  });
  const [date1, setDate1] = useState<Date | undefined>(undefined);
  const [date2, setDate2] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [alerta, setAlerta] = useState("");

  function change(name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setCredito({
      ...credito,
      [name]: value,
    });
  }

  async function crearCredito() {
    setAlerta("");
    if (credito.proveedor === "") return;
    if (credito.monto === 0) return;
    if (date1 === undefined || date2 === undefined) return;
    if (credito.abono > credito.monto) return;

    try {
      const response = await crearCreditos(
        credito.proveedor,
        credito.monto,
        credito.abono,
        date1.toString(),
        date2.toString()
      );

      if (response === "Credito creado") {
        setAlerta("Crédito creado");

        setTimeout(() => {
          setAlerta("");
          setOpen(false);
        }, 1000);

        return;
      }

      setAlerta(response);
    } catch {
      setAlerta("Error al crear crédito");
    }
  }

  useEffect(() => {
    if (open) {
      setCredito({
        id: "",
        proveedor: "",
        monto: 0,
        abono: 0,
        fechaInicio: "",
        fechaFin: "",
      });
      setDate1(undefined);
      setDate2(undefined);
      setAlerta("");
    }
  }, [open]);

  return (
    <>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300 text-sm"
        onClick={() => setOpen(true)}
      >
        Crear crédito
      </button>
      <dialog
        className={`${
          open ? "flex" : "hidden"
        } bg-black/70 w-screen h-screen top-0 z-[60] justify-center items-center`}
      >
        <form className="bg-slate-200 flex flex-col p-4 gap-4 px-8 py-12 rounded-md justify-center items-center relative">
          <X
            className="absolute top-0 right-0 m-2 cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          />
          <h3 className="font-bold text-center text-xl">Crear nueva hoja</h3>
          <div className="mt-4 flex gap-7">
            <InputBottom
              placeholder="Proveedor"
              value={credito.proveedor}
              name="proveedor"
              change={change}
              type="text"
            />
            <InputBottom
              type="number"
              placeholder="Monto"
              value={credito.monto.toString()}
              name="monto"
              change={change}
            />
          </div>
          <InputBottom
            type="number"
            placeholder="Abono"
            value={credito.abono.toString()}
            name="abono"
            change={change}
          />
          <div className="mt-4 flex gap-7">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date1 && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date1 ? (
                    new Date(date1).toLocaleDateString()
                  ) : (
                    <span>Fecha inicio</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]">
                <Calendar
                  mode="single"
                  selected={date1}
                  onSelect={(date) => {
                    setCredito({
                      ...credito,
                      fechaInicio: date?.toString() ?? "",
                    });
                    setDate1(date);
                  }}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !date2 && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date2 ? (
                    new Date(date2).toLocaleDateString()
                  ) : (
                    <span>Fecha final</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]">
                <Calendar
                  mode="single"
                  selected={date2}
                  onSelect={(date) => {
                    setCredito({
                      ...credito,
                      fechaFin: date?.toString() ?? "",
                    });
                    setDate2(date);
                  }}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
          <p
            className={`${
              alerta === "Crédito creado" ? "text-green-500" : "text-red-500"
            } text-center font-semibold mt-8`}
          >
            {alerta}
          </p>
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white rounded-lg px-2 py-1 text-sm"
            onClick={crearCredito}
          >
            crear
          </button>
        </form>
      </dialog>
    </>
  );
}
