import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import image4 from "../assets/image4.png"
import image3 from "../assets/image3.png"
import euro from "../assets/euro.png"
import hoja from "../assets/hoja.png"
import Grafico from "../hooks/grafico";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
    const navigate = useNavigate();
    const [ErrorMsg, setErrorMsg] = useState("");
    const [ahorros, setAhorros] = useState([]);
    const [kg_co2, setKg_co2] = useState([]);
    const [nombre, setNombre] = useState("");
    const [puntos, setPuntos] = useState([]);
    const [fechas, setFechas] = useState([]);
    const borrarCuenta = async () => {
        setErrorMsg("");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}api/borrar_cuenta`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + jwtToken,
                    },
                }
            );

            if (!response.ok) {

                const errorData = await response.json();
                setErrorMsg(errorData.message || "Error al borrar la cuenta.");
                return;
            }

            localStorage.removeItem("jwt-token");
            navigate("/login");
        } catch (error) {
            console.error("Error al borrar cuenta:", error);
            setErrorMsg("Error al conectar con el servidor.");
        }
    };
    useEffect(() => {
        const jwtToken = localStorage.getItem("jwt-token");
        const decoded = jwtDecode(jwtToken);
        setNombre(decoded.sub);


        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtToken,
        };


        Promise.all([
            fetch(`${baseUrl}api/ahorros`, { method: "GET", headers }).then((res) =>
                res.json()
            ),
            fetch(`${baseUrl}api/emisiones`, { method: "GET", headers }).then((res) =>
                res.json()
            ),
        ])
            .then(([ahorrosData, emisionesData]) => {

                ahorrosData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                emisionesData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                setFechas(emisionesData.map((item) => item.fecha))

                const ahorrosList = ahorrosData.map(
                    (item) => item.ingresos - item.gastos
                );
                const emisionesList = emisionesData.map((item) => item.kg_co2);

                setAhorros(ahorrosList);
                setKg_co2(emisionesList);


                const puntosList = ahorrosList.map((ahorro, i) => {
                    const co2 = emisionesList[i];
                    return co2 !== 0 ? ahorro / co2 : 0; // evita dividir por 0
                });

                setPuntos(puntosList);
            })
            .catch((err) => console.error("Error al obtener datos:", err));
    }, []);

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <li className="nav-item dropdown">
                        <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={image4} />
                        </a>
                        <ul className="dropdown-menu p-2">
                            <li><p className="inter-texto">Editar perfil</p></li>
                            <li><p className="inter-texto" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fa-solid fa-right-from-bracket me-2"></i>Cerrar sesion</p></li>
                            <li><p className="text-danger inter-texto" data-bs-toggle="modal" data-bs-target="#borrar">Borrar cuenta</p></li>
                        </ul>
                    </li>
                    <p className="navbar-brand inter-texto mx-auto pt-2 fw-bold">{nombre}</p>
                    <img src={image3} style={{ 'width': '50px', 'height': '50px' }} />
                </div>
            </nav>

            <div className="modal fade" id="borrar" tabindex="-1" aria-labelledby="borrarLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="borrarLabel">Borrar Cuenta</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body inter-texto">
                            ¿Seguro que quieres borrar la cuenta?
                            {ErrorMsg && (
                                <p className="text-danger mt-2">
                                    {ErrorMsg}
                                </p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary inter-texto" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger inter-texto" data-bs-dismiss="modal" onClick={borrarCuenta}>Borrar Cuenta</button>
                        </div>
                    </div>
                </div>
            </div>



            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Cerrar Sesion</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body inter-texto">
                            ¿Seguro que quieres cerrar sesión?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary inter-texto" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-danger inter-texto" data-bs-dismiss="modal" onClick={() => { localStorage.removeItem('jwt-token'); navigate('/') }}>Cerrar Sesion</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <h2 className="text-center poppins-semibold fw-bold">Tu impacto consciente</h2>
                    <p className="text-center poppins-italic mt-3">Cada decision cuenta para ti <br /> y para el planeta</p>
                </div>
            </div>
            <div className="row">
                <div className="col-6 text-end pe-4">
                    <img src={euro} style={{ 'width': '50px', 'height': '50px' }} />
                    <h3 className="inter-texto fw-bold">{ahorros[ahorros.length - 1]} € </h3>
                </div>
                <div className="col-6 text-start ps-4">
                    <img src={hoja} style={{ 'width': '50px', 'height': '50px' }} />
                    <h3 className="inter-texto fw-bold">{kg_co2[kg_co2.length - 1]} kg</h3>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col-12">
                    {<Grafico x={fechas} y={puntos} />}
                </div>
            </div>

        </>

    )

}

export default Dashboard;