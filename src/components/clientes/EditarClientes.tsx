import { useEffect, useState } from "react";
import { InputBottom } from "../InputBottom";
import { X } from "../../icons/X";
import { ClienteType } from "../../types/clientes";
import { editarClientes, eliminarClientes } from "../../lib/clientes";

export const EditarCliente = ({
  children,
  clienteA,
}: {
  children: React.ReactNode;
  clienteA: ClienteType;
}) => {
  const [visible, setVisible] = useState(false);
  const [elim, setElim] = useState(false);
  const [corde, setCorde] = useState({ x: 0, y: 0, id: "" });
  const [alerta, setAlerta] = useState("");
  const [cliente, setCliente] = useState({
    nombres: clienteA.nombres,
    telefono: clienteA.telefono,
    direccion: clienteA.direccion,
  });

  useEffect(() => {
    if (visible) {
      setCliente({
        nombres: clienteA.nombres,
        telefono: clienteA.telefono,
        direccion: clienteA.direccion,
      });
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

  async function editarClientee() {
    if (
      cliente.nombres === "" ||
      cliente.direccion === "" ||
      cliente.telefono === ""
    ) {
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await editarClientes(
        clienteA.id,
        cliente.nombres,
        cliente.telefono,
        cliente.direccion
      );

      if (response !== "Cliente actualizado") {
        setAlerta(response);
        return;
      }

      setAlerta("Cliente actualizado");
      setTimeout(() => {
        setAlerta("");
        setVisible(false);
      }, 800);
    } catch {
      setAlerta("Error al editar el cliente");
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
            id: clienteA.id,
          });
          setElim(true);
        }}
        onDoubleClick={() => setVisible(true)}
        className="w-full h-full cursor-pointer text-left"
      >
        {children}
      </button>
      <dialog
        onClick={() => setElim(false)}
        className="top-0 left-0 justify-center items-center w-screen h-screen bg-transparent"
        open={elim}
      >
        <button onClick={async () => {
          const res = confirm("¿Estás seguro de eliminar el producto?");

          if (res) {
            await eliminarClientes(clienteA.id);
          }
        }} className="absolute px-4 py-2 bg-black hover:bg-zinc-900/90 transition-colors text-white rounded-md" style={{top: corde.y, left: corde.x}}>
          Eliminar cliente
        </button>
      </dialog>
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
          <h3 className="text-xl font-bold text-center">Editar Cliente</h3>
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
              alerta === "Cliente actualizado"
                ? "text-green-500"
                : "text-red-500"
            } text-center font-semibold mt-8`}
          >
            {alerta}
          </p>
          <div className="flex justify-center items-center mt-8">
            <button
              onClick={editarClientee}
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
