import { apiRequest } from "./apiClient";

//traer voluntarios !!!soporta filtros como el id o la campaña
export function obtenerVoluntarios(campaniaId, filtrosExtras = {}) {
  //montamos los parámetros de la URL dinámicamente
  const params = new URLSearchParams();
  if (campaniaId) params.append("campaniaId", campaniaId);

  //añadimos a los parametros cualquier otro filtro que venga (id, resp, entid....)
  Object.entries(filtrosExtras).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  return apiRequest(`/voluntarios?${params.toString()}`);
}

//crear
export function crearVoluntario(voluntario) {
  return apiRequest("/voluntarios", {
    method: "POST",
    body: JSON.stringify(voluntario),
  });
}

//modificar
export function actualizarVoluntario(id, voluntario) {
  return apiRequest(`/voluntarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(voluntario),
  });
}

//borrar
export function eliminarVoluntario(id) {
  return apiRequest(`/voluntarios/${id}`, {
    method: "DELETE",
  });
}
