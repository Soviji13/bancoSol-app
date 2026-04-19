// JOSE

const iUsuario = document.querySelector("#usuario");
const iContrasenia = document.querySelector("#password");
const btnentrar = document.querySelector(".btn-login");
const mensajeError = document.querySelector("#mensaje-error");

const uPrueba = "Sofia";
const cPrueba = "Xina";

function retrasoAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validarUsuario(usuario, contrasenia) {
  return new Promise((resolve, reject) => {
    if (usuario === uPrueba && contrasenia === cPrueba) {
      resolve("Exito");
    } else {
      reject("Acceso denegado º-º");
    }
  });
}

function limpiarErrores() {
  iUsuario.classList.remove("incorrecto");
  iContrasenia.classList.remove("incorrecto");
  mensajeError.hidden = true;
  mensajeError.textContent = "";
}

function mostrarError(texto, marcarUsuario = false, marcarContrasenia = false) {
  if (marcarUsuario) {
    iUsuario.classList.add("incorrecto");
  }

  if (marcarContrasenia) {
    iContrasenia.classList.add("incorrecto");
  }

  mensajeError.textContent = `⚠ ${texto}`;
  mensajeError.hidden = false;
}

iUsuario.addEventListener("input", limpiarErrores);
iContrasenia.addEventListener("input", limpiarErrores);

btnentrar.addEventListener("click", (event) => {
  event.preventDefault();

  const usuario = iUsuario.value.trim();
  const contrasenia = iContrasenia.value.trim();

  limpiarErrores();

  if (usuario === "" || contrasenia === "") {
    mostrarError(
      "Rellena ambos campos antes de acceder",
      usuario === "",
      contrasenia === ""
    );
    return;
  }

  console.log("Accediendo al servidor");

  setTimeout(() => {
    validarUsuario(usuario, contrasenia)
      .then((resultado) => {
        alert(resultado);
      })
      .catch(() => {
        mostrarError("Usuario y contraseña no coinciden", true, true);
      });
  }, retrasoAleatorio(500, 1000));
});