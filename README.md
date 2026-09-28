# Hola Orca 🚀

Plugin de prueba para [Orca](https://www.onorca.dev/), el entorno de Stably AI para trabajar con agentes de código en paralelo.

Sirve como ejemplo mínimo de todo lo que puede hacer un plugin de Orca: un panel en la barra lateral, un comando con atajo de teclado, almacenamiento propio, notificaciones, escritura en el terminal y suscripción a eventos.

> ⚠️ El sistema de plugins de Orca es **experimental** (`pluginApi` v0). La API puede cambiar entre versiones de Orca sin previo aviso.

## Qué hace

- **Panel "Hola Orca"** (icono 🚀 en la barra lateral derecha) con tres botones:
  - *Leer worktree actual*: muestra el nombre, la rama y los terminales del worktree enfocado.
  - *Mostrar notificación*: lanza una notificación de escritorio.
  - *Escribir en el terminal*: escribe `echo "Hola desde el plugin"` en el primer terminal del worktree, **sin pulsar Enter**.
- **Comando "Hola Orca: Saludar"** (`Cmd+Alt+H` en macOS, `Ctrl+Alt+H` en Windows/Linux): muestra una notificación con un contador de saludos que se guarda entre sesiones.
- **Evento**: avisa con una notificación cada vez que se crea un worktree nuevo.

## Requisitos

- Orca `1.4.0` o superior.
- El sistema de plugins activado: **Settings → Plugins → Plugin system**. Viene desactivado por defecto.

## Instalación

### Opción A: desde GitHub (versión fija)

1. En Orca, abre **Settings → Plugins** y el diálogo de instalación.
2. Elige la pestaña **Git URL** y pega la URL con el tag de la versión:

   ```
   https://github.com/wilbercl/hola-orca.git#v0.1.0
   ```

3. Revisa y acepta los permisos que pide el plugin.

La instalación queda fijada a ese commit y **no se actualiza sola**. Para actualizar, vuelve a instalar con el tag nuevo (por ejemplo `#v0.2.0`). Orca guarda la versión anterior por si necesitas volver atrás.

### Opción B: en modo desarrollo (se recarga al editar)

```bash
git clone https://github.com/wilbercl/hola-orca.git
```

En **Settings → Plugins**, añade la carpeta clonada como ruta de desarrollo. Orca vigila los archivos y recarga el plugin cada vez que los editas o haces `git pull`, sin reiniciar.

No instales las dos opciones a la vez en la misma máquina: comparten la misma identidad (`wilber.hola-orca`).

## Permisos que solicita

| Capacidad | Para qué se usa |
|---|---|
| `workspace:read` | Leer el nombre, la rama y los terminales del worktree enfocado |
| `notifications:show` | Mostrar notificaciones de escritorio |
| `terminal:send` | Escribir texto en un terminal concreto |
| `storage` | Guardar el contador de saludos |
| `events:subscribe` | Recibir el aviso cuando se crea un worktree |

## Estructura

```
hola-orca/
├── orca-plugin.json   # Manifiesto: qué registra el plugin y qué permisos pide
├── worker.mjs         # Lógica (JavaScript, módulo ES) que corre en un proceso Node aparte
├── panel.html         # Interfaz del panel (HTML + CSS + JS) en un iframe aislado
└── README.md
```

- **`worker.mjs`** exporta por defecto una función `activate(orca)`. Desde ahí registra comandos (`orca.commands.register`), escucha eventos (`orca.events.on`) y llama a la API de Orca (`orca.host.call`).
- **`panel.html`** contiene solo el contenido del panel. Orca le añade su propia cabecera con estilos y seguridad. El panel **no tiene acceso a red** y se comunica con Orca por `postMessage`.

## Publicar una versión nueva

1. Sube el campo `version` en `orca-plugin.json` (por ejemplo a `0.2.0`).
2. Haz commit, push y crea el tag:

   ```bash
   git commit -am "v0.2.0"
   git push
   git tag v0.2.0
   git push origin v0.2.0
   ```

3. Quien lo tenga instalado desde GitHub lo reinstala con `#v0.2.0`. Si has cambiado los permisos, Orca pedirá consentimiento de nuevo.

## Referencias

- Documentación de Orca: <https://www.onorca.dev/docs>
- Esquema oficial del manifiesto: [`src/shared/plugins/plugin-manifest.ts`](https://github.com/stablyai/orca/blob/main/src/shared/plugins/plugin-manifest.ts)
- API disponible para plugins: [`src/shared/plugins/plugin-host-api.ts`](https://github.com/stablyai/orca/blob/main/src/shared/plugins/plugin-host-api.ts)
