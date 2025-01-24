export interface ProductoFacturaType {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface FacturaType {
  id: string;
  nombre: string;
  fecha: Date;
  productos: ProductoFacturaType[];
  tipo: string;
  total: number;
  pagado: number;
}