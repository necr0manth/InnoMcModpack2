// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:ensouled_chassis' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['CIC', 'IVI', 'CIC'],
    key: {
      C: { item: 'enderio:soul_chain' },
      I: { item: 'enderio:soularium_ingot' },
      V: { item: 'enderio:void_chassis' }
    },
    result: { id: 'enderio:ensouled_chassis', count: 1 }
  }).id('kubejs:inno_preview/ensouled_chassis_v1');
});
