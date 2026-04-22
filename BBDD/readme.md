# Notas sobre la Base de Datos

> **Aviso:** Es recomendable leer las restricciones que se han añadido en la carpeta `archivos_equipo` en conjunto con este documento.

---

## REGLAS ESTRICTAS EN SPRING BOOT
**IMPORTANTE:** Es estrictamente necesario implementar esto; de lo contrario, las restricciones creadas en la BBDD lanzarán errores y bloquearán la aplicación.

**Nomenclatura de Datos:**

- **Nombres y códigos**: Obligatorio en **mayúsculas** (nombre de entidades, cadenas, localidades, personas...)
- **Descripciones y observaciones**: Se permite formato libre

---

## LÓGICA A AÑADIR EN SPRING BOOT (Services)

### Consultas y Relaciones (JOINs)

* **Tabla `Colaborador_campania`:** Al crear esta tabla intermedia, es **necesario** hacer un `JOIN` a `participa` y `observaciones`.
* **Última participación:** Para acceder a la última participación de una Entidad Colaboradora, accederemos desde la tabla intermedia `Colaborador_campania` a `Campania`, obteniendo el atributo `anio`.
* **Contactos de la Entidad:** Para acceder a los contactos de la Entidad Colaboradora, necesitaremos acceder a sus Responsables (`Responsable_entidad`) y de ahí a su `Contacto`.

### Validaciones de Seguridad

* **Creación de Responsable:** Si se crea un Responsable de Entidad, debemos validar por código que si no se le añade un contacto, lance un error.
* **Asignación a Tiendas:** Si una tienda se asocia a un Responsable de Entidad, debemos validar dos cosas:
  1. Que la Entidad está asociada a la Tienda.
  2. Que la Entidad Colaboradora se encuentra en la misma campaña que la Tienda.

### Lógica de Horarios (Voluntarios vs. Turnos)

* **Horas Sueltas (`Voluntario`):** Si tiene activado *horas sueltas*, se deben añadir los atributos de `hora_inicio` y `hora_final` obligatoriamente. Si no lo tiene activado, entonces no pueden añadirse.
* **Turno Estándar (`Turno`):** * Si el voluntario tiene activado *horas sueltas*, el día ni la franja horaria se deben rellenar (en la vista se mostrarán las horas de la entidad Voluntario). 
  * Si no tiene horas sueltas, **sí** debe tener los campos de día y franja horaria (obligatorio). En este caso, vamos a su turno correspondiente y obtenemos dichos datos.

---

## ACLARACIONES SOBRE CIERTAS ENTIDADES

### Comportamiento de Borrado (Foreign Keys)

* **`CASCADE`:** Implica que bajo tal acción, la entidad que posee la clave foránea se elimina automáticamente para no dejar datos huérfanos.
* **`SET NULL`:** Implica que bajo la acción de eliminar la entidad relacionada, la columna de la clave foránea simplemente se pone en NULL (el registro no se borra).

### Diccionario de Entidades

* **Campania**
  * `anio`: Este atributo se actualiza automáticamente. Su valor depende del año extraído de `fecha_inicio`.
  * `fecha_inicio` y `fecha_fin`: Son atributos únicos, no pueden repetirse en otras campañas.

* **Entidad_colaboradora**
  * `nombre`: Es único, no puede repetirse.
  * `estado_activo`: Si se activa, significa que la Entidad Colaboradora está participando actualmente en la campaña.

* **Colaborador_campania**
  * Se ha decidido añadir `participa` y `observaciones` para guardar un registro en el tiempo. Puede que participaran en 2022 pero en 2025 no. Puede que tuvieran unas observaciones en 2019 y otras (o ninguna) actualmente.

* **Contacto**
  * `email` y `telefono` son campos únicos en toda la base de datos.

* **Coordinador**
  * Al final se ha decidido dejar la entidad centralizada simplemente como `Coordinador`.

* **Notificación / Solicitud de cambio**
  * Esta es la solicitud que le envía el Coordinador al Administrador para pedir permiso para modificar alguna interfaz.
  * `estado`: Utiliza un tipo Enum. Sus **únicos valores válidos** son: `LEIDA` (amarillo), `PENDIENTE` (rojo), `RESUELTA` (verde).

* **Usuario**
  * `rol`: Utiliza un tipo Enum. Sus **únicos valores válidos** son: `ADMIN`, `COORDINADOR`, `RESPONSABLE_ENTIDAD`, `RESPONSABLE_TIENDA`.

* **Dirección**
  * **NO** se puede eliminar una dirección que esté asociada a una tienda o colaborador. Solo se permitirá modificarla.

* **Voluntario**
  * Aquí **sí** pueden solaparse dos voluntarios (en un principio la hora de inicio y final) si van por horas sueltas.

* **Turno**
  * A diferencia del voluntario suelto, aquí **dos voluntarios de la misma tienda NO pueden tener el mismo día con la misma franja horaria**.
