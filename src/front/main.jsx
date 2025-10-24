import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signin from './pages/signin'
import Registro from './pages/registro'
import Registrocreado from './pages/registrocreado';

import { StoreProvider } from './hooks/useGlobalReducer'
import RutaProtegida from './hooks/RutaProtegida'

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
