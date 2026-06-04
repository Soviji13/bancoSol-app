// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez
// Ayuda de la IA para saber cómo conectar un dato de JSP con JS

// Este script muestra la tabla de Campañas para seleccionar de forma dinámica
// Además, solo invoca y llama a las campañas cuando de verdad es necesario

// Intentamos a acceder al apartado de entidades
const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {

    // Localizamos los botones de control para abrir y cerrar el modal selector del HTML
    const btnSeleccionarCampania = document.querySelector('.cambiar-campania button');
    const btnCerrarSelector = document.getElementById('cerrar-selector');

    // Si los elementos existen en la página, les asociamos sus respectivos disparadores para controlar el modal
    if (btnSeleccionarCampania) btnSeleccionarCampania.onclick = abrirSelectorCampanias;
    if (btnCerrarSelector) btnCerrarSelector.onclick = () => document.getElementById('modal-campanias').style.display = 'none';

    // Abrir selector si se pulsa (tenemos que hacer una solicitud)
    async function abrirSelectorCampanias () {
        try {

            // Solicitamos las campañas actuales en JSON
            const dataCampanias = await fetch('/entidades/mostrar-campanias-json') ;
            const campanias = await dataCampanias.json();

            // Solicitamos el ID de la campaña actual
            const idCampaniaVisualizada = seccionEntidades.dataset.idCampaniaActual;

            // Obtenemos la lista de campañas y la reseteamos por si ya había algo
            const grid = document.getElementById('lista-campanias');
            grid.innerHTML = ''; 

            document.getElementById('modal-campanias').style.display = 'flex';

            // Recorremos cada campaña
            campanias.forEach(c => {
                
                // Creamos un nodo div de forma dinámica y le inyectamos las clases CSS pertinentes en función de sus estados de actividad
                const card = document.createElement('div');
                card.className = `campania-card ${String(c.id) === idCampaniaVisualizada ? 'seleccionada' : ''} ${c.activa ? 'es-activa' : 'es-inactiva'}`;
                
                // Saneamos y formateamos los objetos de fecha de la API pasándolos a cadenas legibles con formato local (DD/MM/AAAA)
                const inicio = new Date(c.fechaInicio).toLocaleDateString();
                const fin = new Date(c.fechaFin).toLocaleDateString();
                
                // Fabricamos los fragmentos HTML de los badges aplicando estilos inline estrictos para impedir que el texto se parta en bloques feos
                const labelActiva = c.activa 
                    ? '<span class="badge badge-activa" style="white-space: nowrap; display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">ACTIVA</span>' 
                    : '<span class="badge badge-inactiva" style="white-space: nowrap; display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">INACTIVA</span>';
                
                // Si es la campaña que coincide con la selección activa, le preparamos la etiqueta de acompañamiento visual
                const labelSeleccionada = String(c.id) === idCampaniaVisualizada
                    ? '<span class="badge badge-viendo" style="white-space: nowrap; display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-left: 5px;">VIENDO AHORA</span>' 
                    : '';

                // Maquetamos la cabecera interna con un flex dinámico que respeta el espacio de los badges
                // Refactorización JSP - Le añado un <a> que nos lleve a /entidades para mostrar la nueva campaña seleccionada
                card.innerHTML = `
                    <a href='/entidades?campaniaId=${c.id}'>
                        <div class="card-header-flex" style="display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 10px; margin-bottom: 8px;">
                            <h3 style="margin: 0; font-size: 1.1em; color: #1e3a8a; text-align: left;">${c.nombre}</h3>
                            <div class="badges-container" style="display: flex; align-items: center; flex-shrink: 0;">
                                ${labelActiva}
                                ${labelSeleccionada}
                            </div>
                        </div>
                        <p><strong>Inicio:</strong> ${inicio} | <strong>Fin:</strong> ${fin}</p>
                        <p class="anio-info" style="margin-top: 5px; font-size: 0.85em; color: #64748b;">Año: ${c.anio}</p>
                    </a>
                `;

                /*
                // Vinculamos el clic sobre la tarjeta para actualizar el estado local y ejecutar el procesamiento del cambio
                card.onclick = () => {
                    idCampaniaVisualizada = c.id; 
                    seleccionarCampania(c);
                };
                */

                // Adjuntamos la tarjeta terminada y lista para usarse como un nodo hijo directo dentro de nuestro grid modal
                grid.appendChild(card);
            });

        } catch (error) {
            console.error("Error en el selector de campañas:", error);
        }
    }
}
