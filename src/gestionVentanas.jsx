import { useState } from "react";

import "../public/gestion_ventanas.css";

import { MainCampanias } from "./campanias/campaniasMain";
import { MainVoluntarios } from "./voluntarios/voluntariosMain";

/*FRAN*/
import { DetalleVoluntario } from "./voluntarios/menuLateral/DetalleVoluntario";
import { FiltrosVoluntarios } from "./voluntarios/menuLateral/FiltrosVoluntarios";
import { AniadirVoluntario } from "./voluntarios/contenido/AniadirVoluntario";
import { ModificarVoluntario } from "./voluntarios/menuLateral/ModificarVoluntario";

function NavegadorMenus({ manejaContenidoInicial, contenido }) {
  return (
    <nav className="menu-lateral" aria-label="Menú de administración">
      <button
        className={`menu-lateral__btn 
                    ${contenido === "campanias" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("campanias");
        }}
      >
        Gestionar campañas
      </button>

      <button
        className={`menu-lateral__btn 
                    ${contenido === "coordinadores" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("coordinadores");
        }}
      >
        Gestionar coordinadores
      </button>

      <button
        className={`menu-lateral__btn 
                    ${contenido === "tiendas" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("tiendas");
        }}
      >
        Gestionar tiendas
      </button>

      <button
        className={`menu-lateral__btn 
                    ${contenido === "colaboradores" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("colaboradores");
        }}
      >
        Gestionar colaboradores
      </button>

      <button
        className={`menu-lateral__btn 
                    ${contenido === "voluntarios" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("voluntarios");
        }}
      >
        Gestionar voluntarios
      </button>

      <button
        className={`menu-lateral__btn 
                    ${contenido === "incidencias" ? "menu-lateral__btn--activo" : ""}`}
        type="button"
        onClick={() => {
          manejaContenidoInicial("incidencias");
        }}
      >
        Incidencias y movimientos
      </button>
    </nav>
  );
}

/********************************************************
 * GESTIÓN DE MENÚS LATERALES Y MENÚS INICIALES
 *********************************************************/

export function MenuLateral({
  tipoLateral,
  manejaContenidoInicial,
  manejaContenidoLateral,
  contenidoInicial,
}) {
  return (
    <div className="contenedor_contenido contenedor_menu">
      {tipoLateral === "menuLateral" && (
        <NavegadorMenus
          manejaContenidoInicial={manejaContenidoInicial}
          contenido={contenidoInicial}
        />
      )}
      {tipoLateral === "test" && (
        <Ok
          manejaContenidoLateral={manejaContenidoLateral}
          manejaContenidoInicial={manejaContenidoInicial}
        />
      )}
      {tipoLateral === "detalle-voluntario" /*FRAN */ && (
        <DetalleVoluntario manejaContenidoLateral={manejaContenidoLateral} />
      )}

      {tipoLateral === "filtros-voluntarios" /*FRAN */ && (
        <FiltrosVoluntarios manejaContenidoLateral={manejaContenidoLateral} />
      )}

      {tipoLateral === "modificar-voluntario" /*FRAN */ && (
        <ModificarVoluntario manejaContenidoLateral={manejaContenidoLateral} />
      )}
    </div>
  );
}

function ContenidoInicial({
  tipoContenido,
  manejaContenidoLateral,
  manejaContenidoInicial,
}) {
  return (
    <div className="contenedor_contenido contenedor_principal">
      {tipoContenido === "campanias" && (
        <MainCampanias
          manejaContenidoLateral={manejaContenidoLateral}
          manejaContenidoInicial={manejaContenidoInicial}
        />
      )}
      {tipoContenido === "coordinadores" && (
        <p>Coordinadores (Funcionalidad en parte de JavaScript)</p>
      )}
      {tipoContenido === "tiendas" && (
        <p>Tiendas (Funcionalidad en parte de JavaScript)</p>
      )}
      {tipoContenido === "colaboradores" && (
        <p>Colaboradores (Funcionalidad en parte de JavaScript)</p>
      )}
      {tipoContenido === "voluntarios" && (
        <MainVoluntarios
          manejaContenidoLateral={manejaContenidoLateral}
          manejaContenidoInicial={manejaContenidoInicial}
        />
      )}

      {tipoContenido === "aniadir-voluntario" /*FRAN */ && (
        <AniadirVoluntario manejaContenidoInicial={manejaContenidoInicial} />
      )}

      {tipoContenido === "incidencias" && (
        <p>Inicidencias (Funcionalidad en parte de JavaScript)</p>
      )}
      {tipoContenido === "test" && (
        <Ok
          manejaContenidoLateral={manejaContenidoLateral}
          manejaContenidoInicial={manejaContenidoInicial}
        />
      )}
    </div>
  );
}

function Ok({ manejaContenidoInicial, manejaContenidoLateral }) {
  return (
    <>
      <p>Test Ok</p>
      <button
        onClick={() => {
          manejaContenidoInicial("coordinadores");
          manejaContenidoLateral("menuLateral");
        }}
      >
        Reset contenido
      </button>
    </>
  );
}

export function VentanaGestion() {
  /*************************++++***************************************
   * GESTIÓN DE VENTANAS DE CONTENIDO INICIAL (CONTENEDOR DERECHO)
   ********************************************************************/

  const [contenidoInicial, setContenidoInicial] = useState("coordinadores");

  function manejaContenidoInicial(contenido) {
    setContenidoInicial(contenido);
  }

  /*************************++++***************************************
   * GESTIÓN DE VENTANAS DE MENÚS (CONTENEDOR IZQUIERDO)
   ********************************************************************/

  const [lateral, setLateral] = useState("menuLateral");

  function manejaContenidoLateral(contenido) {
    setLateral(contenido);
  }

  return (
    <div className="panel-gestion">
      <MenuLateral
        tipoLateral={lateral}
        manejaContenidoInicial={manejaContenidoInicial}
        manejaContenidoLateral={manejaContenidoLateral}
        contenidoInicial={contenidoInicial}
      />
      <ContenidoInicial
        tipoContenido={contenidoInicial}
        manejaContenidoLateral={manejaContenidoLateral}
        manejaContenidoInicial={manejaContenidoInicial}
      />
    </div>
  );
}
