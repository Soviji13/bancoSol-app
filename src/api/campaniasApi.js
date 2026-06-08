import { apiRequest } from "./apiClient";

export function obtenerCampanias() {
  return apiRequest("/campanias");
}

export function obtenerCampaniaPorId(id) {
  return apiRequest(`/campanias/${id}`);
}

export function crearCampania(campania) {
  return apiRequest("/campanias", {
    method: "POST",
    body: JSON.stringify(campania),
  });
}

export function actualizarCampania(id, campania) {
  return apiRequest(`/campanias/${id}`, {
    method: "PUT",
    body: JSON.stringify(campania),
  });
}

export function eliminarCampania(id) {
  return apiRequest(`/campanias/${id}`, {
    method: "DELETE",
  });
}

export function actualizarCadenasCampania(idCampania, idsCadenas) {
  return apiRequest(`/campanias/${idCampania}/cadenas`, {
    method: "PUT",
    body: JSON.stringify(idsCadenas),
  });
}

export function actualizarCoordinadoresCampania(idCampania, idsCoordinadores) {
  return apiRequest(`/campanias/${idCampania}/coordinadores`, {
    method: "PUT",
    body: JSON.stringify(idsCoordinadores),
  });
}
