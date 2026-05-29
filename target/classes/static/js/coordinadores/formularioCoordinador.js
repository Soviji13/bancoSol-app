document.addEventListener("DOMContentLoaded", () => {
    const btnVolver = document.querySelector("#btn-volver");
    const btnCancelar = document.querySelector("#btn-cancelar");
    const form = document.querySelector("#form-registro-coordinador");

    const inputNombre = document.querySelector("#nombre");
    const inputEmail = document.querySelector("#email");
    const selectZonas = document.querySelector("#select-zonas");
    const checksCampanias = document.querySelectorAll("input[name='idsCampanias']");

    const volverListado = () => {
        window.location.href = `${window.location.origin}/coordinadores`;
    };

    if (btnVolver) {
        btnVolver.addEventListener("click", (event) => {
            event.preventDefault();
            volverListado();
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", (event) => {
            event.preventDefault();

            const confirmar = confirm("¿Seguro que desea cancelar? Se perderán los cambios no guardados.");

            if (confirmar) {
                volverListado();
            }
        });
    }

    if (form) {
        form.addEventListener("submit", (event) => {
            limpiarErrores();

            const errores = [];

            if (!inputNombre.value.trim()) {
                errores.push("El nombre del coordinador es obligatorio.");
                marcarError(inputNombre);
            }

            if (!inputEmail.value.trim()) {
                errores.push("El correo es obligatorio.");
                marcarError(inputEmail);
            }

            if (!selectZonas.value.trim()) {
                errores.push("Debe seleccionar un área.");
                marcarError(selectZonas);
            }

            const algunaCampaniaSeleccionada = Array.from(checksCampanias)
                .some((check) => check.checked);

            if (!algunaCampaniaSeleccionada) {
                errores.push("Debe seleccionar al menos una campaña.");
            }

            if (errores.length > 0) {
                event.preventDefault();
                mostrarErrores(errores);
            }
        });
    }
});

function marcarError(elemento) {
    elemento.classList.add("campo-error");
}

function limpiarErrores() {
    document.querySelectorAll(".campo-error").forEach((elemento) => {
        elemento.classList.remove("campo-error");
    });

    const avisoExistente = document.querySelector("#aviso-formulario");

    if (avisoExistente) {
        avisoExistente.remove();
    }
}

function mostrarErrores(errores) {
    const form = document.querySelector("#form-registro-coordinador");

    const aviso = document.createElement("div");
    aviso.id = "aviso-formulario";
    aviso.className = "aviso-formulario";

    const titulo = document.createElement("strong");
    titulo.textContent = "Revise el formulario:";

    const lista = document.createElement("ul");

    errores.forEach((error) => {
        const item = document.createElement("li");
        item.textContent = error;
        lista.appendChild(item);
    });

    aviso.appendChild(titulo);
    aviso.appendChild(lista);

    form.prepend(aviso);
}