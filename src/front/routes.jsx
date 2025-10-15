// Import necessary components and functions from react-router-dom.

import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";

import Registro from "./pages/registro.jsx";
import Signin from "./pages/signin";

export const router = createBrowserRouter(
    createRoutesFromElements(
      // Root Route: definimos rutas sencillas para la app
      <>
        <Route path="/" element={<Signin />} errorElement={<h1>Not found!</h1>} />
        <Route path="/registro" element={<Registro />} />
      </>
    )
);