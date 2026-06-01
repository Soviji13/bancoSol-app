// Por ahora no accede a los datos de la API, se implementará en un futuro

import '../public/login.css'

import { useState } from 'react';

// Recordatorio de usuarios:

// Email: jorge@gmail.com, psw: jorge1234, rol: Administrador
// Email: mayte@gmail.com, psw: mayte1234, rol: Coordinador
// Email: carlos@gmail.com, psw: carlos1234, rol: Responsable de Entidad
// Email: hugo@gmail.com, psw: hugo1234, rol: Responsable de Tienda

export function Login ({manejaLogin, error}) {

    // Estado para guardar datos de login
    const [user, setUser] = useState(null);
    const [psw, setPsw] = useState(null);

    return (
    <>
    <main class="pantalla-login border-main">
        <section class="login-contenido">
            <img src="../public/logo.png" alt="Logo BancoSol" class="logo-login" />

            <h1 class="text-main titulo-login">Gestión de campañas</h1>

            <form class="form-login" action="#" method="post" onSubmit={(e) => {e.preventDefault();}}>
                <div class="grupo-campo">
                    {/* USUARIO */}
                    <label for="usuario" class="text-main label-login">Nombre de usuario:</label>
                    <input 
                        type="text" 
                        id="usuario" 
                        name="usuario" 
                        class="input-login border-soft" 
                        onChange={(e) => {setUser(e.target.value);}}
                    />
                </div>

                <div class="grupo-campo">
                    {/* CONTRASEÑA */}
                    <label for="password" class="text-main label-login">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        class="input-login border-soft" 
                        onChange={(e) => {setPsw(e.target.value);}}
                    />
                    {error !== null && <MensajeError>{error}</MensajeError>}
                </div>

                <button 
                    type="submit" 
                    class="btn-login bg-main text-white"
                    onClick={() => {manejaLogin(user, psw);}}
                >
                Entrar
                </button>
            </form>
        </section>
    </main>
    </>
    );
}

function MensajeError ({children}) {
    return(
        <div class="contenedor-error">
            <p id="mensaje-error" class="mensaje-error">
                {children}
            </p>
        </div>
    )
}