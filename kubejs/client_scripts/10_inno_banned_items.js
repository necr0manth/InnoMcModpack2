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
  innoCatalog.groups.forEach(group => {
    if (group.status === 'available') return
    const lines = [Text.red('Временно забанено'), Text.gray(group.reason)]
    group.items.forEach(id => { event.add(id, lines) })
    group.namespaces.forEach(namespace => { event.add(new RegExp('^' + namespace + ':'), lines) })
  })
})
