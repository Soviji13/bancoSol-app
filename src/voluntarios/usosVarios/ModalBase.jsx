import "./usosVarios.css";

export function ModalBase({ isOpen, onClose, titulo, children }) {
  //si esta cerrado devolvemos null para q react no pinte nada
  if (!isOpen) return null;

  return (
    /*PARA CERRAR AL CLICK FUERA DEL MODAL (modaloverlay es el fondo oscurillo de detras)*/
    <div className="modal-overlay" onClick={onClose}>
      {/*para propagacion para q no se cierre al pinchar dentro de la caja*/}
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <h2 className="modal-titulo">{titulo}</h2>
          <button className="modal-cerrar-x" onClick={onClose}>
            X
          </button>
        </div>

        {/*los children seran als tarjetas de las campañas*/}
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>
  );
}
