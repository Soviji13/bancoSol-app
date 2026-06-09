# Local Storage en Usuario

Guardaremos el usuarioDTO en local Storage, para que directamente se acceda al menú utilizando esas credenciales, y sin necesidad de tener que guardar la contraseña.

Se habían barajado opciones más seguras, puesto que esta opción, hablando a niveles de ciberseguridad es débil. Sin embargo, este fue el punto de equilibrio entre buscar una solución lógica para el lado del cliente con un mínimo de planteamiento sobre la seguridad.

Además, se comprueban directamente al crear los UseState, para evitar loop infinitos de renders o un render innecesario usando `useEffect()[]`
