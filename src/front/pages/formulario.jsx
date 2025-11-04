import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect} from "react";

import ecovestLogo from '../assets/Ecovest.png';
import imagen from "../assets/image3.png";

const Formulario = () => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('jwt-token');
    const { id } = useParams();

    const [formData, setFormData] = useState({
        ingresos: "",
        gastos: "",
        tipovehiculo: "",
        consumovehiculo: "",
        kmsemana: "",
        energiasrenovables: false,
        consumoelectrico: "",
        tipocalefaccion: "",
        transportepublico: "",
        reciclas: ""
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const formato = `${año}/${mes}`;
    useEffect(() => {
        if (id === "1") {
            const fetchData = async () => {
                try {
                    const [resAhorros, resEmisiones] = await Promise.all([
                        fetch(`${base}api/ahorros`, {
                            headers: { 'Authorization': 'Bearer ' + token }
                        }),
                        fetch(`${base}api/emisiones`, {
                            headers: { 'Authorization': 'Bearer ' + token }
                        })
                    ]);


                    const dataAhorros = await resAhorros.json();
                    const dataEmisiones = await resEmisiones.json();


                    const ultimoAhorro = dataAhorros[dataAhorros.length - 1];
                    const ultimaEmision = dataEmisiones[dataEmisiones.length - 1];

                    setFormData(prev => ({
                        ...prev,
                        ingresos: ultimoAhorro?.ingresos || "",
                        gastos: ultimoAhorro?.gastos || "",
                        tipovehiculo: ultimaEmision?.tipo_vehiculo || "",
                        consumovehiculo: "",
                        energiasrenovables: ultimaEmision?.energia_renovable || false,
                        consumoelectrico: ultimaEmision?.kwh_consumidos || "",
                        tipocalefaccion: ultimaEmision?.tipo_calefaccion || "",
                    }));

                } catch (err) {
                    console.error(err);
                    setError("No se pudieron cargar los datos previos");
                }
            };

            fetchData();
        }
    }, [id, base, token]);
    // Maneja cambios en los campos del formulario
    const handleChange = (e) => {
        const { id, name, type, value, checked, files } = e.target;
        const key = id || name;
        if (!key) return;

        let newValue;
        if (type === 'checkbox') {
            newValue = checked;
        } else if (type === 'number') {
            newValue = value === '' ? '' : Number(value);
        } else {
            newValue = value;
        }

        setFormData(prev => ({ ...prev, [key]: newValue }));
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);
        const metodo = id === "1" ? "PUT" : "POST";

        // Envía los datos del formulario al backend
        try {
            const res = await fetch(`${base}api/ahorros`, {
                method: metodo,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ 'fecha': formato, 'ingresos': formData.ingresos, 'gastos': formData.gastos })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || data.detail || 'Error al enviar formulario');
            }

            setSuccess(true);

        } catch (err) {
            setError(err.message || 'Error desconocido');
        } finally {
            setSubmitting(false);
        }

        try {
            const res = await fetch(`${base}api/emisiones`, {
                method: metodo,
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
                body: JSON.stringify({ 'fecha': formato, 'litros_combustible': formData.kmsemana * formData.consumovehiculo / 100, 'kwh_consumidos': formData.consumoelectrico, 'tipo_vehiculo': formData.tipovehiculo, 'tipo_calefaccion': formData.tipocalefaccion, 'energia_renovable': formData.energiasrenovables })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || data.detail || 'Error al enviar formulario');
            }

            setSuccess(true);

        } catch (err) {
            setError(err.message || 'Error desconocido');
        } finally {
            setSubmitting(false);
        }

        navigate('/dashboard')

    };


    return (
        <div className="d-flex justify-content-center align-items-start p-2">
            <div className="container">
                <div className="text-start mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        <img src={ecovestLogo} alt="Logo Ecovest" className="d-block mx-auto" style={{ width: '200px', height: 'auto' }} />
                    </div>
                    <h3 className="fw-bold poppins-semibold">Configura tu perfil de consumo</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label inter-texto">Edad</label>
                        <input
                            type="date"
                            id="edad"
                            className="form-control"
                            placeholder="Ej. 32"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label inter-texto">Salario mensual aproximado</label>
                        <input
                            type="number"
                            id="ingresos"
                            className="form-control"
                            placeholder="Ej. 1400€"
                            value={formData.ingresos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label inter-texto">¿Cuáles son tus gastos mensuales?</label>
                        <input
                            type="number"
                            id="gastos"
                            className="form-control"
                            placeholder="Ej. 800€"
                            value={formData.gastos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlfor="tipovehiculo">Tipo de vehículo principal</label>
                        <select
                            id="tipovehiculo"
                            className="form-select"
                            value={formData.tipovehiculo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Hibrido">Híbrido</option>
                            <option value="Electrico">Eléctrico</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label inter-texto">Consumo medio del vehículo</label>
                        <input
                            type="number"
                            id="consumovehiculo"
                            className="form-control"
                            placeholder="Ej. 5L"
                            value={formData.consumovehiculo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label inter-texto">¿Cuántos km a la semana sueles hacer con tu vehículo?</label>
                        <input
                            type="number"
                            id="kmsemana"
                            className="form-control"
                            placeholder="Ej. 200km"
                            value={formData.kmsemana}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Tienes alguna energía renovable en casa?</label>
                        <div className="form-check">
                            <label htmlFor="energiasrenovables-si" className="form-check-label">Sí</label>
                            <input
                                id="energiasrenovables-si"
                                name="energiasrenovables"
                                type="radio"
                                value="true"
                                checked={formData.energiasrenovables === true}
                                onChange={() => setFormData({ ...formData, energiasrenovables: true })}
                                className="form-check-input" />
                        </div>

                        <div className="form-check">
                            <label htmlFor="energiasrenovables-no" className="form-check-label">No</label>
                            <input
                                id="energiasrenovables-no"
                                name="energiasrenovables"
                                type="radio"
                                value="false"
                                checked={formData.energiasrenovables === false}
                                onChange={(s) => setFormData({ ...formData, energiasrenovables: false })}
                                className="form-check-input" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label inter-texto">¿Cuál es tu consumo eléctrico mensual?</label>
                        <input
                            type="number"
                            id="consumoelectrico"
                            className="form-control"
                            placeholder="Ej. 150kWh"
                            value={formData.consumoelectrico}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlfor="tipovehiculo">Tipo de calefacción</label>
                        <select
                            id="tipocalefaccion"
                            className="form-select"
                            value={formData.tipocalefaccion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una opción</option>
                            <option value="Electrica">Eléctrica</option>
                            <option value="Gas-natural">Gas Natural</option>
                            <option value="Gas-propano">Gas Propano</option>
                            <option value="Gasoil">Gasoil</option>
                            <option value="Biomasa">Biomasa</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Usas transporte público habitualmente?</label>
                        <div className="form-check">
                            <label htmlFor="transportepublico-si" className="form-check-label">Sí</label>
                            <input
                                id="transportepublico-si"
                                name="transportepublico"
                                type="radio"
                                value="si"
                                checked={formData.transportepublico === 'si'}
                                onChange={(e) => setFormData({ ...formData, transportepublico: e.target.value })}
                                className="form-check-input" />
                        </div>

                        <div className="form-check">
                            <label htmlFor="transportepublico-no" className="form-check-label">No</label>
                            <input
                                id="transportepublico-no"
                                name="transportepublico"
                                type="radio"
                                value="no"
                                checked={formData.transportepublico === 'no'}
                                onChange={(e) => setFormData({ ...formData, transportepublico: e.target.value })}
                                className="form-check-input" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Reciclas en casa?</label>
                        <div className="form-check">
                            <label htmlFor="reciclas-si" className="form-check-label">Sí</label>
                            <input
                                id="reciclas-si"
                                name="reciclas"
                                type="radio"
                                value="si"
                                checked={formData.reciclas === 'si'}
                                onChange={(e) => setFormData({ ...formData, reciclas: e.target.value })}
                                className="form-check-input" />
                        </div>

                        <div className="form-check">
                            <label htmlFor="reciclas-no" className="form-check-label">No</label>
                            <input
                                id="reciclas-no"
                                name="reciclas"
                                type="radio"
                                value="no"
                                checked={formData.reciclas === 'no'}
                                onChange={(e) => setFormData({ ...formData, reciclas: e.target.value })}
                                className="form-check-input" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">¿Te gustaría recibir consejos personalizados?</label>
                        <div className="form-check">
                            <label htmlFor="consejos-si" className="form-check-label">Sí</label>
                            <input
                                id="consejos-si"
                                name="consejos"
                                type="radio"
                                className="form-check-input" />
                        </div>

                        <div className="form-check">
                            <label htmlFor="consejos-no" className="form-check-label">No</label>
                            <input
                                id="consejos-no"
                                name="consejos"
                                type="radio"
                                className="form-check-input" />
                        </div>
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    {success && <div className="alert alert-success" role="alert">Formulario enviado correctamente.</div>}
                    <div className="d-grid mb-3">
                        <button type="submit" className="btn w-100 mt-3 text-white"
                            style={{ "backgroundColor": "black" }} disabled={submitting}>
                            {submitting ? 'Enviando...' : '¡Listo!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Formulario
