import { AgregarEditarPersonal } from "@/components/personal/AgregarEditarPersonal";
import { Layout } from "../layouts/Layout";
import { PersonalType } from "@/types/personal";
import { useState } from "react";
import { usePersonal } from "@/providers/Personal";
import { UserX } from "lucide-react";
import { eliminarPersonal } from "@/lib/personal";
import { confirm } from "@tauri-apps/plugin-dialog";

export const Personal = () => {
  const { personal } = usePersonal();
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({} as PersonalType);

  return (
    <Layout>
      <h1 className="text-center font-bold mt-4 text-zinc-800">Personal</h1>
      <div className="flex justify-start ml-3">
        <button
          className="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white rounded-lg px-2 py-1 text-sm"
          onClick={() => setVisible(true)}
        >
          Agregar Personal
        </button>
      </div>
      <section className="mt-6 flex flex-col gap-3 px-2">
        {personal.length === 0 ? (
          <h1 className="text-center text-2xl font-bold mt-4">
            No hay personal
          </h1>
        ) : (
          personal.map((personal) => (
            <article className="flex gap-8 bg-slate-100 p-4" key={personal.id}>
              <figure>
                <figcaption className="flex items-center justify-center w-40 h-40 rounded-full overflow-hidden">
                  {personal.imagen === "" ? (
                    <UserX size={80} />
                  ) : (
                    <img
                      src={personal.imagen}
                      alt="imagen"
                      className="object-cover w-full h-full"
                    />
                  )}
                </figcaption>
              </figure>
              <figure className="flex flex-col w-full">
                <h3 className="text-center font-bold text-lg">
                  {personal.nombres} {personal.apellidos}
                </h3>
                <figure className="w-full h-full flex gap-8 p-3">
                  <div className="w-1/2">
                    <p className="text-sm">
                      <span className="font-bold">Cédula:</span>{" "}
                      {personal.cedula}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Dirección:</span>{" "}
                      {personal.direccion}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Teléfono:</span>{" "}
                      {personal.telefono}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Fecha de nacimiento:</span>{" "}
                      {personal.fechaNacimiento}
                    </p>
                  </div>
                  <div className="w-1/2">
                    <p className="text-sm">
                      <span className="font-bold">Salario:</span>{" "}
                      {personal.salario}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">Inicio de trabajo:</span>{" "}
                      {personal.inicioTrabajo}
                    </p>
                    <div className="flex gap-4 mt-4">
                      <button onClick={() => {
                        setEdit(true);
                        setPersonalInfo(personal);
                        setVisible(true);
                      }} className="bg-green-600 text-white font-semibold text-sm px-2 py-1 rounded">Editar</button>
                      <button onClick={async () => {
                        const response = await confirm("¿Estás seguro de eliminar este personal?");

                        if(!response) return;

                        await eliminarPersonal(personal.id);
                      }} className="bg-red-600 text-white font-semibold text-sm px-2 py-1 rounded">Eliminar</button>
                    </div>
                  </div>
                </figure>
              </figure>
            </article>
          ))
        )}
      </section>
      <AgregarEditarPersonal
        setVisible={setVisible}
        visible={visible}
        edit={edit}
        personalInfo={personalInfo}
        setPersonalInfo={setPersonalInfo}
      />
    </Layout>
  );
};
