import { useState } from "react"

import { Login } from "./login";
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
  function manejaLogin (user, psw) {

    user = user.toLowerCase();
    psw = psw.toLowerCase();

    if (user === "jorge@gmail.com" && psw === "jorge1234") {
      setLoginDone(true);
      setRol({rol: "admin", alias: "Administrador"});
      setNombreCabecera("Jorge");
    } 
    else if (user === "mayte@gmail.com" && psw === "mayte1234") {
      setLoginDone(true);
      setRol({rol: "coor", alias: "Coordinador"});
      setNombreCabecera("Mayte");
    }
    else if (user === "carlos@gmail.com" && psw === "carlos1234") {
      setLoginDone(true);
      setRol({rol: "resp_entidad", alias: "Responsable de entidad"});
      setNombreCabecera("Carlos");
    }
    else if (user === "hugo@gmail.com" && psw === "hugo1234") {
      setLoginDone(true);
      setNombreCabecera("Hugo");
      setRol({rol: "resp_tienda", alias: "Responsable de tienda"});
    }
    else if (user === "prueba" && psw === "prueba") {
      setLoginDone(true);
      setNombreCabecera("Prueba");
      setRol({rol: "prueba", alias: "rol prueba"});
    }
    // Campo vacío de login, contraseña o ambos
    else if (user === "" || psw === "") {
      if (user === "" && psw === "") {
        setErrorLogin("Debe rellenar los campos de usuario y contraseña");
      }
      else if (psw === "") {
        setErrorLogin("Debe rellenar el campo de contraseña");
      }
      else if (user === "") {
        setErrorLogin("Debe rellenar el campo de usuario");
      }
    }
    // Datos erróneos
    else {
      setErrorLogin("Error: Usuario o contraseña no son correctos");
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
    {loginDone && <Cabecera user={nombreCabecera} rol={rol.alias} cierreSesion={manejaCierreSesion}/>}
    {loginDone && <VentanaGestion />}
    </>
  )
}

export default App
