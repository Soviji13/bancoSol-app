// JOSE

const iUsuario = document.querySelector("#usuario");
const iContrasenia = document.querySelector("#password");
const btnentrar = document.querySelector(".btn-login");
let uPrueba = "Sofia";
let cPrueba = "Xina"

function retrasoAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function validarUsuario(usuario,contrasenia){
    return new Promise((resolve,reject) => {
        if(usuario === uPrueba && contrasenia === cPrueba)
        {
            resolve("Exito")
        }else{
            reject("Acceso denegado º-º")
        }
    })
}

btnentrar.addEventListener("click", (event) => {
    event.preventDefault();

    let usuario = iUsuario.value;
    let contrasenia = iContrasenia.value;
    console.log("Accediendo al servidor");
    setTimeout(() => {
                        validarUsuario(usuario,contrasenia)
                        .then((resultado) => {alert(`${resultado}`)})
                        .catch((error) => {alert(`${error}`)})
                    }, retrasoAleatorio(1000,3000)
    );
});