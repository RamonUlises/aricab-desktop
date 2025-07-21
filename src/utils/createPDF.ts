import { PrdSlc } from "@/types/productosSeleccionados";
import { buscarClienteNombre } from "./buscarCliente";
import { ClienteType } from "../types/clientes";
import { jsPDF } from "jspdf";
import { RutasTypes } from "@/types/Rutas";
import { RegistroType } from "@/types/registro";
import { ProductoType } from "@/types/productos";

export async function createPDF(
  productos: PrdSlc[],
  cliente: string,
  id: string,
  fecha: Date,
  estado: string,
  pagado: number,
  clientes: ClienteType[]
) {
  const total = productos.reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  const direccion =
    buscarClienteNombre(cliente, clientes)?.direccion ?? "Desconocida";

  const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>Factura</title>
  </head>
  <body style="max-width: 300px; margin-inline: auto;">
    <h1 style="font-weight: bold; text-align: center; margin-bottom: 10px; font-size: 45px;">Ari-Cab</h1>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Factura:</strong> ${id}</p>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Teléfono:</strong> 88437565-89053304</p>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Cliente:</strong> ${cliente}</p>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Dirección:</strong> ${direccion}</p>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Fecha:</strong> ${new Date(
      fecha
    ).toLocaleDateString()}</p>
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Estado:</strong> ${estado}</p>
        <div style="max-width: 90%; width: 100%; height: 2px; background-color: #d1d1d1; margin-inline: auto; margin-top: 16px;"></div>

    <div style="display: flex; justify-content: space-between; width: 90%; margin-inline: auto; margin-bottom: 8px;">
      <p style="font-weight: bold;">Producto</p>
      <p style="font-weight: bold;">Monto</p>
    </div>
        <div style="max-width: 90%; width: 100%; height: 2px; background-color: #d1d1d1; margin-inline: auto; margin-top: 20px;"></div>

    <table style="margin: 0 auto 10px auto; width: 90%;">
      <thead>
        <tr>
          <th style="text-align: start; width: 70%;"></th>
          <th style="text-align: start; width: 30%;"></th>
        </tr>
      </thead>
      <tbody>
        ${productos
          .map(
            ({ nombre, cantidad, precio }) => `
          <tr>
            <td>
              ${nombre}
              <p style="text-align: start; margin-bottom: 3px;">${cantidad} x ${precio}</p>  
            </td>
            <td style="text-align: right;">C$ ${cantidad * precio}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div style="max-width: 90%; width: 100%; height: 2px; background-color: #d1d1d1; margin-inline: auto;"></div>
    <div style="display: flex; justify-content: space-between; width: 90%; margin-inline: auto; margin-block: 8px;">
      <p style="font-weight: bold;">Gran total:</p>
      <p>C$ ${total}</p>
    </div>
    <div style="display: flex; justify-content: space-between; width: 90%; margin-inline: auto; margin-block: 8px;">
      <p style="font-weight: bold;">Pagado :</p>
      <p>C$ ${pagado}</p>
    </div>
        <div style="max-width: 90%; width: 100%; height: 2px; background-color: #d1d1d1; margin-inline: auto; margin-top: 20px"></div>

    <div style="display: flex; justify-content: space-between; width: 90%; margin-inline: auto;">
      <p style="font-weight: bold;">Saldo :</p>
      <p>C$ ${total - pagado}</p>
    </div>
  </body>
</html>
    `;

  const doc = new jsPDF({
    orientation: "p",
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"],
  });

  await doc.html(htmlContent, {
    width: 780,
    windowWidth: 875,
    x: 0,
    y: 0,
    margin: 5,
    autoPaging: true,
  });

  const pdfData = doc.output("arraybuffer");
  const pdfBytes = new Uint8Array(pdfData);

  return { pdf: pdfBytes };
}
import autoTable from "jspdf-autotable";

export async function createRegistro(
  ruta: RutasTypes,
  hoja: RegistroType,
  productos: ProductoType[]
) {
  const fechaInicio = new Date(hoja.fechaInicio).toLocaleDateString();
  const fechaFin = new Date(hoja.fechaFin).toLocaleDateString();

  const doc = new jsPDF({
    orientation: "p",
    unit: "px",
    format: "a4",
    hotfixes: ["px_scaling"],
  });

  doc.setFontSize(18);
  doc.text("Ari-Cab", doc.internal.pageSize.getWidth() / 2, 40, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.text(`${fechaInicio} - ${fechaFin}`, 20, 60);
  doc.text(`${ruta.usuario}`, doc.internal.pageSize.getWidth() - 100, 60);

  const headers = [
    [
      "Productos",
      ...ruta.dias,
      "Cambios",
      hoja.terminada ? "Sobrantes" : null,
      hoja.terminada ? "totales" : null,
    ].filter(Boolean),
  ];

  let totalFinal = 0;
  const body = productos.map((prd) => {
    const row = [
      prd.nombre,
      ...ruta.dias.map((dia) => {
        const value = hoja.productos[dia]?.[prd.nombre];
        return value === 0 || value == undefined ? "" : value;
      }),
    ];

    const cambio = hoja.cambios?.[prd.nombre] ?? 0;
    row.push(cambio === 0 || cambio == null ? "" : cambio);

    if (hoja.terminada) {
      const sobrante = hoja.sobrantes?.[prd.nombre] ?? 0;
      row.push(sobrante === 0 || cambio == null ? "" : sobrante);
      // Crear total en dinero, sumando todos los productos de la hoja menos los sobrantes y cambios por el precio del producto
      const total =
        Object.values(hoja.productos).reduce((acc, dia) => {
          const value = dia[prd.nombre];
          return acc + (value === 0 || value == undefined ? 0 : value);
        }, 0) -
        sobrante -
        cambio;
      totalFinal += Math.ceil(total * prd.precioVenta);
      row.push(
        total * prd.precioVenta === 0
          ? ""
          : `C$ ${Math.ceil(total * prd.precioVenta)}`
      );
    }
    return row;
  });

  autoTable(doc, {
    startY: 80,
    head: headers,
    body: body,
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [0, 0, 0],
      lineColor: [0, 0, 0],
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
    },
    theme: "grid",
  });

  // mostrar descuento
  const finalDes =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      ?.finalY || 80; // Fallback en caso raro
  doc.setFontSize(8);
  doc.text("Descuentos:", 20, finalDes + 20);
  doc.text(
    `C$ ${hoja.descuentos.toString()}`,
    doc.internal.pageSize.getWidth() - 100,
    finalDes + 20
  );

  // Colocar el total después de la tabla si la hoja está terminada
  if (hoja.terminada) {
    const finalY =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        ?.finalY || 100; // Fallback en caso raro
    doc.setFontSize(8);
    doc.text("Total:", 20, finalY + 40);
    doc.text(
      `C$ ${(totalFinal - hoja.descuentos).toString()}`,
      doc.internal.pageSize.getWidth() - 100,
      finalY + 40
    );
  }

  const pdfData = doc.output("arraybuffer");
  const pdfBytes = new Uint8Array(pdfData);

  return { pdf: pdfBytes };
}
