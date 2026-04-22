De aquí no hace falta que hagáis nada. Dejo esto para que sepais las **restricciones y enums** que se han creado:

```SQL
-- Para que el año se ponga automáticamente en Campania

ALTER TABLE "Campania" 
ADD COLUMN anio int2 
GENERATED ALWAYS AS (EXTRACT(YEAR FROM fecha_inicio)::int2) STORED;

-- Para que una campaña no pueda tener dos cadenas repetidas o viceversa

ALTER TABLE "Campania_cadena" 
ADD CONSTRAINT unique_campania_cadena UNIQUE (campania_id, cadena_id);

-- Para que una entidad no pueda tener varias campañas al mismo tiempo

ALTER TABLE "Colaborador_campania" 
ADD CONSTRAINT unique_entidad_campania UNIQUE (entidad_id, campania_id);

-- Deben estar al menos Email o Teléfono en la tabla "Contacto"

ALTER TABLE "Contacto"
ADD CONSTRAINT "email_o_telefono_check" 
CHECK (email IS NOT NULL OR telefono IS NOT NULL);

-- La entidad colaboradora solo debe tener un contacto principal (puede no tener ninguno también)

CREATE UNIQUE INDEX "solo_un_responsable_con_contacto_principal" 
ON "Responsable_entidad" (entidad_id) 
WHERE (es_contacto_principal = true);

-- Solo una campaña activa al mismo tiempo

CREATE UNIQUE INDEX "solo_una_campania_activa" 
ON "public"."Campania" ("activa") 
WHERE ("activa" = true);

-- Enums de Solicitud_cambio / estado (ACEPTADO, NO_ACEPTADO, PENDIENTE)

CREATE TYPE "estado_cambio" AS ENUM ('ACEPTADO', 'NO_ACEPTADO', 'PENDIENTE');

ALTER TABLE "public"."Solicitud_cambio" 
ADD COLUMN "estado_solicitud" estado_cambio DEFAULT 'PENDIENTE';

-- Enums de Incidencia / estado (PENDIENTE, LEIDA, RESUELTA)

CREATE TYPE "estado_incidencia" AS ENUM ('PENDIENTE', 'LEIDA', 'RESUELTA');

ALTER TABLE "public"."Incidencia" 
ADD COLUMN "estado" estado_incidencia DEFAULT 'PENDIENTE';

-- En una misma campaña no puede estar el coordinador repetido y viceversa

ALTER TABLE "public"."Coordinador_campania" 
ADD CONSTRAINT "unique_coordinador_campania" UNIQUE ("coordinador_id", "campania_id");

-- Enums de Usuario / rol (ADMIN, COORDINADOR, RESPONSABLE_ENTIDAD, RESPONSABLE_TIENDA) - Por defecto, responsable de tienda

CREATE TYPE tipo_rol AS ENUM ('ADMIN', 'COORDINADOR', 'RESPONSABLE_ENTIDAD', 'RESPONSABLE_TIENDA');

ALTER TABLE "public"."Usuario" 
ADD COLUMN "rol" tipo_rol DEFAULT 'RESPONSABLE_TIENDA';

-- En un mismo distrito no puede estar el CP repetido y viceversa

ALTER TABLE "public"."Distrito_cp" 
ADD CONSTRAINT "unique_distrito_cp" UNIQUE ("distrito_id", "cp_id");

-- Si no es capital, no se puede poner distrito en dirección

ALTER TABLE "public"."Direccion" 
ADD CONSTRAINT "check_distrito_solo_en_capital" 
CHECK (
    -- Si es_capital es falso, el distrito TIENE que ser nulo
    (es_capital = false AND distrito_id IS NULL) 
    OR 
    -- Si es_capital es verdadero, permitimos que el distrito tenga valor
    (es_capital = true)
);

-- En una misma tienda no puede estar la campaña repetida y viceversa

ALTER TABLE "public"."Tienda_Campania" 
ADD CONSTRAINT "unique_tienda_campania" UNIQUE ("campania_id", "tienda_id");

-- En una misma tienda no puede estar una entidad colaboradora repetida y viceversa

ALTER TABLE "public"."Tienda_colaborador" 
ADD CONSTRAINT "unique_tienda_colaborador" UNIQUE ("tienda_id", "colaborador_id");

-- Restricción lógica: no se puede relacionar una tienda con una campaña si no están en la misma campaña. Tampoco se puede asociar un responsable de tienda que no esté en la misma campaña ni que su entidad participe con esa tienda. 

-- Restricción de la tienda y campaña

CREATE OR REPLACE FUNCTION validar_tienda_colaborador() 
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_valida_tienda_colab
BEFORE INSERT OR UPDATE ON "Tienda_colaborador"
FOR EACH ROW EXECUTE FUNCTION validar_tienda_colaborador();

-- Restricción del colaborador con la tienda

CREATE OR REPLACE FUNCTION validar_tienda_responsable() 
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_valida_tienda_resp
BEFORE INSERT OR UPDATE ON "Tienda_responsable"
FOR EACH ROW EXECUTE FUNCTION validar_tienda_responsable();

-- Verificar que el responsable de entidad ha asociado voluntarios a una tienda que él gestiona

CREATE OR REPLACE FUNCTION validar_voluntario_tienda() 
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Aplicamos el trigger a la tabla Voluntario
CREATE TRIGGER trigger_valida_voluntario_relacion
BEFORE INSERT OR UPDATE ON "Voluntario"
FOR EACH ROW EXECUTE FUNCTION validar_voluntario_tienda();

-- En Tienda_responsable: Un responsable solo se asigna una vez a esa tienda en esa campaña
ALTER TABLE "public"."Tienda_responsable" 
ADD CONSTRAINT "unique_tienda_responsable" UNIQUE ("tienda_id", "responsable_id", "campania_id");

-- Enums de Turno / dia (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES, SABADO) / franja_horaria (MAÑANA, TARDE)

-- Día
CREATE TYPE turno_dia AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO');

ALTER TABLE "public"."Turno" 
ADD COLUMN "dia" turno_dia;

-- Franja horaria
CREATE TYPE turno_franja AS ENUM ('MAÑANA', 'TARDE');

ALTER TABLE "public"."Turno" 
ADD COLUMN "franja_horaria" turno_franja;

-- Restricción: si hay horas sueltas, debe haber horario, y si no, debe estar vacío

ALTER TABLE "public"."Voluntario"
ADD CONSTRAINT "check_horas_sueltas_config"
CHECK (
    -- Caso A: Horas sueltas activas -> Horas obligatorias
    (horas_sueltas = true AND hora_comienzo IS NOT NULL AND hora_final IS NOT NULL) 
    OR 
    -- Caso B: Horas sueltas desactivadas -> Horas prohibidas (deben ser NULL)
    (horas_sueltas = false AND hora_comienzo IS NULL AND hora_final IS NULL)
);

-- En una tienda no puede haber dos voluntarios con el mismo turno

ALTER TABLE "public"."Tienda_turno"
ADD CONSTRAINT "unique_tienda_dia_franja" 
UNIQUE ("tienda_id", "turno_id");

-- La hora_comienzo debe ser anterior a la hora_final

ALTER TABLE "public"."Voluntario" 
ADD CONSTRAINT "check_orden_horas" 
CHECK (hora_comienzo < hora_final);

-- La fecha fin de la campaña debe ser posterior a la de fecha_inicio

ALTER TABLE "public"."Campania" 
ADD CONSTRAINT "check_fechas_campania" 
CHECK (fecha_fin > fecha_inicio);

```