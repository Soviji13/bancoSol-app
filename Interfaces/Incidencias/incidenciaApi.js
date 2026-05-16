// ==============================
// API INCIDENCIAS
// ==============================

const API_BASE = "http://localhost:8080/api";

const ENDPOINTS = {
  incidencias: `${API_BASE}/incidencias`
};

// ==============================
// RESPUESTAS SEGURAS
// ==============================

async function leerRespuestaSegura(respuesta) {
  const texto = await respuesta.text();

  if (!texto) {
    return null;
  }

  try {
    return JSON.parse(texto);
  } catch {
    return texto;
  }
}

async function comprobarRespuesta(respuesta, mensajeError) {
  if (!respuesta.ok) {
    const cuerpoError = await leerRespuestaSegura(respuesta);

    console.error(mensajeError, {
      url: respuesta.url,
      status: respuesta.status,
      body: cuerpoError
    });

    throw new Error(
      `${mensajeError}. Código HTTP: ${respuesta.status}. Respuesta: ${JSON.stringify(cuerpoError)}`
    );
  }

  return await leerRespuestaSegura(respuesta);
}

// ==============================
// FUNCIONES FETCH
// ==============================

async function getJSON(url, mensajeError) {
  const respuesta = await fetch(url);
  return await comprobarRespuesta(respuesta, mensajeError);
}

async function enviarJSON(url, metodo, datos, mensajeError) {
  const respuesta = await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  });

  return await comprobarRespuesta(respuesta, mensajeError);
}

async function deleteJSON(url, mensajeError) {
  const respuesta = await fetch(url, {
    method: "DELETE"
  });

  return await comprobarRespuesta(respuesta, mensajeError);
}

// ==============================
// INCIDENCIAS
// ==============================

export async function listarIncidencias() {
  return await getJSON(
    ENDPOINTS.incidencias,
    "Error al listar incidencias"
  );
}

export async function obtenerIncidenciaPorId(id) {
  return await getJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "Error al obtener incidencia"
  );
}

export async function crearIncidencia(incidencia) {
  return await enviarJSON(
    ENDPOINTS.incidencias,
    "POST",
    incidencia,
    "Error al crear incidencia"
  );
}

export async function actualizarIncidencia(id, incidencia) {
  return await enviarJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "PUT",
    incidencia,
    "Error al actualizar incidencia"
  );
}

export async function eliminarIncidencia(id) {
  return await deleteJSON(
    `${ENDPOINTS.incidencias}/${id}`,
    "Error al eliminar incidencia"
  );
}