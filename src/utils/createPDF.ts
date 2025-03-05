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
    <p style="text-align: center; margin-bottom: 1px; font-size: 16px"><strong>Fecha:</strong> ${new Date(fecha).toLocaleDateString()}</p>
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

export async function createRegistro(ruta: RutasTypes, hoja: RegistroType, productos: ProductoType[]) {

  const fechaInicio = new Date(hoja.fechaInicio).toLocaleDateString();
  const fechaFin = new Date(hoja.fechaFin).toLocaleDateString();

  const htmlContent = `
  <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>Factura</title>
    <meta charset="UTF-8" />
  </head>
  <body style="display:flex; flex-direction: column;">
    <h1 style="font-weight: bold; text-align: center; margin-bottom: 0px; font-size: 45px;">Ari-Cab</h1>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-inline: 20px;">
      <p style="font-size: 20px; font-weight: bold">${fechaInicio} - ${fechaFin}</p>
      <p style="font-size: 20px; font-weight: bold">${ruta.usuario}</p>
    </div>
    <table style="width: 100%; margin-inline: auto; margin-top: 15px">
      <thead>
        <tr style="font-size: 22px;">
          <th style="border: 1px solid #000; padding-bottom: 16px; text-align: start; padding-left: 8px">Productos</th>
          ${ruta.dias.map(dia => 
            `<th style="width: 80px; border: 1px solid #000; padding-bottom: 16px;">${dia}</th>`
          ).join("")}
          ${hoja.terminada ? `<th style="width: 80px; border: 1px solid #000; padding-bottom: 18px; text-align: center; padding-left: 8px;">Sobrantes</th>` : ""}
        </tr>
      </thead>
      <tbody>
        ${productos.map(prd => `
          <tr>
            <td style="border: 1px solid #000; padding-bottom: 16px; padding-left: 8px; text-align: start">${prd.nombre}</td>
            ${ruta.dias.map(dia => `
              <td style="text-align: center; border: 1px solid #000; padding-bottom: 16px">
                ${hoja.productos[dia][prd.nombre] === 0 ? "" : hoja.productos[dia][prd.nombre]}
              </td>
            `).join("")}
            ${hoja.terminada ? `<td style="text-align: center; border: 1px solid #000; padding-bottom: 16px">${hoja.sobrantes[prd.nombre]}</td>` : ""}
          </tr>
        `).join("")}
      </tbody>
    </table>
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
    windowWidth: 780,
    x: 0,
    y: 0,
    margin: 5,
    autoPaging: true,
  });


  const pdfData = doc.output("arraybuffer");
  const pdfBytes = new Uint8Array(pdfData);

  return { pdf: pdfBytes };
}