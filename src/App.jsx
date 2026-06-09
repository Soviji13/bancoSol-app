import { useState } from "react"

import { Login } from "./login";
import { verificarUsuario } from "./api/usuariosApi";

import { Cabecera } from "./cabecera";
import { VentanaGestion } from "./gestionVentanas";

function App() {

  /******************************************
   *  LÓGICA DE LOGIN 
   ******************************************/

  // Estado para saber si se ha iniciado sesión o no (por defecto false)
  const [loginDone, setLoginDone] = useState(false);
  const [errorLogin, setErrorLogin] = useState("");

  // Estado para manejar Rol
  const [rol, setRol] = useState(null);

  // Estado para cabecera
  const [nombreCabecera, setNombreCabecera] = useState("");

  // Función para validar login (REFACTORIZAR CUANDO SE CONECTE A API)
  async function manejaLogin (usuario, contrasenia) {

    usuario = usuario.trim().toLowerCase();

    // Se crea un objeto igual que el contenido de la petición post
    const u = {
      user: usuario,
      pass: contrasenia
    };

    // Manejamos todos los posibles fallos de campos nulos
    if (usuario === "" || contrasenia === "") {
      if (usuario === "" && contrasenia === "") {
        setErrorLogin("Debe rellenar los campos de usuario y contraseña");
      }
      else if (contrasenia === "") {
        setErrorLogin("Debe rellenar el campo de contraseña");
      }
      else if (usuario === "") {
        setErrorLogin("Debe rellenar el campo de usuario");
      }
    // Si no hay datos nulos, lanzamos la petición
    } else {
      try {
        const respuestaLogin = await (verificarUsuario(u));
        setLoginDone(true);
        setRol(respuestaLogin.rol);
        setNombreCabecera(respuestaLogin.nombre);
      } catch (error) {
        setErrorLogin(error.message);
      }  
  }
}

  // Para cerrar sesión
  function manejaCierreSesion ()
  {
    setLoginDone(false);
  }

  return (
    <>
    {!loginDone && <Login manejaLogin={manejaLogin} error={errorLogin}/>}
    {loginDone && <Cabecera user={nombreCabecera} rol={rol} cierreSesion={manejaCierreSesion}/>}
    {loginDone && <VentanaGestion />}
    </>
  )
}

export default App
