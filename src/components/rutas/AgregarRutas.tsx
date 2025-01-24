import { useEffect, useState } from "react";
import { X } from "../../icons/X";
import { InputBottom } from "../InputBottom";
import { agregarRuta } from "../../lib/rutas";

export const AgregarRutas = () => {
  const [visible, setVisible] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [ruta, setRuta] = useState({
    usuario: "",
    password: "",
  });
  const [dias, setDias] = useState<string[]>([]);

  function change(name: string, value: string, type: string) {
    // si el tipo es number, y el valor trae letras, eliminarlas
    if (type === "number" && isNaN(Number(value))) return;

    setRuta({
      ...ruta,
      [name]: value,
    });
  }

  async function crearRuta() {
    if (ruta.usuario === "" || ruta.password === "") {
      setAlerta("Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await agregarRuta(ruta.usuario, ruta.password);

      if(response !== "Usuario creado"){
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

  function updateDias(dia: string){
    let newArray: string[] = [];
    if(dias.includes(dia)){
      newArray = dias.filter(d => d !== dia);
    } else {
      newArray = [...dias, dia];
    }

    setDias(newArray);
  }

  useEffect(() => {
    if (visible) {
      setAlerta("");
      setRuta({
        usuario: "",
        password: "",
      });
      setDias([]);
    }
  }, [visible]);

  return (
    <>
      <div
        
        className="flex justify-center absolute bottom-0 w-full mb-4 z-40"
      >
        <button onClick={() => setVisible(true)} className="bg-green-600 hover:bg-green-700 transition-colors duration-300 py-2 px-4 rounded-lg text-slate-200">
          Agregar Ruta
        </button>
      </div>
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
          <h3 className="text-xl font-bold text-center mb-8">Agregar Ruta</h3>
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
          <div>
            <p className="mt-4 font-semibold text-center">Seleccione los días de ruta</p>
            <div className="flex flex-row gap-1 mt-2">
              <button onClick={() => updateDias('Lun')} type="button" className={`${dias.includes('Lun') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Lun</button>
              <button onClick={() => updateDias('Mar')} type="button" className={`${dias.includes('Mar') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Mar</button>
              <button onClick={() => updateDias('Mie')} type="button" className={`${dias.includes('Mie') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Mie</button>
              <button onClick={() => updateDias('Jue')} type="button" className={`${dias.includes('Jue') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Jue</button>
              <button onClick={() => updateDias('Vie')} type="button" className={`${dias.includes('Vie') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Vie</button>
              <button onClick={() => updateDias('Sab')} type="button" className={`${dias.includes('Sab') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Sab</button>
              <button onClick={() => updateDias('Dom')} type="button" className={`${dias.includes('Dom') ? 'border-green-600 text-green-600' : 'border-black'} px-1 border-2 rounded`}>Dom</button>
            </div>
          </div>
          {alerta && <p className={`${alerta !== "Usuario creado" ? "text-red-500" : "text-green-500"} text-center mt-4`}>{alerta}</p>}
          <div className="flex justify-center mt-8">
            <button
              onClick={crearRuta}
              className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2 transition-colors duration-300 text-white"
              type="button"
            >
              Agregar
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};
