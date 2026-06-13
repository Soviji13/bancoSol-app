document.addEventListener("DOMContentLoaded", () => {
    // 1. Bloqueo de Distrito según Localidad (Málaga)
    const selectLocalidad = document.getElementById("select-localidad");
    const selectDistrito = document.getElementById("select-distrito");

    const comprobarLocalidad = () => {
        const opcionSeleccionada = selectLocalidad.options[selectLocalidad.selectedIndex];
        const nombreLocalidad = (opcionSeleccionada ? opcionSeleccionada.dataset.nombre : "").toUpperCase();

        if (nombreLocalidad.includes("MÁLAGA") || nombreLocalidad.includes("MALAGA")) {
            selectDistrito.disabled = false;
            selectDistrito.style.backgroundColor = "white";
        } else {
            selectDistrito.disabled = true;
            selectDistrito.value = "";
            selectDistrito.style.backgroundColor = "#eee";
        }
    };

    if(selectLocalidad) {
        selectLocalidad.addEventListener("change", comprobarLocalidad);
        comprobarLocalidad();
    }

    // 2. Cerrar y volver al listado
    const btnCerrar = document.getElementById('btn-cerrar-panel');
    if(btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const campaniaId = urlParams.get('campaniaId');
            const tiendaId = document.querySelector('input[name="tiendaId"]').value;
            window.location.href = `/tiendas?campaniaId=${campaniaId}&tiendaId=${tiendaId}`;
        });
    }

    // 3. LÓGICA DEL MODAL RESPONSABLE (Misma que en añadir-tienda.js)
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