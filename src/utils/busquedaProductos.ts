import { ProductoType } from "../types/productos";

export function busquedaProductos(productos: ProductoType[], busqueda: string) {
  let inicio = 0;
  let fin = productos.length - 1;
  const resultado: ProductoType[] = [];

  while (inicio <= fin) {
    const medio = Math.floor((inicio + fin) / 2);

    if(productos[medio].nombre.toLowerCase().includes(busqueda.toLowerCase())) {
      let i = medio;

      while(i >= 0 && productos[i].nombre.toLowerCase().includes(busqueda.toLowerCase())) i--;
      i++;
      
      while(i < productos.length && productos[i].nombre.toLowerCase().includes(busqueda.toLowerCase())) {
        resultado.push(productos[i]);
        i++;
      }

      return resultado;
    } else if(productos[medio].nombre.toLowerCase() < busqueda.toLowerCase()) {
      inicio = medio + 1;
    } else {
      fin = medio - 1;
    }
  }
}