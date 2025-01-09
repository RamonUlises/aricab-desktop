export interface ProductoFacturaType {
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
}