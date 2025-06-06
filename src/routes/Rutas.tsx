import { Layout } from "../layouts/Layout";
import { useRutas } from "../providers/Rutas";
import { AgregarRutas } from "../components/rutas/AgregarRutas";
import { useState } from "react";
import { EditarRutas } from "../components/rutas/EditarRutas";
import { eliminarRuta } from "../lib/rutas";
import { useNavigate } from "react-router-dom";
import { server } from "@/lib/server";
import { confirm } from "@tauri-apps/plugin-dialog";
import { RutasTypes } from "@/types/Rutas";
import { invoke } from "@tauri-apps/api/core";
import { createRegistro } from "@/utils/createPDF";
import { useRegistro } from "@/providers/Registro";
import { useProductos } from "@/providers/Productos";
import { terminarRegistro } from "@/lib/registro";

type RegistroVisible = 'imprimir' | 'eliminar' | 'resumen' | null;

export const Rutas = () => {
  const { rutas } = useRutas();
  const { registros } = useRegistro();
  const { productos } = useProductos();
  const [menu, setMenu] = useState("");
  const [visible, setVisible] = useState(false);
  const [rutaSelect, setRutaSelect] = useState<RutasTypes>({
    id: "",
    usuario: "",
    password: "",
    dias: [],
  });
  const [visibleRegistro, setVisibleRegistro] = useState<RegistroVisible>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  return (
    <Layout onClickk={() => setMenu("")}>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Rutas</h1>
      <div className="flex flex-col items-center gap-3 mt-4">
        {rutas.length > 0 &&
          rutas.map((ruta) => (
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
                className="absolute bg-black -bottom-15 z-50 flex-col text-slate-200 w-full left-0 right-0 mx-auto max-w-[200px] rounded-md overflow-hidden"
              >
                <button
                  onClick={() => {
                    navigate(`/${ruta.id}/productos`);
                  }}
                  className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2"
                >
                  Productos
                </button>
                <button
                  onClick={() => {
                    setVisible(true);
                    setRutaSelect({
                      id: ruta.id,
                      usuario: ruta.usuario,
                      password: ruta.password,
                      dias: ruta.dias,
                    });
                  }}
                  className="w-full font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 py-2"
                >
                  Editar
                </button>
                <button
                  onClick={async () => {
                    await window.pet.get(
                      `${server.url}/rutas/admin/${ruta.id}`
                    );
                  }}
                  className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2"
                >
                  Permiso admin
                </button>
                <button
                  onClick={(event) => {
                    event.stopPropagation();

                    const registro = registros.find(
                      (reg) => reg.ruta === ruta.id
                    );

                    if (!registro) {
                      alert("No hay registro para esta ruta");
                      return;
                    }

                    setRutaSelect(ruta);
                    setVisibleRegistro('imprimir');
                  }}
                  className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2"
                >
                  Imprimir registro
                </button>
                <button className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2" onClick={(event) => {
                    event.stopPropagation();

                    const registro = registros.find(
                      (reg) => reg.ruta === ruta.id
                    );

                    if (!registro) {
                      alert("No hay registro para esta ruta");
                      return;
                    }

                    setRutaSelect(ruta);
                    setVisibleRegistro('resumen');
                  }}>
                  Resumen de registro
                </button>
                <button
                  onClick={async (event) => {
                    event.stopPropagation();

                    const registro = registros.find(
                      (reg) => reg.ruta === ruta.id && reg.terminada === false
                    );

                    if (!registro) {
                      alert("No hay registro activo para esta ruta");
                      return;
                    }

                    const confir = await confirm("¿Estás seguro de terminar el registro?");

                    if(!confir) return;

                    setLoading(true);
                    await terminarRegistro(registro.id, ruta.id);
                    setLoading(false);

                    alert("Registro terminado correctamente");
                  }}
                  className="font-semibold hover:bg-white hover:text-green-500 transition-colors duration-300 text-center w-full py-2"
                >
                  Terminar registro
                </button>
                <button
                  onClick={async (event) => {
                    event.stopPropagation();

                    const registro = registros.find(
                      (reg) => reg.ruta === ruta.id
                    );

                    if (!registro) {
                      alert("No hay registro para esta ruta");
                      return;
                    }

                    setRutaSelect(ruta);
                    setVisibleRegistro('eliminar');
                  }}
                  className="w-full font-semibold hover:bg-red-600 transition-colors duration-300 py-2"
                >
                  Eliminar registro
                </button>
                <button
                  onClick={async () => {
                    const resp = await confirm(
                      "¿Estás seguro de eliminar la ruta?"
                    );

                    if (resp) {
                      eliminarRuta(ruta.id);
                    }
                  }}
                  className="w-full font-semibold hover:bg-red-600 transition-colors duration-300 py-2"
                >
                  Eliminar ruta
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
      <section
        className={`fixed inset-0 bg-black bg-opacity-50 p-6 z-50 h-full ${
          visibleRegistro === "imprimir" || visibleRegistro === "eliminar" || visibleRegistro === 'resumen' ? "flex" : "hidden"
        }`}
      >
        <div className="bg-white w-full max-w-[600px] mx-auto p-4 rounded-lg h-full overflow-hidden flex flex-col">
          <h2 className="text-xl font-bold text-center text-zinc-800">
            {visibleRegistro === "imprimir" ? "Imprimir registro" : visibleRegistro === 'resumen' ? 'Resumen de registro' : 'Eliminar registro'}
          </h2>
          <div className="flex flex-col gap-4 mt-4 overflow-y-auto flex-1">
            {registros
              .filter((reg) => {
                return reg.ruta === rutaSelect.id;
              })
              .map((reg) => (
                <div
                onClick={async () => {
                  if(visibleRegistro === 'eliminar') {
                    if(!reg.terminada) return;
                    const resp = await confirm("¿Estás seguro de eliminar el registro?");

                    if(!resp) return;

                    await window.pet.deletee(`${server.url}/registros/${reg.id}`);
                  } else if(visibleRegistro === 'imprimir') {
                    const { pdf } = await createRegistro(rutaSelect, reg, productos);
                    await invoke("share_pdf", { pdf });
                  } else if(visibleRegistro === 'resumen') {
                    if(!reg.terminada) return;
                    navigate(`/registros/${reg.id}`);
                  }

                    setVisibleRegistro(null);
                }}
                  key={reg.id}
                  className="p-4 rounded-lg flex flex-row gap-2 border-2 justify-between items-center cursor-pointer hover:bg-slate-200 transition-colors duration-300"
                >
                  <div>
                    <p className="text-zinc-800">
                      <strong>Fecha inicio:</strong>{" "}
                      {new Date(reg.fechaInicio).toLocaleDateString()}
                    </p>
                    <p className="text-zinc-800">
                      <strong>Fecha final:</strong>{" "}
                      {new Date(reg.fechaFin).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className={`${reg.terminada ? 'bg-green-600' : 'bg-red-600'} text-white p-2 rounded-sm`}>{reg.terminada ? 'Terminada' : 'No terminada'}</p>
                  </div>
                </div>
              ))}
          </div>
          <button
            onClick={() => setVisibleRegistro(null)}
            className="bg-red-600 text-white w-full py-2 rounded-lg mt-4"
          >
            Cerrar
          </button>
        </div>
      </section>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-bold text-center">Cargando...</h2>
          </div>
        </div>
      )}
    </Layout>
  );
};
