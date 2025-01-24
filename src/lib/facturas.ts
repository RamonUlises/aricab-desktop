import { server } from "./server";

export async function abonarFacturaServer({ id, abono }: { id: string, abono: number }) {
  try {
    await window.pet.put(`${server.url}/facturas/abonar/${id}`, { abono });

    return false;
  } catch {
    return false;
  }
}

export async function deleteFactura(id: string) {
  try {
    await window.pet.deletee(`${server.url}/facturas/${id}`);

    return false;
  } catch {
    return false;
  }
}