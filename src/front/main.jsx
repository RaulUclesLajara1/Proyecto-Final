import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './pages/signin'
import Registro from './pages/registro'
import Registrocreado from './pages/registrocreado';

import { StoreProvider } from './hooks/useGlobalReducer'
import RutaProtegida from './hooks/RutaProtegida'

// --- INICIO DE LA CONFIGURACIÓN E INICIALIZACIÓN DE FIREBASE ---

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Para Analytics
import { getAuth } from "firebase/auth";       // Para la autenticación


const firebaseConfig = {
  apiKey: "AIzaSyDM429jBugFq4HgqxWqqbO_PkDLddRkg4g",
  authDomain: "proyectofinal4geeks-e92db.firebaseapp.com",
  projectId: "proyectofinal4geeks-e92db",
  storageBucket: "proyectofinal4geeks-e92db.firebasestorage.app",
  messagingSenderId: "806108571713",
  appId: "1:806108571713:web:4ac693777b743bc8437ec0",
  measurementId: "G-QL7Y4SJHNP"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app); 
export const auth = getAuth(app);           

// firebase hasta aqui

const Main = () => {
    // Do not block rendering when VITE_BACKEND_URL is missing in development.
    // If you need a strict check, add a visible notice instead of returning nothing.
    if(! import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL == "") {
        console.warn('VITE_BACKEND_URL is not set. Running in development mode without backend.');
    }

    return (
        <React.StrictMode>
            <StoreProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Signin/>} />
                        <Route path="/registro" element={<Registro/>} />
                        <Route element={<RutaProtegida/>}>
                            <Route path="/registro-creado" element={<Registrocreado />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </StoreProvider>
        </React.StrictMode>
    )
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
