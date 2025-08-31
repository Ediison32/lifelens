import { cargarAnalitica } from "./services/render.js";
const restul = await cargarAnalitica();
const ctx = document.getElementById('radarChart').getContext('2d');
console.log("analitica grafica");

console.log(restul);
const {
    Inhibitory_control,
    executive_functioning,
    working_memory,
    cognitive_flexibility,
    planning,
    strategic_learning,
    processing_speed
} = restul;

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
            data: [Inhibitory_control,
                    executive_functioning,
                    working_memory,
                    cognitive_flexibility,
                    planning,
                    strategic_learning,
                    processing_speed],
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
                suggestedMax: 5
            }
        }
    }
});