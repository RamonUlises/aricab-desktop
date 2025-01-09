import { Layout } from "../layouts/Layout";
import { useRutas } from "../providers/Rutas";
import { AgregarRutas } from "../components/rutas/AgregarRutas";
import { useState } from "react";
import { EditarRutas } from "../components/rutas/EditarRutas";
import { eliminarRuta } from "../lib/rutas";
import { useNavigate } from "react-router-dom";

export const Rutas = () => {
  const { rutas } = useRutas();
  const [menu, setMenu] = useState("");
  const [visible, setVisible] = useState(false);
  const [rutaSelect, setRutaSelect] = useState({
    id: "",
    usuario: "",
    password: "",
  });

  const navigate = useNavigate();

  return (
    <Layout onClickk={() => setMenu("")}>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Rutas</h1>
      <div className="flex flex-col items-center gap-3 mt-4">
        {rutas.length > 0 && rutas.map((ruta) => (
          <div
            key={ruta.id}
            className="bg-green-700 w-full max-w-[450px] p-4 rounded-lg cursor-pointer relative"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setMenu(ruta.id);
            }}
          >
            <h2 className="text-xl font-bold text-slate-200 text-center">
              {ruta.usuario}
            </h2>
            <dialog
              open={ruta.id === menu}
              className="absolute bg-black -bottom-15 z-10 flex-col text-slate-200 w-full left-0 right-0 mx-auto max-w-[200px] rounded-md overflow-hidden"
            >
              <button onClick={() => {
                navigate(`/${ruta.id}/productos`);
              }} className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2">Productos</button>
              <button
                onClick={() => {
                  setVisible(true);
                  setRutaSelect({
                    id: ruta.id,
                    usuario: ruta.usuario,
                    password: ruta.password,
                  });
                }}
                className="w-full font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 py-2"
              >
                Editar
              </button>
              <button
                onClick={() => {
                  const resp = confirm("¿Estás seguro de eliminar la ruta?");

                  if (resp) {
                    eliminarRuta(ruta.id);
                  }
                }}
                className="w-full font-semibold hover:bg-red-600 transition-colors duration-300 py-2"
              >
                Eliminar
              </button>
            </dialog>
          </div>
        ))}
      </div>
      <EditarRutas
        visible={visible}
        setVisible={setVisible}
        rutaa={rutaSelect}
      />
      <AgregarRutas />
    </Layout>
  );
};
