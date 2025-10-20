import React from 'react';

const RegistroCreado = () => {
  const styles = {
    container: {
      maxWidth: '400px',
      margin: '60px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
    },
    imagen: {
      width: '100%',
      marginBottom: '20px',
      borderRadius: '8px',
    },
    mensaje: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
    },
    submensaje: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '30px',
    },
    boton: {
      backgroundColor: 'black',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1>Registro creado</h1>
      <img
        src="https://entornoazul.com/wp-content/uploads/2023/03/sostenibilidad-scaled.jpg"
        alt="Ilustración de sostenibilidad"
        style={styles.imagen}
      />
      <p style={styles.mensaje}>¡Ya estás dentro!</p>
      <p style={styles.submensaje}>
        Elegir con conciencia nos conecta con algo más grande: <strong>proteger lo que nos rodea</strong>.
      </p>
      <button style={styles.boton} onClick={() => window.location.href = '/formulario'}>
        ¿Empezamos?
      </button>
    </div>
  );
};

export default RegistroCreado;
