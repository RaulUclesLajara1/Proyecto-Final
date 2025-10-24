import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image from '../assets/image2.png';

const Registro = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [terms, setTerms] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!terms) return;

        try {
            const url = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${url}api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'username':username, 'email':email, 'password':password}),
            });

            if (response.ok) {
                setMensaje('✅ Registro creado exitosamente');
                setTimeout(() => navigate('/registro-creado'), 1500);
            } else {
                const error = await response.json();
                if (error.error?.includes('ya está en uso')) {
                    setMensaje('⚠️ Ya existe este usuario');
                } else {
                    setMensaje('❌ Error al registrar usuario');
                }
            }
        } catch (err) {
            setMensaje('❌ Error de conexión con el servidor');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-start p-2">
            <div className="container">
                <div className="text-start mb-4">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                        <img src={image} alt="Logo" />
                    </div>
                    <h3 className="fw-bold poppins-semibold">Crear cuenta</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label inter-texto">Nombre de usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label inter-texto">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="row mb-3">
                        <label className="form-label inter-texto">Contraseña</label>
                        <div className="col-10">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-2">
                            <button
                                type="button"
                                className="btn"
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            >
                                {showPassword ? (
                                    <i className="fa-solid fa-eye"></i>
                                ) : (
                                    <i className="fa-solid fa-eye-slash"></i>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="terms"
                            checked={terms}
                            onChange={(e) => setTerms(e.target.checked)}
                        />
                        <label className="form-check-label inter-texto" htmlFor="terms">
                            Acepto los términos de servicio
                        </label>
                    </div>

                    <div className="d-grid mb-3">
                        <button
                            type="submit"
                            className="btn w-full mt-3 text-white"
                            style={{ backgroundColor: 'black' }}
                            disabled={!terms}
                        >
                            Continuar
                        </button>
                    </div>

                    {mensaje && (
                        <div className="text-center inter-texto mt-2">
                            <span>{mensaje}</span>
                        </div>
                    )}

                    <div className="text-center inter-texto mt-3">
                        ¿Ya tienes una cuenta? <Link to="/" className="fw-bold">Inicia sesión aquí</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registro;
