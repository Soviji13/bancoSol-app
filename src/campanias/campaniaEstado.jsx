export function CampaniaEstado({ activa }) {
  return (
    <p
      className={
        activa
          ? "campanias__estado campanias__estado--activa"
          : "campanias__estado campanias__estado--terminada"
      }
    >
      {activa ? "Activa" : "Terminada"}
    </p>
  );
}