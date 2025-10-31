import { Link, useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import imagen from "../assets/image.png"
import { auth } from '../main.jsx';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const Signin = () => {
    const navigate = useNavigate(); // use navigate

    // --- BLOQUE PARA MANEJAR REDIRECCIÓN DE FIREBASE ---
    useEffect(() => {
        const handleFirebaseRedirect = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    const user = result.user;
                    console.log('Usuario autenticado con Google (vía redirección):', user);
                    navigate("/registro-creado");
                }
            } catch (error) {
                console.error("Error al manejar el resultado de la redirección de Google:", error);
                alert(`Error al iniciar sesión con Google: ${error.message}`);
            }
        };

        handleFirebaseRedirect();
    }, [navigate]);


    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

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
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Error al iniciar la redirección con Google:", error);
            alert(`Error al iniciar sesión con Google: ${error.message}`);
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
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                className="btn w-100 mt-2 text-black"
                                style={{ "backgroundColor": "#00df47ff" }}
                            >
                                <i className="fab fa-google me-2"></i> Iniciar sesión con Google
                            </button>
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
