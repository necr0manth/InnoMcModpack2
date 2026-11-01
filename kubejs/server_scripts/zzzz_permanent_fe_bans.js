// Run after recipe additions so permanent FE bans also cover custom recipes.
ServerEvents.recipes(event => {
  const groups = JsonIO.read('kubejs/config/banned_items.json').groups
  groups.filter(group => group.key === 'fe_generators' || group.key === 'fe_network_bypasses')
    .forEach(group => { group.items.forEach(id => { event.remove({ output: id }) }) })
  // Ender IO soul binding exposes output.id outside the ordinary output filter.
  ;['soul_engine', 'energetic_photovoltaic_module', 'pulsating_photovoltaic_module', 'vibrant_photovoltaic_module']
    .forEach(name => { event.remove({ id: 'enderio:soulbinding/' + name }) })
})
