import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

  // Configuración de tu proyecto Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAk9mfR81bztfMvHaQoVVaktMbDe1lBGlw",
    authDomain: "lifelens-46093.firebaseapp.com",
    projectId: "lifelens-46093",
    storageBucket: "lifelens-46093.firebasestorage.app",
    messagingSenderId: "607379036682",
    appId: "1:607379036682:web:ec42f872bd5a720cbc1df3"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);