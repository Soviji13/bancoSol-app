export function CampaniaEstado({ activa }) {
  return (
    <span
      className={
        activa
          ? "campanias__estado campanias__estado--activa"
          : "campanias__estado campanias__estado--terminada"
      }
    >
      {activa ? "Activa" : "Terminada"}
    </span>
  );
}
