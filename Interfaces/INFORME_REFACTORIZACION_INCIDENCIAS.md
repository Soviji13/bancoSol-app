# Informe de refactorización del módulo de Incidencias

## 1. Introducción

Este informe documenta la refactorización realizada sobre el módulo de **Incidencias** del proyecto **BancoSol**.

El objetivo principal de esta refactorización ha sido mejorar la calidad técnica del código JavaScript, haciendo que el módulo sea más claro, mantenible, reutilizable y fácil de ampliar. Para ello, se ha reorganizado el código en archivos con responsabilidades concretas, se han eliminado duplicaciones y se ha centralizado la lógica común en módulos auxiliares.

Antes de la refactorización, parte del módulo funcionaba correctamente, pero presentaba varios problemas estructurales:

- Archivos con demasiadas responsabilidades.
- Lógica de API duplicada.
- Lógica de fechas repetida en varios scripts.
- Mapeo de datos mezclado con renderizado.
- Panel de detalle usando nombres de campos antiguos.
- Inconsistencias entre la tabla HTML y las columnas generadas por JavaScript.
- Comentarios poco homogéneos.
- Dificultad para localizar errores por la concentración de lógica en archivos grandes.

La refactorización corrige estos puntos y deja una base más sólida para futuras mejoras.

---

## 2. Objetivos de la refactorización

Los objetivos principales han sido:

1. Separar responsabilidades entre archivos.
2. Modularizar el código mediante `import` y `export`.
3. Centralizar las llamadas al backend.
4. Centralizar el mapeo de datos de incidencias.
5. Crear un archivo común para utilidades de fecha y hora.
6. Reducir la duplicación de código.
7. Mejorar la seguridad en la manipulación del DOM.
8. Sincronizar los nombres de campos usados por tabla, mapper y panel de detalle.
9. Ajustar el renderizado de tabla a las columnas reales del HTML.
10. Añadir comentarios informativos con tono formal y académico.
11. Documentar riesgos y futuras mejoras.
12. Mantener el comportamiento funcional existente sin introducir cambios funcionales innecesarios.

---

## 3. Estructura final del módulo

La estructura final propuesta queda organizada de la siguiente forma:

```txt
utils/
└── fechaUtils.js

Incidencias/
├── incidencias.html
├── incidencias.js
├── incidenciaApi.js
├── incidenciaMapper.js
├── incidenciaView.js
├── formIncidencia.html
├── formIncidencia.js
├── incidenciaSeleccionada.html
├── incidenciaSeleccionada.js
├── panelFiltro.html
└── panelFiltro.js
```

La carpeta `utils` está situada una carpeta por encima de `Incidencias`.

Por tanto, desde los archivos JavaScript ubicados dentro de `Incidencias`, las funciones comunes de fecha se importan así:

```js
import {
  formatearFecha,
  formatearHora
} from "../utils/fechaUtils.js";
```

---

## 4. Arquitectura resultante

La arquitectura queda separada en capas sencillas:

```txt
incidenciaApi.js            -> comunicación con backend
incidenciaMapper.js         -> transformación de datos
incidenciaView.js           -> renderizado y manipulación visual
fechaUtils.js               -> utilidades comunes de fecha y hora
incidencias.js              -> controlador principal de la pantalla
formIncidencia.js           -> formulario de creación de incidencias
incidenciaSeleccionada.js   -> panel lateral de detalle
panelFiltro.js              -> panel lateral de filtros
```

Esta organización permite que cada archivo tenga una función concreta y evita que el archivo principal acumule responsabilidades que pertenecen a otras capas.

---

## 5. Refactorización realizada por archivo

### 5.1. `utils/fechaUtils.js`

#### Función del archivo

Este archivo se ha creado para centralizar toda la lógica relacionada con fechas y horas.

Incluye funciones como:

```js
crearFechaValida()
formatearFecha()
formatearHora()
formatearFechaLarga()
formatearFechaHoraDetalle()
obtenerFechaHoraActualSinZona()
```

#### Problema anterior

Antes de crear este archivo, varios scripts tenían funciones parecidas o idénticas:

```js
function formatearFecha(fechaHora) { ... }
function formatearHora(fechaHora) { ... }
function crearFechaValida(fechaHora) { ... }
```

Esto provocaba duplicación y hacía que cualquier cambio en el formato de fecha tuviera que repetirse manualmente en distintos puntos del proyecto.

#### Mejora aplicada

La lógica de fechas se ha trasladado a `fechaUtils.js`.

Ahora los demás archivos importan las funciones que necesitan:

```js
import {
  formatearFecha,
  formatearHora
} from "../utils/fechaUtils.js";
```

o:

```js
import {
  obtenerFechaHoraActualSinZona
} from "../utils/fechaUtils.js";
```

#### Beneficios

- Menor duplicación.
- Mayor coherencia en el formato de fechas.
- Mantenimiento más sencillo.
- Una única fuente de verdad para la lógica temporal.
- Reducción del tamaño de los archivos principales.

---

### 5.2. `incidenciaApi.js`

#### Función del archivo

Este archivo centraliza las operaciones HTTP relacionadas con incidencias.

Incluye funciones como:

```js
listarIncidencias()
obtenerIncidenciaPorId()
crearIncidencia()
actualizarIncidencia()
eliminarIncidencia()
```

#### Problema anterior

La vista principal y otros scripts contenían funciones propias para realizar peticiones con `fetch`. Esto mezclaba la lógica de interfaz con la lógica de acceso a datos.

#### Mejora aplicada

Se ha separado la comunicación con backend en un archivo específico.

El resto del módulo puede trabajar con funciones de alto nivel, por ejemplo:

```js
const incidencias = await listarIncidencias();
```

o:

```js
await actualizarIncidencia(id, datosActualizados);
```

#### Beneficios

- Reducción del acoplamiento entre vista y backend.
- Mayor claridad en los flujos de datos.
- Reutilización de operaciones HTTP.
- Mejor localización de errores relacionados con la API.
- Control centralizado de respuestas HTTP.

---

### 5.3. `incidenciaMapper.js`

#### Función del archivo

Este archivo transforma los datos recibidos desde la API en objetos preparados para la interfaz.

Genera campos derivados como:

```txt
fechaTexto
horaTexto
estadoTexto
cargoTexto
contactoTexto
```

También centraliza funciones como:

```js
mapearIncidenciaDesdeAPI()
mapearIncidenciaParaAPI()
mapearIncidenciaConNuevoEstado()
formatearEstado()
obtenerClaseEstado()
formatearCargo()
```

#### Problema anterior

La transformación de datos estaba parcialmente mezclada con la vista principal. Además, el formateo de fecha y hora se repetía.

#### Mejora aplicada

El mapper se encarga de preparar los datos que necesita la interfaz.

Además, importa las funciones de fecha desde `fechaUtils.js`:

```js
import {
  formatearFecha,
  formatearHora
} from "../utils/fechaUtils.js";
```

#### Beneficios

- Los datos llegan a la vista ya normalizados.
- Se evita duplicar formateo de estados y cargos.
- Se centraliza la lógica de transformación.
- El renderizado visual no necesita conocer la estructura exacta del backend.
- Se mejora la coherencia entre tabla y panel de detalle.

---

### 5.4. `incidenciaView.js`

#### Función del archivo

Este archivo se encarga de la parte visual de la tabla de incidencias.

Sus responsabilidades son:

- Obtener referencias a elementos del DOM.
- Pintar incidencias en la tabla.
- Crear filas y celdas.
- Marcar filas seleccionadas.
- Limpiar selección de filas.
- Actualizar botones de acción.
- Abrir el panel lateral de detalle.

#### Problema anterior

La vista principal generaba directamente la tabla y mezclaba renderizado, selección, eventos y lógica de estado.

Además, en algunos puntos se utilizaba `innerHTML` para introducir datos dinámicos.

#### Mejora aplicada

El renderizado se mueve a `incidenciaView.js`.

También se sustituye la inserción de datos dinámicos mediante `innerHTML` por creación de nodos y uso de `textContent`.

Ejemplo:

```js
const celda = document.createElement("td");
celda.textContent = texto ?? "";
```

#### Beneficios

- Renderizado más seguro.
- Menor riesgo de inyección de HTML.
- Código visual centralizado.
- Controlador principal más limpio.
- Mayor facilidad para modificar la tabla en el futuro.

#### Corrección adicional

Se detectó que `incidenciaView.js` generaba una tabla con ocho columnas, mientras que `incidencias.html` tenía siete columnas.

La refactorización ajusta el renderizado a las columnas reales del HTML para evitar desalineaciones.

---

### 5.5. `incidencias.js`

#### Función del archivo

Este archivo queda como controlador principal de la pantalla de incidencias.

Sus responsabilidades actuales son:

- Inicializar la pantalla.
- Registrar eventos.
- Cargar incidencias.
- Aplicar filtros.
- Gestionar la incidencia seleccionada.
- Coordinar cambios de estado.
- Comunicarse con el menú lateral.
- Coordinar API, mapper y vista.

#### Problema anterior

Este archivo concentraba demasiadas responsabilidades:

```txt
- Fetch HTTP
- Mapeo de datos
- Renderizado de tabla
- Formateo de fechas
- Formateo de estados
- Gestión de selección
- Filtros
- Comunicación entre vistas
```

#### Mejora aplicada

Se han delegado responsabilidades en otros archivos:

```js
import {
  listarIncidencias,
  actualizarIncidencia
} from "./incidenciaApi.js";

import {
  mapearIncidenciaDesdeAPI,
  mapearIncidenciaConNuevoEstado
} from "./incidenciaMapper.js";

import {
  obtenerElementos,
  pintarIncidencias,
  marcarFilaSeleccionada,
  limpiarSeleccionFilas,
  actualizarEstadoBotones,
  abrirPanelLateral,
  mostrarMensaje
} from "./incidenciaView.js";
```

#### Beneficios

- Archivo principal más corto y legible.
- Mejor separación entre coordinación y detalles técnicos.
- Menos duplicación de funciones.
- Mayor facilidad para depurar flujos de pantalla.
- Mejor preparación para añadir nuevas acciones.

---

### 5.6. `formIncidencia.js`

#### Función del archivo

Este archivo gestiona el formulario de creación de incidencias.

Sus responsabilidades son:

- Cargar responsables de tienda.
- Cargar responsables de entidad.
- Rellenar el selector de responsables.
- Validar campos obligatorios.
- Construir el objeto de incidencia.
- Crear la incidencia mediante la API.
- Notificar la recarga de la tabla.
- Volver a la pantalla principal.

#### Problema anterior

El formulario incluía su propia lógica para construir fechas y podía duplicar lógica de comunicación con la API.

#### Mejora aplicada

Se usa `fechaUtils.js` para obtener la fecha actual:

```js
import {
  obtenerFechaHoraActualSinZona
} from "../utils/fechaUtils.js";
```

Además, el formulario se apoya en `incidenciaApi.js` para crear incidencias.

#### Beneficios

- Menos lógica repetida.
- Fecha de creación uniforme.
- Código más claro.
- Menor acoplamiento con detalles de `fetch`.
- Validaciones más localizadas.

---

### 5.7. `incidenciaSeleccionada.js`

#### Función del archivo

Este archivo controla el panel lateral de detalle de una incidencia.

Sus responsabilidades son:

- Leer la incidencia seleccionada desde `sessionStorage`.
- Mostrar los datos en el panel.
- Aplicar clases visuales según el estado.
- Cerrar el panel.
- Restaurar el menú lateral.

#### Problema anterior

El panel esperaba campos antiguos:

```txt
reportadoPor
idInterno
cargo
fecha
hora
```

Pero el mapper actual genera campos como:

```txt
reportadoPorNombre
id
cargoTexto
estadoTexto
fechaHora
contactoTexto
```

Esto podía provocar que el panel mostrase valores vacíos o `undefined`.

#### Mejora aplicada

Se actualizaron los campos usados por el panel para que coincidan con los generados por `incidenciaMapper.js`.

Además, se añadió lectura segura de `sessionStorage` mediante `try/catch`.

#### Beneficios

- Panel sincronizado con el mapper.
- Menos errores por campos inexistentes.
- Mejor tolerancia ante datos corruptos en `sessionStorage`.
- Uso de `fechaUtils.js` para generar la fecha del detalle.
- Código más robusto.

---

### 5.8. `panelFiltro.js`

#### Función del archivo

Este archivo gestiona el panel lateral de filtros.

Sus responsabilidades son:

- Leer valores del formulario.
- Aplicar filtros.
- Limpiar filtros.
- Cerrar el panel.
- Comunicarse con la pantalla principal mediante `postMessage`.

#### Mejora aplicada

Se añadieron constantes para:

- Selectores.
- Tipos de mensajes.
- Funciones de comunicación con el documento padre.

#### Beneficios

- Código más legible.
- Responsabilidad única.
- Mensajes centralizados.
- Mantenimiento más sencillo.

---

## 6. Uso del archivo `utils`

El uso del archivo `utils/fechaUtils.js` es uno de los puntos más importantes de la refactorización.

### Antes

La lógica de fechas estaba repetida:

```js
function formatearFecha(fechaHora) { ... }
function formatearHora(fechaHora) { ... }
function crearFechaValida(fechaHora) { ... }
```

### Después

La lógica está centralizada en:

```txt
utils/fechaUtils.js
```

Y se importa cuando es necesaria:

```js
import {
  formatearFecha,
  formatearHora
} from "../utils/fechaUtils.js";
```

### Archivos que hacen uso de `fechaUtils.js`

```txt
incidenciaMapper.js
formIncidencia.js
incidenciaSeleccionada.js
```

### Ventajas

- Se evita repetir código.
- Se mantiene un formato uniforme.
- Se facilita el mantenimiento.
- Se reduce el riesgo de errores por cambios parciales.
- Se mejora la reutilización entre módulos.

---

## 7. Comentarios informativos añadidos

Se han añadido comentarios con tono formal y académico para explicar:

- La responsabilidad de cada módulo.
- La finalidad de funciones relevantes.
- El flujo de datos.
- La transformación de datos.
- La creación de elementos visuales.
- La comunicación entre vistas.
- La validación y procesamiento de respuestas HTTP.

Ejemplo:

```js
/**
 * Transforma una incidencia recibida desde la API en un objeto adaptado
 * a las necesidades de representación de la interfaz.
 *
 * @param {object} incidenciaAPI Incidencia recibida desde el backend.
 * @returns {object} Incidencia preparada para su uso en la interfaz.
 */
```

Los comentarios se han utilizado para aportar contexto, no para repetir lo que ya expresa el código.

---

## 8. Uso de módulos ES

La refactorización se apoya en módulos ES mediante `import` y `export`.

Esto permite dividir el código y reutilizar funciones entre archivos.

Ejemplo de exportación:

```js
export function listarIncidencias() {
  return getJSON(ENDPOINTS.incidencias, "Error al listar incidencias");
}
```

Ejemplo de importación:

```js
import {
  listarIncidencias
} from "./incidenciaApi.js";
```

### Implicación en los HTML

Los archivos principales deben cargarse como módulo:

```html
<script type="module" src="incidencias.js" defer></script>
```

Esto debe aplicarse a los HTML que carguen scripts principales con imports:

```txt
incidencias.html
formIncidencia.html
incidenciaSeleccionada.html
panelFiltro.html
```

Los archivos auxiliares no se cargan directamente desde HTML, sino que son importados por otros scripts.

---

## 9. Mejoras de seguridad y robustez

### 9.1. Renderizado seguro

El uso de `textContent` evita que datos procedentes del backend se interpreten como HTML.

Esto reduce el riesgo de inyección de contenido en la tabla.

### 9.2. Lectura segura de `sessionStorage`

El panel de detalle controla errores al leer JSON desde `sessionStorage`.

Si el contenido no es válido, el script no rompe la pantalla.

### 9.3. Validación de formulario

El formulario mantiene validaciones mínimas antes de enviar la incidencia:

- El asunto es obligatorio.
- Debe seleccionarse un responsable.
- El identificador del responsable se transforma de forma controlada.

### 9.4. Uso de constantes

Se han usado constantes para:

- Selectores.
- Estados.
- Rutas.
- Mensajes.
- Claves de almacenamiento.
- Tipos de responsable.

Esto reduce errores por strings repetidos.

---

## 10. Problemas corregidos

Durante la refactorización se corrigieron los siguientes puntos:

### 10.1. Duplicación de fechas

Solucionada mediante `utils/fechaUtils.js`.

### 10.2. Duplicación de API

Solucionada mediante `incidenciaApi.js`.

### 10.3. Duplicación de mapeo

Solucionada mediante `incidenciaMapper.js`.

### 10.4. Exceso de responsabilidades en `incidencias.js`

Solucionado convirtiéndolo en controlador principal.

### 10.5. Campos antiguos en panel de detalle

Solucionado actualizando `incidenciaSeleccionada.js` para usar los campos reales del mapper.

### 10.6. Desajuste de columnas

Solucionado ajustando `incidenciaView.js` a las columnas reales de `incidencias.html`.

### 10.7. Comentarios poco homogéneos

Solucionado mediante comentarios formales e informativos.

---

## 11. Beneficios obtenidos

La refactorización aporta los siguientes beneficios:

1. Código más modular.
2. Menos duplicación.
3. Mayor claridad arquitectónica.
4. Mayor facilidad de mantenimiento.
5. Mayor seguridad en la manipulación del DOM.
6. Mejor reutilización de funciones.
7. Mejor coherencia entre pantallas.
8. Menor acoplamiento entre vista y backend.
9. Mayor facilidad de depuración.
10. Base más sólida para futuras funcionalidades.

---

## 12. Riesgos y puntos a revisar

Aunque la refactorización mejora la estructura del módulo, durante la integración deben revisarse estos puntos:

### 12.1. Rutas relativas

Debe comprobarse que los imports hacia `fechaUtils.js` son correctos:

```js
../utils/fechaUtils.js
```

### 12.2. Scripts como módulo

Los HTML deben cargar los scripts principales con:

```html
<script type="module" src="archivo.js" defer></script>
```

### 12.3. Rutas en iframes

Las rutas usadas al cambiar el contenido del menú lateral deben comprobarse desde la ubicación real del HTML cargado.

### 12.4. Comunicación con `postMessage`

Actualmente se usa `"*"` como origen de destino. En una aplicación real sería recomendable restringir el origen permitido.

Ejemplo:

```js
window.parent.postMessage(mensaje, window.location.origin);
```

---

## 13. Mejoras futuras identificadas

### 13.1. Orden de incidencias

Al crear una nueva incidencia, esta puede aparecer en una posición intermedia de la tabla.

Este comportamiento se debe probablemente a que la API devuelve las incidencias sin un criterio de orden explícito.

En bases de datos relacionales, si no se usa `ORDER BY`, el orden de los registros no está garantizado.

Esta mejora queda como implementación futura.

Opciones posibles:

1. Ordenar por `fechaHora` descendente en frontend.
2. Ordenar por `id` descendente en frontend.
3. Ordenar desde backend con `ORDER BY fechaHora DESC`.
4. Ordenar desde backend con `ORDER BY id DESC`.
5. Crear un endpoint específico que devuelva incidencias ordenadas.

La opción más sólida sería ordenar desde backend y, si se considera necesario, mantener una ordenación defensiva en frontend.

---

### 13.2. Centralización de constantes

Podría crearse un archivo común:

```txt
incidenciaConstantes.js
```

Para centralizar:

- Estados.
- Tipos de responsable.
- Mensajes de canal.
- Mensajes de `postMessage`.
- Rutas internas.
- Claves de `sessionStorage`.

---

### 13.3. Cliente HTTP común

Si otros módulos del proyecto usan una lógica similar de `fetch`, podría crearse:

```txt
utils/httpClient.js
```

Con funciones como:

```js
getJSON()
postJSON()
putJSON()
deleteJSON()
validarRespuestaHTTP()
```

Esto permitiría reutilizar la lógica HTTP fuera del módulo de incidencias.

---

### 13.4. Seguridad de `postMessage`

Se recomienda sustituir el uso de `"*"` por un origen controlado cuando el proyecto deje de ser local o académico.

---

### 13.5. Mejoras de accesibilidad

Podrían añadirse mejoras como:

- Roles ARIA más específicos.
- Gestión del foco al abrir y cerrar paneles.
- Mensajes accesibles para estados vacíos.
- Mayor soporte de navegación por teclado.

---

### 13.6. Confirmación antes de resolver incidencias

Podría añadirse una confirmación previa antes de marcar una incidencia como resuelta.

Ejemplo:

```txt
¿Desea marcar esta incidencia como resuelta?
```
