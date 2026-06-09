import { useEffect, useState } from "react";
import { ModalBase } from "./ModalBase";
import { TarjetaCampania } from "./TarjetaCampania"; // <-- Volvemos a importar tu tarjeta
import { apiRequest } from "../../api/apiClient";
import "./usosVarios.css";
export function ModalCampanias({
  isOpen,
  onClose,
  campaniaActivaId,
  onSelectCampania,
}) {
  const [campanias, setCampanias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Traemos las campañas de la base de datos de verdad
  useEffect(() => {
    if (isOpen) {
      setCargando(true);
      apiRequest("/campanias")
        .then((data) => {
          setCampanias(data);
        })
        .catch((error) => {
          console.error("Error al cargar las campañas reales:", error);
          setCampanias([]);
        })
        .finally(() => {
          setCargando(false);
        });
    }
  }, [isOpen]);

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} titulo="Seleccionar Campaña">
      <div className="modal-campanias-lista">
        {cargando ? (
          <p className="texto-cargando">Cargando campañas...</p>
        ) : campanias.length > 0 ? (
          campanias.map((camp) => (
            <TarjetaCampania
              key={camp.id}
              campania={camp}
              esViendo={camp.id === campaniaActivaId}
              onSelect={(campSeleccionada) => {
                onSelectCampania(campSeleccionada);
                onClose();
              }}
            />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            No hay campañas creadas en la base de datos.
          </p>
        )}
      </div>
    </ModalBase>
  );
}
