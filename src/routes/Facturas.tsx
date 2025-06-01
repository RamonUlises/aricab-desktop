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

export const Facturas = () => {
  const { facturas } = useFacturas();
  const [facturasSeleccionadas, setFacturasSeleccionadas] = useState(facturas);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFacturasSeleccionadas(facturas);
  }, [facturas]);

  useEffect(() => {
    setLoading(true);
    if (!date) {
      setFacturasSeleccionadas(facturas);
      setLoading(false);
      return;
    }

    const fechaFormateada = date.toISOString().split("T")[0];
    searchFacturas(fechaFormateada);
  }, [date]);

  async function searchFacturas(fecha: string) {
    try {
      const response = await fetch(`${server.url}/facturas/fecha/${fecha}`, {
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
      setFacturasSeleccionadas([]);
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="flex items-center justify-center gap-8 mt-4">
        <h1 className="text-center font-bold text-zinc-800">Facturas</h1>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? (
                new Date(date).toLocaleDateString()
              ) : (
                <span>Seleccione la fecha</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm transition-colors duration-300"
          onClick={() => setDate(undefined)}
        >
          eliminar filtro
        </button>
      </div>

      {loading && (
        <h1 className="text-center font-bold mt-4">
          Cargando...
        </h1>
      )}
      {facturasSeleccionadas.length === 0 && !loading ? (
        <h3 className="text-center mt-8 font-bold">Sin Facturas</h3>
      ) : facturasSeleccionadas.length > 0 && !loading && (
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
      )}
    </Layout>
  );
};
