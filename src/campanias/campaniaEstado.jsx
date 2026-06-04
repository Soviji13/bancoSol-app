export function CampaniaEstado({ activa }) {
  const claseEstado = activa
    ? "campanias__estado campanias__estado--activa"
    : "campanias__estado campanias__estado--terminada";

  return (
    <p className={claseEstado}>
      {activa ? "Activa" : "Terminada"}
    </p>
  );
}