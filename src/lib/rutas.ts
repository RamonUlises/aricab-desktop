import { ProductoFacturaType } from "../types/facturas";
import { ProductoType } from "../types/productos";
import { Productos } from "../types/rutasProductos";
import { server } from "./server";

export async function agregarRuta(usuario: string, password: string): Promise<string> {
  try{
    const response = await window.pet.post(`${server.url}/rutas`, { usuario, password }) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al agregar ruta";
  }
}

export async function editarRuta(id: string, usuario: string, password: string): Promise<string> {
  try{
    const response = await window.pet.put(`${server.url}/rutas/${id}`, { usuario, password }) as { message: string };

    return response.message;
  } catch(error){
    console.log(error);
    return "Error al editar ruta";
  }
}

export async function eliminarRuta(id: string): Promise<string> {
  try{
    const response = await window.pet.deletee(`${server.url}/rutas/${id}`) as { message: string };

    return response.message;
  } catch{
    return "Error al eliminar ruta";
  }
}

export async function obtenerProductosRuta(ruta: string) {
  try {
    const response = await window.pet.get(`${server.url}/rutas/${ruta}/productos`) as ProductoFacturaType;

    return response;
  } catch {
    return [];
  }
}

export async function actualizarProductosRuta(ruta: string, productos: Productos[], newProductos: ProductoType[] ) {
  try {
    const response = await window.pet.put(`${server.url}/rutas/${ruta}/productos`, { productos, newProductos }) as { message: string }

    return response.message;
  } catch {
    return "Error";
  }
}