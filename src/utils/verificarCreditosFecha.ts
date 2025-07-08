import { CreditosType } from "@/types/creditos";

export const verificarCreditosFecha = (creditos: CreditosType[]) => {
  const hoy = new Date();
  // Solo nos interesa la fecha, no la hora
  hoy.setHours(0, 0, 0, 0);

  creditos.forEach(credito => {
    const fechaFin = new Date(credito.fechaFin);
    fechaFin.setHours(0, 0, 0, 0);

    // Diferencia en milisegundos
    const diferencia = fechaFin.getTime() - hoy.getTime();

    // Convertimos a días
    const diasFaltantes = Math.ceil(diferencia / (1000 * 60 * 60 * 24));

    if (diasFaltantes <= 5 && diasFaltantes >= 0) {
      alert(`Faltan ${diasFaltantes} días para que termine la factura de ${credito.proveedor}`);
    }
  });
};