import { Link, useParams } from "react-router-dom"
import { useState } from "react"
import imagen from "../imagenes/image.png"

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value 
        }))
    };
    
    return (
        <>
        <div className="container vh-100 d-flex flex-column">
            <div className="row">
                <div className="col d-flex flex-column justify-content-center align-items-center">
                    <img className="" src={imagen} alt="Logo"></img>
                    <h2 className="poppins-bold text-center">Transformamos tus<br/>hábitos de consumo en decisiones<br/> <b className="texto-verde">sostenibles</b> sin que gastes más dinero</h2>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <h5 className="inter-texto text-start ms-2">Iniciar sesión</h5>
                    <form className="p-2">
                        <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="tucorreo@dominio.com" className="form-control"></input>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="password" className="form-control mt-2"></input>
                        <button type="submit" className="btn w-100 mt-3 text-white"
                        style={{"backgroundColor":"black"}}>Continuar</button>
                    </form>
                </div>
            </div>
            <div className="row mt-auto">
                <div className="col mb-3">
                    <p className="inter-texto text-center">¿Eres nuevo? Registrate <Link className="enlace" to="/registro">aquí</Link></p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Signin