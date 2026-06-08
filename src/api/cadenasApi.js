import { apiRequest } from "./apiClient";

export function obtenerCadenas() {
  return apiRequest("/cadenas");
}

export function crearCadena(cadena) {
  return apiRequest("/cadenas", {
    method: "POST",
    body: JSON.stringify(cadena),
  });
}