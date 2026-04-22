


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."estado_cambio" AS ENUM (
    'ACEPTADO',
    'NO_ACEPTADO',
    'PENDIENTE'
);


ALTER TYPE "public"."estado_cambio" OWNER TO "postgres";


CREATE TYPE "public"."estado_incidencia" AS ENUM (
    'PENDIENTE',
    'LEIDA',
    'RESUELTA'
);


ALTER TYPE "public"."estado_incidencia" OWNER TO "postgres";


CREATE TYPE "public"."tipo_rol" AS ENUM (
    'ADMIN',
    'COORDINADOR',
    'RESPONSABLE_ENTIDAD',
    'RESPONSABLE_TIENDA'
);


ALTER TYPE "public"."tipo_rol" OWNER TO "postgres";


CREATE TYPE "public"."turno_dia" AS ENUM (
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO'
);


ALTER TYPE "public"."turno_dia" OWNER TO "postgres";


CREATE TYPE "public"."turno_franja" AS ENUM (
    'MAÑANA',
    'TARDE'
);


ALTER TYPE "public"."turno_franja" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validar_tienda_colaborador"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    -- Comprobamos si la tienda y el colaborador coinciden en AL MENOS una campaña
    IF NOT EXISTS (
        SELECT 1 
        FROM "Colaborador_campania" cc
        JOIN "Campania_cadena" cmc ON cc.campania_id = cmc.campania_id
        JOIN "Tienda" t ON t.cadena_id = cmc.cadena_id
        WHERE cc.entidad_id = NEW.colaborador_id 
          AND t.id = NEW.tienda_id
          AND cc.participa = true
          AND cmc.participa = true
    ) THEN
        RAISE EXCEPTION 'Operación denegada: La entidad y la tienda no comparten ninguna campaña activa.';
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validar_tienda_colaborador"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validar_tienda_responsable"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    id_entidad_del_responsable bigint;
BEGIN
    -- 1. Obtenemos la entidad a la que pertenece el responsable
    SELECT entidad_id INTO id_entidad_del_responsable 
    FROM "Responsable_entidad" WHERE id = NEW.responsable_id;

    -- 2. VALIDACIÓN A: ¿La entidad del responsable está asociada a ESTA tienda?
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda_colaborador"
        WHERE tienda_id = NEW.tienda_id 
          AND colaborador_id = id_entidad_del_responsable
    ) THEN
        RAISE EXCEPTION 'Denegado: No puedes asignar este responsable porque su entidad no está vinculada a esta tienda.';
    END IF;

    -- 3. VALIDACIÓN B: ¿Coinciden todos en la campaña indicada (NEW.campania_id)?
    -- Check de la Tienda en la campaña
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda" t
        JOIN "Campania_cadena" cmc ON t.cadena_id = cmc.cadena_id
        WHERE t.id = NEW.tienda_id AND cmc.campania_id = NEW.campania_id
    ) THEN 
        RAISE EXCEPTION 'Denegado: La tienda no pertenece a la campaña seleccionada.';
    END IF;

    -- Check del Colaborador en la campaña
    IF NOT EXISTS (
        SELECT 1 FROM "Colaborador_campania"
        WHERE entidad_id = id_entidad_del_responsable 
          AND campania_id = NEW.campania_id 
          AND participa = true
    ) THEN
        RAISE EXCEPTION 'Denegado: La entidad del responsable no participa en esta campaña.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validar_tienda_responsable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."validar_voluntario_tienda"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    id_entidad_del_responsable bigint;
BEGIN
    -- 1. Buscamos a qué entidad pertenece el responsable que intenta crear el turno
    SELECT entidad_id INTO id_entidad_del_responsable 
    FROM "Responsable_entidad" 
    WHERE id = NEW.responsable_id;

    -- 2. Verificamos si ESA entidad tiene permiso (está en Tienda_colaborador) para ESA tienda
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda_colaborador"
        WHERE tienda_id = NEW.tienda_id 
          AND colaborador_id = id_entidad_del_responsable
    ) THEN
        RAISE EXCEPTION 'Operación cancelada: El responsable no puede gestionar voluntarios en esta tienda porque su entidad no está vinculada a ella.';
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."validar_voluntario_tienda"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Cadena" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "codigo" "text" NOT NULL
);


ALTER TABLE "public"."Cadena" OWNER TO "postgres";


COMMENT ON TABLE "public"."Cadena" IS 'La cadena de supermercados';



ALTER TABLE "public"."Cadena" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Cadena_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Campania" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "activa" boolean DEFAULT true NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_fin" "date" NOT NULL,
    "anio" smallint GENERATED ALWAYS AS ((EXTRACT(year FROM "fecha_inicio"))::smallint) STORED NOT NULL,
    CONSTRAINT "check_fechas_campania" CHECK (("fecha_fin" > "fecha_inicio"))
);


ALTER TABLE "public"."Campania" OWNER TO "postgres";


COMMENT ON TABLE "public"."Campania" IS 'Tabla que contiene información sobre la campaña. Está conectada a: [uno o varios coordinadores], [una o varia cadenas], [uno o varios colaboradores], [una o varias tiendas]';



CREATE TABLE IF NOT EXISTS "public"."Campania_cadena" (
    "id" bigint NOT NULL,
    "participa" boolean DEFAULT false NOT NULL,
    "cadena_id" bigint NOT NULL,
    "campania_id" bigint NOT NULL
);


ALTER TABLE "public"."Campania_cadena" OWNER TO "postgres";


COMMENT ON TABLE "public"."Campania_cadena" IS 'Relación M:M de campaña con cadena';



ALTER TABLE "public"."Campania_cadena" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Campania_cadena_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."Campania" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Campania_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Codigo_postal" (
    "id" bigint NOT NULL,
    "codigo" smallint NOT NULL
);


ALTER TABLE "public"."Codigo_postal" OWNER TO "postgres";


ALTER TABLE "public"."Codigo_postal" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Codigo_postal_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Colaborador_campania" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "entidad_id" bigint NOT NULL,
    "campania_id" bigint NOT NULL,
    "participa" boolean DEFAULT false NOT NULL,
    "observaciones" "text"
);


ALTER TABLE "public"."Colaborador_campania" OWNER TO "postgres";


COMMENT ON TABLE "public"."Colaborador_campania" IS 'Relación M:M de la entidad colaboradora con la Campaña. Almacena además atributos para poder tener un registro de tiempo';



ALTER TABLE "public"."Colaborador_campania" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Colaborador_campania_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Contacto" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "email" "text",
    "telefono" "text",
    "responsable_entidad_id" bigint NOT NULL,
    CONSTRAINT "email_o_telefono_check" CHECK ((("email" IS NOT NULL) OR ("telefono" IS NOT NULL)))
);


ALTER TABLE "public"."Contacto" OWNER TO "postgres";


COMMENT ON TABLE "public"."Contacto" IS 'Lo poseen la entidad colaboradora, el coordinadorCapitan, el responsable de tienda, y el responsable de entidad';



ALTER TABLE "public"."Contacto" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Contacto_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Coordinador" (
    "id" bigint NOT NULL,
    "area" "text" NOT NULL,
    "tiendas" smallint DEFAULT '0'::smallint NOT NULL,
    "permiso_modificar" boolean DEFAULT false NOT NULL,
    "usuario_id" bigint NOT NULL
);


ALTER TABLE "public"."Coordinador" OWNER TO "postgres";


COMMENT ON TABLE "public"."Coordinador" IS 'Tiene un contacto, es un usuario y gestiona principalmente la campaña';



CREATE TABLE IF NOT EXISTS "public"."Coordinador_campania" (
    "id" bigint NOT NULL,
    "campania_id" bigint NOT NULL,
    "coordinador_id" bigint NOT NULL
);


ALTER TABLE "public"."Coordinador_campania" OWNER TO "postgres";


ALTER TABLE "public"."Coordinador_campania" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Coordinador_campania_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."Coordinador" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Coordinador_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Direccion" (
    "id" bigint NOT NULL,
    "calle" "text",
    "numero" smallint,
    "datos_adicionales" "text",
    "es_capital" boolean DEFAULT false NOT NULL,
    "localidad_id" bigint,
    "cp_id" bigint,
    "distrito_id" bigint,
    CONSTRAINT "check_distrito_solo_en_capital" CHECK (((("es_capital" = false) AND ("distrito_id" IS NULL)) OR ("es_capital" = true)))
);


ALTER TABLE "public"."Direccion" OWNER TO "postgres";


ALTER TABLE "public"."Direccion" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Direccion_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Distrito" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL
);


ALTER TABLE "public"."Distrito" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Distrito_cp" (
    "id" bigint NOT NULL,
    "distrito_id" bigint NOT NULL,
    "cp_id" bigint NOT NULL
);


ALTER TABLE "public"."Distrito_cp" OWNER TO "postgres";


COMMENT ON TABLE "public"."Distrito_cp" IS 'Relación N:N de distrito a CP';



ALTER TABLE "public"."Distrito" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Distrito_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Entidad_colaboradora" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "estado_activo" boolean DEFAULT false NOT NULL,
    "observaciones" "text",
    "num_tiendas" smallint DEFAULT '0'::smallint NOT NULL,
    "num_turnos" smallint DEFAULT '0'::smallint NOT NULL,
    "num_voluntarios" smallint DEFAULT '0'::smallint NOT NULL,
    "coordinador_id" bigint NOT NULL,
    "direccion_id" bigint NOT NULL
);


ALTER TABLE "public"."Entidad_colaboradora" OWNER TO "postgres";


ALTER TABLE "public"."Entidad_colaboradora" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Entidad_colaboradora_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Incidencia" (
    "id" bigint NOT NULL,
    "fecha_hora" timestamp without time zone NOT NULL,
    "descripcion" "text",
    "asunto" "text" NOT NULL,
    "responsable_tienda_id" bigint,
    "estado" "public"."estado_incidencia" DEFAULT 'PENDIENTE'::"public"."estado_incidencia",
    "responsable_entidad_id" bigint
);


ALTER TABLE "public"."Incidencia" OWNER TO "postgres";


COMMENT ON TABLE "public"."Incidencia" IS 'La pueden reportar el responsable de tienda y el responsable de entidad';



COMMENT ON COLUMN "public"."Incidencia"."fecha_hora" IS 'Envía tanto la fecha como la hora de la incidencia';



ALTER TABLE "public"."Incidencia" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Incidencia_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Localidad" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "zona_geo_id" bigint
);


ALTER TABLE "public"."Localidad" OWNER TO "postgres";


ALTER TABLE "public"."Localidad" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Localidad_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Solicitud_cambio" (
    "id" bigint NOT NULL,
    "asunto" "text" NOT NULL,
    "descripcion" "text",
    "interfaz" "text" NOT NULL,
    "coordinador_id" bigint NOT NULL,
    "estado_solicitud" "public"."estado_cambio" DEFAULT 'PENDIENTE'::"public"."estado_cambio"
);


ALTER TABLE "public"."Solicitud_cambio" OWNER TO "postgres";


COMMENT ON TABLE "public"."Solicitud_cambio" IS 'Sirve para enviar una notificación que se queda en el historial';



ALTER TABLE "public"."Solicitud_cambio" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Notificacion_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Responsable_entidad" (
    "id" bigint NOT NULL,
    "entidad_id" bigint NOT NULL,
    "es_contacto_principal" boolean DEFAULT false NOT NULL,
    "usuario_id" bigint NOT NULL
);


ALTER TABLE "public"."Responsable_entidad" OWNER TO "postgres";


COMMENT ON TABLE "public"."Responsable_entidad" IS 'Este se dedica a gestionar la plantilla de turnos de los voluntarios, a gestionar las tiendas, tienen un único contacto y son un usuario';



ALTER TABLE "public"."Responsable_entidad" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Responsable_entidad_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Responsable_tienda" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "usuario_id" bigint NOT NULL
);


ALTER TABLE "public"."Responsable_tienda" OWNER TO "postgres";


ALTER TABLE "public"."Responsable_tienda" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Responsable_tienda_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Tienda" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL,
    "puntos_recogida" smallint DEFAULT '0'::smallint NOT NULL,
    "es_franquicia" boolean DEFAULT false NOT NULL,
    "cadena_id" bigint NOT NULL,
    "direccion_id" bigint NOT NULL
);


ALTER TABLE "public"."Tienda" OWNER TO "postgres";


COMMENT ON TABLE "public"."Tienda" IS 'Son distintas tiendas pertenecientes a una misma cadena';



CREATE TABLE IF NOT EXISTS "public"."Tienda_campania" (
    "id" bigint NOT NULL,
    "tienda_id" bigint NOT NULL,
    "campania_id" bigint NOT NULL
);


ALTER TABLE "public"."Tienda_campania" OWNER TO "postgres";


COMMENT ON TABLE "public"."Tienda_campania" IS 'Relación N:N de tienda con la campaña (si existe esta tabla, implica que la tienda participa en esa campaña)';



ALTER TABLE "public"."Tienda_campania" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tienda_campania_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Tienda_colaborador" (
    "id" bigint NOT NULL,
    "tienda_id" bigint NOT NULL,
    "colaborador_id" bigint NOT NULL,
    "campania_id" bigint NOT NULL
);


ALTER TABLE "public"."Tienda_colaborador" OWNER TO "postgres";


COMMENT ON TABLE "public"."Tienda_colaborador" IS 'Relación N:N de tienda a entidad colaboradora';



ALTER TABLE "public"."Tienda_colaborador" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tienda_colaborador_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."Tienda" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tienda_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Tienda_responsable" (
    "id" bigint NOT NULL,
    "tienda_id" bigint NOT NULL,
    "responsable_entidad_id" bigint NOT NULL,
    "campania_id" bigint NOT NULL
);


ALTER TABLE "public"."Tienda_responsable" OWNER TO "postgres";


COMMENT ON TABLE "public"."Tienda_responsable" IS 'Relación N:N de tienda con un responsable de entidad';



ALTER TABLE "public"."Tienda_responsable" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tienda_responsable_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Tienda_turno" (
    "id" bigint NOT NULL,
    "responsable_entidad_id" bigint NOT NULL,
    "colaborador_id" bigint NOT NULL,
    "turno_id" bigint,
    "tienda_id" bigint NOT NULL,
    "voluntario_id" bigint NOT NULL
);


ALTER TABLE "public"."Tienda_turno" OWNER TO "postgres";


COMMENT ON TABLE "public"."Tienda_turno" IS 'Esta es una relación N:N entre turno y tienda. Un voluntario puede tener varios turnos, entonces asocia cada turno correspondiente de cada voluntario a una tienda. Por otro lado, el responsable asociado a esta tabla es el que puede asignar.';



ALTER TABLE "public"."Tienda_turno" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Tienda_turno_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Turno" (
    "id" bigint NOT NULL,
    "campania_id" bigint NOT NULL,
    "dia" "public"."turno_dia",
    "franja_horaria" "public"."turno_franja"
);


ALTER TABLE "public"."Turno" OWNER TO "postgres";


ALTER TABLE "public"."Turno" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Turno_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Usuario" (
    "id" bigint NOT NULL,
    "email" "text" NOT NULL,
    "contrasenia" "text" NOT NULL,
    "rol" "public"."tipo_rol" DEFAULT 'RESPONSABLE_TIENDA'::"public"."tipo_rol"
);


ALTER TABLE "public"."Usuario" OWNER TO "postgres";


ALTER TABLE "public"."Usuario" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Usuario_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Voluntario" (
    "id" bigint NOT NULL,
    "responsable_entidad_id" bigint NOT NULL,
    "observaciones" "text",
    "horas_sueltas" boolean DEFAULT false NOT NULL,
    "hora_comienzo" time without time zone,
    "hora_final" time without time zone,
    CONSTRAINT "check_horas_sueltas_config" CHECK (((("horas_sueltas" = true) AND ("hora_comienzo" IS NOT NULL) AND ("hora_final" IS NOT NULL)) OR (("horas_sueltas" = false) AND ("hora_comienzo" IS NULL) AND ("hora_final" IS NULL)))),
    CONSTRAINT "check_orden_horas" CHECK (("hora_comienzo" < "hora_final"))
);


ALTER TABLE "public"."Voluntario" OWNER TO "postgres";


COMMENT ON TABLE "public"."Voluntario" IS 'El responsable de entidad gestiona los voluntarios. Si el voluntario tiene el atributo de Horas Sueltas activado, se le puede asignar una hora_comienzo y una hora_final personalizada. El voluntario debe estar asociado a un responsable de entidad, si no, no puede existir.';



ALTER TABLE "public"."Voluntario" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Voluntario_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."Zona_geografica" (
    "id" bigint NOT NULL,
    "nombre" "text" NOT NULL
);


ALTER TABLE "public"."Zona_geografica" OWNER TO "postgres";


ALTER TABLE "public"."Zona_geografica" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."Zona_geografica_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."Distrito_cp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."distrito_cp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."Cadena"
    ADD CONSTRAINT "Cadena_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."Cadena"
    ADD CONSTRAINT "Cadena_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."Cadena"
    ADD CONSTRAINT "Cadena_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Campania_cadena"
    ADD CONSTRAINT "Campania_cadena_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Campania"
    ADD CONSTRAINT "Campania_fecha_fin_key" UNIQUE ("fecha_fin");



ALTER TABLE ONLY "public"."Campania"
    ADD CONSTRAINT "Campania_fecha_inicio_key" UNIQUE ("fecha_inicio");



ALTER TABLE ONLY "public"."Campania"
    ADD CONSTRAINT "Campania_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Codigo_postal"
    ADD CONSTRAINT "Codigo_postal_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "public"."Codigo_postal"
    ADD CONSTRAINT "Codigo_postal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Colaborador_campania"
    ADD CONSTRAINT "Colaborador_campania_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Contacto"
    ADD CONSTRAINT "Contacto_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."Contacto"
    ADD CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Contacto"
    ADD CONSTRAINT "Contacto_responsable_id_key" UNIQUE ("responsable_entidad_id");



ALTER TABLE ONLY "public"."Contacto"
    ADD CONSTRAINT "Contacto_telefono_key" UNIQUE ("telefono");



ALTER TABLE ONLY "public"."Coordinador_campania"
    ADD CONSTRAINT "Coordinador_campania_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Coordinador"
    ADD CONSTRAINT "Coordinador_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Coordinador"
    ADD CONSTRAINT "Coordinador_usuario_id_key" UNIQUE ("usuario_id");



ALTER TABLE ONLY "public"."Direccion"
    ADD CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Distrito"
    ADD CONSTRAINT "Distrito_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."Distrito"
    ADD CONSTRAINT "Distrito_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Entidad_colaboradora"
    ADD CONSTRAINT "Entidad_colaboradora_direccion_id_key" UNIQUE ("direccion_id");



ALTER TABLE ONLY "public"."Entidad_colaboradora"
    ADD CONSTRAINT "Entidad_colaboradora_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Incidencia"
    ADD CONSTRAINT "Incidencia_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Localidad"
    ADD CONSTRAINT "Localidad_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."Localidad"
    ADD CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Solicitud_cambio"
    ADD CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Responsable_entidad"
    ADD CONSTRAINT "Responsable_entidad_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Responsable_entidad"
    ADD CONSTRAINT "Responsable_entidad_usuario_id_key" UNIQUE ("usuario_id");



ALTER TABLE ONLY "public"."Responsable_tienda"
    ADD CONSTRAINT "Responsable_tienda_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Responsable_tienda"
    ADD CONSTRAINT "Responsable_tienda_usuario_id_key" UNIQUE ("usuario_id");



ALTER TABLE ONLY "public"."Tienda_campania"
    ADD CONSTRAINT "Tienda_campania_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tienda_colaborador"
    ADD CONSTRAINT "Tienda_colaborador_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tienda"
    ADD CONSTRAINT "Tienda_direccion_id_key" UNIQUE ("direccion_id");



ALTER TABLE ONLY "public"."Tienda"
    ADD CONSTRAINT "Tienda_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tienda_responsable"
    ADD CONSTRAINT "Tienda_responsable_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Turno"
    ADD CONSTRAINT "Turno_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Usuario"
    ADD CONSTRAINT "Usuario_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."Usuario"
    ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Voluntario"
    ADD CONSTRAINT "Voluntario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Zona_geografica"
    ADD CONSTRAINT "Zona_geografica_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "public"."Zona_geografica"
    ADD CONSTRAINT "Zona_geografica_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Distrito_cp"
    ADD CONSTRAINT "distrito_cp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Campania_cadena"
    ADD CONSTRAINT "unique_campania_cadena" UNIQUE ("campania_id", "cadena_id");



ALTER TABLE ONLY "public"."Coordinador_campania"
    ADD CONSTRAINT "unique_coordinador_campania" UNIQUE ("coordinador_id", "campania_id");



ALTER TABLE ONLY "public"."Distrito_cp"
    ADD CONSTRAINT "unique_distrito_cp" UNIQUE ("distrito_id", "cp_id");



ALTER TABLE ONLY "public"."Colaborador_campania"
    ADD CONSTRAINT "unique_entidad_campania" UNIQUE ("entidad_id", "campania_id");



ALTER TABLE ONLY "public"."Tienda_colaborador"
    ADD CONSTRAINT "unique_tienda_colaborador" UNIQUE ("tienda_id", "colaborador_id");



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "unique_tienda_dia_franja" UNIQUE ("tienda_id", "turno_id");



ALTER TABLE ONLY "public"."Tienda_responsable"
    ADD CONSTRAINT "unique_tienda_responsable" UNIQUE ("tienda_id", "responsable_entidad_id", "campania_id");



CREATE UNIQUE INDEX "solo_un_responsable_con_contacto_principal" ON "public"."Responsable_entidad" USING "btree" ("entidad_id") WHERE ("es_contacto_principal" = true);



CREATE UNIQUE INDEX "solo_una_campania_activa" ON "public"."Campania" USING "btree" ("activa") WHERE ("activa" = true);



CREATE OR REPLACE TRIGGER "trigger_valida_tienda_colab" BEFORE INSERT OR UPDATE ON "public"."Tienda_colaborador" FOR EACH ROW EXECUTE FUNCTION "public"."validar_tienda_colaborador"();



CREATE OR REPLACE TRIGGER "trigger_valida_tienda_resp" BEFORE INSERT OR UPDATE ON "public"."Tienda_responsable" FOR EACH ROW EXECUTE FUNCTION "public"."validar_tienda_responsable"();



CREATE OR REPLACE TRIGGER "trigger_valida_voluntario_relacion" BEFORE INSERT OR UPDATE ON "public"."Voluntario" FOR EACH ROW EXECUTE FUNCTION "public"."validar_voluntario_tienda"();



ALTER TABLE ONLY "public"."Campania_cadena"
    ADD CONSTRAINT "Campania_cadena_cadena_id_fkey" FOREIGN KEY ("cadena_id") REFERENCES "public"."Cadena"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Campania_cadena"
    ADD CONSTRAINT "Campania_cadena_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Colaborador_campania"
    ADD CONSTRAINT "Colaborador_campania_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Colaborador_campania"
    ADD CONSTRAINT "Colaborador_campania_entidad_id_fkey" FOREIGN KEY ("entidad_id") REFERENCES "public"."Entidad_colaboradora"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Contacto"
    ADD CONSTRAINT "Contacto_responsable_entidad_id_fkey" FOREIGN KEY ("responsable_entidad_id") REFERENCES "public"."Responsable_entidad"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Coordinador_campania"
    ADD CONSTRAINT "Coordinador_campania_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Coordinador_campania"
    ADD CONSTRAINT "Coordinador_campania_coordinador_id_fkey" FOREIGN KEY ("coordinador_id") REFERENCES "public"."Coordinador"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Coordinador"
    ADD CONSTRAINT "Coordinador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Direccion"
    ADD CONSTRAINT "Direccion_cp_id_fkey" FOREIGN KEY ("cp_id") REFERENCES "public"."Codigo_postal"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Direccion"
    ADD CONSTRAINT "Direccion_distrito_id_fkey" FOREIGN KEY ("distrito_id") REFERENCES "public"."Distrito"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Direccion"
    ADD CONSTRAINT "Direccion_localidad_id_fkey" FOREIGN KEY ("localidad_id") REFERENCES "public"."Localidad"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Entidad_colaboradora"
    ADD CONSTRAINT "Entidad_colaboradora_coordinador_id_fkey" FOREIGN KEY ("coordinador_id") REFERENCES "public"."Coordinador"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Entidad_colaboradora"
    ADD CONSTRAINT "Entidad_colaboradora_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "public"."Direccion"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Incidencia"
    ADD CONSTRAINT "Incidencia_responsable_entidad_id_fkey" FOREIGN KEY ("responsable_entidad_id") REFERENCES "public"."Responsable_entidad"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Incidencia"
    ADD CONSTRAINT "Incidencia_responsable_tienda_id_fkey" FOREIGN KEY ("responsable_tienda_id") REFERENCES "public"."Responsable_tienda"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Localidad"
    ADD CONSTRAINT "Localidad_zona_geo_id_fkey" FOREIGN KEY ("zona_geo_id") REFERENCES "public"."Zona_geografica"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Solicitud_cambio"
    ADD CONSTRAINT "Notificacion_coordinador_id_fkey" FOREIGN KEY ("coordinador_id") REFERENCES "public"."Coordinador"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Responsable_entidad"
    ADD CONSTRAINT "Responsable_entidad_entidad_id_fkey" FOREIGN KEY ("entidad_id") REFERENCES "public"."Entidad_colaboradora"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Responsable_entidad"
    ADD CONSTRAINT "Responsable_entidad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Responsable_tienda"
    ADD CONSTRAINT "Responsable_tienda_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda"
    ADD CONSTRAINT "Tienda_cadena_id_fkey" FOREIGN KEY ("cadena_id") REFERENCES "public"."Cadena"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_campania"
    ADD CONSTRAINT "Tienda_campania_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_campania"
    ADD CONSTRAINT "Tienda_campania_tienda_id_fkey" FOREIGN KEY ("tienda_id") REFERENCES "public"."Tienda"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_colaborador"
    ADD CONSTRAINT "Tienda_colaborador_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_colaborador"
    ADD CONSTRAINT "Tienda_colaborador_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "public"."Entidad_colaboradora"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_colaborador"
    ADD CONSTRAINT "Tienda_colaborador_tienda_id_fkey" FOREIGN KEY ("tienda_id") REFERENCES "public"."Tienda"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda"
    ADD CONSTRAINT "Tienda_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "public"."Direccion"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Tienda_responsable"
    ADD CONSTRAINT "Tienda_responsable_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_responsable"
    ADD CONSTRAINT "Tienda_responsable_responsable_entidad_id_fkey" FOREIGN KEY ("responsable_entidad_id") REFERENCES "public"."Responsable_entidad"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_responsable"
    ADD CONSTRAINT "Tienda_responsable_tienda_id_fkey" FOREIGN KEY ("tienda_id") REFERENCES "public"."Tienda"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_colaborador_id_fkey" FOREIGN KEY ("colaborador_id") REFERENCES "public"."Entidad_colaboradora"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_responsable_entidad_id_fkey" FOREIGN KEY ("responsable_entidad_id") REFERENCES "public"."Responsable_entidad"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_tienda_id_fkey" FOREIGN KEY ("tienda_id") REFERENCES "public"."Tienda"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "public"."Turno"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Tienda_turno"
    ADD CONSTRAINT "Tienda_turno_voluntario_id_fkey" FOREIGN KEY ("voluntario_id") REFERENCES "public"."Voluntario"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Turno"
    ADD CONSTRAINT "Turno_campania_id_fkey" FOREIGN KEY ("campania_id") REFERENCES "public"."Campania"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Voluntario"
    ADD CONSTRAINT "Voluntario_responsable_entidad_id_fkey" FOREIGN KEY ("responsable_entidad_id") REFERENCES "public"."Responsable_entidad"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Distrito_cp"
    ADD CONSTRAINT "distrito_cp_cp_id_fkey" FOREIGN KEY ("cp_id") REFERENCES "public"."Codigo_postal"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Distrito_cp"
    ADD CONSTRAINT "distrito_cp_distrito_id_fkey" FOREIGN KEY ("distrito_id") REFERENCES "public"."Distrito"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."Cadena" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Campania" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Campania_cadena" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Codigo_postal" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Colaborador_campania" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Contacto" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Coordinador" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Coordinador_campania" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Direccion" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Distrito" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Distrito_cp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Entidad_colaboradora" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Incidencia" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Localidad" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Responsable_entidad" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Responsable_tienda" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Solicitud_cambio" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tienda" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tienda_campania" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tienda_colaborador" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tienda_responsable" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Tienda_turno" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Turno" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Voluntario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Zona_geografica" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validar_tienda_colaborador"() TO "anon";
GRANT ALL ON FUNCTION "public"."validar_tienda_colaborador"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validar_tienda_colaborador"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validar_tienda_responsable"() TO "anon";
GRANT ALL ON FUNCTION "public"."validar_tienda_responsable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validar_tienda_responsable"() TO "service_role";



GRANT ALL ON FUNCTION "public"."validar_voluntario_tienda"() TO "anon";
GRANT ALL ON FUNCTION "public"."validar_voluntario_tienda"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."validar_voluntario_tienda"() TO "service_role";


















GRANT ALL ON TABLE "public"."Cadena" TO "anon";
GRANT ALL ON TABLE "public"."Cadena" TO "authenticated";
GRANT ALL ON TABLE "public"."Cadena" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Cadena_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Cadena_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Cadena_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Campania" TO "anon";
GRANT ALL ON TABLE "public"."Campania" TO "authenticated";
GRANT ALL ON TABLE "public"."Campania" TO "service_role";



GRANT ALL ON TABLE "public"."Campania_cadena" TO "anon";
GRANT ALL ON TABLE "public"."Campania_cadena" TO "authenticated";
GRANT ALL ON TABLE "public"."Campania_cadena" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Campania_cadena_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Campania_cadena_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Campania_cadena_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Campania_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Campania_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Campania_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Codigo_postal" TO "anon";
GRANT ALL ON TABLE "public"."Codigo_postal" TO "authenticated";
GRANT ALL ON TABLE "public"."Codigo_postal" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Codigo_postal_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Codigo_postal_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Codigo_postal_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Colaborador_campania" TO "anon";
GRANT ALL ON TABLE "public"."Colaborador_campania" TO "authenticated";
GRANT ALL ON TABLE "public"."Colaborador_campania" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Colaborador_campania_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Colaborador_campania_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Colaborador_campania_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Contacto" TO "anon";
GRANT ALL ON TABLE "public"."Contacto" TO "authenticated";
GRANT ALL ON TABLE "public"."Contacto" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Contacto_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Contacto_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Contacto_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Coordinador" TO "anon";
GRANT ALL ON TABLE "public"."Coordinador" TO "authenticated";
GRANT ALL ON TABLE "public"."Coordinador" TO "service_role";



GRANT ALL ON TABLE "public"."Coordinador_campania" TO "anon";
GRANT ALL ON TABLE "public"."Coordinador_campania" TO "authenticated";
GRANT ALL ON TABLE "public"."Coordinador_campania" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Coordinador_campania_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Coordinador_campania_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Coordinador_campania_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Coordinador_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Coordinador_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Coordinador_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Direccion" TO "anon";
GRANT ALL ON TABLE "public"."Direccion" TO "authenticated";
GRANT ALL ON TABLE "public"."Direccion" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Direccion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Direccion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Direccion_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Distrito" TO "anon";
GRANT ALL ON TABLE "public"."Distrito" TO "authenticated";
GRANT ALL ON TABLE "public"."Distrito" TO "service_role";



GRANT ALL ON TABLE "public"."Distrito_cp" TO "anon";
GRANT ALL ON TABLE "public"."Distrito_cp" TO "authenticated";
GRANT ALL ON TABLE "public"."Distrito_cp" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Distrito_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Distrito_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Distrito_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Entidad_colaboradora" TO "anon";
GRANT ALL ON TABLE "public"."Entidad_colaboradora" TO "authenticated";
GRANT ALL ON TABLE "public"."Entidad_colaboradora" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Entidad_colaboradora_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Entidad_colaboradora_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Entidad_colaboradora_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Incidencia" TO "anon";
GRANT ALL ON TABLE "public"."Incidencia" TO "authenticated";
GRANT ALL ON TABLE "public"."Incidencia" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Incidencia_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Incidencia_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Incidencia_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Localidad" TO "anon";
GRANT ALL ON TABLE "public"."Localidad" TO "authenticated";
GRANT ALL ON TABLE "public"."Localidad" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Localidad_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Localidad_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Localidad_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Solicitud_cambio" TO "anon";
GRANT ALL ON TABLE "public"."Solicitud_cambio" TO "authenticated";
GRANT ALL ON TABLE "public"."Solicitud_cambio" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Notificacion_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Notificacion_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Notificacion_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Responsable_entidad" TO "anon";
GRANT ALL ON TABLE "public"."Responsable_entidad" TO "authenticated";
GRANT ALL ON TABLE "public"."Responsable_entidad" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Responsable_entidad_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Responsable_entidad_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Responsable_entidad_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Responsable_tienda" TO "anon";
GRANT ALL ON TABLE "public"."Responsable_tienda" TO "authenticated";
GRANT ALL ON TABLE "public"."Responsable_tienda" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Responsable_tienda_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Responsable_tienda_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Responsable_tienda_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Tienda" TO "anon";
GRANT ALL ON TABLE "public"."Tienda" TO "authenticated";
GRANT ALL ON TABLE "public"."Tienda" TO "service_role";



GRANT ALL ON TABLE "public"."Tienda_campania" TO "anon";
GRANT ALL ON TABLE "public"."Tienda_campania" TO "authenticated";
GRANT ALL ON TABLE "public"."Tienda_campania" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tienda_campania_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tienda_campania_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tienda_campania_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Tienda_colaborador" TO "anon";
GRANT ALL ON TABLE "public"."Tienda_colaborador" TO "authenticated";
GRANT ALL ON TABLE "public"."Tienda_colaborador" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tienda_colaborador_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tienda_colaborador_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tienda_colaborador_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tienda_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tienda_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tienda_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Tienda_responsable" TO "anon";
GRANT ALL ON TABLE "public"."Tienda_responsable" TO "authenticated";
GRANT ALL ON TABLE "public"."Tienda_responsable" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tienda_responsable_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tienda_responsable_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tienda_responsable_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Tienda_turno" TO "anon";
GRANT ALL ON TABLE "public"."Tienda_turno" TO "authenticated";
GRANT ALL ON TABLE "public"."Tienda_turno" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Tienda_turno_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Tienda_turno_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Tienda_turno_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Turno" TO "anon";
GRANT ALL ON TABLE "public"."Turno" TO "authenticated";
GRANT ALL ON TABLE "public"."Turno" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Turno_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Turno_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Turno_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Usuario" TO "anon";
GRANT ALL ON TABLE "public"."Usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."Usuario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Usuario_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Usuario_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Usuario_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Voluntario" TO "anon";
GRANT ALL ON TABLE "public"."Voluntario" TO "authenticated";
GRANT ALL ON TABLE "public"."Voluntario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Voluntario_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Voluntario_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Voluntario_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."Zona_geografica" TO "anon";
GRANT ALL ON TABLE "public"."Zona_geografica" TO "authenticated";
GRANT ALL ON TABLE "public"."Zona_geografica" TO "service_role";



GRANT ALL ON SEQUENCE "public"."Zona_geografica_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."Zona_geografica_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."Zona_geografica_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."distrito_cp_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."distrito_cp_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."distrito_cp_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































