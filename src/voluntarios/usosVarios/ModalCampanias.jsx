import { ModalBase } from "./ModalBase";
import { TarjetaCampania } from "./TarjetaCampania";
import { mockCampanias } from "../mockDataCampanias";

export function ModalCampanias({
  isOpen,
  onClose,
  campaniaActivaId,
  onSelectCampania,
}) {
  //ordenamos camapañas sin mutar el array original
  const campOrdenadas = [...mockCampanias].sort(
    (a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio),
  );

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} titulo="Seleccionar Campaña">
      <div id="lista-campanias">
        {campOrdenadas.map((c) => (
          <TarjetaCampania
            key={c.id}
            campania={c}
            esViendo={c.id === campaniaActivaId}
            onSelect={(campania) => {
              onSelectCampania(campania);
              onClose(); //cerramos el modal al hacer clic en una campña !!!!importante
            }}
          />
        ))}
      </div>
    </ModalBase>
  );
}
