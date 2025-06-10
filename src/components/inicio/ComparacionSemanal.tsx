import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { comparacionFacturasSemanas } from "@/lib/facturas";
import { FacturaType } from "@/types/facturas";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRutas } from "@/providers/Rutas";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ComparacionSemanalChart() {
  const { rutas } = useRutas();
  const [facturas1, setFacturas1] = useState<FacturaType[]>([]);
  const [facturas2, setFacturas2] = useState<FacturaType[]>([]);
  const [fechas, setFechas] = useState<{ fecha1: string; fecha2: string }>({
    fecha1: "",
    fecha2: "",
  });
  const [rutaSelected, setRutaSelected] = useState<string>("");
  const [chartDataRuta, setChartDataRuta] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderRadius: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: "Total de ventas",
        data: [0, 0],
        backgroundColor: ["#22c55e", "#16a34a"],
        borderRadius: 8,
      },
    ],
  });

  useEffect(() => {
    (async () => {
      const { facturas1, facturas2, fecha1, fecha2 } =
        await comparacionFacturasSemanas();
      setFacturas1(facturas1);
      setFacturas2(facturas2);
      setFechas({ fecha1, fecha2 });
    })();
  }, []);

  const chartData = {
    labels: [`${fechas.fecha2}`, `${fechas.fecha1}`],
    datasets: [
      {
        label: "Total de ventas",
        data: [
          facturas2.reduce((acum, factura) => acum + factura.total, 0),
          facturas1.reduce((acum, factura) => acum + factura.total, 0),
        ],
        backgroundColor: ["#22c55e", "#16a34a"],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="max-w-[1100px] w-full mx-auto pb-8">
      <h3 className="text-center font-semibold mt-8 text-xl">
        Comparación de ventas por semana
      </h3>
      <Bar options={options} data={chartData} />
      <h3 className="text-center font-semibold mt-8 text-xl">
        Comparación de ventas por semana (ruta)
      </h3>
      <Select
        onValueChange={(value) => {
          const fac1 = facturas1
            .filter((factura) => factura["id-facturador"] === value)
            .reduce((acum, factura) => acum + factura.total, 0);
          const fac2 = facturas2
            .filter((factura) => factura["id-facturador"] === value)
            .reduce((acum, factura) => acum + factura.total, 0);
          console.log(fac1, fac2);
          setChartDataRuta((prev) => {
            return {
              labels: [`${fechas.fecha2}`, `${fechas.fecha1}`],
              datasets: prev.datasets.map((dataset) => ({
                ...dataset,
                data: [fac2, fac1],
              })),
            };
          });

          setRutaSelected(value);
        }}
      >
        <SelectTrigger className="w-[289px]">
          <SelectValue placeholder="Selecciona la ruta a comparar" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {rutas.map((ruta) => (
              <SelectItem key={ruta.id} value={ruta.id}>
                {ruta.usuario}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {rutaSelected !== "" && <Bar key={rutaSelected} options={options} data={chartDataRuta} />}
    </div>
  );
}
