document.addEventListener("DOMContentLoaded", () => {
    // Referencias form
    const selectEntidad = document.getElementById("select-entidad");
    const selectResponsable = document.getElementById("select-responsable");
    const hsSi = document.getElementById("hs-si");
    const hsNo = document.getElementById("hs-no");
    const horaInicio = document.getElementById("horaInicio");
    const horaFin = document.getElementById("horaFin");
    const labelIntervalo = document.getElementById("label-intervalo");

    // Referencias turnos array
    let turnosAsignados = [];
    const inputTurnosJson = document.getElementById("turnosJson");
    const listaTurnosDOM = document.getElementById("lista-turnos-agregados");
    const textoSinTurnos = document.getElementById("texto-sin-turnos");

    // Referencias Modal
    const btnAbrirModal = document.getElementById("btn-abrir-modal-turno");
    const modalTurno = document.getElementById("modal-turno");
    const btnCerrarModal = document.getElementById("btn-cerrar-turno");
    const btnGuardarTurno = document.getElementById("btn-guardar-turno");

    const mSelectTienda = document.getElementById("modal-select-tienda");
    const mSelectDia = document.getElementById("modal-select-dia");
    const mSelectFranja = document.getElementById("modal-select-franja");
    const mInfoHoras = document.getElementById("modal-info-horas");

    // 1. Cargar datos dinamicos desde el JSP (sin fetch)
    const entidades = window.entidadesData || [];
    const tiendas = window.tiendasData || [];

    entidades.forEach(ent => {
        const opt = document.createElement("option");
        opt.value = ent.id; //usamos el ID de la entidad
        opt.text = ent.nombre;
        selectEntidad.add(opt);
    });

    tiendas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.text = t.nombre;
        mSelectTienda.add(opt);
    });

    // 2. Select dependiente Entidad -> Responsables
    selectEntidad.addEventListener("change", (e) => {
        const entId = parseInt(e.target.value);
        const entidadSeleccionada = entidades.find(ent => ent.id === entId);

        selectResponsable.innerHTML = '<option value="" disabled selected>Seleccione un responsable...</option>';
        if (entidadSeleccionada && entidadSeleccionada.responsablesEntidad) {
            entidadSeleccionada.responsablesEntidad.forEach(resp => {
                const opt = document.createElement("option");
                opt.value = resp.id;
                opt.text = resp.contacto.nombre;
                selectResponsable.add(opt);
            });
            selectResponsable.disabled = false;
            selectResponsable.style.background = "white";
        } else {
            selectResponsable.disabled = true;
            selectResponsable.style.background = "#f8f9fa";
        }
    });

    // 3. Logica Horas Sueltas
    const toggleHoras = () => {
        const isSi = hsSi.checked;
        horaInicio.disabled = !isSi;
        horaFin.disabled = !isSi;
        horaInicio.required = isSi;
        horaFin.required = isSi;

        if (isSi) {
            horaInicio.style.background = "white";
            horaFin.style.background = "white";
            labelIntervalo.style.color = "#2c398b";
        } else {
            horaInicio.value = "";
            horaFin.value = "";
            horaInicio.style.background = "#f8f9fa";
            horaFin.style.background = "#f8f9fa";
            labelIntervalo.style.color = "#a0a0a0";
        }
    };
    hsSi.addEventListener("change", toggleHoras);
    hsNo.addEventListener("change", toggleHoras);

    // 4. Logica Modal Turnos
    btnAbrirModal.addEventListener("click", () => {
        mSelectTienda.value = "";
        mSelectDia.value = "";
        mSelectFranja.value = "";

        if (hsSi.checked) {
            mSelectFranja.classList.add("oculto");
            mSelectFranja.style.display = "none";
            mInfoHoras.classList.remove("oculto");
            mInfoHoras.style.display = "block";
        } else {
            mSelectFranja.classList.remove("oculto");
            mSelectFranja.style.display = "block";
            mInfoHoras.classList.add("oculto");
            mInfoHoras.style.display = "none";
        }

        modalTurno.classList.remove("oculto");
        modalTurno.style.display = "flex";
    });

    btnCerrarModal.addEventListener("click", () => {
        modalTurno.style.display = "none";
    });

    // Guardar Turno
    btnGuardarTurno.addEventListener("click", () => {
        if (!mSelectTienda.value || !mSelectDia.value) {
            alert("Selecciona tienda y día.");
            return;
        }
        if (hsNo.checked && !mSelectFranja.value) {
            alert("Selecciona franja.");
            return;
        }

        const tiendaSel = mSelectTienda.options[mSelectTienda.selectedIndex];

        const nuevoTurno = {
            tiendaId: mSelectTienda.value,
            tiendaNombre: tiendaSel.text,
            dia: mSelectDia.value,
            franja: hsSi.checked ? "HORAS_SUELTAS" : mSelectFranja.value
        };

        turnosAsignados.push(nuevoTurno);
        actualizarDOMTurnos();
        modalTurno.style.display = "none";
    });

    window.eliminarTurno = (index) => {
        turnosAsignados.splice(index, 1);
        actualizarDOMTurnos();
    };

    function actualizarDOMTurnos() {
        listaTurnosDOM.innerHTML = "";
        if (turnosAsignados.length > 0) {
            textoSinTurnos.style.display = "none";
            turnosAsignados.forEach((t, index) => {
                const li = document.createElement("li");
                li.style = "display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; border: 1px solid #d0d0d0; border-radius: 4px; padding: 0.5rem 0.8rem; font-size: 0.9rem;";

                const franjaMostrada = t.franja === "HORAS_SUELTAS" ? "Según formulario" : t.franja;
                li.innerHTML = `
                    <span><strong>${t.tiendaNombre}</strong> - ${t.dia} (${franjaMostrada})</span>
                    <button type="button" onclick="eliminarTurno(${index})" style="background: none; border: none; color: #c53030; font-weight: bold; cursor: pointer;">X</button>
                `;
                listaTurnosDOM.appendChild(li);
            });
        } else {
            textoSinTurnos.style.display = "block";
        }

        // Carga la informacion oculta para enviar al controller
        inputTurnosJson.value = JSON.stringify(turnosAsignados);
    }
});