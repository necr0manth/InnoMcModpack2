ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:steel_casing' });
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['RPR', 'POP', 'RPR'],
    key: {
      R: { tag: 'c:rods/steel' },
      P: { tag: 'c:plates/steel' },
      O: { tag: 'c:ingots/osmium' }
    },
    result: { id: 'mekanism:steel_casing', count: 1 },
    accept_mirrored: false
  }).id('kubejs:steel_casing_mechanical');
});
