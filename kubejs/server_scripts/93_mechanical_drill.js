// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/mechanical_drill' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' S ', 'SMS', 'GCG'],
    key: {
      S: { tag: 'c:ingots/steel' },
      M: { tag: 'c:storage_blocks/steel' },
      G: { item: 'create:cogwheel' },
      C: { item: 'create:andesite_casing' }
    },
    result: { id: 'create:mechanical_drill', count: 1 }
  }).id('kubejs:inno_preview/mechanical_drill_v4');
});
