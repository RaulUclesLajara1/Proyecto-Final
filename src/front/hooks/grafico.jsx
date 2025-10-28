import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const Grafico = ({ x, y }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null); 

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d"); 

    // Destruir gráfico previo si existe (para evitar duplicados al re-renderizar)
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Crear el gráfico
    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: x,
        datasets: [
          {
            label: "Mi gráfico",
            data: y,
            borderColor: "rgba(71, 198, 52, 1)",
            backgroundColor: "rgba(27, 198, 22, 0.2)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    // limpiar al desmontar
    return () => {
      chartRef.current.destroy();
    };
  }, [x, y]);

  return (
    <div style={{height: "300px" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default Grafico;
