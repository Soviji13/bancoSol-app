import { ModalBase } from "./ModalBase";

// este es nuestro modal modularizado q usaremos en aniadir y en modificar
// recibe por props (parametros) todo lo q necesita del componente q lo invoca
export function ModalTurno({
  isOpen,
  onClose,
  tiendasUnicas,
  diasSemana,
  nuevoTurnoTienda,
  setNuevoTurnoTienda,
  nuevoTurnoDia,
  setNuevoTurnoDia,
  nuevoTurnoFranja,
  setNuevoTurnoFranja,
  horasSueltas,
  horasCompletadas,
  horaInicio,
  horaFin,
  puedeGuardarTurno,
  onGuardarTurno,
}) {
  return (
    <ModalBase isOpen={isOpen} onClose={onClose} titulo="Añadir Turno">
      <div className="modal-campo">
        <label htmlFor="modal-select-tienda">Tienda de destino:</label>
        <select
          id="modal-select-tienda"
          className="select-caja select-caja-full"
          value={nuevoTurnoTienda}
          onChange={(e) => setNuevoTurnoTienda(e.target.value)}
        >
          {/*RECORDATORIO: el disabled es para mostrar la opcion pero q no se pueda seleccionar y asi poder dar la indicacion*/}
          <option value="" disabled>
            Seleccione tienda...
          </option>
          {tiendasUnicas.map((t, idx) => (
            <option key={idx} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-campo">
        <label htmlFor="modal-select-dia">Día de la semana:</label>
        <select
          id="modal-select-dia"
          className="select-caja select-caja-full"
          value={nuevoTurnoDia}
          onChange={(e) => setNuevoTurnoDia(e.target.value)}
        >
          <option value="" disabled>
            Seleccione día...
          </option>
          {diasSemana.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div className="modal-campo">
        <label>Franja u Horario:</label>
        {/* logica para mostrar el desplegable o el texto de aviso segun horasSueltas*/}
        {horasSueltas === "no" ? (
          <select
            className="select-caja select-caja-full"
            value={nuevoTurnoFranja}
            onChange={(e) => setNuevoTurnoFranja(e.target.value)}
          >
            <option value="" disabled>
              Seleccione franja...
            </option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
          </select>
        ) : (
          <div className="info-horas-sueltas-modal">
            {horasCompletadas ? (
              <span className="info-horas-ok">
                Se asignará: {horaInicio} - {horaFin}
              </span>
            ) : (
              {
                /*CASO AÑADES TURNO CON HORASSUELTAS TRUE PERO SIN RELLENAR !!!!!!!!!*/
              }(
                <span className="info-horas-error">
                  Debes rellenar la hora de inicio y fin en el formulario
                  primero.
                </span>,
              )
            )}
          </div>
        )}
      </div>

      <footer className="modal-pie">
        <button
          type="button"
          className="btn-modal-guardar"
          onClick={onGuardarTurno}
          disabled={!puedeGuardarTurno}
        >
          Añadir al listado
        </button>
      </footer>
    </ModalBase>
  );
}
