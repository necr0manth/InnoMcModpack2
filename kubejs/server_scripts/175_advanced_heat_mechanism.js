// Required component recipe; MMM mechanism recipe generation is disabled.
ServerEvents.recipes(function (event) {
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SWS', 'RHR', 'SWS'],
    key: {
      S: { tag: 'c:plates/steel' },
      W: { item: 'electroenergetics:insulated_wire' },
      R: { item: 'powah:crystal_blazing' },
      H: { item: 'createmechanisms:heat_mechanism' }
    },
    result: { id: 'createmechanisms:advanced_heat_mechanism', count: 1 }
  }).id('kubejs:inno_preview/advanced_heat_mechanism_v2');
});
