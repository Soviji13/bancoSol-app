document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector('#tabla-tiendas-body');
    const btnAnadir = document.querySelector('#btn-anadir');
    const btnModificar = document.querySelector('#btn-modificar');
    const btnSeleccionarCampania = document.querySelector('#btn-seleccionar-campania');
    const modalCampanias = document.querySelector('#modal-campanias');
    const btnCerrarCampanias = document.querySelector('#btn-cerrar-campanias');
    const listaCampaniasDiv = document.querySelector('#lista-campanias');

    // Pillamos la campaña actual del contexto
    const divContexto = document.getElementById("datos-contexto");
    const campaniaId = divContexto ? divContexto.dataset.campaniaId : "";
    console.log("[Bancosol Info] Campaña actual detectada en JS:", campaniaId);

    if (tbody) {
        // 1. Un clic para seleccionar fila (Poner azul)
        tbody.addEventListener('click', (event) => {
            const fila = event.target.closest('tr.fila-tienda');
            if (!fila) return;

            tbody.querySelectorAll('tr.fila-tienda').forEach(tr => tr.classList.remove('seleccionada'));
            fila.classList.add('seleccionada');
            console.log("[Bancosol Info] Fila seleccionada con éxito, ID tienda:", fila.dataset.id);

            if (btnModificar) {
                btnModificar.disabled = false;
            }
        });

        // 2. Doble clic para abrir los detalles laterales (Modo lectura)
        tbody.addEventListener('dblclick', (event) => {
            const fila = event.target.closest('tr.fila-tienda');
            if (fila) {
                const idTienda = fila.dataset.id;
                window.location.href = `/tiendas?campaniaId=${campaniaId}&tiendaId=${idTienda}`;
            }
        });
    }

    // 3. Botón Añadir Tienda funcional
    if (btnAnadir) {
        btnAnadir.addEventListener('click', () => {
            window.location.href = `/tiendas/aniadir?campaniaId=${campaniaId}`;
        });
    }

    // 4. Botón Modificar Tienda (Redirección optimizada con logs)
    if (btnModificar) {
        console.log("[Bancosol Info] Botón modificar detectado e inicializado en el DOM.");
        btnModificar.addEventListener('click', () => {
            console.log("[Bancosol Info] Click detectado en el botón Modificar.");

            // Ampliamos la búsqueda a todo el documento por seguridad del DOM
            const filaSeleccionada = document.querySelector('tr.fila-tienda.seleccionada');
            console.log("[Bancosol Info] Resultado de buscar la fila marcada:", filaSeleccionada);

            if (filaSeleccionada) {
                const idTienda = filaSeleccionada.dataset.id;
                const urlDestino = `/tiendas/modificar?campaniaId=${campaniaId}&tiendaId=${idTienda}`;

                console.log("[Bancosol Info] Redirigiendo ventana a:", urlDestino);
                window.location.href = urlDestino;
            } else {
                console.warn("[Bancosol Warning] Se pulsó modificar pero filaSeleccionada es NULL. ¿Hay alguna fila azul?");
                alert("Por favor, seleccione una tienda de la lista haciendo clic sobre ella antes de modificar.");
            }
        });
    } else {
        console.error("[Bancosol Error] No se ha encontrado ningún botón con el ID '#btn-modificar' en el HTML.");
    }

    // 5. Botón Seleccionar otra campaña (Modal dinámico)
    if (btnSeleccionarCampania) {
        btnSeleccionarCampania.addEventListener('click', async () => {
            if (modalCampanias) {
                modalCampanias.classList.remove('oculto');
                modalCampanias.style.display = 'flex';
            }

            if (listaCampaniasDiv) {
                listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#666;'>Cargando campañas...</p>";
                try {
                    const response = await fetch('/tiendas/mostrar-campanias-json');
                    if (response.ok) {
                        const campanias = await response.json();
                        listaCampaniasDiv.innerHTML = "";

                        if (campanias.length === 0) {
                            listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#666;'>No hay campañas registradas.</p>";
                            return;
                        }

                        campanias.forEach(c => {
                            const btnCampania = document.createElement('button');
                            btnCampania.type = 'button';
                            btnCampania.className = 'modal-btn-campania';
                            btnCampania.style.display = 'block';
                            btnCampania.style.width = '100%';
                            btnCampania.style.padding = '10px';
                            btnCampania.style.margin = '5px 0';
                            btnCampania.style.cursor = 'pointer';
                            btnCampania.textContent = c.nombre;

                            btnCampania.addEventListener('click', () => {
                                window.location.href = `/tiendas?campaniaId=${c.id}`;
                            });

                            listaCampaniasDiv.appendChild(btnCampania);
                        });
                    } else {
                        listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#d9534f;'>Error al cargar las campañas.</p>";
                    }
                } catch (error) {
                    console.error("Error:", error);
                    listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#d9534f;'>Error de conexión.</p>";
                }
            }
        });
    }

    // 6. ACTIVAR ACORDEÓN DE RESPONSABLES (Flecha doble en la tabla)
    document.querySelectorAll('.btn-desplegar-resp').forEach(imgFlech => {
        imgFlech.addEventListener('click', (event) => {
            event.stopPropagation();
            const tr = event.target.closest('tr');
            const listaCompleta = tr.querySelector('.resp-lista-completa');
            const resumen = tr.querySelector('.resp-resumen');

            if (listaCompleta && resumen) {
                if (listaCompleta.style.display === "none") {
                    listaCompleta.style.display = "block";
                    resumen.style.display = "none";
                    imgFlech.style.transform = "rotate(180deg)";
                } else {
                    listaCompleta.style.display = "none";
                    resumen.style.display = "block";
                    imgFlech.style.transform = "rotate(0deg)";
                }
            }
        });
    });

    // 7. Cerrar el modal de campañas
    if (btnCerrarCampanias && modalCampanias) {
        btnCerrarCampanias.addEventListener('click', () => {
            modalCampanias.classList.add('oculto');
            modalCampanias.style.display = 'none';
        });
    }
});