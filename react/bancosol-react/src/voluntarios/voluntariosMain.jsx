export function MainVoluntarios ({manejaContenidoLateral, manejaContenidoInicial}) {
    return(
        <>
        <h1>VOLUNTARIOS (A RELLENAR POR EL MIEMBRO DEL GRUPO)</h1>
        <button onClick={() => {manejaContenidoInicial("test")}}>Tet Inicial</button>
        <button onClick={() => {manejaContenidoLateral("test")}}>Test Lateral</button>
        </>
    )
}