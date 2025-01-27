import { server } from "./server";

export const agregarPersonal = async (
  nombres: string,
  apellidos: string,
  direccion: string,
  cedula: string,
  telefono: string,
  fechaNacimiento: string,
  imagen: string,
  salario: number,
  inicioTrabajo: string
): Promise<string> => {
  try {
    const response = (await window.pet.post(`${server.url}/personal`, {
      nombres,
      apellidos,
      direccion,
      cedula,
      telefono,
      fechaNacimiento,
      imagen,
      salario,
      inicioTrabajo,
    })) as { message: string };

    return response.message;
  } catch (error) {
    console.log(error);
    return "Error al agregar personal";
  }
};

export const actualizarPersonal = async (
  id: string,
  nombres: string,
  apellidos: string,
  direccion: string,
  cedula: string,
  telefono: string,
  fechaNacimiento: string,
  imagen: string,
  salario: number,
  inicioTrabajo: string
): Promise<string> => {
  try {
    const response = (await window.pet.put(`${server.url}/personal/${id}`, {
      nombres,
      apellidos,
      direccion,
      cedula,
      telefono,
      fechaNacimiento,
      imagen,
      salario,
      inicioTrabajo,
    })) as { message: string };

    return response.message;
  } catch (error) {
    console.log(error);
    return "Error al actualizar personal";
  }
};

export const eliminarPersonal = async (id: string): Promise<string> => {
  try {
    const response = (await window.pet.deletee(
      `${server.url}/personal/${id}`
    )) as { message: string };

    return response.message;
  } catch (error) {
    console.log(error);
    return "Error al eliminar personal";
  }
};
