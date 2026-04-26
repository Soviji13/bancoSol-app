# Necesario añadir este parche a la base de datos para que funcione

**HAY CUATRO PARCHES**. Id haciéndolo en orden poco a poco.

Os vais a SQLEditor y ejecutais esta Query:

```SQL
-- 1. Borramos el trigger de la tabla donde no debería estar
DROP TRIGGER IF EXISTS trigger_valida_voluntario_relacion ON "public"."Voluntario";

-- 2. Corregimos la función para que use los nombres de columna de Tienda_turno
CREATE OR REPLACE FUNCTION "public"."validar_voluntario_tienda"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    id_entidad_del_responsable bigint;
BEGIN
    -- Obtenemos la entidad del responsable que intenta hacer la asignación
    -- Usamos responsable_entidad_id que es el nombre real en Tienda_turno
    SELECT entidad_id INTO id_entidad_del_responsable 
    FROM "Responsable_entidad" 
    WHERE id = NEW.responsable_entidad_id; 

    -- Verificamos si esa entidad tiene permiso para gestionar esa tienda específica
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda_colaborador"
        WHERE tienda_id = NEW.tienda_id 
          AND colaborador_id = id_entidad_del_responsable
    ) THEN
        RAISE EXCEPTION 'Operación cancelada: El responsable no puede asignar voluntarios en esta tienda porque su entidad no está vinculada a ella.'; 
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Creamos el trigger en la tabla correcta: Tienda_turno
-- Es aquí donde se produce la unión y donde tiene sentido validar
CREATE TRIGGER trigger_valida_voluntario_asignacion
BEFORE INSERT OR UPDATE ON "public"."Tienda_turno"
FOR EACH ROW EXECUTE FUNCTION "public"."validar_voluntario_tienda"(); 
```

Esta otra:

```SQL
-- 1. Borramos la restricción antigua que es demasiado cerrada
ALTER TABLE "public"."Tienda_colaborador" 
DROP CONSTRAINT "unique_tienda_colaborador";

-- 2. Creamos la nueva que permite repetir la dupla siempre que sea en campañas diferentes
ALTER TABLE "public"."Tienda_colaborador" 
ADD CONSTRAINT "unique_tienda_colaborador_campania" 
UNIQUE ("tienda_id", "colaborador_id", "campania_id");
```

Esta:

```SQL
-- AREGLO 3

-- 1. SOLUCIÓN AL MODELO DE CONTACTOS
-- Primero, eliminamos la restricción y la Foreign Key que ataban el contacto al Responsable de Entidad
ALTER TABLE "public"."Contacto" DROP CONSTRAINT IF EXISTS "Contacto_responsable_entidad_id_fkey";
ALTER TABLE "public"."Contacto" DROP CONSTRAINT IF EXISTS "Contacto_responsable_id_key";

-- Ahora eliminamos la columna sobrante en la tabla Contacto
ALTER TABLE "public"."Contacto" DROP COLUMN IF EXISTS "responsable_entidad_id";

-- Añadimos la nueva Foreign Key a Coordinador
ALTER TABLE "public"."Coordinador" ADD COLUMN "contacto_id" bigint;
ALTER TABLE "public"."Coordinador" ADD CONSTRAINT "Coordinador_contacto_id_fkey" 
    FOREIGN KEY ("contacto_id") REFERENCES "public"."Contacto"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- Añadimos la nueva Foreign Key a Responsable_entidad
ALTER TABLE "public"."Responsable_entidad" ADD COLUMN "contacto_id" bigint;
ALTER TABLE "public"."Responsable_entidad" ADD CONSTRAINT "Responsable_entidad_contacto_id_fkey" 
    FOREIGN KEY ("contacto_id") REFERENCES "public"."Contacto"("id") ON UPDATE CASCADE ON DELETE SET NULL;

-- Añadimos la nueva Foreign Key a Responsable_tienda
ALTER TABLE "public"."Responsable_tienda" ADD COLUMN "contacto_id" bigint;
ALTER TABLE "public"."Responsable_tienda" ADD CONSTRAINT "Responsable_tienda_contacto_id_fkey" 
    FOREIGN KEY ("contacto_id") REFERENCES "public"."Contacto"("id") ON UPDATE CASCADE ON DELETE SET NULL;


-- 2. SOLUCIÓN A LA VIOLACIÓN DRY EN TIENDA_TURNO
-- Eliminamos la Foreign Key y la columna del colaborador_id que era redundante
ALTER TABLE "public"."Tienda_turno" DROP CONSTRAINT IF EXISTS "Tienda_turno_colaborador_id_fkey";
ALTER TABLE "public"."Tienda_turno" DROP COLUMN IF EXISTS "colaborador_id";


-- 3. SOLUCIÓN A LA NOMENCLATURA FANTASMA 
-- Esto renombra el generador de IDs y la clave primaria
-- para que dejen de llamarse "Notificacion" y pasen a llamarse "Solicitud_cambio"
ALTER SEQUENCE IF EXISTS "public"."Notificacion_id_seq" RENAME TO "Solicitud_cambio_id_seq";
ALTER TABLE "public"."Solicitud_cambio" RENAME CONSTRAINT "Notificacion_pkey" TO "Solicitud_cambio_pkey";
```
Esta:

```SQL

CREATE OR REPLACE FUNCTION "public"."validar_tienda_responsable"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    id_entidad_del_responsable bigint;
BEGIN
    -- Usamos el nombre correcto: responsable_entidad_id
    SELECT entidad_id INTO id_entidad_del_responsable 
    FROM "Responsable_entidad" WHERE id = NEW.responsable_entidad_id; 

    -- (El resto de la lógica de validación se queda igual...)
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda_colaborador"
        WHERE tienda_id = NEW.tienda_id 
          AND colaborador_id = id_entidad_del_responsable
    ) THEN
        RAISE EXCEPTION 'Denegado: No puedes asignar este responsable porque su entidad no está vinculada a esta tienda.';
    END IF;

    RETURN NEW;
END;
$$;
```