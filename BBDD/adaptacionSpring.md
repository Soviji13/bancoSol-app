# Comando necesario para que la BBDD en Srpingboot funcione correctamente

```SQL
-- ==============================================================================
-- ADAPTACIÓN PARA SPRING BOOT 
-- ==============================================================================

-- 1. ELIMINAR TRIGGERS DE LÓGICA DE NEGOCIO
-- Mueve esta lógica a tus clases @Service en Spring Boot para poder lanzar
-- excepciones personalizadas y tener mejor control.
DROP TRIGGER IF EXISTS "trigger_valida_tienda_colab" ON "public"."Tienda_colaborador";
DROP TRIGGER IF EXISTS "trigger_valida_tienda_resp" ON "public"."Tienda_responsable";
DROP TRIGGER IF EXISTS "trigger_valida_voluntario_asignacion" ON "public"."Tienda_turno";

DROP FUNCTION IF EXISTS "public"."validar_tienda_colaborador"();
DROP FUNCTION IF EXISTS "public"."validar_tienda_responsable"();
DROP FUNCTION IF EXISTS "public"."validar_voluntario_tienda"();


-- 2. DESACTIVAR RLS (Row Level Security)
-- Spring Security (Java) será el encargado de proteger los endpoints, 
-- por lo que la BBDD no necesita esta capa extra de complejidad.
DROP FUNCTION IF EXISTS "public"."rls_auto_enable"() CASCADE;

ALTER TABLE "public"."Cadena" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Campania" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Campania_cadena" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Codigo_postal" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Colaborador_campania" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Contacto" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Coordinador" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Coordinador_campania" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Direccion" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Distrito" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Distrito_cp" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Entidad_colaboradora" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Incidencia" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Localidad" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Responsable_entidad" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Responsable_tienda" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Solicitud_cambio" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_campania" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_colaborador" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_responsable" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_turno" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Turno" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Usuario" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Voluntario" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Zona_geografica" DISABLE ROW LEVEL SECURITY;


-- 3. CONVERTIR ENUMS A TEXT (Para que Hibernate/Spring Boot no de problemas)
-- En tu Entidad de Java, simplemente usarás @Enumerated(EnumType.STRING).

ALTER TABLE "public"."Solicitud_cambio" ALTER COLUMN estado_solicitud TYPE text USING estado_solicitud::text;
ALTER TABLE "public"."Solicitud_cambio" ALTER COLUMN estado_solicitud SET DEFAULT 'PENDIENTE';

ALTER TABLE "public"."Incidencia" ALTER COLUMN estado TYPE text USING estado::text;
ALTER TABLE "public"."Incidencia" ALTER COLUMN estado SET DEFAULT 'PENDIENTE';

ALTER TABLE "public"."Usuario" ALTER COLUMN rol TYPE text USING rol::text;
ALTER TABLE "public"."Usuario" ALTER COLUMN rol SET DEFAULT 'RESPONSABLE_TIENDA';

ALTER TABLE "public"."Turno" ALTER COLUMN dia TYPE text USING dia::text;
ALTER TABLE "public"."Turno" ALTER COLUMN franja_horaria TYPE text USING franja_horaria::text;

-- Borramos los tipos ENUM creados originalmente ya que no los usaremos
DROP TYPE IF EXISTS "public"."estado_cambio";
DROP TYPE IF EXISTS "public"."estado_incidencia";
DROP TYPE IF EXISTS "public"."tipo_rol";
DROP TYPE IF EXISTS "public"."turno_dia";
DROP TYPE IF EXISTS "public"."turno_franja";
```