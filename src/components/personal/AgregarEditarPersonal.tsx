import { actualizarPersonal, agregarPersonal } from "@/lib/personal";
import { PersonalType } from "@/types/personal";
import { UserX, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type typeInput = "text" | "number" | "date";

export const AgregarEditarPersonal = ({
  edit,
  personalInfo,
  visible,
  setVisible,
  setPersonalInfo,
}: {
  edit: boolean;
  personalInfo: PersonalType;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalType>>;
}) => {
  const [personal, setPersonal] = useState({} as PersonalType);
  const [alerta, setAlerta] = useState("");

  function updateImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];

      // Convertir la imagen a blob
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPersonal({
          ...personal,
          imagen: reader.result as string,
        });
      };
    }
  }

  function uploadDates(
    event: React.ChangeEvent<HTMLInputElement>,
    type: typeInput
  ) {
    const name = event.target.name;
    const value = event.target.value;

    if (type === "number") {
      if (event.target.value === "") {
        setPersonal({
          ...personal,
          [name]: 0,
        });
        return;
      }
      if (isNaN(Number(event.target.value))) {
        return;
      }
    }

    if (name === "cedula") {
      if (value.length > 16) {
        return;
      }
    }

    setPersonal({
      ...personal,
      [name]: value,
    });
  }

  async function crearPersonal() {
    const valid = validateCampos();
    if(!valid) return;

    try {
      let response = "";

      if(edit){
        response = await actualizarPersonal(personal.id, personal.nombres, personal.apellidos, personal.direccion, personal.cedula, personal.telefono, personal.fechaNacimiento, personal.imagen ?? "", personal.salario, personal.inicioTrabajo);
      } else {
        response = await agregarPersonal(personal.nombres, personal.apellidos, personal.direccion, personal.cedula, personal.telefono, personal.fechaNacimiento, personal.imagen ?? "", personal.salario, personal.inicioTrabajo);
      }

      setAlerta(response);

      if(response === "Personal creado" || response === "Personal actualizado") {
        
        setTimeout(() => {
          setVisible(false);
        }, 800);
        return;
      }
    } catch {
      setAlerta("Error al agregar el personal");
    }
  }

  function validateCampos(): boolean {
    const cedulaExp = /^[0-9]{3}-[0-9]{6}-[0-9]{4}[A-Z]{1}$/;
    const fechaExp = /^[0-9]{2}-[0-9]{2}-[0-9]{4}$/;
    const telefonoExp = /^[0-9]{4}-[0-9]{4}$/;

    if (
      personal.nombres == undefined ||
      personal.nombres === "" ||
      personal.apellidos == undefined ||
      personal.apellidos === "" ||
      personal.direccion == undefined ||
      personal.direccion === "" ||
      personal.cedula == undefined ||
      personal.cedula === "" ||
      personal.telefono == undefined ||
      personal.telefono === "" ||
      personal.fechaNacimiento == undefined ||
      personal.fechaNacimiento === "" ||
      personal.salario == 0 ||
      personal.inicioTrabajo == undefined ||
      personal.inicioTrabajo === ""
    ) {
      setAlerta("Todos los campos son obligatorios");
      return false;
    }

    if (!cedulaExp.test(personal.cedula)) {
      setAlerta("Cédula inválida, formato: 000-000000-0000A");
      return false;
    }

    if (
      !fechaExp.test(personal.fechaNacimiento) ||
      !fechaExp.test(personal.inicioTrabajo)
    ) {
      setAlerta("Fecha inválida, formato: dd-mm-yyyy");
      return false;
    }

    if (!telefonoExp.test(personal.telefono)) {
      setAlerta("Teléfono inválido, formato: 0000-0000");
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (edit === false) {
      setPersonal({} as PersonalType);
      return;
    }
    
    setPersonal(personalInfo);
    setAlerta("");
  }, [visible]);

  return (
    <>
      <section
        className={`${
          visible ? "flex" : "hidden"
        } fixed top-0 left-0 w-screen h-screen bg-black/60 justify-center items-center`}
      >
        <div className="flex flex-col items-center bg-white p-4 rounded-lg relative">
          <h2 className="text-center font-bold text-lg">
            {edit ? "Editar" : "Agregar"} Personal
          </h2>
          <X
            onClick={() => {
              setVisible(false);
              setPersonalInfo({} as PersonalType);
            }}
            className="text-zinc-800 cursor-pointer absolute top-0 right-0 mr-4 mt-4"
          />
          <div className="flex gap-32 mt-4">
            <div className="flex flex-col gap-3 max-w-60">
              <div className="w-40 h-40 border flex justify-center items-center rounded mx-auto">
                {personal.imagen ? (
                  <img
                    src={personal.imagen}
                    alt="Imagen del trabajador"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserX size={80} />
                )}
              </div>
              <label className="bg-slate-300 p-1 rounded cursor-pointer text-sm text-center block w-36 mx-auto">
                <input
                  onChange={updateImage}
                  type="file"
                  hidden
                  accept="image/*"
                />
                Agregar imagen
              </label>
            </div>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="Nombres"
                name="nombres"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.nombres ?? ""}
                onChange={(e) => uploadDates(e, "text")}
              />
              <input
                type="text"
                placeholder="Apellidos"
                name="apellidos"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.apellidos ?? ""}
                onChange={(e) => uploadDates(e, "text")}
              />
              <input
                type="text"
                placeholder="Dirección"
                name="direccion"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.direccion ?? ""}
                onChange={(e) => uploadDates(e, "text")}
              />
              <input
                type="text"
                placeholder="Cédula"
                name="cedula"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.cedula ?? ""}
                onChange={(e) => uploadDates(e, "text")}
              />
              <input
                type="text"
                placeholder="Teléfono"
                name="telefono"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.telefono ?? ""}
                onChange={(e) => uploadDates(e, "text")}
              />
              <input
                type="text"
                placeholder="Fecha de nacimiento"
                name="fechaNacimiento"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.fechaNacimiento ?? ""}
                onChange={(e) => uploadDates(e, "date")}
              />
              <input
                type="text"
                placeholder="Salario"
                name="salario"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={
                  personal.salario === undefined || personal.salario === 0
                    ? ""
                    : personal.salario
                }
                onChange={(e) => uploadDates(e, "number")}
              />
              <input
                type="text"
                placeholder="Inicio de trabajo"
                name="inicioTrabajo"
                className="border border-gray-300 rounded-lg px-2 py-1"
                value={personal.inicioTrabajo ?? ""}
                onChange={(e) => uploadDates(e, "date")}
              />
            </div>
          </div>
          {alerta !== "" && <p className={`${alerta === 'Personal creado' || alerta === 'Personal actualizado' ? 'text-green-600' : 'text-red-500'} text-sm mt-8`}>{alerta}</p>}
          <button
            onClick={crearPersonal}
            className="bg-green-600 hover:bg-green-700 transition-colors duration-300 text-white rounded-lg px-2 py-1 mt-8"
          >
            {edit ? "Editar" : "Agregar"}
          </button>
        </div>
      </section>
    </>
  );
};
