# Necesario añadir este parche a la base de datos para que funcione

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
    WHERE id = NEW.responsable_entidad_id; [cite: 450]

    -- Verificamos si esa entidad tiene permiso para gestionar esa tienda específica
    IF NOT EXISTS (
        SELECT 1 FROM "Tienda_colaborador"
        WHERE tienda_id = NEW.tienda_id 
          AND colaborador_id = id_entidad_del_responsable
    ) THEN
        RAISE EXCEPTION 'Operación cancelada: El responsable no puede asignar voluntarios en esta tienda porque su entidad no está vinculada a ella.'; [cite: 450]
    END IF;

    RETURN NEW;
END;
$$;

-- 3. Creamos el trigger en la tabla correcta: Tienda_turno
-- Es aquí donde se produce la unión y donde tiene sentido validar
CREATE TRIGGER trigger_valida_voluntario_asignacion
BEFORE INSERT OR UPDATE ON "public"."Tienda_turno"
FOR EACH ROW EXECUTE FUNCTION "public"."validar_voluntario_tienda"(); [cite: 450]
```