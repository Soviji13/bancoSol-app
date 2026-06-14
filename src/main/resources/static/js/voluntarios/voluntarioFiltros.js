document.addEventListener("DOMContentLoaded", () => {
    const selectEntidad = document.getElementById("filtroEntidad");
    const selectResponsable = document.getElementById("filtroResponsable");
    const selectTienda = document.getElementById("filtroTienda");

    const entidades = window.entidadesFiltros || [];
    const tiendas = window.tiendasFiltros || [];
    const filtros = window.filtrosActuales || {};

    // 1. Cargar Tiendas
    tiendas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.nombre; //OJO: el buscador de hibernate usa el nombre en los filtros
        opt.text = t.nombre;
        if (t.nombre === filtros.tienda) opt.selected = true;
        selectTienda.add(opt);
    });

    // 2. Cargar Entidades
    entidades.forEach(ent => {
        const opt = document.createElement("option");
        opt.value = ent.nombre;
        opt.text = ent.nombre;
        if (ent.nombre === filtros.entidad) opt.selected = true;
        selectEntidad.add(opt);
    });

    // 3. Rellenar responsables dependientes
    function cargarResponsables(entidadNombre, responsableActual) {
        selectResponsable.innerHTML = '<option value="">Todos los responsables</option>';
        if (!entidadNombre) return;

        const entidadSeleccionada = entidades.find(ent => ent.nombre === entidadNombre);
        if (entidadSeleccionada && entidadSeleccionada.responsablesEntidad) {
            entidadSeleccionada.responsablesEntidad.forEach(resp => {
                const opt = document.createElement("option");
                opt.value = resp.contacto.nombre;
                opt.text = resp.contacto.nombre;
                if (resp.contacto.nombre === responsableActual) opt.selected = true;
                selectResponsable.add(opt);
            });
        }
    }

    // Inicializamos si veniamos de una busqueda anterior
    if (filtros.entidad) {
        cargarResponsables(filtros.entidad, filtros.responsable);
    }

    // Actualizar responsables dinamicamente
    selectEntidad.addEventListener("change", (e) => {
        cargarResponsables(e.target.value, "");
    });
});