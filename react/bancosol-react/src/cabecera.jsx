import '../public/cabecera.css'

export function Cabecera ({user, rol, cierreSesion}) {
    return (
        <header class="panel-coordinadores__header">
            <div class="usuario">
                <div class="usuario__logo">
                    <img src="../public/logo.png" alt="Logo BancoSol" />
                </div>

                <div class="usuario__datos">
                    <p class="usuario__bienvenida">Bienvenido, {user}</p>
                    <p class="usuario__rol">{rol}</p>
                </div>
            </div>

            <a 
                href="#" 
                class="panel-coordinadores__logout"
                onClick={cierreSesion}
            >
                Cerrar sesión
            </a>
        </header>
    )
}