package com.bancosol.filters;

import com.bancosol.dto.UsuarioDTO;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import java.io.IOException;

// Sofía Si Villalba Jiménez - IA plantilla base, yo he añadido la lógica de roles y de si no hay usuario

@Component
public class AutorizacionFilter implements Filter {

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    HttpSession session = httpRequest.getSession(false);

    String requestURI = httpRequest.getRequestURI();
    String contextPath = httpRequest.getContextPath();

    // 1. Obtener los datos del DTO guardados en la sesión
    UsuarioDTO usuario = (session != null) ? (UsuarioDTO) session.getAttribute("usuarioLogueado") : null;

    // No se bloquean rutas a las que hay que acceder sí o sí
    boolean esRaizOLogin = requestURI.equals(contextPath + "/") || requestURI.equals(contextPath + "/inicio-sesion");
    boolean esRecursoEstatico = requestURI.contains("/css/") || requestURI.contains("/js/")
        || requestURI.contains("/assets/");

    // Control de login
    if (usuario == null) {
      if (esRaizOLogin || esRecursoEstatico) {
        // Si va al login o a por estilos, le dejamos pasar sin problemas
        chain.doFilter(request, response);
      } else {
        // Si intenta entrar a capón a /tiendas o /entidades sin registrarse, rebote a
        // la raíz
        httpResponse.sendRedirect(contextPath + "/");
      }
      return; // Cortamos la ejecución aquí
    }

    // 2. Definir las rutas críticas (no permitidas a todos)
    boolean intentandoEntrarACampanias = requestURI.startsWith(contextPath + "/campanias");
    boolean intentandoEntrarACoordinadores = requestURI.startsWith(contextPath + "/coordinadores");
    boolean intentandoEntrarAColaboradores = requestURI.startsWith(contextPath + "/entidades");

    boolean intentandoEntrarAListadoIncidencias = requestURI.startsWith(contextPath + "/incidencias");
    boolean esRutaPermitidaIncidencias = requestURI.equals(contextPath + "/incidencias/nuevo")
        || requestURI.equals(contextPath + "/incidencias/guardar");

    // 3. Sistema de barreras y permisos por Rol
    if (usuario != null) {
      String rol = usuario.getRol() != null ? usuario.getRol().name() : "";

      if (!rol.equals("ADMIN")) {
        if (intentandoEntrarACampanias || intentandoEntrarACoordinadores) {
          httpResponse.sendRedirect(contextPath + "/tiendas"); // Redirigimos a su zona segura
          return;
        }
        if (intentandoEntrarAListadoIncidencias && !esRutaPermitidaIncidencias) {
          httpResponse.sendRedirect(contextPath + "/incidencias/nuevo"); // Redirigimos a su zona segura
          return;
        }
      }

      if (rol.equals("RESPONSABLE_TIENDA") && intentandoEntrarAColaboradores) {
        httpResponse.sendRedirect(contextPath + "/tiendas");
        return;
      }
      if (rol.equals("RESPONSABLE_TIENDA") && intentandoEntrarAListadoIncidencias) {
        httpResponse.sendRedirect(contextPath + "/tiendas");
        return;
      }
    }

    // Si pasa todos los filtros de seguridad, continúa el flujo normal
    chain.doFilter(request, response);
  }
}