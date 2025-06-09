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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ComparacionSemanalChart() {
  const [facturas1, setFacturas1] = useState<FacturaType[]>([]);
  const [facturas2, setFacturas2] = useState<FacturaType[]>([]);
  const [fechas, setFechas] = useState<{ fecha1: string; fecha2: string }>({
    fecha1: "",
    fecha2: "",
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
    <div className="max-w-[1100px] w-full mx-auto">
      <Bar options={options} data={chartData} />
    </div>
  );
}
