import { server } from "./server";

export async function crearCreditos(proveedor: string, monto: number, abono: number, fechaInicio: string, fechaFin: string) {
  try {
    const response = await window.pet.post(`${server.url}/creditos`, { proveedor, monto, abono, fechaInicio, fechaFin }) as { message: string };

    return response.message;
  } catch {
    return "Error al crear crédito";
  }
}

export async function deleteCreditos(id: string) {
  try {
    const response = await window.pet.deletee(`${server.url}/creditos/${id}`) as { message: string };

    if(response.message === "Credito eliminado"){
      return true;
    }

    return false;
  } catch {
    return false;
  }
}