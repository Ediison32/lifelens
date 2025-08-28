// LOGIN con número de identificación
/*document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");
  const input = document.getElementById("identificacion");
  const btnTest = document.querySelector(".info a"); // botón "Iniciar Test"
  const mensaje = document.createElement("p");
  mensaje.style.color = "red";
  mensaje.style.fontSize = "14px";
  mensaje.style.marginTop = "8px";
  form.appendChild(mensaje);

  // Botón empieza deshabilitado
  btnTest.classList.add("disabled");
  btnTest.style.pointerEvents = "none";
  btnTest.style.opacity = "0.5";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = input.value.trim();
    if (id === "") {
      mensaje.textContent = "Ingresa tu número de identificación";
      return;
    }

    try {
      // poner direccion
      const response = await fetch(`            ${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Error en la conexión con el servidor");
      }

      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
        //Usuario encontrado
        localStorage.setItem("identificacion", id);
        mensaje.style.color = "green";
        mensaje.textContent = "Usuario encontrado. Ya puedes iniciar el test";

        // habilitar el botón
        btnTest.classList.remove("disabled");
        btnTest.style.pointerEvents = "auto";
        btnTest.style.opacity = "1";

      } else {
        // Usuario no encontrado
        mensaje.style.color = "red";
        mensaje.textContent = " Usuario no encontrado";
      }

    } catch (error) {
      console.error("Error:", error);
      mensaje.style.color = "red";
      mensaje.textContent = "No se pudo conectar con el servidor";
    }
  });
});*/