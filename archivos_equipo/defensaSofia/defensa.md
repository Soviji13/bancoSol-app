# Decisiones de arquitectura

## Hacer fetch a las campañas

Para no tener que volver a recargar la tabla entera, puesto que solo quiero obtener todas las campañas, se dividen responsabilidades. - Evitamos sobrecarga y consultas (deberíamos traer la tabla entera dos veces)

De igual forma, se pierde la vista que tenía el usuario (imaginemos que hizo scroll) - No es un detalle muy importante, pero también está.

Además, se debería haber añadido un parámetro adicional (en algunos casos únicamente necesario) a `mostrarTabla`, lo cual hace el código poco modularizado y menos fácilidad para su escalabilidad.

## Relacionados con crear entidad colaboradora

### Asignar coordinador a entidad

Si un coordinador se asigna a una entidad, y a esa campaña no está asignado el coordinador. Aparecerá un aviso poniendo que el coordinador no se encuentra en esa campaña, y que si desea asignarlo, que vaya a la ventana de coordinadores y sea asignado.
