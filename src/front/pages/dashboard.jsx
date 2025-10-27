import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import image4 from "../assets/image4.png"
import image3 from "../assets/image3.png"
import euro from "../assets/euro.png"
import hoja from "../assets/hoja.png"
import rayo from "../assets/rayo.png"



const Dashboard = () => {

    const [ahorro, setAhorro] = useState(5);
    const [kg_co2, setkg_co2] = useState(10);
    // useEffect(() => {
    // const jwtToken = localStorage.getItem('jwt-token');
    // let ahorros,emisiones;
    // fetch(`${import.meta.env.VITE_BACKEND_URL}api/ahorros`, {
    //     method: 'GET',
    //     headers: { 
    //         "Content-Type": "application/json",
    //         'Authorization': 'Bearer ' + jwtToken}}
    //     )
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     ahorros=data;
    //     })

    // fetch(`${import.meta.env.VITE_BACKEND_URL}api/emisiones`, {
    //     method: 'GET',
    //     headers: { 
    //         "Content-Type": "application/json",
    //         'Authorization': 'Bearer ' + jwtToken}}
    //     )
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     emisiones=data;
    //     })
    // }, []);
    return(
        <>
            <nav className = "navbar navbar-expand-lg">
                <div className="container-fluid">
                    <li className="nav-item dropdown">
                        <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={image4}/>
                        </a>
                        <ul className="dropdown-menu p-2">
                            <li><p className="inter-texto">Editar perfil</p></li>
                            <li><p className="inter-texto"><i class="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesion</p></li>
                            <li><p className="text-danger inter-texto">Borrar cuenta</p></li>
                        </ul>
                    </li>
                    <p className="navbar-brand inter-texto mx-auto pt-2 fw-bold">rauulucless</p>
                    <img src={image3} style={{'width':'50px', 'height':'50px'}}/>
                </div>
            </nav>

            <div className="row mt-3">
                <div className="col">
                    <h2 className="text-center poppins-semibold fw-bold">Tu impacto consciente</h2>
                    <p className="text-center poppins-italic mt-3">Cada decision cuenta para ti <br/> y para el planeta</p>
                </div>
            </div>
            <div className="row">
                <div className="col-4 text-center">
                    <img src={euro}/>
                    <h3 className="inter-texto fw-bold">{ahorro} € </h3>
                     


                </div>
            </div>

            
        </>

    ) 
    
}

export default Dashboard;