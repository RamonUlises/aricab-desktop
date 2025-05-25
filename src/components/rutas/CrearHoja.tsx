import { cn } from "@/utils/utils";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { useEffect, useState } from "react";
import { X } from "@/icons/X";
import { es } from "date-fns/locale"
import { crearRegistro } from "@/lib/registro";
import { ProductosDiasType } from "@/types/registro";
import { ProductoType } from "@/types/productos";

export const CrearHoja = ({ ruta, productos, dias }: { ruta: string, productos: ProductoType[], dias: string[] }) => {
  const [open, setOpen] = useState(false);
  const [dateInicio, setDate] = useState<Date>();
  const [dateFin, setDateFin] = useState<Date>();

  useEffect(() => {
    setDateFin(undefined);
    setDate(undefined);
  }, [open]);

  async function crearHojaFunc() {
    if (!dateInicio || !dateFin) {
      alert("Seleccione las fechas");
      return;
    }
    try {
      const productosObj: Record<string, ProductosDiasType> = {};
      const cambios: Record<string, number> = {};
      const sobrantes: Record<string, number> = {};

      productos.forEach((producto) => {
        dias.forEach((dia) => {
          productosObj[dia] = { ...productosObj[dia], [producto.nombre]: 0 };
        });

        sobrantes[producto.nombre] = 0;
        cambios[producto.nombre] = 0;
      });

      const response = await crearRegistro(ruta, dateInicio.toString(), dateFin.toString(), productosObj, sobrantes, cambios);

      if(response === "Registro creado correctamente"){
        setOpen(false);
      }

      alert(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-300"
        onClick={() => setOpen(true)}
      >
        Crear hoja
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
          <p className="m-0 p-0 text-sm -mb-3">Fecha de inicio</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateInicio && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {dateInicio ? (
                  new Date(dateInicio).toLocaleDateString()
                ) : (
                  <span>Seleccione la fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateInicio}
                onSelect={setDate}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <p className="m-0 p-0 text-sm -mb-3">Fecha del final</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !dateFin && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {dateFin ? (
                  new Date(dateFin).toLocaleDateString()
                ) : (
                  <span>Seleccione la fecha</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFin}
                onSelect={setDateFin}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-green-700 transition-colors duration-300"
            type="button"
            onClick={() => {
              crearHojaFunc();
              //setOpen(false);
            }}
          >
            Crear
          </button>
        </form>
      </dialog>
    </>
  );
};
