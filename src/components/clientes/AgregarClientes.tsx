import { useEffect, useState } from "react";
import { X } from "../../icons/X";
import { InputBottom } from "../InputBottom";
import { agregarClientes } from "../../lib/clientes";

export const AgregarClientes = () => {
  const [visible, setVisible] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [cliente, setCliente] = useState({
    nombres: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    if (visible) {
      setCliente({
        nombres: "",
        telefono: "",
        direccion: "",
      });
      setAlerta("");
    }
  }, [visible]);

  function change(name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setCliente({
      ...cliente,
      [name]: value,
    });
  }

  async function enviarCliente() {
    if (
      cliente.nombres === "" ||
      cliente.direccion === "" ||
      cliente.telefono === ""
    ) {
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await agregarClientes(
        cliente.nombres,
        cliente.telefono,
        cliente.direccion
      );

      if (response !== "Cliente creado") {
        setAlerta(response);
        return;
      }

      setAlerta("Cliente creado");

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
        Agregar Cliente
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
          <h3 className="text-xl font-bold text-center">Agregar Cliente</h3>
          <div className="mt-4 flex gap-7">
            <InputBottom
              placeholder="Nombres del cliente"
              value={cliente.nombres}
              name="nombres"
              change={change}
            />
            <InputBottom
              type="text"
              placeholder="Teléfono del cliente"
              value={cliente.telefono}
              name="telefono"
              change={change}
            />
          </div>
          <div className="mt-4 flex gap-7">
            <InputBottom
              type="text"
              placeholder="Dirección del cliente"
              value={cliente.direccion}
              name="direccion"
              change={change}
            />
          </div>
          <p
            className={`${
              alerta === "Cliente creado" ? "text-green-500" : "text-red-500"
            } text-center font-semibold mt-8`}
          >
            {alerta}
          </p>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={enviarCliente}
              type="button"
              className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 transition-colors duration-300 text-white"
            >
              Agregar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
