// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/nixie_tube' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' E ', 'GCG', ' E '],
    key: {
      E: { item: 'create:electron_tube' },
      G: { item: 'minecraft:glass_pane' },
      C: { item: 'create:copper_sheet' }
    },
    result: { id: 'create:nixie_tube', count: 4 }
  }).id('kubejs:inno_preview/nixie_tube_v1');
});
