const API_URL = "https://lifelens-db.vercel.app";

// GET genérico: tabla y opcionalmente id
export async function getFromTable(table = "", id = null) {
  try {
    if (!table) {
      table = 'users';
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


// funcion para elimianar 
export async function deleteUser(id){
  try {

    let url = `${API_URL}/users`;
    if (id !== null && id !== undefined) {
      url += `/${id}`;
    }
    const response = await fetch(url,{
      method: "DELETE",
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error("Error en la petición");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al eliminar  ${table}:`, error);
    return null;
  }
}


// ---------- Llamada POST para crear usuario ----------
export async function createUser(payload) {
  try {
    let url = `${API_URL}/users`;
    const res = await fetch(url, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear');
    return data;          // { message: "Usuario creado..." }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
