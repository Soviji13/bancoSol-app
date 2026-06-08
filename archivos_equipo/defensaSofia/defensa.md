# Decisiones de arquitectura

## Hacer fetch a las campañas

Para no tener que volver a recargar la tabla entera, puesto que solo quiero obtener todas las campañas, se dividen responsabilidades. - Evitamos sobrecarga y consultas (deberíamos traer la tabla entera dos veces)

De igual forma, se pierde la vista que tenía el usuario (imaginemos que hizo scroll) - No es un detalle muy importante, pero también está.

Además, se debería haber añadido un parámetro adicional (en algunos casos únicamente necesario) a `mostrarTabla`, lo cual hace el código poco modularizado y menos fácilidad para su escalabilidad.

## En los fetchs no necesidad de `localhost:8080/`

El navegador aplica el principio de origen actual, entonces, va a la ruta del propio servidor, ya interpreta la url "raíz"

## Relacionados con crear entidad colaboradora

### Asignar coordinador a entidad

Si un coordinador se asigna a una entidad, solo se mostrarán las campañas para las que participa ese coordinador

### Asignar CP automáticamente

Debido a que, CP apunta hacia una dirección, y no hacia una localidad, no se ha podido actualizar el CP dinámicamente como con localidad y zona geográfica. Sin embargo, si se selecciona un distrito, sí se actualizarán los CPs disponibles de ese distrito. 

Si no hay distrito, entonces, se puede seleccionar cualquier CP que no sea perteneciente a un distrito

### Devolver campañas con tiendas

La lógica de que se devolviera las campaña con tiendas de un coordinador la creé yo. Sin embargo, lo devolvía en forma de Map, siendo la clave la campañaDTO y los valores una lista de tiendasDTO.

También creé yo el GetMapping y el fetch

La lógica funcionaba, pero los datos en json no se devolvían como esperaba, así que le pedí ayuda a la IA para que me los devolviera como yo quería

El record es un tipo de clase especial para representar datos de forma inmutable y eliminar código repetitivo. Se usa para datos rápidos sin mucha lógica. En mi caso era esencial para poder devolver el dato desde el controlador sin tener que crear una nueva clase.

### Evitar comportamiento por defecto del formulario

Debido a que hay muchos datos por recoger, y hay que validar mucha lógica de tipos o nula, prefiero recoger los campos desde el javaScript, y si algo falla, en vez de tener que hacer con un controller de nuevo un redirect hacia otra página, que el fallo se ponga directamente de forma dinámica en el HTML con el error exacto. Evitamos sobrecarga en la BBDD (porque deberíamos volver a traer la tabla, y de nuevo recargar la entidad) y además, mejoramos la experiencia del usuario (se muestran los falllos que hay).

Actualmente, se puede ver en este formulario, que trata de evitar fallos (como vincular una localidad a una zona geográfica no correspondiente o datos correctamente formateados) para que el cliente no cometa errores. Sin embargo, siempre debemos tener en cuenta que la aplicación puede escalar, y creo que la solución más óptima para una escalabilidad más sencilla es el enfoque de Single Page Application (el que he aplicado).

Además, muchos datos vienen con formatos especiales, por lo que es preferible formatearlos desde el JS y pasarlos limpios y de forma ordenada al controller, como los responsables de entidad o campañas y tiendas.

Evitamos que el controller realice más lógica de la que debe.

Llamaremos al controller únicamente cuando los datos estén en orden, desde el JS.

### Crear unos DTO especiales

Crearé unos DTO para registrar la entidad, de forma que sea mucho más simple la recogida de datos. Como los datos los envío en formato JSON al servidor, si creamos DTO (como objetos), leerán correctamente todos los atributos y se podrán asociar de forma mucho más simple.

Este planteamiento lo he obtenido con ayuda de la IA, pues mi idea era poder recoger los datos de la forma más simple posible.