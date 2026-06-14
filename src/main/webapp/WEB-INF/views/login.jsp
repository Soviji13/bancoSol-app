<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fn" uri="jakarta.tags.functions" %>


<%-- Sofía Si Villalba Jiménez (IA solo para conectar bien las rutas) --%>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gestión de campañas</title>
  <link rel="stylesheet" href="<c:url value='/css/login/style.css' />">
  <link rel="stylesheet" href="<c:url value='/css/global.css' />">
  <script type="module"
                src="<c:url value='/js/login/script.js' />"
                defer>
  </script>
</head>
<body class="bg-page">

  <main class="pantalla-login border-main">
    <section class="login-contenido">
      <img src="../assets/logo.png" alt="Logo BancoSol" class="logo-login" />

      <h1 class="text-main titulo-login">Gestión de campañas</h1>

      <form class="form-login" action="/inicio-sesion" method="post">
        <div class="grupo-campo">
          <label for="usuario" class="text-main label-login">Nombre de usuario:</label>
          <input type="text" id="usuario" name="usuario" class="input-login border-soft" />
        </div>

        <div class="grupo-campo">
          <label for="password" class="text-main label-login">Contraseña:</label>
          <input type="password" id="password" name="password" class="input-login border-soft" />

          <div class="contenedor-error">
            <c:if test="${errorLogin != null}">
                <p id="mensaje-error" class="mensaje-error" style="color: red; font-size: 0.9em; margin-top: 5px;">
                  Usuario o contraseña incorrectos
                </p>
            </c:if>
          </div>
        </div>

        <button type="submit" class="btn-login bg-main text-white">
          Entrar
        </button>
      </form>
    </section>
  </main>

</body>
</html>