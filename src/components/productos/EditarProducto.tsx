import { useEffect, useState } from "react";
import { InputBottom } from "../InputBottom";
import { X } from "../../icons/X";
import { ProductoType } from "../../types/productos";
import { editarProducto, eliminarProducto } from "../../lib/productos";
import { confirm } from '@tauri-apps/plugin-dialog';

export const EditarProducto = ({
  children,
  productoA,
}: {
  children: React.ReactNode;
  productoA: ProductoType;
}) => {
  const [visible, setVisible] = useState(false);
  const [elim, setElim] = useState(false);
  const [corde, setCorde] = useState({ x: 0, y: 0, id: "" });
  const [alerta, setAlerta] = useState("");
  const [producto, setProducto] = useState({
    nombre: productoA.nombre,
    precioCompra: productoA.precioCompra,
    precioVenta: productoA.precioVenta,
    cantidad: productoA.cantidad,
  });

  useEffect(() => {
    if (visible) {
      setProducto({
        nombre: productoA.nombre,
        precioCompra: productoA.precioCompra,
        precioVenta: productoA.precioVenta,
        cantidad: productoA.cantidad,
      });
    }
  }, [visible]);

  function change(name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setProducto({
      ...producto,
      [name]: value,
    });
  }

  async function editarrProducto() {
    if (
      producto.nombre === "" ||
      producto.cantidad === 0 ||
      producto.precioCompra === 0 ||
      producto.precioVenta === 0
    ) {
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    if (producto.precioCompra > producto.precioVenta) {
      setAlerta("El precio de compra no puede ser mayor al precio de venta");
      return;
    }

    try {
      const response = await editarProducto(
        productoA.id,
        producto.nombre,
        Number(producto.cantidad),
        Number(producto.precioCompra),
        Number(producto.precioVenta)
      );

      if (response !== "Producto actualizado") {
        setAlerta(response);
        return;
      }

      setAlerta("Producto actualizado");
      setTimeout(() => {
        setAlerta("");
        setVisible(false);
      }, 800);
    } catch {
      setAlerta("Error al editar producto");
    }
  }
  return (
    <>
      <button
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setCorde({
            x: 130,
            y: event.clientY,
            id: productoA.id,
          });
          setElim(true);
        }}
        onDoubleClick={() => setVisible(true)}
        className="w-full h-full cursor-pointer text-left pl-2"
      >
        {children}
      </button>
      <dialog
        onClick={() => setElim(false)}
        className="top-0 left-0 justify-center items-center w-screen h-screen bg-transparent fixed"
        open={elim}
      >
        <button onClick={async () => {
          const res = await confirm("¿Estás seguro de eliminar el producto?");

          if (res) {
            await eliminarProducto(productoA.id);
          }
        }} className="absolute px-4 py-2 bg-black hover:bg-zinc-900/90 transition-colors text-white rounded-md" style={{top: corde.y, left: corde.x}}>
          Eliminar producto
        </button>
      </dialog>
      <dialog
        className={`${
          visible && "flex"
        } w-screen h-screen bg-black/70 top-0 left-0 justify-center items-center fixed`}
        open={visible}
      >
        <div className="flex justify-end">
          <X
            onClick={() => setVisible(false)}
            className="text-slate-200 cursor-pointer absolute top-0 right-0 mr-4 mt-4"
          />
        </div>
        <form className="bg-slate-100 rounded-lg px-8 py-6 text-sm">
          <h3 className="text-xl font-bold text-center">Editar Producto</h3>
          <div className="mt-4 flex gap-7">
            <InputBottom
              placeholder="Nombre del producto"
              value={producto.nombre}
              name="nombre"
              change={change}
            />
            <InputBottom
              type="number"
              placeholder="Cantidad"
              value={producto.cantidad.toString()}
              name="cantidad"
              change={change}
            />
          </div>
          <div className="mt-4 flex gap-7">
            <InputBottom
              type="number"
              placeholder="Precio de compra"
              value={producto.precioCompra.toString()}
              name="precioCompra"
              change={change}
            />
            <InputBottom
              type="number"
              placeholder="Precio de venta"
              value={producto.precioVenta.toString()}
              name="precioVenta"
              change={change}
            />
          </div>
          <p
            className={`${
              alerta === "Producto actualizado"
                ? "text-green-500"
                : "text-red-500"
            } text-center font-semibold mt-8`}
          >
            {alerta}
          </p>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={editarrProducto}
              type="button"
              className="bg-slate-200 rounded-lg px-4 py-2"
            >
              Editar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
