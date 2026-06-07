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
