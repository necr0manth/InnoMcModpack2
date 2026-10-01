// Catalog hiding is explanatory UX; access is enforced independently by the server.
const innoCatalog = JsonIO.read('kubejs/config/inno_mvp_access.json')
const innoCatalogStatus = {
  permanent: 'Запрещено по замыслу сборки',
  pending_recipe: 'Временно закрыто: нет готового рецепта',
  pending_role: 'Временно закрыто: нужна интеграция',
  pending_test: 'Временно закрыто: нужен игровой тест'
}

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
    const lines = [Text.red(innoCatalogStatus[group.status]), Text.gray(group.reason)]
    group.items.forEach(id => { event.add(id, lines) })
    group.namespaces.forEach(namespace => { event.add(new RegExp('^' + namespace + ':'), lines) })
  })
  innoCatalog.rankRestrictions.forEach(restriction => {
    event.add(restriction.item, [Text.gray('MVP: ' + restriction.reason)])
  })
})
