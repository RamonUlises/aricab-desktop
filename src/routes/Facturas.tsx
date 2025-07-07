import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Layout } from "../layouts/Layout";
import { Card, CardContent } from "../components/ui/card";
import { useFacturas } from "@/providers/FacturasProvider";
import { useEffect, useState } from "react";
import { FacturasMostar } from "@/components/facturas/Facturas";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/utils";
import { es } from "date-fns/locale";
import { FacturaType } from "@/types/facturas";
import { server } from "@/lib/server";

type filterType = "fecha" | "credito" | null;

export const Facturas = () => {
  const { facturas } = useFacturas();
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState(facturas);
  const [date1, setDate1] = useState<Date | undefined>(undefined);
  const [date2, setDate2] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<filterType>(null);

  useEffect(() => {
    setFacturasSeleccionadas(facturas);
    setDate1(undefined);
    setDate2(undefined);
  }, [facturas]);

  async function filterFacturas() {
    if (!date1 || !date2) {
      alert("Debes seleccionar un rango de fechas");
      return;
    }

    setLoading(true);
    setFilter("fecha");

    const fechaFormateada1 = date1.toISOString().split("T")[0];
    const fechaFormateada2 = date2.toISOString().split("T")[0];

    searchFacturas(fechaFormateada1, fechaFormateada2);
  }

  async function searchFacturas(fecha1: string, fecha2: string) {
    try {
      const response = await fetch(
        `${server.url}/facturas/rango/${fecha1}/${fecha2}`,
        {
          headers: {
            Authorization: `Basic ${server.credetials}`,
          },
        }
      );
      const data: FacturaType[] = await response.json();

      if (Array.isArray(data)) {
        setFacturasSeleccionadas(data);
      } else {
        setFacturasSeleccionadas([]);
      }

      setLoading(false);
    } catch {
      setFacturasSeleccionadas([]);
      setLoading(false);
    }
  }

  async function filterFacturasCreditos() {
    try {
      setFilter("credito");
      setLoading(true);

      const response = await fetch(`${server.url}/facturas/creditos/no-canceladas`, {
        headers: {
          Authorization: `Basic ${server.credetials}`,
        },
      });
      const data: FacturaType[] = await response.json();

      if (Array.isArray(data)) {
        setFacturasSeleccionadas(data);
      } else {
        setFacturasSeleccionadas([]);
      }

      setLoading(false);
    } catch {
      setLoading(false);
      setFacturasSeleccionadas([]);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between px-8 mt-4">
        <div className="flex items-center gap-4">
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date1}
                onSelect={setDate1}
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
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date2}
                onSelect={setDate2}
                initialFocus
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <button
            className={` bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm transition-colors duration-300`}
            onClick={() => {
              filterFacturas();
            }}
          >
            filtrar
          </button>
          <button
            className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm transition-colors duration-300`}
            onClick={() => {
              filterFacturasCreditos();
            }}
          >
            fac. créditos
          </button>
          <button
            className={`${
              filter === null && "hidden"
            } bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm transition-colors duration-300`}
            onClick={() => {
              setDate1(undefined);
              setDate2(undefined);
              setFacturasSeleccionadas(facturas);
              setFilter(null);
            }}
          >
            eliminar filtro
          </button>
        </div>
        <div>
          <p className="font-bold">Monto total:</p>
          <p>
            C${" "}
            {facturasSeleccionadas
              .reduce((acum, factura) => acum + factura.total, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {loading && <h1 className="text-center font-bold mt-4">Cargando...</h1>}
      {facturasSeleccionadas.length === 0 && !loading ? (
        <h3 className="text-center mt-8 font-bold">Sin Facturas</h3>
      ) : (
        facturasSeleccionadas.length > 0 &&
        !loading && (
          <Tabs defaultValue="todas" className="w-full my-4 h-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pagadas">Pagadas</TabsTrigger>
              <TabsTrigger value="nopagadas">No pagadas</TabsTrigger>
            </TabsList>
            <TabsContent value="todas" className="w-full h-full">
              <Card>
                <CardContent className="space-y-2">
                  <FacturasMostar facturas={facturasSeleccionadas} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pagadas" className="w-full h-full">
              <Card>
                <CardContent className="space-y-2">
                  <FacturasMostar
                    facturas={facturasSeleccionadas.filter(
                      (factura) => factura.tipo === "contado"
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nopagadas" className="w-full h-full">
              <Card>
                <CardContent className="space-y-2">
                  <FacturasMostar
                    facturas={facturasSeleccionadas.filter(
                      (factura) => factura.tipo === "crédito"
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )
      )}
    </Layout>
  );
};
