const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function apiRequest(endpoint, opciones = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  if (!response.ok) {
    let mensaje = `Error ${response.status}: ${response.statusText}`;

    try {
      const texto = await response.text();
      if (texto) {
        mensaje = texto;
      }
    } catch {
      // Si no se puede leer el cuerpo del error, se mantiene el mensaje HTTP.
    }

    throw new Error(mensaje);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
