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
    <main className="pantalla-login border-main">
        <section className="login-contenido">
            <img src="../public/logo.png" alt="Logo BancoSol" className="logo-login" />

            <h1 className="text-main titulo-login">Gestión de campañas</h1>

            <form className="form-login" action="#" method="post" onSubmit={(e) => {e.preventDefault(); manejaLogin(user, psw)}}>
                <div className="grupo-campo">
                    {/* USUARIO */}
                    <label htmlFor="usuario" className="text-main label-login">Nombre de usuario:</label>
                    <input 
                        type="text" 
                        id="usuario" 
                        name="usuario" 
                        className="input-login border-soft" 
                        onChange={(e) => {setUser(e.target.value);}}
                    />
                </div>

                <div className="grupo-campo">
                    {/* CONTRASEÑA */}
                    <label htmlFor="password" className="text-main label-login">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        className="input-login border-soft" 
                        onChange={(e) => {setPsw(e.target.value);}}
                    />
                    {error !== null && <MensajeError>{error}</MensajeError>}
                </div>

                <button 
                    type="submit" 
                    className="btn-login bg-main text-white"
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
        <div className="contenedor-error">
            <p id="mensaje-error" className="mensaje-error">
                {children}
            </p>
        </div>
    )
}