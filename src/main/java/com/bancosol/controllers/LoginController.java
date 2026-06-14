package com.bancosol.controllers;

import org.springframework.stereotype.Controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.bancosol.dto.UsuarioDTO;
import com.bancosol.services.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

// SOfía Si Villalba Jiménez (IA PARA AUTOMATIZAR ESCRITURA DE CÓDIGO; LÓGICA PLANTEADA POR MÍ AL 100%)
@Controller
@AllArgsConstructor
public class LoginController {

  private final UsuarioService usuarioService;

  @GetMapping("/")
  public String doInicioSesion() {
    return "login";
  }

  @PostMapping("/inicio-sesion")
  public String procesarLogin(
      @RequestParam("usuario") String usuarioLogin,
      @RequestParam("password") String password,
      HttpServletRequest request,
      RedirectAttributes redirectAttributes) {

    UsuarioDTO usuarioSesion = usuarioService.autenticar(usuarioLogin, password);

    // Si falla el login
    if (usuarioSesion == null) {
      redirectAttributes.addFlashAttribute("errorLogin", true);
      return "redirect:/";
    }

    // Login bien, vamos a tiendas (interfaz accesible por todos los usuarios)
    // Guardamos además el usuario
    HttpSession session = request.getSession(true);
    session.setAttribute("usuarioLogueado", usuarioSesion);

    return "redirect:/tiendas";
  }

  @GetMapping("/logout")
  public String logout(HttpServletRequest request) {
    HttpSession session = request.getSession(false);
    if (session != null) {
      session.invalidate(); // Rompemos la sesión
    }
    return "redirect:/";
  }

}
