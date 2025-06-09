import { server } from "./server";

export async function abonarFacturaServer({ id, abono }: { id: string, abono: number }) {
  try {
    await window.pet.put(`${server.url}/facturas/abonar/${id}`, { abono });

    return false;
  } catch {
    return false;
  }
}

export async function deleteFactura(id: string, facturador: string) {
  try {
    const url = `${server.url}/facturas/${id}/facturador/${facturador}`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        'Authorization': `Basic ${server.credetials}`
      }
    });
    return false;
  } catch {
    return false;
  }
}

export async function getFacturasCreditos() {
  try {
    const url = `${server.url}/facturas/estado/credito`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Basic ${server.credetials}`
      }
    });
    const data = await response.json();
    return data;
  } catch {
    return false;
  }
}

export async function comparacionFacturasSemanas() {
  try {
    const url = `${server.url}/facturas/resumen/semanas`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Authorization': `Basic ${server.credetials}`
      }
    });
    const data = await response.json();
    return data;
  } catch {
    return false;
  }
}