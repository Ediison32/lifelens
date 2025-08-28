const API_URL = "https://lifelens-db.vercel.app";

// GET genérico: tabla y opcionalmente id
export async function getFromTable(table = "", id = null) {
  try {
    if (!table) {
      table = 'user';
    }
    let url = `${API_URL}/${table}`;
    if (id !== null && id !== undefined) {
      url += `/${id}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error en la petición");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al obtener datos de ${table}:`, error);
    return null;
  }
}

// Ejemplo de uso:
// const users = await getFromTable('user');
// const user7 = await getFromTable('user', 7);
// const gonogo = await getFromTable('gonogo');
// const stroop = await getFromTable('stroop', 3);