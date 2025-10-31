import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistroCreado = () => {
  const navigate = useNavigate();
  const jwtToken = localStorage.getItem("jwt-token")
  const [mensaje, setMensaje] = useState("")
  const verficarfecha = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}api/verificar_fecha`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtToken,
        },
      }
    );
    const data = await response.json()
    if (!response.ok) {
      setMensaje(response.error)
    }
    if (data.message == "Dashboard") {
      navigate('/dashboard');

    }
    else if (data.message == "Formulario") {
      navigate('/formulario');
    }
  }
  return (
    <>
      <style>
        {`
          .registro-container {
            max-width: 400px;
            margin: 60px auto;
            padding: 30px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            font-family: 'Inter', sans-serif;
          }

          .registro-imagen {
            width: 100%;
            margin-bottom: 20px;
            border-radius: 8px;
          }

          .registro-mensaje {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }

          .registro-submensaje {
            font-size: 16px;
            color: #333;
            margin-bottom: 30px;
          }

          .texto-verde {
            color: #0bc814ff;
          }

          .registro-boton {
            background-color: black;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: inline-block;
          }
        `}
      </style>

      <div className="registro-container">
        <img
          src="https://entornoazul.com/wp-content/uploads/2023/03/sostenibilidad-scaled.jpg"
          alt="Ilustración de sostenibilidad"
          className="registro-imagen"
        />
        <p className="registro-mensaje">¡Ya estás dentro!</p>
        <p className="registro-submensaje">
          Elegir con conciencia nos conecta con algo más grande: <b className="texto-verde">proteger lo que nos rodea.</b>
        </p>
        <p>
          {mensaje}
        </p>
        <div className="registro-boton" onClick={verficarfecha}>
          ¿Empezamos?
        </div>
      </div>
    </>
  );
};

export default RegistroCreado;
