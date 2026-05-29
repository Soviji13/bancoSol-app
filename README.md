# Parte React BancoSol

1. Descargar la carpeta entera
2. Leer `README.md` con calma
3. Empezar a programar **siguiendo las reglas** descritas en este archivo.
4. **Importante**: En la guía de github, en vez de hacer las cosas a `main`, se harán a `react`

#### Cualquier incidente o complicación de mi parte al implementar los roles o al unir el código que sea debido a no haber seguido las reglas, será responsabilidad del miembro al que le tocó esa parte arreglarlo él mismo


**Índice (reglas):**

1. [Estructura de archivos](#estructura-de-archivos-modificables)
2. [Cómo utilizar `gestionVentanas.jsx`](#cómo-utilizar-gestionventanasjsx)
3. [Gestión de roles](#gestión-de-roles)
4. [Login](#login)
5. [Conexión a API](#conexión-a-api)

Los **únicos directorios o archivos modificables** serán los que se muestren en el apartado [Estructura de Archivos](#estructura-de-archivos-modificables). De hecho, **es necesario modificarlos para que os funcione vuestra parte**

> Muy recomendable leer el apartado explicando cómo utilizar `gestionVentanas.jsx`.

*Recordatorio: Para lanzar un proyecto de react necesitamos lanzar en el mismo directorio `npm install`y `npm run dev` en el mismo orden escrito. Posteriormente, accedemos desde `http://localhost:5173`*

---

## Estructura de archivos (modificables)

- `src/campanias/`: Directorio donde irá todo el código relacionado con las campañas. He dejado un componente `main` para que podáis partir desde él sin tener que vincularlo. **No modificar el nombre del componente**

- `src/voluntarios/`: Directorio donde irá todo el código relacionado con los voluntarios. He dejado un componente `main` para que podáis partir desde él sin tener que vincularlo. **No modificar el nombre del componente**

- `src/gestionVentanas.jsx`: Archivo donde se debe **gestionar qué se ve en el menú lateral y en la ventana principal. No gestionar la lógica de esto en vuestros directorios, solo aquí**. Recomendable para saber cómo manejarlo en este [apartado](#cómo-utilizar-gestionventanasjsx). 

- `public/`: Aquí deben ir archivos estáticos: **estilos `.css` e imágenes** normalmente.

>**En `gestionVentanas.jsx` sólo se pueden modificar los componentes especificados**

---

## Cómo utilizar `gestionVentanas.jsx`

**IMPORTANTE: DOCUMENTAR TODO LO QUE MODIFIQUÉIS COMENTANDO Y EXPLICANDO PARA PODER REALIZAR UNA POSTERIOR INTEGRACIÓN CORRECTAMENTE**

### Estados importantes

- `lateral`: Indica qué menú lateral se debe mostrar (psrte izquierda). **Manejaremos este valor con `manejaContenidoLateral("contenido")`.** Importante que la entrada sea **tipo String**

- `contenidoIniial`: Indica qué contenido inicial se debe mostrar (parte derecha). **Manejaremos este valor con `manejaContenidoInicial("contenido")`.** Importante que la entrada sea **tipo String**

**No crear nuevos manejadores para estos cambios de estado en concreto**

**Ejemplo de uso**: Queremos que al pulsar un botón, el menú lateral cambie a filtros de tiendas

```jsx
<button onClick(() => {
    manejaContenidoLateral("filtro-tiendas");
})>Filtro de Tiendas</button>
```

> Nota importante: Esto de por sí solo no funciona, para que funcione, debemos realizar el siguiente apartado.

### Funciones/Componentes que se deben modificar

**ESTAS FUNCIONES SERÁN LAS QUE MAPEARÁN EL MENÚ LATERAL O INICIAL. NO GESTIONAR ESTOS MAPEOS EN OTRA FUNCIÓN**

> Nota: No eliminar nada de lo que ya hay dentro, excepto el siguiente bloque:

```jsx
{tipoContenido === "test" && <Ok 
        manejaContenidoLateral={manejaContenidoLateral}
        manejaContenidoInicial={manejaContenidoInicial}
    />
}
```

- `MenuLateral`: Gestiona cómo varía el contenido lateral (parte izquierda).Solo debemos manejarlo de la siguiente forma, **siempre dentro del `div`**

**Ejemplo de uso**: Queremos que al pulsar un botón, el menú lateral cambie a filtros de tiendas

```jsx
    export function MenuLateral ({tipoLateral, manejaContenidoInicial, manejaContenidoLateral, contenidoInicial}) {
    return (
        <div className="contenedor_contenido contenedor_menu">
            {/*...código*/} 
            {tipoLateral === "filtro-tiendas" && 
                <FiltroTiendas manejaContenidoInicial={manejaContenidoInicial}/>
            }
            {/*código...*/} 
        </div>
    )
}
```
> Ahora deberíamos crear en nuestro respectivo directorio el componente `FiltroTiendas``

> *Pasamos `manejaContenidoInicial` por props en este caso, porque queremos manejar cómo va a variar el menú de la derecha según los filtros que apliquemos. Si quisiéramos modificar cualquier otra cosa, habría que crear manejadores o usar `manejaContenidoLateral`, si queremos modificar también el menú lateral*

- `ContenidoInicial`: Gestiona cómo varía el contenido inicial (parte derecha), se usa igual que `MenuLateral`y **siempre dentro del `div`**

### Ejemplos aplicados

Tenéis el ejemplo de `Ok` o el de `NavegadorMenus` dentro del mismo archivo para que entendáis cómo funciona la lógica.

---

## Gestión de roles

Debéis **comentar en qué secciones de vuestro código se deben aplicar los roles y con qué lógica.** 

**La lógica la implemento yo**, pero para no cometer errores o evitar saltarme algo, intentad dejar claro **dónde pueden variar los permisos según el rol, y cómo varían.**

---

## Login

- Entrar con user `prueba` y contraseña `prueba`.

Hay más usuarios creados para probar los roles, pero para vuestra implementación, lo más simple es usar el especificado. Si desean saber el resto de usuarios, se encuentran en `login.jsx`.

---

## Conexión a API

Debería valer con modificar el archivo `WebConfig.java` en el proyecto de springBoot.

Modificaremos la línea de `.allowedOrigins(...)` de tal forma:

```java
.allowedOrigins("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173")
```

Por ahora no he realizado fetchs, así que no he comprobado su funcionamiento correcto. Cualquier problema comentadlo.

> Os recomiendo usar el proyecto de SpringBoot que ya tenemos para el front-end.

---

## Anotaciones para un futuro (para mí misma)

- Refactorizar login conectando a la API y eliminar `e.preventDefault()` del form

