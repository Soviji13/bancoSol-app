# GUÍA DE COMO USAR LOS COMANDOS DE GIT PASO A PASO PARA EL GRUPO

Leer con calma y **seguir las reglas** siempre.

Iré actualizando el main con el framework, **por ahora únicamente hacer el paso de preparación.** 

---

## Preparación (primera interacción)

1. Crea una carpeta en tu ordenador que se llame exactamente `bancoSol-app`

    <p style="margin:15px;"></p>

    - Importante: luego es un lío mover carpetas, así que ponla en un sitio donde siempre vayas a acceder sin cambiar, duplicar ni eliminar la ruta donde se ubica. Tampoco debes cambiar el nombre de la carpeta.

<p style="margin:15px;"></p>

2. Abre la carpeta con IntellIJ IDEA (o editor preferido)

<p style="margin:15px;"></p>

3. Debajo del todo, hay una pestaña que pone "Terminal", haz clic (si no te deja abrirla, abre una terminal aparte y accede exactamente a la ruta de la carpeta `.../bancoSol-app`)

<p style="margin:15px;"></p>

4. Vincula tu carpeta con el proyecto pegando estos comandos uno a uno por orden:

    <p style="margin:15px;"></p>

    - `git init`

    <p style="margin:15px;"></p>

    - `git remote add origin https://github.com/Soviji13/bancoSol-app.git`

    <p style="margin:15px;"></p>

    - `git fetch origin`

    <p style="margin:15px;"></p>

    - `git checkout TU_NOMBRE` (fran, sofia, suito o jose)

---

## Rutina diaria

### Antes de empezar a programar

<p style="margin:25px;"></p>

> Si os quereis asegurar de que estais en la rama correcta antes de empezar a algo, usar el comando `git branch`

<p style="margin:25px;"></p>

Para ver qué han hecho los demás en la versión oficial (`main`):

1. `git checkout main`

<p style="margin:15px;"></p>

2. `git pull origin main` (descarga lo último que funciona)

<p style="margin:15px;"></p>

3. **Vuelve a tu rama**: `git checkout TU_NOMBRE`. Ahora puedes ver lo que hay en el main y pegarlo a tu rama si hace falta (desde github web o app, puedes ver exactamente qué líneas de código, scripts y elementos que se han actualizado y borrado por si quieres más detalle)

### Al terminar de programar (para guardar cambios)

1. En la terminal escribe `git add .` (importante el punto final)

<p style="margin:15px;"></p>

2. Escribe `git commit -m "Parte x terminada/modificada/mejorada, etc."` (Poner el mensaje entre comillas, será lo que veremos los compañeros que has cambiado)

<p style="margin:15px;"></p>

3. Escribe `git push origin TU_NOMBRE`

## Cómo pasar código a TEST

<p style="margin:25px;"></p>

> ***Importante**: Para que no hayan conflictos, **AVISAR SIEMPRE por Whatsapp cuando alguien vaya a acceder a la rama test**. Mientras una persona haya dicho "Voy a subir X a test", **esperar a que confirme que ha terminado** y que ha guardado los cambios. Mientras tanto, no tocar.*

<p style="margin:25px;"></p>

**Siempre es necesario primero hacer el paso [al terminar de programar](#al-terminar-de-programar-para-guardar-cambios) antes.**

Como vamos a usar el método copiar y pegar manualmente para no liarnos con comandos difíciles:

0. Hacer siempre **`git pull origin test` al inicio** para actualizar los cambios de otras personas.

<p style="margin:15px;"></p>

1. Copia el código que te funciona en tu rama.

<p style="margin:15px;"></p>

2. Escribe en la terminal: `git checkout test`. Se te actualizará el directorio al test.

<p style="margin:15px;"></p>

3. Pega tu código nuevo en los archivos correspondientes. Si tienes que hacer copia-pega varias veces, vuelve a hacer `git checkout TU_NOMBRE`, copia lo que necesites y vuelve al paso 2.

<p style="margin:15px;"></p>

4. Debes estar seguro de que estás en la rama test. Una vez estés seguro, utiliza `git add.`, luego `git commit -m "Añadida parte de NOMBRE, funcionalidad X a test"` (acordarse de las comillas). Posteriormente `git push origin test`.

<p style="margin:15px;"></p>

5. Vuelve a tu rama siempre al acabar: `git checkout TU_NOMBRE`.

## REGLAS A SEGUIR

- **PROHIBIDO hacer `git push origin main`**. El main solo lo tocará una persona, por ejemplo Sofía. Se le debe avisar al administrador del main cuando se quiera subir algo YA COMPROBADO ANTES en test.

<p style="margin:15px;"></p>

- **PROHIBIDO trabajar en la rama de otro**

<p style="margin:15px;"></p>

- DIRECTORIO: **Todos los comandos** (excepto que de fallo) **se deben escribir en la terminal de IntellIJ.** En caso de fallo, desde terminal UTILIZANDO el directorio de la carpeta.

## Diccionario rápido

- **Pull**: "Descargar" o actualizar en tu ordenador lo que hay subido en el repositorio en Internet.

<p style="margin:15px;"></p>

- **Push**: "Subir" lo que se ha hecho desde el ordenador a Internet.

<p style="margin:15px;"></p>

- **Commit**: "Guardar" un punto de control y además explicar hasta dónde se ha hecho.

<p style="margin:15px;"></p>

- **Checkout**: "Saltar" de una rama a otra.



