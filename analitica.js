const ctx = document.getElementById('radarChart');

new Chart(ctx, {
  type: 'radar',
  data: {
    labels: [
      "Control inhibitorio",
      "Funcionamiento ejecutivo",
      "Memoria de trabajo",
      "Flexibilidad Cognitiva",
      "Planificación",
      "Aprendizaje Estratégico",
      "Velocidad de procesamiento"
    ],
    datasets: [{
      label: "Funciones Metacognitivas",
      data: [0.85, 5.1, 0.8, 5.8, 6.2, 5.0, 6.2],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 2,
      pointBackgroundColor: "rgba(54, 162, 235, 1)"
    }]
  },
  options: {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: "#ddd" },
        grid: { color: "#ddd" },
        suggestedMin: 0,
        suggestedMax: 7,
        pointLabels: {
          font: { size: 14 }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: { size: 14 }
        }
      }
    }
  }
});
