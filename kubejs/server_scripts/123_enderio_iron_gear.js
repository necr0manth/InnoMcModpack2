// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:iron_gear' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['NSN', 'SFS', 'NSN'],
    key: {
      N: { tag: 'c:nuggets/steel' },
      S: { tag: 'c:ingots/steel' },
      F: { item: 'enderio:grains_of_infinity' }
    },
    result: { id: 'enderio:iron_gear', count: 1 }
  }).id('kubejs:inno_preview/enderio_iron_gear_v2');
});
