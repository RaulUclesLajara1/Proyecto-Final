import { Link, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import imagen from "../assets/image.png"
import { auth } from '../main.jsx';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
const Signin = () => {
    const navigate = useNavigate(); // use navigate
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error_google, Seterror_google] = useState("")

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${url}api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            console.log(response)

            const data = await response.json();
            console.log("Respuesta del backend:", data);

            if (response.ok) {
                localStorage.setItem("jwt-token", data.token)
                navigate("/registro-creado");
            } else {
                alert(data.error || "Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            alert("Hubo un problema al iniciar sesión");
        }
    };

    // FUNCIÓN PARA EL INICIO DE SESIÓN CON GOOGLE
    const handleGoogleSignIn = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;
            const url = import.meta.env.VITE_BACKEND_URL;
            const res = await fetch(`${url}api/login_google`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("jwt-token", data.token);
                navigate('/registro-creado')
            }
            else {
                Seterror_google(res.error)
            }
        }
        catch (err) {
            Seterror_google(err)
        }
    };


    return (
        <>
            <div className="container vh-100 d-flex flex-column">
                <div className="row">
                    <div className="col d-flex flex-column justify-content-center align-items-center">
                        <img className="" src={imagen} alt="Logo"></img>
                        <h2 className="poppins-bold text-center">Transformamos tus<br />hábitos de consumo en decisiones<br /> <b className="texto-verde">sostenibles</b> sin que gastes más dinero</h2>
                    </div>
                </div>
                <div className="row mt-5">
                    <div className="col">
                        <h5 className="inter-texto text-start ms-2">Iniciar sesión</h5>
                        <form className="p-2" onSubmit={handleSubmit}>
                            <input type="text" id="username" value={formData.username} onChange={handleChange} placeholder="Usuario" className="form-control" autoComplete="username"></input>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="Contraseña" className="form-control mt-2" autoComplete="current-password" />
                            <button type="submit" className="btn w-100 mt-3 text-white"
                                style={{ "backgroundColor": "black" }}>Continuar</button>
                        </form>


                        <div className="p-2">
                            <p className="inter-texto">{error_google}</p>
                            <GoogleLogin
                                onSuccess={handleGoogleSignIn}
                                onError={() => {
                                    Seterror_google("Error al iniciar sesion con Google");
                                }}
                            />
                        </div>


                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <p className="inter-texto text-center text-dark">¿Eres nuevo? Registrate <Link className="enlace" to="/registro">aquí</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signin
