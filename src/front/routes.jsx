// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Registro from "./pages/registro.jsx"
import Signin from "./pages/signin";
import RegistroCreado from "./pages/registrocreado.jsx";
import Formulario from "./pages/formulario.jsx";
import RutaProtegida from "./hooks/RutaProtegida.jsx";
import Dashboard from "./pages/dashboard.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: definimos rutas sencillas para la app
    <>
      <Route path="/" element={<Signin />} errorElement={<h1>Not found!</h1>} />
      <Route path="/registro" element={<Registro />} />
      <Route element={<RutaProtegida />}>
        <Route path="/formulario/:id" element={<Formulario />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registro-creado" element={<RegistroCreado />} />
      </Route>
    </>
  )
);
