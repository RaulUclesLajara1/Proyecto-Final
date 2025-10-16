import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const Registro = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [terms, setTerms] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!terms) return;
		console.log({ username, email, password });
	};

	return (
		<div className="d-flex justify-content-center align-items-start py-5" style={{minHeight: '100vh', background: '#f8f9fa'}}>
			<div className="card shadow-sm p-4" style={{maxWidth: '420px', width: '100%', borderRadius: '16px', marginTop: '24px'}}>
				<div className="text-start mb-4">
					<div className="d-flex align-items-center mb-3">
						<div style={{width:48, height:48, display:'flex', alignItems:'center', justifyContent:'center', marginRight:12}}>
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="https://i.imgur.com/zLlTrF1.png">
								<rect x="3" y="3" width="18" height="18" rx="6" fill="#fff"/>
								<path d="M6 14v-4M10 18V8M14 15v-6" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
								<path d="M6 10a1 1 0 011-1h0a1 1 0 011 1v3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</div>
					</div>
					<h3 className="fw-bold">Crear cuenta</h3>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label className="form-label">Nombre de usuario</label>
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
						<label className="form-label">Email</label>
						<input
							type="email"
							className="form-control"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>

					<div className="mb-3 position-relative">
						<label className="form-label">Contraseña</label>
						<input
							type={showPassword ? 'text' : 'password'}
							className="form-control"
							placeholder="Contraseña"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<button
							type="button"
							className="btn btn-outline-secondary position-absolute top-50 end-0 translate-middle-y me-2 p-1"
							onClick={() => setShowPassword((s) => !s)}
							aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
						>
							{showPassword ? (
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
									<path d="M13.359 11.238C12.113 12.404 10.225 13 8 13s-4.113-.596-5.359-1.762C1.189 9.88.708 8.937.333 8c.375-.937.856-1.88 2.308-3.238C3.887 3.596 5.775 3 8 3s4.113.596 5.359 1.762C14.811 6.12 15.292 7.063 15.667 8c-.375.937-.856 1.88-2.308 3.238zM8 5a3 3 0 100 6 3 3 0 000-6z"/>
								</svg>
							) : (
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
									<path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 11a3 3 0 110-6 3 3 0 010 6z"/>
								</svg>
							)}
						</button>
					</div>

					<div className="form-check mb-3">
						<input
							className="form-check-input"
							type="checkbox"
							id="terms"
							checked={terms}
							onChange={(e) => setTerms(e.target.checked)}
						/>
						<label className="form-check-label" htmlFor="terms">
							Acepto los términos de servicio
						</label>
					</div>

					<div className="d-grid mb-3">
						<button type="submit" className="btn btn-dark btn-lg rounded-pill" disabled={!terms}>
							Continuar
						</button>
					</div>

					<div className="text-center small text-muted">
						¿Ya tienes una cuenta? <Link to="/" className="fw-bold">Inicia sesión aquí</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Registro;

