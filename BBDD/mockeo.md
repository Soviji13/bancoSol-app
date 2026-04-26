# Leer antes de mockear

## Antes de añadir los datos

Debeis desactivar temporalmente el RLS para evitar que los trigues de validación fallen por no poder leer las tablas debido a la falta de políticas:

```SQL
ALTER TABLE "public"."Tienda" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Colaborador_campania" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Campania_cadena" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_colaborador" DISABLE ROW LEVEL SECURITY;
```

## Después de añadir los datos

Volvemos a activarlo

```SQL
ALTER TABLE "public"."Tienda" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Colaborador_campania" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Campania_cadena" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Tienda_colaborador" ENABLE ROW LEVEL SECURITY;
```

NOTA: Esto no os va a afectar en SpringBoot, solo hay que hacerlo al introducir los datos directamente a la BBDD desde la consola. Es recomendable que volváis a activar el RLS