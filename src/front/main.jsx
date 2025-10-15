import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import {BrowserRouter, Routes,Route} from "react-router-dom"
import Signin from './pages/signin';

const Main = () => {
    
    if(! import.meta.env.VITE_BACKEND_URL ||  import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
            <BackendURL/ >
        </React.StrictMode>
        );
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signin/>}/>
            </Routes>
        </BrowserRouter>
        // <React.StrictMode>  
        //     {/* Provide global state to all components */}
        //     <StoreProvider> 
        //         {/* Set up routing for the application */} 
        //         <RouterProvider router={router}>
        //         </RouterProvider>
        //     </StoreProvider>
        // </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
