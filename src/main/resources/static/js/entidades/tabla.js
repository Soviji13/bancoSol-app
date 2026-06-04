// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez

// Intentamos a acceder al apartado de entidades
const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {

        // Se obtienen los botones de desplegar tienda
        const botonesDesplegar = seccionEntidades.querySelectorAll(".boton-desplegar-tiendas-js");

        // Recorremos cada uno
        botonesDesplegar.forEach(boton => {
            boton.addEventListener("click", function() {

                // Se busca la columna anterior a su fila correspondiente
                const celdaTiendas = this.previousElementSibling;
                if (!celdaTiendas) return;

                // Se alternan los estilos entre "solo una tienda" o "todas las tiendas"
                const resumen = celdaTiendas.querySelector('.tiendas-resumen');
                const listaCompleta = celdaTiendas.querySelector('.tiendas-lista-completa');

                if (resumen && listaCompleta) {
                    const estaOculta = listaCompleta.style.display === 'none';

                    // Alternamos la visibilidad
                    listaCompleta.style.display = estaOculta ? 'block' : 'none';
                    resumen.style.display = estaOculta ? 'none' : 'block';

                    // Rotamos la flechita con CSS
                    if (estaOculta) {
                        this.classList.add('rotado');
                    } else {
                        this.classList.remove('rotado');
                    }
                }
            });
        });
}

