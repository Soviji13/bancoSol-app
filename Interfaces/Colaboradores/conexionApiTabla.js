// VARIABLES GLOBALES Y CACHÉ
let colaboradoresCache = [];
let colaboradoresOriginales = [];
let modoEliminarActivo = false;
let idCampaniaVisualizada = 1; 
const API_BASE = "http://localhost:8080/api";

const canalComunicacion = new BroadcastChannel('bancosol_channel');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carga Inicial
    cargarTablaDinamica();

    // 2. Elementos del DOM
    const tbody = document.querySelector('#tabla-body');
    const btnEliminar = document.getElementById('btn-eliminar-colaborador');
    const aviso = document.getElementById('aviso-borrado');
    const tabla = document.querySelector('table');
    const btnSeleccionarCampania = document.querySelector('.cambiar-campania button');
    const btnCerrarSelector = document.getElementById('cerrar-selector');

    // 3. EVENTO: Doble clic (Ver detalle en panel lateral)
    tbody.addEventListener('dblclick', (event) => {
        const fila = event.target.closest('tr');
        if (fila && fila.dataset.id && !modoEliminarActivo) {
            abrirDetalleColaborador(fila.dataset.id);
        }
    });

    // 4. EVENTO: Click para Borrar
    tbody.addEventListener('click', async (event) => {
        if (!modoEliminarActivo) return;
        const fila = event.target.closest('tr');
        if (!fila) return;
        const idEntidad = fila.dataset.id;
        const nombreColaborador = fila.cells[0].innerText;

        if (confirm(`⚠️ ¿ELIMINAR PERMANENTEMENTE? \nSe borrará "${nombreColaborador}".`)) {
            try {
                const res = await fetch(`${API_BASE}/entidades/${idEntidad}`, { method: 'DELETE' });
                if (res.ok) {
                    alert("Entidad eliminada correctamente.");
                    fila.remove(); 
                    desactivarModoEliminar(aviso, tabla, btnEliminar);
                }
            } catch (error) { console.error(error); }
        }
    });

    // 5. EVENTO: Activar/Desactivar Modo Eliminar
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            modoEliminarActivo = !modoEliminarActivo;
            if (modoEliminarActivo) {
                aviso.style.display = 'block';
                tabla.classList.add('modo-borrado-activo');
                btnEliminar.style.backgroundColor = "#e02424";
                btnEliminar.style.color = "white";
            } else {
                desactivarModoEliminar(aviso, tabla, btnEliminar);
            }
        });
    }

    // 6. ESCUCHAR POR EL CANAL DE RADIO (Centralizado)
    canalComunicacion.onmessage = (event) => {
        if (event.data === 'recargar-tabla') {
            console.log("🔄 Recargando tabla...");
            cargarTablaDinamica(); 
            resetearBotonModificar();
        } 
        // CAMBIO: Nuevo receptor para los filtros
        else if (event.data.type === 'aplicar-filtros') {
            console.log("🔍 Aplicando filtros...");
            aplicarFiltrosDinamicos(event.data.filtros);
        }
    };

    // 7. EVENTOS DE INTERFAZ
    if (btnSeleccionarCampania) btnSeleccionarCampania.onclick = abrirSelectorCampanias;
    if (btnCerrarSelector) btnCerrarSelector.onclick = () => document.getElementById('modal-campanias').style.display = 'none';

    // CAMBIO: Vincular el botón de la lupa (Filtros)
    document.getElementById('filtrar').onclick = () => {
        if (window.parent) {
            const iframeMenu = window.parent.document.querySelector('.menu-lateral-iframe');
            if (iframeMenu) iframeMenu.src = '../Colaboradores/panelFiltros.html';
        }
    };
});

// --- FUNCIONES DE APOYO ---
function desactivarModoEliminar(aviso, tabla, btn) {
    modoEliminarActivo = false;
    if (aviso) aviso.style.display = 'none';
    if (tabla) tabla.classList.remove('modo-borrado-activo');
    if (btn) {
        btn.style.backgroundColor = ""; 
        btn.style.color = "";
    }
}

// --- FUNCIÓN DE APOYO PARA EL LOADER ---
function toggleLoader(mostrar) {
    let loader = document.getElementById('loading-overlay');
    
    if (mostrar && !loader) {
        // Crear el elemento si no existe
        loader = document.createElement('div');
        loader.id = 'loading-overlay';
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="spinner"></div>
            <div class="loading-text">Cargando datos... Por favor, espere</div>
        `;
        document.body.appendChild(loader);
    }
    
    if (loader) {
        loader.style.display = mostrar ? 'flex' : 'none';
    }
}

// ACTUALIZACIÓN DE LA FUNCIÓN DE CARGA
async function cargarTablaDinamica(idsParaFiltrar = null) {
    toggleLoader(true); // 1. Mostrar loader al empezar
    
    try {
        const [resEntidades, resCampanias] = await Promise.all([
            fetch(`${API_BASE}/entidades`),
            fetch(`${API_BASE}/campanias`)
        ]);
        
        const todas = await resEntidades.json();
        const campanias = await resCampanias.json();
        
        colaboradoresOriginales = todas;
        sessionStorage.setItem("colaboradoresCache", JSON.stringify(todas));

        let entidadesAMostrar = [];
        if (idsParaFiltrar) {
            entidadesAMostrar = todas.filter(e => idsParaFiltrar.includes(e.id));
        } else {
            const def = campanias.find(c => c.id === idCampaniaVisualizada);
            if (def) {
                document.querySelector('.encabezado h1').textContent = def.nombre;
                entidadesAMostrar = todas.filter(e => def.idsColaboradores.includes(e.id));
            }
        }

        renderizarFilas(entidadesAMostrar);
    } catch (error) { 
        console.error("Error:", error); 
    } finally {
        toggleLoader(false); // 2. Ocultar loader SIEMPRE al terminar (incluso si hay error)
    }
}

async function abrirSelectorCampanias() {
    try {
        const respuesta = await fetch('http://localhost:8080/api/campanias');
        const campanias = await respuesta.json();

        const grid = document.getElementById('lista-campanias');
        grid.innerHTML = ''; 
        document.getElementById('modal-campanias').style.display = 'flex';

        campanias.forEach(c => {
            const card = document.createElement('div');
            
            // LÓGICA DE CLASES CSS
            // 'seleccionada' es la que estamos viendo ahora
            // 'activa' es la que el sistema marca como vigente
            const esSeleccionada = c.id === idCampaniaVisualizada;
            card.className = `campania-card ${esSeleccionada ? 'seleccionada' : ''} ${c.activa ? 'es-activa' : 'es-inactiva'}`;
            
            const inicio = new Date(c.fechaInicio).toLocaleDateString();
            const fin = new Date(c.fechaFin).toLocaleDateString();

            // LÓGICA DE ETIQUETAS (Badges)
            const labelActiva = c.activa 
                ? '<span class="badge badge-activa">ACTIVA</span>' 
                : '<span class="badge badge-inactiva">INACTIVA</span>';
            
            const labelSeleccionada = esSeleccionada 
                ? '<span class="badge badge-viendo">VIENDO AHORA</span>' 
                : '';

            card.innerHTML = `
                <div class="card-header-flex">
                    <h3>${c.nombre}</h3>
                    <div class="badges-container">${labelActiva} ${labelSeleccionada}</div>
                </div>
                <p><strong>Inicio:</strong> ${inicio} | <strong>Fin:</strong> ${fin}</p>
                <p class="anio-info">Año fiscal: ${c.anio}</p>
            `;

            card.onclick = () => {
                idCampaniaVisualizada = c.id; // Actualizamos el rastro
                seleccionarCampania(c);
            };
            
            grid.appendChild(card);
        });
    } catch (error) {
        console.error("Error en el selector:", error);
    }
}

function seleccionarCampania(campania) {
    console.log("Campaña seleccionada:", campania.nombre);
    // Aquí actualizaremos el título de la página y recargaremos la tabla
    document.querySelector('.encabezado h1').textContent = campania.nombre;
    
    // Cerramos el modal
    document.getElementById('modal-campanias').style.display = 'none';

    // REBOTE DE DATOS: Volvemos a cargar la tabla pero filtrando por los IDs de esta campaña
    actualizarTablaPorCampania(campania.idsColaboradores);
}

// Nueva función para filtrar la tabla
function actualizarTablaPorCampania(idsColaboradores) {
    // Usamos nuestra caché para no volver a llamar a la API
    // Si 'colaboradoresCache' está vacía o necesitas datos frescos, podrías hacer un fetch
    cargarTablaDinamica(idsColaboradores); 
}

// Variable para saber qué IDs estamos mostrando actualmente
let idsActuales = [];

// FUNCIÓN PARA ABRIR EL PANEL LATERAL
function abrirDetalleColaborador(id) {
    const colaborador = colaboradoresCache.find(c => c.id == id);
    if (colaborador) {
        // 1. Guardamos los datos
        sessionStorage.setItem("colaboradorSeleccionado", JSON.stringify(colaborador));

        const btnModificar = document.getElementById('btn-modificar-colaborador');
        if (btnModificar) {
            btnModificar.classList.replace('desactivado', 'activado');
            
            btnModificar.onclick = () => {
                // Buscador a prueba de balas: busca en esta ventana o en la padre
                let iframe = document.querySelector(".menu-lateral-iframe");
                if (!iframe && window.parent) {
                    iframe = window.parent.document.querySelector(".menu-lateral-iframe");
                }

                if (iframe && iframe.contentWindow) {
                    console.log("Enviando señal toggle..."); // Chivato para F12
                    iframe.contentWindow.postMessage('toggle-edicion-lateral', '*');
                    
                    iframe.style.boxShadow = "0 0 15px rgba(37, 99, 235, 0.5)";
                    setTimeout(() => iframe.style.boxShadow = "none", 1000);
                } else {
                    console.error("No se encontró el iframe del panel lateral");
                }
            };
        }

        // 3. ¡ESTO ES LO QUE FALTABA! Abrir visualmente el HTML en el iframe
        if (window.parent && window.parent.document) {
            const iframeMenu = window.parent.document.querySelector(".menu-lateral-iframe");
            if (iframeMenu) {
                iframeMenu.src = "../Colaboradores/colaboradorSeleccionado.html";
            }
        }
    }
}

// CAMBIO: Función para procesar los filtros recibidos del panel lateral
function aplicarFiltrosDinamicos(f) {
    let filtrados = colaboradoresOriginales;

    // Filtro Tienda (Contiene texto)
    if (f.tienda) {
        filtrados = filtrados.filter(c => 
            c.nombresTiendas && c.nombresTiendas.some(t => t.toUpperCase().includes(f.tienda))
        );
    }

    // Filtro Localidad (Exacto)
    if (f.localidad) {
        filtrados = filtrados.filter(c => c.localidadNombre === f.localidad);
    }

    // Filtro Campaña (Busca el ID en la lista del colaborador)
    if (f.campaniaId) {
        const idBusqueda = parseInt(f.campaniaId);
        filtrados = filtrados.filter(c => c.idsCampanias && c.idsCampanias.includes(idBusqueda));
    }

    // Checkboxes
    if (f.soloCapital) filtrados = filtrados.filter(c => c.esCapital === true);
    if (f.soloActiva) filtrados = filtrados.filter(c => c.estadoActivo === true);

    renderizarFilas(filtrados);
}

// CAMBIO: Nueva función para pintar filas (se usa al cargar y al filtrar)
function renderizarFilas(datos) {
    colaboradoresCache = datos; // Actualizamos la caché actual (para el doble clic)
    const tbody = document.querySelector('#tabla-body');
    tbody.innerHTML = '';

    datos.forEach(colab => {
        const fila = document.createElement('tr');
        fila.dataset.id = colab.id;

        const principal = colab.responsables?.find(r => r.esPrincipal);
        const contactoHtml = principal 
            ? `${principal.nombre} <br><small>${principal.email}</small>` 
            : "Sin contacto";

        const listaT = colab.nombresTiendas || [];
        const tiendasHtml = `
            <div class="tiendas-resumen">${listaT[0] || '---'} ${listaT.length > 1 ? `<b>(+${listaT.length - 1})</b>` : ''}</div>
            <div class="tiendas-lista-completa" style="display: none;">
                ${listaT.map(t => `<div>- ${t}</div>`).join('')}
            </div>
        `;

        fila.innerHTML = `
            <td>${colab.nombre}</td>
            <td>${colab.domicilioCompleto}</td>
            <td>${colab.localidadNombre}</td>
            <td>${contactoHtml}</td>
            <td>${tiendasHtml}</td>
            <td class="desplegar" onclick="desplegarTiendas(this)">&nbsp;</td>
        `;
        tbody.appendChild(fila);
    });
}

// LÓGICA DE INTERFAZ: Desplegar tiendas
function desplegarTiendas(celdaBoton) {
    const celdaTiendas = celdaBoton.previousElementSibling;
    const resumen = celdaTiendas.querySelector('.tiendas-resumen');
    const listaCompleta = celdaTiendas.querySelector('.tiendas-lista-completa');

    if (listaCompleta.style.display === 'none') {
        listaCompleta.style.display = 'block';
        resumen.style.display = 'none';
    } else {
        listaCompleta.style.display = 'none';
        resumen.style.display = 'block';
    }
}

function resetearBotonModificar() {
    const btnModificar = document.getElementById('btn-modificar-colaborador');
    if (btnModificar) {
        // 1. Cambiamos el aspecto visual
        btnModificar.classList.replace('activado', 'desactivado');
        
        // 2. Restauramos el mensaje de ayuda
        btnModificar.title = "Debes primero seleccionar un colaborador";
        
        // 3. Eliminamos la función de clic para que no abra el panel por error
        btnModificar.onclick = null;
        
        console.log("🔘 Botón modificar reseteado al estado inicial.");
    }
}


