import { server } from "./server";

export async function crearRegistro(
  ruta: string,
  fechaInicio: string,
  fechaFin: string,
  productos: Record<string, Record<string, number>>,
  sobrantes: Record<string, number>,
  cambios: Record<string, number>
){
  try{
    const response = await window.pet.post(`${server.url}/registros`, { ruta, fechaInicio, fechaFin, productos, sobrantes, cambios }) as { message: string };

    return response.message;
  } catch {
    return 'Error al agregar registro';
  }
}

export async function terminarRegistro(id: string, ruta: string){
  try{
    const response = await window.pet.put(`${server.url}/registros/terminar/${id}`, { ruta }) as { message: string };

    return response.message;
  } catch {
    return 'Error al terminar registro';
  }
}