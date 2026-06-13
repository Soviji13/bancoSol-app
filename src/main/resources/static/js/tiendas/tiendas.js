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

    // 4. Botón Modificar Tienda (Redirección optimizada y a prueba de fallos)
    if (btnModificar) {
        console.log("[Bancosol Info] Botón modificar detectado e inicializado en el DOM.");
        btnModificar.addEventListener('click', () => {
            console.log("[Bancosol Info] Click detectado en el botón Modificar.");

            // Intento 1: Buscar la fila azul en la tabla actual
            let idTienda = null;
            const filaSeleccionada = document.querySelector('tr.fila-tienda.seleccionada');

            if (filaSeleccionada) {
                idTienda = filaSeleccionada.dataset.id;
                console.log("[Bancosol Info] Tienda encontrada por fila azul. ID:", idTienda);
            } else {
                // Intento 2: Si no hay fila azul (por iframes), leemos el ID del panel de detalles lateral
                const panelLateral = document.querySelector('iframe.menu-lateral-iframe');
                if (panelLateral && panelLateral.contentDocument) {
                    const inputOculto = panelLateral.contentDocument.querySelector('input[name="tiendaId"]');
                    if (inputOculto) {
                        idTienda = inputOculto.value;
                        console.log("[Bancosol Info] Tienda encontrada por panel lateral. ID:", idTienda);
                    }
                }

                // Intento 3: Si estás guardando el id en session storage como tenías antes
                if (!idTienda) {
                    const tiendaJSON = sessionStorage.getItem("tiendaSeleccionada");
                    if (tiendaJSON) {
                        const tInfo = JSON.parse(tiendaJSON);
                        idTienda = tInfo.id;
                        console.log("[Bancosol Info] Tienda encontrada por sessionStorage. ID:", idTienda);
                    }
                }
            }

            // Si hemos logrado pillar el ID por algún lado, navegamos
            if (idTienda) {
                const urlDestino = `/tiendas/modificar?campaniaId=${campaniaId}&tiendaId=${idTienda}`;
                console.log("[Bancosol Info] Redirigiendo ventana a:", urlDestino);

                // Forzamos la recarga de toda la pantalla (window.parent) para que todo se cuadre
                if (window.parent) {
                    window.parent.location.href = urlDestino;
                } else {
                    window.location.href = urlDestino;
                }
            } else {
                console.warn("[Bancosol Warning] No se pudo encontrar el ID de la tienda a modificar por ningún método.");
                alert("Por favor, haga doble clic sobre una tienda para ver sus detalles antes de modificarla.");
            }
        });
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

    // 8. LÓGICA DE ELIMINACIÓN DE TIENDA (Estilo Formulario/Redirect Spring MVC)
    const btnEliminar = document.querySelector("#btn-eliminar");

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            const filaSeleccionada = tbody.querySelector('tr.fila-tienda.seleccionada');

            if (!filaSeleccionada) {
                return alert("Por favor, seleccione una tienda de la lista haciendo clic sobre ella antes de eliminar.");
            }

            const idTienda = filaSeleccionada.dataset.id;
            const nombreTienda = filaSeleccionada.querySelector("td strong").textContent;

            if (confirm(`¿Está seguro de que desea eliminar permanentemente la tienda "${nombreTienda}"?`)) {

                // Creamos un formulario dinámico al vuelo (el equivalente a un <form> en HTML)
                const form = document.createElement("form");
                form.method = "POST";
                form.action = "/tiendas/eliminar";

                // Le metemos el ID de la tienda
                const inputTienda = document.createElement("input");
                inputTienda.type = "hidden";
                inputTienda.name = "tiendaId";
                inputTienda.value = idTienda;

                // Le metemos el ID de la campaña actual (para el redirect)
                const inputCampania = document.createElement("input");
                inputCampania.type = "hidden";
                inputCampania.name = "campaniaId";
                inputCampania.value = campaniaId;

                form.appendChild(inputTienda);
                form.appendChild(inputCampania);
                document.body.appendChild(form);

                // Enviamos el formulario. El servidor borrará y hará el redirect automáticamente.
                form.submit();
            }
        });
    }

    // 9. LÓGICA PARA ABRIR EL PANEL DE FILTROS (Botón del Embudo)
    const btnFiltroEmbudo = document.querySelector('.filtro button');
    if (btnFiltroEmbudo) {
        btnFiltroEmbudo.addEventListener('click', () => {
            // Mantiene la campaña actual pero le dice al controlador que inyecte el panel de filtros
            window.location.href = `/tiendas?campaniaId=${campaniaId}&verFiltros=true`;
        });
    }

    // =========================================================================
    // 10. LÓGICA DEL PANEL DE FILTROS AVANZADOS (Solo el Distrito)
    // =========================================================================
    const selectLocalidadFiltro = document.getElementById('filtro-localidad');
    const bloqueDistritoFiltro = document.getElementById('bloque-distrito');
    const selectDistritoFiltro = document.getElementById('filtro-distrito');

    if (selectLocalidadFiltro) {
        const alternarDistritoFiltro = () => {
            const opcionSeleccionada = selectLocalidadFiltro.options[selectLocalidadFiltro.selectedIndex];

            // Comprobación a prueba de fallos (?. evita el error si es undefined)
            const nombreLocalidad = (opcionSeleccionada?.dataset?.nombre || "").toUpperCase();

            if (nombreLocalidad.includes("MÁLAGA") || nombreLocalidad.includes("MALAGA")) {
                bloqueDistritoFiltro.classList.remove("oculto");
                if (selectDistritoFiltro) {
                    selectDistritoFiltro.disabled = false;
                    selectDistritoFiltro.style.backgroundColor = "white";
                }
            } else {
                bloqueDistritoFiltro.classList.add("oculto");
                if (selectDistritoFiltro) {
                    selectDistritoFiltro.disabled = true;
                    selectDistritoFiltro.value = ""; // Vaciamos para no mandar basura al backend
                    selectDistritoFiltro.style.backgroundColor = "#eee";
                }
            }
        };

        selectLocalidadFiltro.addEventListener('change', alternarDistritoFiltro);
        alternarDistritoFiltro(); // Ejecutar al cargar la página
    }

    // =========================================================================
    // 11. EXPORTACIÓN A CSV (Optimizada sin fetch)
    // =========================================================================
    const btnCsv = document.querySelector('#btn-exportar');

    if (btnCsv) {
        btnCsv.style.cursor = 'pointer';
        btnCsv.title = 'Descargar lista actual de tiendas en CSV';

        btnCsv.addEventListener('click', () => {
            // Comprobamos la variable global que inyectó Spring en listaTiendas.jsp
            if (typeof window.tiendasParaExportar !== 'undefined' && window.tiendasParaExportar.length > 0) {
                exportarTiendasACSV(window.tiendasParaExportar);
            } else {
                alert("No hay tiendas cargadas en la tabla para exportar en este momento.");
            }
        });
    }

    function exportarTiendasACSV(tiendas) {
        const cabeceras = [
            "TIENDA", "DOMICILIO", "LOCALIDAD", "DISTRITO", "CODIGOPOSTAL",
            "ZONA GEOGRAFICA", "ENTIDAD COLABORADORA", "RESPONSABLE DE TIENDA",
            "CADENA", "ES FRANQUICIA", "ID TIENDA", "PUNTUACION"
        ];

        // Función para escapar comillas y evitar romper celdas en Excel
        const limpiar = (texto) => (texto ? `"${texto.toString().replace(/"/g, '""')}"` : '""');

        const filasCsv = tiendas.map(t => {
            const domicilioCompleto = (t.calle || t.numero) ? `${t.calle || ''}, Nº ${t.numero || ''}` : '---';

            // Extraer entidades colaboradoras y responsables de la lista combinada (Acordeón)
            let entidadesStr = "Sin entidad";
            let responsableStr = "Sin responsable asignado";

            if (t.responsablesLista && t.responsablesLista.length > 0) {
                const entidadesArray = t.responsablesLista.map(r => r.nombreEntidad).filter(Boolean);
                entidadesStr = [...new Set(entidadesArray)].join(" | ");

                const respArray = t.responsablesLista.map(r => r.nombreResponsable).filter(Boolean);
                responsableStr = [...new Set(respArray)].join(" | ");
            } else {
                // Caída de seguridad por si no hay lista (usamos el DTO base)
                entidadesStr = t.nombreEntidad || "Sin entidad";
                responsableStr = t.nombreResponsable || "Sin responsable asignado";
            }

            return [
                limpiar(t.nombre),
                limpiar(domicilioCompleto),
                limpiar(t.localidad || 'Málaga'),
                limpiar(t.distrito || '---'),
                limpiar(t.codigoPostal || '---'),
                limpiar(t.zonaGeografica || '---'),
                limpiar(entidadesStr),
                limpiar(responsableStr),
                limpiar(t.nombreCadena || 'INDIVIDUAL'),
                t.esFranquicia ? '"SÍ"' : '"NO"',
                t.id,
                t.puntosRecogida || 0
            ].join(";");
        });

        const BOM = "\uFEFF"; // Para que Excel lea tildes y ñ correctamente
        const contenidoFinal = BOM + cabeceras.join(";") + "\n" + filasCsv.join("\n");

        const blobFinal = new Blob([contenidoFinal], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blobFinal);

        const link = document.createElement("a");
        const fecha = new Date().toISOString().slice(0, 10);

        link.setAttribute("href", url);
        link.setAttribute("download", `bancosol_tiendas_${fecha}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

});