import { Link } from "react-router-dom";
import logo from "../assets/icon.png"

export const Navbar = () => {
  return (
    <header className="flex bg-slate-200 text-black py-2 justify-between items-center px-8 font-bold border-b-2 border-green-600">
      <div className="w-10 h-10">
        <img src={logo} alt="Logo Ari-Cab" />
      </div>
      <nav>
        <ul className="flex space-x-8 ml-8">
          <li>
            <Link className="hover:text-green-500 transition-colors duration-500" to={"/"}>Inicio</Link>
          </li>
          <li>
            <Link className="hover:text-green-500 transition-colors duration-500" to={"/productos"}>Productos</Link>
          </li>
          <li>
            <Link className="hover:text-green-500 transition-colors duration-500" to={"/rutas"}>Rutas</Link>
          </li>
          <li>
            <Link className="hover:text-green-500 transition-colors duration-500" to={"/personal"}>Personal</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
