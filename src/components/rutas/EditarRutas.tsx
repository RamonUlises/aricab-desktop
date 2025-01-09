import { useEffect, useState } from "react";
import { X } from "../../icons/X";
import { InputBottom } from "../InputBottom";
import { editarRuta } from "../../lib/rutas";
import { RutasTypes } from "../../types/Rutas";

export const EditarRutas = ({
  visible,
  setVisible,
  rutaa,
}: {
  visible: boolean;
  setVisible: (value: boolean) => void;
  rutaa: RutasTypes;
}) => {
  const [alerta, setAlerta] = useState("");
  const [ruta, setRuta] = useState({
    usuario: rutaa.usuario,
    password: "",
  });

  function change(name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setRuta({
      ...ruta,
      [name]: value,
    });
  }

  async function actualizarRuta() {
    if (ruta.usuario === "" || ruta.password === "") {
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await editarRuta(rutaa.id, ruta.usuario, ruta.password);

      if (response !== "Usuario actualizado") {
        setAlerta(response);
        return;
      }

      setAlerta(response);

      setTimeout(() => {
        setAlerta("");
        setVisible(false);
        setRuta({
          usuario: "",
          password: "",
        });
      }, 800);
    } catch {
      setAlerta("Error al crear la ruta");
    }
  }

  useEffect(() => {
    if (visible) {
      setAlerta("");
      setRuta({
        usuario: rutaa.usuario,
        password: "",
      });
    }
  }, [visible]);

  return (
    <>
      <dialog
        open={visible}
        className={`${
          visible && "flex"
        } w-screen h-screen top-0 bg-black/70 z-50 justify-center items-center`}
      >
        <div className="flex justify-end">
          <X
            onClick={() => setVisible(false)}
            className="text-slate-200 cursor-pointer absolute top-0 right-0 mr-4 mt-4"
          />
        </div>
        <form className="bg-slate-100 rounded-lg px-2 py-6 text-sm max-w-80 w-full flex flex-col justify-center items-center">
          <h3 className="text-xl font-bold text-center mb-8">Editar Ruta</h3>
          <div className="flex flex-col gap-2">
            <InputBottom
              placeholder="Usuario"
              change={change}
              value={ruta.usuario}
              name="usuario"
            />
            <InputBottom
              placeholder="Contraseña"
              change={change}
              value={ruta.password}
              name="password"
            />
          </div>
          {alerta && (
            <p
              className={`${
                alerta !== "Usuario actualizado" ? "text-red-500" : "text-green-500"
              } text-center mt-4`}
            >
              {alerta}
            </p>
          )}
          <div className="flex justify-center mt-8">
            <button
              onClick={actualizarRuta}
              className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 transition-colors duration-300 text-white"
              type="button"
            >
              Editar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
