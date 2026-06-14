document.addEventListener("DOMContentLoaded", () => {
    const tipoResponsable = document.querySelector("#tipo-responsable");
    const responsableTienda = document.querySelector("#responsableTiendaId");
    const responsableEntidad = document.querySelector("#responsableEntidadId");
    const grupoTienda = document.querySelector("#grupo-responsable-tienda");
    const grupoEntidad = document.querySelector("#grupo-responsable-entidad");

    if (!tipoResponsable || !responsableTienda || !responsableEntidad) {
        return;
    }

    actualizarResponsables();

    tipoResponsable.addEventListener("change", actualizarResponsables);

    function actualizarResponsables() {
        const tipo = tipoResponsable.value;

        if (tipo === "TIENDA") {
            activarResponsableTienda();
            return;
        }

        if (tipo === "ENTIDAD") {
            activarResponsableEntidad();
            return;
        }

        desactivarAmbosResponsables();
    }

    function activarResponsableTienda() {
        responsableTienda.disabled = false;
        responsableTienda.required = true;

        responsableEntidad.disabled = true;
        responsableEntidad.required = false;
        responsableEntidad.value = "";

        grupoTienda?.classList.remove("grupo-responsable--deshabilitado");
        grupoEntidad?.classList.add("grupo-responsable--deshabilitado");
    }

    function activarResponsableEntidad() {
        responsableEntidad.disabled = false;
        responsableEntidad.required = true;

        responsableTienda.disabled = true;
        responsableTienda.required = false;
        responsableTienda.value = "";

        grupoEntidad?.classList.remove("grupo-responsable--deshabilitado");
        grupoTienda?.classList.add("grupo-responsable--deshabilitado");
    }

    function desactivarAmbosResponsables() {
        responsableTienda.disabled = true;
        responsableTienda.required = false;
        responsableTienda.value = "";

        responsableEntidad.disabled = true;
        responsableEntidad.required = false;
        responsableEntidad.value = "";

        grupoTienda?.classList.add("grupo-responsable--deshabilitado");
        grupoEntidad?.classList.add("grupo-responsable--deshabilitado");
    }
});