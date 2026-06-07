// Script refactorizado de parte de Clientes - Sofía Si Villalba Jiménez
// IA usada solo para entender cómo vincular el JavaScript

const seccionEntidades = document.getElementById("entidades");

if (seccionEntidades) {
    // PARA CERRAR PANEL DE CREAR ENTIDAD ---------------------------------------------------------------------------------------
    const botonCerrarRegistro = document.querySelector ('.btn-cerrar-modal');

    if (botonCerrarRegistro) {

        // Lo pasamos para que si se le da al botón cerrar, se muestre el listado donde estaba la campaña
        const idCampania = seccionEntidades.dataset.idCampaniaActual;

        botonCerrarRegistro.addEventListener('click', () => {
            window.location.href = `http://localhost:8080/entidades/?campaniaId=${idCampania}`;
        })
    }
}