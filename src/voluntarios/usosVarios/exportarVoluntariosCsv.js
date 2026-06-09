export const exportarVoluntariosCsv = (voluntarios, nombreCampania) => {
  if (!voluntarios || voluntarios.length === 0) {
    alert(
      "No hay voluntarios cargados en la tabla para exportar en este momento.",
    );
    return;
  }

  const cabeceras = ["ID", "Entidad", "Responsable", "Turnos", "Observaciones"];

  //función auxiliar protectora para escapar comillas y evitar romper celdas en Excel
  const limpiar = (texto) =>
    texto ? `"${texto.toString().replace(/"/g, '""')}"` : '""';

  const filasCsv = voluntarios.map((v) => {
    //formateamos los turnos: la tienda y debajo sus turnos tabulados
    let turnosTexto = "";
    if (v.asignaciones && v.asignaciones.length > 0) {
      turnosTexto = v.asignaciones
        .map((asig) => {
          let tiendaStr = `Tienda: ${asig.tiendaNombre}`;
          let turnosStr = asig.turnos
            .map((t) => `\n  - ${t.dia} (${t.franjaHoraria})`)
            .join("");
          return tiendaStr + turnosStr;
        })
        .join("\n\n");
    } else {
      turnosTexto = "Sin turnos asignados";
    }

    return [
      v.id,
      limpiar(v.perteneceA),
      limpiar(v.responsableEntidad),
      limpiar(turnosTexto),
      limpiar(v.observaciones),
    ].join(";");
  });

  const BOM = "\uFEFF"; //para q lea tildes ñ etc del español
  const contenidoFinal = BOM + cabeceras.join(";") + "\n" + filasCsv.join("\n");

  //disparador de la descarga
  const blobFinal = new Blob([contenidoFinal], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blobFinal);

  const link = document.createElement("a");
  const fecha = new Date().toISOString().slice(0, 10);

  link.href = url;
  //nombre del archivo dinámico
  link.download = `Voluntarios_${nombreCampania.replace(/\s+/g, "_")}_${fecha}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
