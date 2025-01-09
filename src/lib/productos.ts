import { server } from "./server";

export async function agregarProducto(nombre: string, cantidad: number, precioCompra: number, precioVenta: number): Promise<string> {
  try{
    const response = await window.pet.post(`${server.url}/productos`, { nombre, cantidad, precioCompra, precioVenta }) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al agregar producto";
  }
}

export async function editarProducto(id: string, nombre: string, cantidad: number, precioCompra: number, precioVenta: number): Promise<string> {
  try{
    const response = await window.pet.put(`${server.url}/productos/${id}`, { nombre, cantidad, precioCompra, precioVenta }) as { message: string };

    return response.message;
  } catch {
    return "Error al editar producto";
  }
}

export async function eliminarProducto(id: string): Promise<string> {
  try{
    const response = await window.pet.deletee(`${server.url}/productos/${id}`) as { message: string };

    return response.message;
  } catch {
    return "Error al eliminar producto";
  }
}