import { apiRequest } from "./apiClient";

export function verificarUsuario(user) {
  return apiRequest("/usuarios/verificar", {
    method: "POST",
    body: JSON.stringify(user),
  });
}