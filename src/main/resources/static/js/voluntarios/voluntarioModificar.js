document.addEventListener("DOMContentLoaded", () => {
    const selectEntidad = document.getElementById("select-entidad");
    const selectResponsable = document.getElementById("select-responsable");
    const spanTelefono = document.getElementById("texto-telefono");
    const spanEmail = document.getElementById("texto-email");

    let turnosAsignados = window.turnosIniciales || [];
    const inputTurnosJson = document.getElementById("turnosJson");
    const listaTurnosDOM = document.getElementById("lista-turnos-agregados");
    const textoSinTurnos = document.getElementById("texto-sin-turnos");
    const isHorasSueltas = window.horasSueltasActivo || false;

    const btnAbrirModal = document.getElementById("btn-abrir-modal-turno");
    const modalTurno = document.getElementById("modal-turno");
    const btnCerrarModal = document.getElementById("btn-cerrar-turno");
    const btnGuardarTurno = document.getElementById("btn-guardar-turno");

    const mSelectTienda = document.getElementById("modal-select-tienda");
    const mSelectDia = document.getElementById("modal-select-dia");
    const mSelectFranja = document.getElementById("modal-select-franja");
    const mInfoHoras = document.getElementById("modal-info-horas");

    const entidades = window.entidadesData || [];
    const tiendas = window.tiendasData || [];
    const responsableActualId = selectResponsable.dataset.selected;

    // 1. Cargar Entidades y Tiendas
    let entidadInicialId = null;
    entidades.forEach(ent => {
        const opt = document.createElement("option");
        opt.value = ent.id;
        opt.text = ent.nombre;

        //Si este voluntario tiene responsable, buscamos su entidad para pre-seleccionarla
        if (responsableActualId && ent.responsablesEntidad) {
            const tieneResp = ent.responsablesEntidad.find(r => String(r.id) === String(responsableActualId));
            if (tieneResp) {
                opt.selected = true;
                entidadInicialId = ent.id;
            }
        }
        selectEntidad.add(opt);
    });

    tiendas.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.id;
        opt.text = t.nombre;
        mSelectTienda.add(opt);
    });

    // 2. Función para cargar responsables según la entidad elegida
    function cargarResponsables(entId, responsableSeleccionadoId = null) {
        selectResponsable.innerHTML = '<option value="" disabled>Seleccione un responsable...</option>';
        const entidadSeleccionada = entidades.find(ent => String(ent.id) === String(entId));

        if (entidadSeleccionada && entidadSeleccionada.responsablesEntidad) {
            entidadSeleccionada.responsablesEntidad.forEach(resp => {
                const opt = document.createElement("option");
                opt.value = resp.id;
                opt.text = resp.contacto.nombre;
                //guardamos los datos en el option para sacarlos rapido al clickar
                opt.dataset.tlf = resp.contacto.telefono || "---";
                opt.dataset.email = resp.contacto.email || "---";

                if (String(resp.id) === String(responsableSeleccionadoId)) {
                    opt.selected = true;
                }
                selectResponsable.add(opt);
            });
            selectResponsable.disabled = false;
            selectResponsable.style.background = "white";
        } else {
            selectResponsable.disabled = true;
            selectResponsable.style.background = "#f8f9fa";
            spanTelefono.textContent = "---";
            spanEmail.textContent = "---";
        }
    }

    //Cargamos los datos iniciales al arrancar la pagina!!!!
    if (entidadInicialId) {
        cargarResponsables(entidadInicialId, responsableActualId);
    }

    selectEntidad.addEventListener("change", (e) => {
        cargarResponsables(e.target.value);
        spanTelefono.textContent = "---";
        spanEmail.textContent = "---";
    });

    selectResponsable.addEventListener("change", (e) => {
        const opt = e.target.options[e.target.selectedIndex];
        spanTelefono.textContent = opt.dataset.tlf || "---";
        spanEmail.textContent = opt.dataset.email || "---";
    });

    // 3. Modal Turnos
    btnAbrirModal.addEventListener("click", () => {
        mSelectTienda.value = "";
        mSelectDia.value = "";
        mSelectFranja.value = "";

        if (isHorasSueltas) {
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

    btnGuardarTurno.addEventListener("click", () => {
        if (!mSelectTienda.value || !mSelectDia.value) {
            alert("Selecciona tienda y día.");
            return;
        }
        if (!isHorasSueltas && !mSelectFranja.value) {
            alert("Selecciona franja.");
            return;
        }

        const tiendaSel = mSelectTienda.options[mSelectTienda.selectedIndex];
        const nuevoTurno = {
            tiendaId: mSelectTienda.value,
            tiendaNombre: tiendaSel.text,
            dia: mSelectDia.value,
            franja: isHorasSueltas ? "HORAS_SUELTAS" : mSelectFranja.value
        };

        turnosAsignados.push(nuevoTurno);
        actualizarDOMTurnos();
        modalTurno.style.display = "none";
    });

    window.eliminarTurnoModificar = (index) => {
        turnosAsignados.splice(index, 1);
        actualizarDOMTurnos();
    };

    function actualizarDOMTurnos() {
        listaTurnosDOM.innerHTML = "";

        // --- LA MAGIA ESTÁ AQUÍ ---
        // Usamos un Map de JS para filtrar automáticamente los turnos duplicados
        // usando como clave única la combinación "Tienda + Día + Franja"
        const turnosUnicos = [];
        const turnosVistos = new Set();

        turnosAsignados.forEach((t) => {
            const claveUnica = t.tiendaId + "-" + t.dia + "-" + t.franja;
            if (!turnosVistos.has(claveUnica)) {
                turnosVistos.add(claveUnica);
                turnosUnicos.push(t);
            }
        });

        // Actualizamos nuestra variable global con la lista ya limpia
        turnosAsignados = turnosUnicos;
        // --------------------------

        if (turnosAsignados.length > 0) {
            textoSinTurnos.style.display = "none";
            turnosAsignados.forEach((t, index) => {
                const li = document.createElement("li");
                li.style = "display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; border: 1px solid #d0d0d0; border-radius: 4px; padding: 0.5rem 0.8rem; font-size: 0.9rem; margin-bottom: 5px;";

                const franjaMostrada = t.franja === "HORAS_SUELTAS" ? "Según horas sueltas" : t.franja;
                li.innerHTML = `
                    <span><strong>${t.tiendaNombre}</strong> | ${t.dia} | ${franjaMostrada}</span>
                    <button type="button" onclick="eliminarTurnoModificar(${index})" style="background: none; border: none; color: #c53030; font-weight: bold; cursor: pointer; font-size: 1.1rem;">X</button>
                `;
                listaTurnosDOM.appendChild(li);
            });
        } else {
            textoSinTurnos.style.display = "block";
        }

        // Carga la informacion limpia para enviar al controller
        inputTurnosJson.value = JSON.stringify(turnosAsignados);
    }

    // Pintamos los turnos al cargar la pagina!!!!
    actualizarDOMTurnos();
});