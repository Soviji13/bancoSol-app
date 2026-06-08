import { apiRequest } from "./apiClient";

export function obtenerCoordinadores() {
  return apiRequest("/coordinadores");
}