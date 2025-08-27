import { initTower } from "./resources/tower.js";
import { login } from "./resources/login.js";
// import { initStroop } from "./resources/stroop.js";

// Definimos las rutas del SPA
// Para agregar más ventanas, solo agrega aquí nuevas rutas y sus archivos HTML
const routes = {
  "/login": "./views/login.html",
  "/tower": "./views/tower.html",
  "/stroop": "./views/stroop.html"
  // "/otraVentana": "./views/otraVentana.html",  <-- ejemplo para futuras rutas
};

// Manejamos los clicks en enlaces con el atributo [data-link] para navegación SPA
document.body.addEventListener("click", (e) => {
  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");
    navigate(path);
  }
});

// Función para navegar entre rutas
export async function navigate(pathname) {
  const route = routes[pathname];

  // Si la ruta no existe, vamos a /login o podrías mostrar un 404 aquí
  if (!route) {
    return navigate("/login");
  }

  // Cargamos el HTML de la ruta
  const html = await fetch(route).then(res => res.text());
  document.getElementById("content").innerHTML = html;

  // Actualizamos el URL sin recargar la página
  history.pushState({}, "", pathname);

  // Ejecutamos la función correspondiente según la ruta
  if (pathname === "/login") {
    // Aquí se carga la lógica de login
    login();
  } else if (pathname === "/tower") {
    // Aquí se carga la lógica del juego Tower
    initTower();
  } else if (pathname === "/stroop") {
    // Aquí se carga la lógica del juego Stroop
    //initStroop();
    console.log("stroop");
  }
  // Añadir más condiciones para futuras rutas
  // else if (pathname === "/otraVentana") {
  //   initOtraVentana();
  // }
}

// Detectamos el botón "atrás" y navegamos sin recargar
window.addEventListener("popstate", () => {
  navigate(location.pathname);
});

// Al cargar la página, verificamos si hay un usuario en localStorage
window.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("user"); // Por ahora guardas el user como string
  const currentPath = location.pathname;

  if (currentUser) {
    // Si el usuario ya está en localStorage, cargamos la ventana 'tower'
    // En futuro, aquí podrías hacer una validación del token o sesión en backend
    if (currentPath === "/" || !routes[currentPath]) {
      navigate("/tower");
    } else {
      navigate(currentPath);
    }
  } else {
    // Si no hay usuario, cargamos la ventana de registro
    if (!routes[currentPath] || currentPath === "/" || currentPath === "/tower") {
      navigate("/login");
    } else {
      navigate(currentPath);
    }
  }
});





//Cerrar sesion

// document.addEventListener("click", (e) => {
//   if (e.target && e.target.id === "logout") {
//     logout();
//   }
// });

// function logout() {
//   localStorage.removeItem("user"); // Elimina la sesión
//   window.location.href = "./index.html";              // Redirige al login
// }


