Esta es la carpeta de interfaces. Hay varias carpetas para agruparlas mejor, una carpeta tiene como mínimo un HTML, un CSS y un JS.

Además se ha incluido un global.css donde se declaran variables globales que se pueden usar en el resto de archivos CSS. (Muy útil para colores sobretodo).

Notación: 
    - En caso de querer crear una carpeta debe crearse con la primera letra en mayúsculas, para poder distinguir entre carpeta y archivo. Los archivos relacionados a una misma funcionalidad deben tener el mismo nombre y cambiar solo la extensión EJ: incidencias.html / incidencias.css / incidencias.js
    - La ñ se sustituirá con "ni" EJ: campaña => campania

Explicación de las carpetas actuales (24/4/26):

Assets: Carpeta con las imágenes

Login: regula la autenticación. Actualmente tiene valores de prueba "user" y "password" con rol de admin por defecto. El éxito o fracaso se modela con alertas.

General: Una vez que se está dentro de la aplicación es la página principal que contiene la cabecera + los dos iFrames dinámicos que van cambiando

MenuLateral: Es el iFrame dinámico de la izquierda. Hay un mapa con todas los archivos HTML y sus direcciones

GestionarCoordinadores: iFrame dinámico para representar el contenido, todos los botones se han modelado con alerta para verificar que tienen un eventListener activado

Incidencias: iFrame dinámico derecho, a futuro si el usuario no es admin se le mostrará únicamente el formulario para reportar una nueva incidencia.
Si el usuario es administrador se le mostrará la tabla con las incidencias reportadas.
En caso de seleccionar una incidencia se mostrará con más detalle en el iFrame dinámico izquierdo sustituyendo al menú lateral. Para volver habrá que hacer click sobre una x y se volverá a mostrar el menú lateral.

CARPETAS VACIAS (Solo contienen un html con h1 de titulo con sus CSS y JS conectados):

Campanias

Voluntarios

Tiendas

Colaboradores

