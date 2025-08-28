import { navigate } from "../index.js";

// Función para manejar el login
export async function login() {
  const message = document.getElementById('message');
  const loginForm = document.getElementById('login-form-id');

  // Escuchar el submit del formulario de registro/login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('user').value;


    // Por ahora manejas usuario fijo para pruebas
    const user = "1234";

    try {
      //const URL = XXX/
      // FUTURO: Aquí se puede hacer fetch a tu backend para validar usuario y contraseña, ejemplo:
      // const response = await fetch('URL/document/123456789', { method: 'POST', body: JSON.stringify({username}) });
      // const data = await response.json();
      // if(data.success) { ... }

      if (username) {

        if (username === user) {
          // Guardamos el usuario en localStorage (string, por ahora no JSON)
          localStorage.setItem('user', user);
          // Navegamos a la ventana Tower
          navigate('/gonogo');
        } else {
          message.textContent = 'Usuario incorrecto.';
        }
      }
    } catch (error) {
      console.error(error);
      message.textContent = 'Error al iniciar. Inténtalo de nuevo.';
    }
  });
}
