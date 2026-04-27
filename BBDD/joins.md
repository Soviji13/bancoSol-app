Estos comandos son útiles para que al realizar un JOIN, las claves foráneas se indexen solas

```SQL
-- En PostgreSQL, las claves primarias (PK) se indexan solas, pero las foráneas (FK) NO.
-- Añadir estos índices asegura que los JOINs y las búsquedas por relación vuelen 

-- 1. Tiendas y sus relaciones
CREATE INDEX idx_tienda_cadena ON "public"."Tienda"("cadena_id");
CREATE INDEX idx_tienda_direccion ON "public"."Tienda"("direccion_id");

-- 2. Turnos y asignaciones
CREATE INDEX idx_tienda_turno_tienda ON "public"."Tienda_turno"("tienda_id");
CREATE INDEX idx_tienda_turno_turno ON "public"."Tienda_turno"("turno_id");
CREATE INDEX idx_tienda_turno_voluntario ON "public"."Tienda_turno"("voluntario_id");
CREATE INDEX idx_turno_campania ON "public"."Turno"("campania_id");

-- 3. Relaciones N:N de Tiendas
CREATE INDEX idx_tienda_colaborador_tienda ON "public"."Tienda_colaborador"("tienda_id");
CREATE INDEX idx_tienda_colaborador_colab ON "public"."Tienda_colaborador"("colaborador_id");
CREATE INDEX idx_tienda_colaborador_camp ON "public"."Tienda_colaborador"("campania_id");

CREATE INDEX idx_tienda_resp_tienda ON "public"."Tienda_responsable"("tienda_id");
CREATE INDEX idx_tienda_resp_resp ON "public"."Tienda_responsable"("responsable_entidad_id");
CREATE INDEX idx_tienda_resp_camp ON "public"."Tienda_responsable"("campania_id");

CREATE INDEX idx_tienda_campania_tienda ON "public"."Tienda_campania"("tienda_id");
CREATE INDEX idx_tienda_campania_camp ON "public"."Tienda_campania"("campania_id");

-- 4. Voluntarios, Entidades y Coordinadores
CREATE INDEX idx_voluntario_responsable ON "public"."Voluntario"("responsable_entidad_id");
CREATE INDEX idx_entidad_coordinador ON "public"."Entidad_colaboradora"("coordinador_id");
CREATE INDEX idx_entidad_direccion ON "public"."Entidad_colaboradora"("direccion_id");

CREATE INDEX idx_resp_entidad_entidad ON "public"."Responsable_entidad"("entidad_id");
CREATE INDEX idx_resp_entidad_usuario ON "public"."Responsable_entidad"("usuario_id");
CREATE INDEX idx_resp_entidad_contacto ON "public"."Responsable_entidad"("contacto_id");

CREATE INDEX idx_resp_tienda_usuario ON "public"."Responsable_tienda"("usuario_id");
CREATE INDEX idx_resp_tienda_contacto ON "public"."Responsable_tienda"("contacto_id");

CREATE INDEX idx_coordinador_usuario ON "public"."Coordinador"("usuario_id");
CREATE INDEX idx_coordinador_contacto ON "public"."Coordinador"("contacto_id");

-- 5. Relaciones de Campaña
CREATE INDEX idx_colab_campania_entidad ON "public"."Colaborador_campania"("entidad_id");
CREATE INDEX idx_colab_campania_camp ON "public"."Colaborador_campania"("campania_id");

CREATE INDEX idx_coord_campania_coord ON "public"."Coordinador_campania"("coordinador_id");
CREATE INDEX idx_coord_campania_camp ON "public"."Coordinador_campania"("campania_id");

CREATE INDEX idx_campania_cadena_cadena ON "public"."Campania_cadena"("cadena_id");
CREATE INDEX idx_campania_cadena_camp ON "public"."Campania_cadena"("campania_id");

-- 6. Incidencias y Solicitudes
CREATE INDEX idx_incidencia_resp_entidad ON "public"."Incidencia"("responsable_entidad_id");
CREATE INDEX idx_incidencia_resp_tienda ON "public"."Incidencia"("responsable_tienda_id");
CREATE INDEX idx_solicitud_coordinador ON "public"."Solicitud_cambio"("coordinador_id");

-- 7. Direcciones y Geografía
CREATE INDEX idx_direccion_localidad ON "public"."Direccion"("localidad_id");
CREATE INDEX idx_direccion_cp ON "public"."Direccion"("cp_id");
CREATE INDEX idx_direccion_distrito ON "public"."Direccion"("distrito_id");
CREATE INDEX idx_localidad_zona ON "public"."Localidad"("zona_geo_id");
CREATE INDEX idx_distrito_cp_distrito ON "public"."Distrito_cp"("distrito_id");
CREATE INDEX idx_distrito_cp_cp ON "public"."Distrito_cp"("cp_id");
```