// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/logistics/redstone_link' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' T ', 'ERE', ' C '],
    key: {
      T: { item: 'create:transmitter' },
      E: { item: 'create:electron_tube' },
      R: { item: 'minecraft:redstone' },
      C: { item: 'create:andesite_casing' }
    },
    result: { id: 'create:redstone_link', count: 2 }
  }).id('kubejs:inno_preview/redstone_link_v1');
});
