import { cargarAnalitica } from "./services/render.js";
cargarAnalitica();
const ctx = document.getElementById('radarChart').getContext('2d');

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
            data: [0.85, 5.1, 0.85, 5.8, 6.2, 6.0, 8.2],
            fill: true,
            backgroundColor: "rgba(106, 90, 205, 0.2)",
            borderColor: "rgba(106, 90, 205, 1)",
            pointBackgroundColor: "rgba(106, 90, 205, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(106, 90, 205, 1)"
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                angleLines: { display: true },
                suggestedMin: 0,
                suggestedMax: 10
            }
        }
    }
});
