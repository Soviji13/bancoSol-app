document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector('#tabla-voluntarios-body');
    const btnAnadir = document.querySelector('#btn-anadir-voluntario');
    const btnModificar = document.querySelector('#btn-modificar-voluntario');
    const btnEliminar = document.querySelector('#btn-eliminar-voluntario');

    const btnSeleccionarCampania = document.querySelector('#btn-seleccionar-campania');
    const modalCampanias = document.querySelector('#modal-campanias');
    const btnCerrarCampanias = document.querySelector('#btn-cerrar-campanias');
    const listaCampaniasDiv = document.querySelector('#lista-campanias');

    const divContexto = document.getElementById("datos-contexto");
    const campaniaId = divContexto ? divContexto.dataset.campaniaId : "";

    if (tbody) {
        tbody.addEventListener('click', (event) => {
            const fila = event.target.closest('tr.fila-voluntario');
            if (!fila) return;

            tbody.querySelectorAll('tr.fila-voluntario').forEach(tr => tr.classList.remove('seleccionada'));
            fila.classList.add('seleccionada');

            // Habilitamos modificar al seleccionar
            if (btnModificar) btnModificar.disabled = false;
        });

        tbody.addEventListener('dblclick', (event) => {
            const fila = event.target.closest('tr.fila-voluntario');
            if (fila) {
                const idVoluntario = fila.dataset.id;
                window.location.href = `/voluntarios?campaniaId=${campaniaId}&voluntarioId=${idVoluntario}`;
            }
        });
    }

    if (btnAnadir) {
        btnAnadir.addEventListener('click', () => {
            window.location.href = `/voluntarios/aniadir?campaniaId=${campaniaId}`;
        });
    }

    // === LÓGICA DEL BOTÓN MODIFICAR AÑADIDA ====
    if (btnModificar) {
        btnModificar.addEventListener('click', () => {
            let idVoluntario = null;

            // 1. Mirar si hay alguna fila seleccionada en azul
            const filaSeleccionada = tbody.querySelector('tr.fila-voluntario.seleccionada');

            if (filaSeleccionada) {
                idVoluntario = filaSeleccionada.dataset.id;
            } else {
                // 2. Si no hay fila en azul, mirar si tenemos el panel de detalles abierto leyendo la URL
                const urlParams = new URLSearchParams(window.location.search);
                idVoluntario = urlParams.get('voluntarioId');
            }

            // 3. Redirigir al endpoint de modificar
            if (idVoluntario) {
                window.location.href = `/voluntarios/modificar?campaniaId=${campaniaId}&voluntarioId=${idVoluntario}`;
            } else {
                alert("Por favor, seleccione un voluntario haciendo clic en su fila antes de modificar.");
            }
        });
    }

    // Modal campañas exacto al de tiendas
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
                                window.location.href = `/voluntarios?campaniaId=${c.id}`;
                            });

                            listaCampaniasDiv.appendChild(btnCampania);
                        });
                    } else {
                        listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#d9534f;'>Error al cargar las campañas.</p>";
                    }
                } catch (error) {
                    listaCampaniasDiv.innerHTML = "<p style='padding:1rem; color:#d9534f;'>Error de conexión.</p>";
                }
            }
        });
    }

    if (btnCerrarCampanias && modalCampanias) {
        btnCerrarCampanias.addEventListener('click', () => {
            modalCampanias.classList.add('oculto');
            modalCampanias.style.display = 'none';
        });
    }

    // Acordeon en celda entera
    document.querySelectorAll('.celda-desplegar').forEach(celda => {
        celda.addEventListener('click', (event) => {
            event.stopPropagation();
            const tr = event.target.closest('tr');
            const listaCompleta = tr.querySelector('.resp-lista-completa');
            const resumen = tr.querySelector('.resp-resumen');
            const imgFlech = celda.querySelector('.icono-flecha');

            if (listaCompleta && resumen && imgFlech) {
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

    const btnFiltroEmbudo = document.querySelector('#btn-filtro-voluntarios');
    if (btnFiltroEmbudo) {
        btnFiltroEmbudo.addEventListener('click', () => {
            window.location.href = `/voluntarios?campaniaId=${campaniaId}&verFiltros=true`;
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            const filaSeleccionada = tbody.querySelector('tr.fila-voluntario.seleccionada');
            if (!filaSeleccionada) {
                return alert("Por favor, seleccione un voluntario de la lista haciendo clic sobre él antes de eliminar.");
            }
            const idVoluntario = filaSeleccionada.dataset.id;

            if (confirm(`¿Está seguro de que desea eliminar permanentemente al voluntario con ID ${idVoluntario}?`)) {
                const form = document.createElement("form");
                form.method = "POST";
                form.action = "/voluntarios/eliminar";

                const inputVol = document.createElement("input");
                inputVol.type = "hidden";
                inputVol.name = "voluntarioId";
                inputVol.value = idVoluntario;

                const inputCamp = document.createElement("input");
                inputCamp.type = "hidden";
                inputCamp.name = "campaniaId";
                inputCamp.value = campaniaId;

                form.appendChild(inputVol);
                form.appendChild(inputCamp);
                document.body.appendChild(form);
                form.submit();
            }
        });
    }
});