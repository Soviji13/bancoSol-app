# Necesario añadir este parche a la base de datos para que funcione

**HAY DOS PARCHES**

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

Y esta otra:

```SQL
-- 1. Borramos la restricción antigua que es demasiado cerrada
ALTER TABLE "public"."Tienda_colaborador" 
DROP CONSTRAINT "unique_tienda_colaborador";

-- 2. Creamos la nueva que permite repetir la dupla siempre que sea en campañas diferentes
ALTER TABLE "public"."Tienda_colaborador" 
ADD CONSTRAINT "unique_tienda_colaborador_campania" 
UNIQUE ("tienda_id", "colaborador_id", "campania_id");
```
