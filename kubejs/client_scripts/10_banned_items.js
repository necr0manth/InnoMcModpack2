// Catalog hiding is explanatory UX; unavailable items remain obtainable in game.
const innoCatalog = JsonIO.read('kubejs/config/banned_items.json')

RecipeViewerEvents.removeEntries('item', event => {
  innoCatalog.groups.forEach(group => {
    if (group.status !== 'permanent') return
    group.items.forEach(id => { event.remove(id) })
    group.namespaces.forEach(namespace => { event.remove(new RegExp('^' + namespace + ':')) })
  })
})

ItemEvents.modifyTooltips(event => {
  const available = []
  innoCatalog.groups.forEach(group => {
    if (group.status === 'available') group.items.forEach(id => { available.push(id) })
  })
  innoCatalog.groups.forEach(group => {
    if (group.status === 'available') return
    const label = group.status === 'permanent' ? 'Забанено навсегда' : 'Временно забанено'
    const lines = [Text.red(label), Text.gray(group.reason)]
    group.items.forEach(id => {
      if (group.status === 'permanent' || available.indexOf(id) === -1) event.add(id, lines)
    })
    group.namespaces.forEach(namespace => {
      const excluded = group.status === 'permanent' ? [] : available.filter(id => id.indexOf(namespace + ':') === 0)
      const escaped = excluded.map(id => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      const prefix = escaped.length ? '(?!(?:' + escaped.join('|') + ')$)' : ''
      event.add(new RegExp('^' + prefix + namespace + ':'), lines)
    })
  })
})
