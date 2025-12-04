import { getFromTable, deleteUser, createUser } from "./api.js";


function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '';
}
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
      <td>${user.name ?? ""}</td>
      <td>${user.name2 ?? "----------"}</td>
      <td>${user.last_name ?? "----------"}</td>
      <td>${user.last_name2 ?? "----------"}</td>
      <td>${user.city ?? "----------"}</td>
      <td>${user.clan ?? "----------"}</td>
      <td>
        <a class="btn-action" href="./analitica.html?id=${user.id_user}">Ver</a>
        <button class="btn-action btn-delete" data-id="${user.id_user}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  // Eventos para los botones eliminar
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        console.log(id);
        
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
  const user = await getFromTable('users', id_user);
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

  
  console.log("gonogo", gonogo);
  console.log("t_hanoi", t_hanoi);
  console.log("trail_making", trail_making);
  console.log("result", result);
  
  renderTables(stroop, gonogo, t_hanoi, trail_making, result, user)

  return result
}


// FUNCIOBN PARA LLENAR TALBA 


function renderTables(stroop, gonogo, t_hanoi, trail_making, result, user) {
    const fullName = [user.name, user.name2, user.last_name, user.last_name2]
    .join(' ');
    document.getElementById('userName').textContent = fullName
    document.getElementById('userDocument').textContent = user.document || '-'
    document.getElementById('userClan').textContent = user.clan

    // Llenar tabla Stroop
    document.getElementById('stroop-p').textContent = stroop.p || stroop.P || '-';
    document.getElementById('stroop-c').textContent = stroop.c || stroop.C || '-';
    document.getElementById('stroop-pc').textContent = stroop.pc || stroop.PC || '-';
    document.getElementById('stroop-pc-ratio').textContent = stroop.P_C || stroop.p_c || '-';
    document.getElementById('stroop-interference').textContent = stroop.Interference || '-';
    document.getElementById('stroop-time').textContent = stroop.time || stroop.tiempo || '-';
    document.getElementById('stroop-time-p').textContent = stroop.time_homework_p ||  '-';
    document.getElementById('stroop-time-c').textContent = stroop.time_homework_pc ||  '-';
    document.getElementById('stroop-time-pc').textContent = stroop.time_homework_pc ||  '-';
    document.getElementById('stroop-total').textContent = stroop.total_stroop || '-';
    document.getElementById('stroop-scale').textContent = stroop.climb || '-';

    // Llenar tabla GoNoGo
    document.getElementById('gonogo-time-1').textContent = gonogo.hw_time_1 ||  '-';
    document.getElementById('gonogo-answers-1').textContent = gonogo.hw_answer_1 || '-';
    document.getElementById('gonogo-score-1').textContent = gonogo.hw_score_1 || '-';
    
    document.getElementById('gonogo-time-2').textContent = gonogo.hw_time_2 || '-';
    document.getElementById('gonogo-answers-2').textContent = gonogo.hw_answer_2 || '-';
    document.getElementById('gonogo-score-2').textContent = gonogo.hw_score_2 || '-';
    
    document.getElementById('gonogo-time-3').textContent = gonogo.hw_time_3 ||  '-';
    document.getElementById('gonogo-answers-3').textContent = gonogo.hw_answer_3 ||  '-';
    document.getElementById('gonogo-score-3').textContent = gonogo.hw_score_3;
    
    document.getElementById('gonogo-total-tareas').textContent = gonogo.total_homewor || '-';
    document.getElementById('gonogo-interferencia').textContent = gonogo.Interference || '-';
    document.getElementById('gonogo-scale').textContent = gonogo.climb || '-';
    document.getElementById('gonogo-respuestas').textContent = gonogo.total_gonogo_answer || '-';
    document.getElementById('gonogo-total').textContent = gonogo.total_gonogo|| '-';
    

    // Llenar tabla Torre Hanoi
    document.getElementById('hanoi-pieces').textContent = t_hanoi.number_pieces || '-';
    document.getElementById('hanoi-pieces-side').textContent = t_hanoi.number_pieces_r_side ||'-';
    document.getElementById('hanoi-time').textContent = t_hanoi.time ||'-';
    document.getElementById('hanoi-total').textContent = t_hanoi.total_hanoi || '-';
    document.getElementById('hanoi-move').textContent = t_hanoi.motion_rating || '-';
    document.getElementById('hanoi-cal-time').textContent = t_hanoi.motion_rating2 || '-';
    // Llenar tabla Trail Making
    document.getElementById('trail-correct-a').textContent = trail_making.correct_answers_A || '-';
    document.getElementById('trail-time-a').textContent = trail_making.time_A || '-';
    document.getElementById('trail-score-a').textContent = trail_making.score_A || '-';
    
    document.getElementById('trail-correct-b').textContent = trail_making.correct_answers_B || '-';
    document.getElementById('trail-time-b').textContent = trail_making.time_B || '-';
    document.getElementById('trail-score-b').textContent = trail_making.score_B || '-';
    
    document.getElementById('trail-total-correct').textContent = (trail_making.correct_answers_A + trail_making.correct_answers_B) || '-';
    document.getElementById('trail-total').textContent = trail_making.total_trail_making || '-';

    // Llenar tabla Resultados
    document.getElementById('result-inhibitory').textContent = result.Inhibitory_control || '-';
    document.getElementById('result-executive').textContent = result.executive_functioning || '-';
    document.getElementById('result-memory').textContent = result.working_memory || '-';
    document.getElementById('result-flexibility').textContent = result.cognitive_flexibility || '-';
    document.getElementById('result-planning').textContent = result.planning || '-';
    document.getElementById('result-learning').textContent = result.strategic_learning || '-';
    document.getElementById('result-speed').textContent = result.processing_speed || '-';
}

// modal

document.addEventListener('DOMContentLoaded', () => {
  const addUserBtn    = document.getElementById('addUserBtn');
  const modal         = document.getElementById('addUserModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const form          = document.getElementById('addUserForm');

  /* ---------- Abrir modal y precargar datos ---------- */
  addUserBtn?.addEventListener('click', () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById('document').value   = params.get('documento') || '';
    document.getElementById('name').value       = params.get('nombre')    || '';
    document.getElementById('name2').value      = params.get('segundo_nombre') || '';
    document.getElementById('last_name').value  = params.get('apellido')  || '';
    document.getElementById('last_name2').value = params.get('segundo_apellido') || '';
    document.getElementById('city').value       = params.get('ciudad')    || '';
    document.getElementById('clan').value       = params.get('clan')      || '';
    

    modal.classList.add('show');
  });

  /* ---------- Cerrar modal ---------- */
  closeModalBtn?.addEventListener('click', () => modal.classList.remove('show'));
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  /* ---------- Submit del formulario ---------- */
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recolectar valores del formulario
    const payload = {
      name       : form.name.value.trim(),
      name2      : form.name2.value.trim() || null,
      last_name  : form.last_name.value.trim(),
      last_name2 : form.last_name2.value.trim() || null,
      document   : form.document.value.trim(),
      city       : form.city.value.trim(),
      clan       : form.clan.value.trim(),
      topy       : "student",
      status     : true
    };

    try {
      // Llamada a la función externa que envía los datos
      await createUser(payload);
      form.reset();
      alert('Usuario creado');
      modal.classList.remove('show');
      location.reload();
    } catch (err) {
      alert(err.message);
    }
  });
});



// ----------- Inicialización según la página -----------
document.addEventListener("DOMContentLoaded", () => {
  // Solo ejecuta renderUsers si es admin.html
  if (window.location.pathname.includes("admin.html")) {
    renderUsers();
  }
  // Solo ejecuta cargarAnalitica si es analitica.html
  if (window.location.pathname.includes("analitica.html")) {
    cargarAnalitica();
  }
});

























