// Keep unavailable recipes disabled while leaving drops and existing items untouched.
const innoAccess = JsonIO.read('kubejs/config/banned_items.json')
const APPLY_TEMPORARY_BANS = true

ServerEvents.recipes(event => {
  // Native soulbinding output.id bypasses the ordinary output filter.
  if (APPLY_TEMPORARY_BANS) {
    ;[
      'enderio:soulbinding/farming_station',
      'enderio:soulbinding/vibrant_photovoltaic_module',
      'enderio:soulbinding/powered_spawner',
      'enderio:soulbinding/soul_engine',
      'enderio:soulbinding/pulsating_photovoltaic_module',
      'enderio:soulbinding/energetic_photovoltaic_module'
    ].forEach(id => { event.remove({ id: id }) })
  }

  const available = []
  innoAccess.groups.forEach(group => {
    if (group.status === 'available') group.items.forEach(id => { available.push(id) })
  })
  const exceptions = available.map(id => ({ output: id }))
  const registered = {}
  Item.getList().forEach(stack => { registered[stack.id] = true })
  innoAccess.groups.forEach(group => {
    if (group.status === 'available' || (group.status !== 'permanent' && !APPLY_TEMPORARY_BANS)) return
    group.items.forEach(id => {
      if (group.status !== 'permanent' && available.indexOf(id) !== -1) return
      if (registered[id]) event.remove({ output: id })
      else console.warn('[inno_access] Unregistered explicit item: ' + id)
    })
    group.namespaces.forEach(namespace => {
      const modFilter = { mod: namespace }
      const outputFilter = { output: new RegExp('^' + namespace + ':') }
      if (group.status !== 'permanent' && exceptions.length) {
        modFilter.not = { or: exceptions }
        outputFilter.not = { or: exceptions }
      }
      event.remove(modFilter)
      event.remove(outputFilter)
    })
  })
})
