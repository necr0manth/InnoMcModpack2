// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:enchanter' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['PBP', 'DCD', 'DLD'],
    key: {
      P: { item: 'enderio:pulsating_crystal' },
      B: { item: 'minecraft:book' },
      D: { item: 'enderio:dark_steel_ingot' },
      C: { item: 'enderio:ensouled_chassis' },
      L: { item: 'minecraft:lectern' }
    },
    result: { id: 'enderio:enchanter', count: 1 }
  }).id('kubejs:inno_preview/enchanter_v1');
});
