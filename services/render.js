import { getFromTable } from "./api.js";

// ----------- ADMIN: Renderizar usuarios -----------
export async function renderUsers() {
  const users = await getFromTable();
  const tbody = document.querySelector("table tbody");
  if (!tbody) return; // Solo ejecuta si existe la tabla

  tbody.innerHTML = ""; // limpiar tabla antes de renderizar

  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.document}</td>
      <td>${user.name}</td>
      <td>${user.last_name} ${user.last_name2 ?? ""}</td>
      <td>${user.city}</td>
      <td>${user.clan}</td>
      <td>
        <a class="btn-action" href="./analitica.html?id=${user.id_user}" data-id="${user.id_user}">Ver</a>
        <button class="btn-delete" data-id="${user.id_user}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Eventos para los botones eliminar
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        const success = await deleteUser(id);
        if (success) {
          renderUsers(); // vuelve a renderizar la tabla
        }
      }
    });
  });
}

// ----------- ANALÍTICA: Cargar datos de usuario y tests -----------
export async function cargarAnalitica() {
  const params = new URLSearchParams(window.location.search);
  const id_user = params.get('id');
  if (!id_user) {
    alert("No se encontró el usuario.");
    return;
  }

  // Traer el usuario
  const user = await getFromTable('user', id_user);
  if (!user) {
    alert("Usuario no encontrado.");
    return;
  }

  // Traer cada tabla con su respectivo id
  const [
    stroop,
    gonogo,
    t_hanoi,
    trail_making,
    result
  ] = await Promise.all([
    getFromTable('stroop', user.id_stroop),
    getFromTable('gonogo', user.id_gonogo),
    getFromTable('t_hanoi', user.id_t_hanoi),
    getFromTable('trail_making', user.id_trail_making),
    getFromTable('result', user.id_result)
  ]);

  // Aquí puedes usar los datos para renderizar en la página
  console.log("Usuario:", user);
  console.log("Stroop:", stroop);
  console.log("GoNoGo:", gonogo);
  console.log("Torre de Hanoi:", t_hanoi);
  console.log("Trail Making:", trail_making);
  console.log("Resultados finales:", result);

  // Aquí puedes actualizar el DOM con los datos obtenidos
  // Ejemplo:
  // document.querySelector("#nombre-usuario").textContent = user.name;
  // document.querySelector("#valor-stroop").textContent = stroop.P;
}

// ----------- Inicialización según la página -----------
document.addEventListener("DOMContentLoaded", () => {
  // Si existe la tabla de usuarios, estamos en admin.html
  if (document.querySelector("table tbody")) {
    renderUsers();
  }
  // Si existe el canvas de la gráfica, estamos en analitica.html
  if (document.getElementById("radarChart")) {
    cargarAnalitica();
  }
});