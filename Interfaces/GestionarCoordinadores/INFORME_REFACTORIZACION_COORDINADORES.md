# Informe de refactorización del módulo de Coordinadores

## 1. Introducción

Este informe documenta la refactorización realizada sobre el módulo de **Coordinadores** del proyecto **BancoSol**.

El objetivo principal de la refactorización ha sido mejorar la organización interna del código JavaScript, separar responsabilidades, reducir duplicaciones y preparar el módulo para futuras ampliaciones.

Además, se ha extraído la lógica de exportación CSV a un archivo común dentro de `utils`, de forma que pueda reutilizarse desde otros módulos del proyecto.

---

## 2. Objetivos de la refactorización

Los objetivos principales han sido:

1. Separar la lógica del módulo en archivos especializados.
2. Convertir el archivo principal en un controlador más limpio.
3. Centralizar las llamadas al backend.
4. Centralizar el mapeo de datos.
5. Separar el renderizado visual de la lógica de negocio.
6. Extraer la exportación CSV a un archivo global reutilizable.
7. Preparar una convención clara para rutas globales de `utils` y `assets`.
8. Reducir el uso de `innerHTML` con datos dinámicos.
9. Añadir comentarios formales e informativos.
10. Mantener el comportamiento funcional existente.
11. Dejar identificadas posibles mejoras futuras.

---

## 3. Estructura final propuesta

La estructura final propuesta queda organizada de la siguiente manera:

```txt
assets/
utils/
├── csvUtils.js
└── assetUtils.js

Coordinadores/
├── coordinadores.js
├── coordinadorApi.js
├── coordinadorMapper.js
├── coordinadorView.js
├── formularioCoordinador.js
└── panelFiltroCoordinadores.js
```

La carpeta `assets` y la carpeta `utils` están situadas al mismo nivel.

Desde los archivos ubicados en `Coordinadores/`, las rutas globales deben resolverse así:

```js
../utils/csvUtils.js
../utils/assetUtils.js
../assets/...
```

---

## 4. Arquitectura resultante

La refactorización organiza el módulo en capas funcionales:

```txt
coordinadorApi.js              -> comunicación con backend
coordinadorMapper.js           -> transformación de datos
coordinadorView.js             -> renderizado y manipulación visual
coordinadores.js               -> controlador principal
formularioCoordinador.js       -> alta y edición de coordinadores
panelFiltroCoordinadores.js    -> panel lateral de filtros
utils/csvUtils.js              -> exportación CSV reutilizable
utils/assetUtils.js            -> construcción de rutas hacia assets globales
```

Esta organización reduce el acoplamiento entre archivos y facilita el mantenimiento.

---

## 5. Refactorización realizada por archivo

### 5.1. `utils/csvUtils.js`

#### Función del archivo

Este archivo centraliza la generación y descarga de ficheros CSV.

Contiene una función principal:

```js
exportarCSV({ cabeceras, filas, nombreArchivo })
```

#### Problema anterior

La lógica de exportación CSV estaba incluida directamente dentro del archivo principal de coordinadores.

Esto hacía que el método estuviera acoplado a una pantalla concreta y no pudiera reutilizarse fácilmente desde otros módulos.

#### Mejora aplicada

Se ha extraído la exportación CSV a un archivo global dentro de `utils`.

Ahora el módulo de coordinadores solo prepara las cabeceras y las filas, y delega la descarga en `csvUtils.js`.

#### Beneficios

- La exportación CSV queda reutilizable.
- Se elimina duplicación futura.
- El controlador principal queda más limpio.
- El tratamiento de comillas, codificación UTF-8 y descarga queda centralizado.
- Otros módulos podrán usar la misma utilidad.

---

### 5.2. `utils/assetUtils.js`

#### Función del archivo

Este archivo centraliza la construcción de rutas hacia la carpeta global de assets.

Contiene la función:

```js
obtenerRutaAsset(rutaRelativa)
```

#### Motivo de incorporación

El proyecto usa una carpeta global `assets` situada al mismo nivel que `utils`.

Para evitar rutas escritas manualmente en varios archivos, se deja preparada una utilidad que construye rutas hacia assets globales.

#### Beneficios

- Convención clara para rutas globales.
- Menos errores en rutas relativas.
- Mejor preparación para reutilizar iconos o imágenes desde distintos módulos.

---

### 5.3. `Coordinadores/coordinadorApi.js`

#### Función del archivo

Este archivo centraliza las llamadas HTTP relacionadas con coordinadores.

Incluye operaciones como:

```js
listarCoordinadores()
obtenerCoordinadorPorId()
listarCampanias()
listarZonas()
crearCoordinadorCompleto()
actualizarCoordinador()
actualizarContacto()
eliminarCoordinadorPorId()
```

#### Problema anterior

Las llamadas `fetch` estaban repartidas entre el archivo principal y el formulario.

Esto mezclaba la comunicación con backend con la lógica de interfaz.

#### Mejora aplicada

Se ha creado un módulo API para concentrar las operaciones HTTP.

#### Beneficios

- Menor duplicación de `fetch`.
- Mejor separación entre interfaz y backend.
- Errores HTTP centralizados.
- Reutilización desde la pantalla principal y desde el formulario.
- Código más fácil de probar y depurar.

---

### 5.4. `Coordinadores/coordinadorMapper.js`

#### Función del archivo

Este archivo transforma los datos recibidos desde la API en objetos preparados para la interfaz.

Incluye funciones como:

```js
mapearCoordinadorDesdeAPI()
mapearCoordinadorParaCrear()
mapearCoordinadorParaActualizar()
mapearContactoParaActualizar()
obtenerCabecerasCSVCoordinadores()
mapearCoordinadoresParaCSV()
```

#### Problema anterior

La transformación de datos estaba mezclada con la vista principal y con el formulario.

Además, la lógica de CSV estaba dentro del controlador principal.

#### Mejora aplicada

El mapper concentra la adaptación de datos tanto para la interfaz como para la API y el CSV.

#### Beneficios

- Datos normalizados para la vista.
- Preparación centralizada de objetos para crear o actualizar.
- Preparación centralizada de filas CSV.
- Menos lógica repetida.
- Mayor coherencia entre tabla, detalle, formulario y exportación.

---

### 5.5. `Coordinadores/coordinadorView.js`

#### Función del archivo

Este archivo contiene la lógica visual de la pantalla de coordinadores.

Sus responsabilidades son:

- Obtener elementos del DOM.
- Pintar la tabla de coordinadores.
- Pintar el detalle de un coordinador.
- Pintar el selector de campañas.
- Activar o desactivar el modo eliminar.
- Activar o resetear el botón modificar.
- Mostrar y cerrar modales.
- Mostrar el loader.
- Cambiar el título de la vista.

#### Problema anterior

La pantalla principal mezclaba renderizado, selección, detalle, modales, loader y lógica de estado.

Además, parte de la tabla se generaba mediante `innerHTML`.

#### Mejora aplicada

Se ha trasladado el renderizado visual a `coordinadorView.js`.

Siempre que se insertan datos dinámicos procedentes del backend se prioriza `textContent` y creación de nodos DOM.

#### Beneficios

- Vista principal más limpia.
- Renderizado más seguro.
- Menor riesgo de inyección de HTML.
- Más facilidad para modificar la tabla o el detalle.
- Menor acoplamiento entre datos y presentación.

---

### 5.6. `Coordinadores/coordinadores.js`

#### Función del archivo

Este archivo queda como controlador principal de la pantalla de coordinadores.

Coordina:

- Carga inicial de datos.
- Registro de eventos.
- Comunicación con `BroadcastChannel`.
- Comunicación con el documento padre mediante `postMessage`.
- Selección de filas.
- Apertura del detalle.
- Eliminación de coordinadores.
- Aplicación de filtros.
- Selección de campañas.
- Exportación CSV.

#### Problema anterior

El archivo principal tenía demasiadas responsabilidades.

Incluía:

```txt
- Fetch HTTP
- Mapeo de datos
- Renderizado de tabla
- Detalle de coordinador
- Eliminación
- Filtros
- Selector de campañas
- Exportación CSV
- Loader
- Utilidades generales
```

#### Mejora aplicada

Ahora el controlador importa y coordina módulos especializados:

```js
coordinadorApi.js
coordinadorMapper.js
coordinadorView.js
utils/csvUtils.js
```

#### Beneficios

- Archivo principal más claro.
- Mejor separación de responsabilidades.
- Menor duplicación.
- Mayor facilidad para depurar.
- El método CSV ya no está acoplado al controlador.
- Mejor preparación para futuras funcionalidades.

---

### 5.7. `Coordinadores/formularioCoordinador.js`

#### Función del archivo

Este archivo gestiona el alta y edición de coordinadores.

Sus responsabilidades son:

- Cargar campañas.
- Cargar zonas geográficas.
- Inicializar modo creación o edición.
- Rellenar el formulario.
- Leer datos del formulario.
- Validar campos obligatorios.
- Crear coordinador.
- Actualizar coordinador.
- Actualizar contacto asociado.
- Notificar la recarga de la tabla.

#### Problema anterior

El formulario tenía lógica propia de API, mapeo y lectura de datos.

#### Mejora aplicada

Ahora utiliza:

```js
coordinadorApi.js
coordinadorMapper.js
```

para separar llamadas HTTP y transformación de datos.

#### Beneficios

- Código más limpio.
- Menos duplicación.
- Validaciones más localizadas.
- Mejor separación entre formulario, API y mapper.
- Mayor coherencia con la pantalla principal.

---

### 5.8. `Coordinadores/panelFiltroCoordinadores.js`

#### Función del archivo

Este archivo gestiona el panel lateral de filtros.

Sus responsabilidades son:

- Pedir campañas a la pantalla principal.
- Pintar campañas en el select de filtro.
- Leer los filtros introducidos.
- Aplicar filtros.
- Limpiar filtros.
- Cerrar el panel.
- Comunicarse con el documento padre mediante `postMessage`.

#### Problema anterior

El código funcionaba, pero estaba menos estructurado y las constantes de mensajes y selectores estaban dispersas.

#### Mejora aplicada

Se han centralizado selectores y tipos de mensajes.

#### Beneficios

- Código más legible.
- Responsabilidad única.
- Comunicación más clara con la pantalla principal.
- Mejor mantenimiento.

---

## 6. Extracción de la exportación CSV a `utils`

Uno de los cambios más importantes ha sido mover el método de exportación CSV a:

```txt
utils/csvUtils.js
```

### Antes

La pantalla principal incluía funciones como:

```js
exportarACsv()
limpiarCsv()
```

Estas funciones estaban directamente acopladas al módulo de coordinadores.

### Después

La utilidad CSV es genérica:

```js
exportarCSV({
  cabeceras,
  filas,
  nombreArchivo
});
```

Y el módulo de coordinadores solo prepara sus datos específicos:

```js
exportarCSV({
  cabeceras: obtenerCabecerasCSVCoordinadores(),
  filas: mapearCoordinadoresParaCSV(estado.coordinadoresVisibles),
  nombreArchivo: `bancosol_coordinadores_${fecha}`
});
```

### Beneficios

- El CSV puede reutilizarse en otros módulos.
- El formato CSV se controla desde un único sitio.
- La codificación UTF-8 con BOM queda centralizada.
- El escape de comillas queda centralizado.
- La descarga de ficheros queda centralizada.

---

## 7. Uso de `assets` global

El proyecto contiene una carpeta global de assets situada al mismo nivel que `utils`.

La convención adoptada es:

```txt
assets/
utils/
Coordinadores/
```

Desde los archivos de `Coordinadores/`, las rutas relativas quedan:

```js
../utils/...
../assets/...
```

Se añade `assetUtils.js` como utilidad preparada para construir rutas hacia assets:

```js
obtenerRutaAsset("iconos/archivo.svg")
```

Aunque los archivos actuales no necesitaban rutas directas a imágenes o iconos, esta convención queda preparada para evitar inconsistencias futuras.

---

## 8. Uso de módulos ES

La refactorización se apoya en módulos ES mediante `import` y `export`.

Ejemplo:

```js
import {
  listarCoordinadores
} from "./coordinadorApi.js";
```

Esto implica que los HTML que carguen estos scripts deben usar:

```html
<script type="module" src="coordinadores.js" defer></script>
```

y:

```html
<script type="module" src="formularioCoordinador.js" defer></script>
```

También debe cargarse como módulo el script del panel de filtros si usa esta versión refactorizada.

---

## 9. Comentarios informativos añadidos

Se han incorporado comentarios formales e informativos para explicar:

- Responsabilidad de cada módulo.
- Propósito de funciones principales.
- Transformación de datos.
- Exportación CSV.
- Comunicación con backend.
- Comunicación con el documento padre.
- Renderizado de tabla y detalle.
- Convención de rutas para `utils` y `assets`.

Los comentarios tienen un tono académico y buscan aportar contexto técnico sin repetir instrucciones evidentes del código.

---

## 10. Mejoras de seguridad y robustez

### 10.1. Renderizado más seguro

Se ha reducido el uso de `innerHTML` con datos dinámicos.

En su lugar, se crean nodos DOM con:

```js
document.createElement()
textContent
appendChild()
```

Esto evita que datos procedentes de backend puedan interpretarse como HTML.

### 10.2. Validación de respuestas HTTP

La validación de respuestas HTTP se centraliza en `coordinadorApi.js`.

### 10.3. Validación de formulario

El formulario valida que:

- El nombre esté informado.
- El email esté informado.
- El área esté informada.
- Exista al menos una campaña seleccionada.

### 10.4. Uso de constantes

Se han centralizado:

- Selectores.
- Mensajes.
- Endpoints.
- Estados internos.
- Claves de canal.

Esto reduce errores por cadenas repetidas.

---

## 11. Problemas corregidos

Durante la refactorización se corrigieron o redujeron los siguientes problemas:

1. Exceso de responsabilidades en el archivo principal.
2. Duplicación de lógica HTTP.
3. Duplicación de lógica de mapeo.
4. Exportación CSV acoplada a la pantalla.
5. Uso innecesario de `innerHTML` para datos dinámicos.
6. Lógica de formulario mezclada con API.
7. Selectores y mensajes poco centralizados.
8. Falta de convención clara para `assets` y `utils`.
9. Dificultad para reutilizar funciones en otros módulos.

---

## 12. Beneficios obtenidos

La refactorización aporta los siguientes beneficios:

1. Código más modular.
2. Mayor claridad arquitectónica.
3. Menor duplicación.
4. Mejor reutilización de utilidades.
5. Exportación CSV reutilizable.
6. Mejor separación entre vista, API, mapper y controlador.
7. Mayor seguridad en la manipulación del DOM.
8. Mejor preparación para futuras ampliaciones.
9. Mayor facilidad de mantenimiento.
10. Mejor trazabilidad de errores.

---

## 13. Mejoras futuras identificadas

### 13.1. Crear un cliente HTTP global

Si otros módulos usan la misma lógica de `fetch`, podría crearse:

```txt
utils/httpClient.js
```

Con funciones reutilizables como:

```js
getJSON()
postJSON()
putJSON()
deleteJSON()
validarRespuestaHTTP()
```

### 13.2. Centralizar constantes compartidas

Podría crearse:

```txt
coordinadorConstantes.js
```

o incluso un archivo común para constantes globales del proyecto.

Podría contener:

- Mensajes de `BroadcastChannel`.
- Tipos de mensajes de `postMessage`.
- Nombres de rutas.
- Claves de `sessionStorage`.
- Selectores comunes.

### 13.3. Reutilizar el loader desde `utils`

El loader aparece en varios módulos del proyecto. Podría extraerse a:

```txt
utils/loaderUtils.js
```

### 13.4. Mejorar la seguridad de `postMessage`

Actualmente se usa `"*"` como origen de destino.

Para una aplicación real sería preferible restringir el origen:

```js
window.parent.postMessage(mensaje, window.location.origin);
```

### 13.5. Mejorar accesibilidad

Podrían añadirse mejoras como:

- Soporte de teclado en la tabla.
- Atributos ARIA en filas seleccionables.
- Gestión del foco al abrir y cerrar modales.
- Mensajes accesibles para estados vacíos.

### 13.6. Confirmación más robusta antes de eliminar

Actualmente se usa `confirm`.

Podría sustituirse por un modal propio con mejor diseño, accesibilidad y explicación de la acción.

### 13.7. Ordenación y paginación

Si el número de coordinadores crece, podrían añadirse:

- Ordenación por nombre.
- Ordenación por campaña.
- Ordenación por número de tiendas.
- Paginación.
- Búsqueda rápida.

### 13.8. Tests básicos de funciones puras

Funciones como los mappers y la exportación CSV podrían probarse con tests unitarios sencillos.
