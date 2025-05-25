import { useEffect, useState } from "react";
import { X } from "../../icons/X";
import { InputBottom } from "../InputBottom";
import { agregarProducto } from "../../lib/productos";

export const AgregarProductos = () => {
  const [visible, setVisible] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [producto, setProducto] = useState({
    nombre: "",
    precioCompra: 0,
    precioVenta: 0,
    cantidad: 0,
  });

  useEffect(() => {
    if (visible) {
      setProducto({
        nombre: "",
        precioCompra: 0,
        precioVenta: 0,
        cantidad: 0,
      });
      setAlerta("");
    }
  }, [visible]);

  function change (name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setProducto({
      ...producto,
      [name]: value,
    });
  };

  async function enviarProducto() {
    if(producto.nombre === "" || producto.precioCompra === 0 || producto.precioVenta === 0){
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    if(parseFloat(producto.precioCompra.toString()) > parseFloat(producto.precioVenta.toString())){
      setAlerta("El precio de compra no puede ser mayor al precio de venta");
      return;
    }

    try {
      const response = await agregarProducto(producto.nombre, producto.cantidad, producto.precioCompra, producto.precioVenta);

      if(response !== "Producto creado"){
        setAlerta(response);
        return;
      }

      setAlerta("Producto creado");
      setTimeout(() => {
        setAlerta("");
        setVisible(false);
      }, 800);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <button
        className="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white rounded-lg px-2 py-1 text-sm"
        onClick={() => setVisible(true)}
      >
        Agregar Producto
      </button>
      <dialog
        className={`${
          visible && "flex"
        } w-screen h-screen bg-black/70 top-0 left-0 justify-center items-center`}
        open={visible}
      >
        <div className="flex justify-end">
          <X
            onClick={() => setVisible(false)}
            className="text-slate-200 cursor-pointer absolute top-0 right-0 mr-4 mt-4"
          />
        </div>
        <form className="bg-slate-100 rounded-lg px-8 py-6 text-sm">
          <h3 className="text-xl font-bold text-center">Agregar Producto</h3>
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
          <p className={`${alerta === "Producto creado" ? "text-green-500" : "text-red-500"} text-center font-semibold mt-8`}>{alerta}</p>
          <div className="flex justify-center items-center mt-8">
            <button onClick={enviarProducto} type="button" className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 transition-colors duration-300 text-white">
              Agregar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
