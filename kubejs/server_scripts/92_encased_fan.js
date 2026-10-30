// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/encased_fan' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' S ', 'ICI', ' P '],
    key: {
      S: { item: 'create:shaft' },
      I: { item: 'create:iron_sheet' },
      C: { item: 'create:andesite_casing' },
      P: { item: 'create:propeller' }
    },
    result: { id: 'create:encased_fan', count: 1 }
  }).id('kubejs:inno_preview/encased_fan_v1');
});
