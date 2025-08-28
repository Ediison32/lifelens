import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { auth } from "./firebaseConfig.js";

document.addEventListener('DOMContentLoaded', () => {

  const loginForm = document.getElementById("loginForm");
  const errorMsg = document.getElementById("error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", userCredential.user);
      localStorage.setItem('belabs_auth', userCredential.user.uid)
      // Redirige al dashboard
      window.location.href = "admin.html";
    } catch (error) {
      console.error(error.code, error.message);
      errorMsg.textContent = "Credenciales inválidas o error en el login.";
    }
  });
});
