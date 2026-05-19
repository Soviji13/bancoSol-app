-- 1. Añadimos la columna de la relación 1:1 (Cada tienda tiene un responsable único)
ALTER TABLE public."Tienda" 
ADD COLUMN responsable_tienda_id bigint UNIQUE;

-- 2. Creamos la restricción de clave foránea
ALTER TABLE public."Tienda" 
ADD CONSTRAINT fk_tienda_responsable_tienda 
FOREIGN KEY (responsable_tienda_id) 
REFERENCES public."Responsable_tienda"(id) 
ON DELETE SET NULL;

-- 3. Modificación de prueba: Asignamos el responsable de tienda con ID 1 a la Tienda 1
UPDATE public."Tienda" SET responsable_tienda_id = 1 WHERE id = 1;
