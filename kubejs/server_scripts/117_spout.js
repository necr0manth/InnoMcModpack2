// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/spout' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' P ', 'STS', ' K '],
    key: {
      P: { item: 'create:fluid_pipe' },
      S: { tag: 'c:plates/copper' },
      T: { item: 'create:fluid_tank' },
      K: { item: 'minecraft:dried_kelp' }
    },
    result: { id: 'create:spout', count: 1 }
  }).id('kubejs:inno_preview/spout_v2');
});
