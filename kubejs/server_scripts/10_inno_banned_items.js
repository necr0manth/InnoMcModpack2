// Keep unavailable recipes disabled while leaving drops and existing items untouched.
const innoAccess = JsonIO.read('kubejs/config/banned_items.json')

ServerEvents.recipes(event => {
  // Native soulbinding output.id bypasses the ordinary output filter.
  ;[
    'enderio:soulbinding/farming_station',
    'enderio:soulbinding/vibrant_photovoltaic_module',
    'enderio:soulbinding/powered_spawner',
    'enderio:soulbinding/soul_engine',
    'enderio:soulbinding/pulsating_photovoltaic_module',
    'enderio:soulbinding/energetic_photovoltaic_module'
  ].forEach(id => { event.remove({ id: id }) })

  const registered = {}
  Item.getList().forEach(stack => { registered[stack.id] = true })
  innoAccess.groups.forEach(group => {
    if (group.status === 'available') return
    group.items.forEach(id => {
      if (registered[id]) event.remove({ output: id })
      else console.warn('[inno_access] Unregistered explicit item: ' + id)
    })
    group.namespaces.forEach(namespace => {
      event.remove({ mod: namespace })
      event.remove({ output: new RegExp('^' + namespace + ':') })
    })
  })
})
