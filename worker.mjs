// Worker del plugin: corre en un proceso hijo de Node, fuera de la UI de Orca.
// Debe ser un módulo ES con `activate` como export por defecto.

export default async function activate(orca) {
  orca.log(`Hola Orca activado. Capacidades concedidas: ${orca.grantedCapabilities.join(', ')}`)

  // 1) Comando declarado en el manifiesto (paleta de comandos o Mod+Alt+H)
  orca.commands.register('saludar', async () => {
    // storage: solo accesible desde el worker, no desde el panel
    const { value } = await orca.host.call('storage.get', { key: 'contador' })
    const contador = (typeof value === 'number' ? value : 0) + 1
    await orca.host.call('storage.set', { key: 'contador', value: contador })

    const ctx = await orca.host.call('workspace.readContext', {})
    const donde = ctx ? `${ctx.displayName} (rama ${ctx.branch})` : 'sin worktree enfocado'

    await orca.host.call('notifications.show', {
      title: 'Hola desde Hola Orca',
      body: `Saludo nº ${contador} en ${donde}`
    })
    return { ok: true, contador }
  })

  // 2) Eventos: hay que suscribirse vía host API y recibir con orca.events.on
  orca.events.on('worktree.created', async (payload) => {
    orca.log(`worktree.created: ${JSON.stringify(payload).slice(0, 500)}`)
    await orca.host.call('notifications.show', {
      title: 'Hola Orca',
      body: 'Se ha creado un worktree nuevo'
    })
  })
  await orca.host.call('events.subscribe', { events: ['worktree.created'] })
}

export function deactivate() {
  // Se llama al apagar el worker (Orca lo recicla tras ~60 s inactivo)
}
