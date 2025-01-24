import { server } from "./server";

export async function agregarClientes(nombres: string, telefono: string, direccion: string): Promise<string> {
  try{
    const response = await window.pet.post(`${server.url}/clientes`, { nombres, telefono, direccion }) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al agregar producto";
  }
}

export async function editarClientes(id: string, nombres: string, telefono: string, direccion: string): Promise<string> {
  try{
    const response = await window.pet.put(`${server.url}/clientes/${id}`, { nombres, telefono, direccion }) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al editar producto";
  }
}

export async function eliminarClientes(id: string): Promise<string> {
  try{
    const response = await window.pet.deletee(`${server.url}/clientes/${id}`) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al eliminar producto";
  }
}