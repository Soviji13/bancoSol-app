# Instrucciones de Integración - Módulo de Voluntarios (Bancosol)

A continuación se detallan los pasos necesarios para integrar el módulo de voluntarios en el proyecto principal y la guía de desarrollo para implementar la lógica de roles (RBAC) una vez conectado el backend.

## 1. Pasos para la Integración del Código

*   **Archivo `gestionVentanas.jsx`:** En mi rama, he dejado señalados de forma muy visible (mediante comentarios) los fragmentos de código que he añadido. Copiad exactamente esos bloques y pegadlos en el archivo `gestionVentanas.jsx` del proyecto integrado.
*   **Carpeta `voluntarios`:** Copiad la carpeta `/voluntarios` al completo (la cual ya contiene su estructura de subcarpetas y archivos CSS modularizados) y pegadla directamente dentro del directorio `src/` del proyecto integrado.

---

## 2. Guía para la Implementación de Roles

Para aplicar las restricciones de acceso según el usuario, bastará con aplicar renderizado condicional y deshabilitar ciertos campos. Aquí tenéis los puntos exactos donde habría que intervenir:

### 👑 Rol: Administrador y Coordinador
*   **Acceso total:** La aplicación, tal y como está desarrollada actualmente, representa la vista completa para estos roles. No es necesario aplicar ninguna restricción adicional.

### 🏢 Rol: Responsable de Entidad
*   **Objetivo:** Solo pueden ver y gestionar (añadir/modificar) los voluntarios pertenecientes a su propia entidad.
*   **`FiltrosVoluntarios.jsx` (aprox. líneas 8-10 y 89-103):** 
    *   Inicializar el estado `filtroEntidad` con la entidad del usuario logueado por defecto.
    *   Añadir la propiedad `disabled` al `<select>` de Entidad Colaboradora para que no puedan buscar ni visualizar voluntarios de otras organizaciones.
*   **`AniadirVoluntario.jsx` (aprox. líneas 8 y 159-178):** 
    *   Inicializar el estado `entidad` con la entidad del usuario.
    *   Bloquear el `<select id="select-entidad">` (`disabled`) para asegurar que el voluntario creado se asigne automáticamente a su asociación.
*   **`ModificarVoluntario.jsx` (aprox. líneas 267-285):** 
    *   Aplicar la misma lógica: deshabilitar el `<select>` de la entidad para que no puedan transferir a un voluntario a otra organización.

### 🏪 Rol: Tienda
*   **Objetivo:** Solo visualizan la lista de voluntarios que tienen asignados. No tienen permisos para modificar, añadir ni borrar (CRUD bloqueado), pero sí deben poder exportar la tabla.
*   **`FiltrosVoluntarios.jsx` (aprox. líneas 11 y 123-137):** 
    *   Inicializar el estado `filtroTienda` con el nombre de su tienda correspondiente.
    *   Deshabilitar el `<select>` de Tienda para restringir la consulta al ámbito de su local.
*   **`FooterVoluntarios.jsx` (aprox. líneas 52-80):** 
    *   Deshabilitar los botones de **Eliminar voluntario**, **Modificar voluntario** y **Añadir voluntario**.
    *   El botón de **Exportar a CSV** debe permanecer visible y sin restricciones.
