document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DEL RADIO "SÍ / NO" Y BLOQUEO ROBUSTO ---
    const radioSi = document.getElementById("participado-si");
    const radioNo = document.getElementById("participado-no");
    const bloqueOrigen = document.getElementById("bloque-campania-origen");
    const bloqueTiendaExist = document.getElementById("bloque-tienda-existente");
    const selectTiendaExist = document.getElementById("select-tienda-existente");
    const selectCampaniaDestino = document.getElementById("select-campania-destino");

    const excluidos = ["participado-si", "participado-no", "btn-seleccionar-origen", "select-tienda-existente", "select-campania-destino"];

    function toggleCamposAnteriores(haParticipado) {
        const todosLosCampos = document.querySelectorAll(".form-tienda input, .form-tienda select, .form-tienda button");

        if (haParticipado) {
            bloqueOrigen.classList.remove("oculto");
            bloqueTiendaExist.classList.remove("oculto");
            selectTiendaExist.required = true;

            todosLosCampos.forEach(el => {
                if (!excluidos.includes(el.id) && el.type !== "submit" && el.id !== "btn-eliminar") {
                    el.disabled = true;
                }
            });
        } else {
            bloqueOrigen.classList.add("oculto");
            bloqueTiendaExist.classList.add("oculto");
            selectTiendaExist.required = false;

            todosLosCampos.forEach(el => { el.disabled = false; });
        }
    }

    if (radioSi && radioNo) {
        radioSi.addEventListener("change", () => toggleCamposAnteriores(radioSi.checked));
        radioNo.addEventListener("change", () => toggleCamposAnteriores(!radioNo.checked));
        toggleCamposAnteriores(radioSi.checked);
    }

    // =========================================================
    // MODAL DE CAMPAÑA ORIGEN (Copia exacta de tu diseño)
    // =========================================================
    const btnSeleccionarOrigen = document.getElementById("btn-seleccionar-origen");
    const modalCampanias = document.getElementById("modal-campanias");
    const btnCerrarCampanias = document.getElementById("btn-cerrar-campanias");
    const listaCampanias = document.getElementById("lista-campanias");
    const textoCampaniaOrigen = document.getElementById("texto-campania-origen");
    // (Asegúrate de tener referenciados selectTiendaExist y selectCampaniaDestino arriba)

    if (btnSeleccionarOrigen && modalCampanias) {
        btnSeleccionarOrigen.addEventListener("click", async () => {
            modalCampanias.classList.remove("oculto");
            listaCampanias.innerHTML = "<p style='padding:1.2rem;'>Cargando campañas disponibles...</p>";

            try {
                // Usamos el endpoint para pedir las campañas
                const res = await fetch('/tiendas/mostrar-campanias-json');
                if (!res.ok) throw new Error("Error obteniendo campañas");
                const campanias = await res.json();

                listaCampanias.innerHTML = "";

                campanias.forEach(camp => {
                    const div = document.createElement("div");
                    // Usamos las clases originales de tu CSS
                    div.className = "tarjeta-campania";

                    // Pinta la etiqueta si está activa
                    const badgeActiva = camp.activa
                        ? `<span class="badge" style="background-color: #28a745; color: white; padding: 2px 6px; font-size: 0.75rem; border-radius: 4px; margin-left: 8px;">ACTIVA</span>`
                        : '';

                    // Controlamos los nulos por si alguna campaña no tiene fecha en la BD
                    const fInicio = camp.fechaInicio ? camp.fechaInicio : 'Sin fecha';
                    const fFin = camp.fechaFin ? camp.fechaFin : 'Sin fecha';

                    div.innerHTML = `
                        <div class="tarjeta-titulo" style="display:flex; align-items:center; margin-bottom: 4px;">
                            ${camp.nombre} ${badgeActiva}
                        </div>
                        <div class="tarjeta-detalles" style="font-size:0.85rem; color:#4a5568;">
                            <span>Año: <strong>${camp.anio}</strong> | Inicio: <strong>${fInicio}</strong> | Fin: <strong>${fFin}</strong></span>
                        </div>
                    `;

                    // Al hacer click, LÓGICA DEL FORMULARIO (En vez de redirigir)
                    div.addEventListener("click", async () => {
                        textoCampaniaOrigen.textContent = camp.nombre;
                        modalCampanias.classList.add("oculto");

                        // 1. CARGAR TIENDAS DE ESA CAMPAÑA (Llamada al endpoint MVC que creamos)
                        const selectTiendaExist = document.getElementById("select-tienda-existente");
                        selectTiendaExist.innerHTML = "<option value='' disabled selected>Cargando tiendas...</option>";
                        try {
                            const resTiendas = await fetch(`/tiendas/api/por-campania?campaniaId=${camp.id}`);
                            if(resTiendas.ok) {
                                const tiendas = await resTiendas.json();
                                selectTiendaExist.innerHTML = "<option value='' disabled selected>Elija la tienda que desea añadir...</option>";
                                tiendas.forEach(t => {
                                    const opt = document.createElement("option");
                                    opt.value = t.id;
                                    opt.text = t.nombre;
                                    selectTiendaExist.add(opt);
                                });
                            }
                        } catch (e) {
                            selectTiendaExist.innerHTML = "<option value='' disabled selected>Error al cargar tiendas</option>";
                        }

                        // 2. EXCLUIR CAMPAÑA ORIGEN DEL SELECT DESTINO
                        const selectCampaniaDestino = document.getElementById("select-campania-destino");
                        Array.from(selectCampaniaDestino.options).forEach(opt => {
                            opt.style.display = (opt.value == camp.id) ? "none" : "block";
                        });
                        if (selectCampaniaDestino.value == camp.id) selectCampaniaDestino.value = "";
                    });

                    listaCampanias.appendChild(div);
                });
            } catch (e) {
                listaCampanias.innerHTML = "<p style='color:red;'>Error cargando campañas</p>";
            }
        });
    }

    if (btnCerrarCampanias) {
        btnCerrarCampanias.addEventListener("click", () => {
            modalCampanias.classList.add("oculto");
        });
    }

    // --- 1.3 MODAL DE NUEVO RESPONSABLE Y CORRECCIÓN 404 ---
    const btnAbrirResp = document.getElementById("btn-abrir-modal-resp");
    const modalResponsable = document.getElementById("modal-responsable");
    const btnCerrarResp = document.getElementById("btn-cerrar-responsable");
    const btnGuardarResp = document.getElementById("btn-guardar-responsable");

    if (btnAbrirResp) btnAbrirResp.addEventListener("click", () => modalResponsable.classList.remove("oculto"));
    if (btnCerrarResp) btnCerrarResp.addEventListener("click", () => modalResponsable.classList.add("oculto"));

    if (btnGuardarResp) {
        btnGuardarResp.addEventListener("click", async () => {
            const nombre = document.getElementById("modal-nombre-resp").value;
            const email = document.getElementById("modal-email").value;
            const telefono = document.getElementById("modal-telefono").value;

            if(!nombre) { alert("El nombre es obligatorio"); return; }

            btnGuardarResp.disabled = true;
            btnGuardarResp.textContent = "Guardando...";

            try {
                const password = document.getElementById("modal-password").value;

                const formData = new URLSearchParams();
                formData.append("nombre", nombre);
                formData.append("email", email);
                formData.append("telefono", telefono);
                formData.append("password", password);

                // ¡Ruta corregida al nuevo RespTiendaController!
                const res = await fetch('/api/responsables/guardar-ajax', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData
                });

                if (res.ok) {
                    const respGuardado = await res.json();
                    const selectResp = document.getElementById("select-responsable");
                    const option = document.createElement("option");
                    option.text = respGuardado.nombre;
                    option.value = respGuardado.id;
                    option.selected = true;
                    selectResp.add(option);

                    modalResponsable.classList.add("oculto");
                } else {
                    alert("Error guardando el responsable.");
                }
            } catch(e) {
                alert("Error de red.");
            } finally {
                btnGuardarResp.disabled = false;
                btnGuardarResp.textContent = "Guardar Responsable";
            }
        });
    }
});