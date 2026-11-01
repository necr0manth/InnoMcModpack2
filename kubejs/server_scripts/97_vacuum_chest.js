// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:vacuum_chest' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['APA', 'GCG', 'AVA'],
    key: {
      A: { item: 'enderio:pulsating_alloy_ingot' },
      P: { item: 'enderio:pulsating_crystal' },
      G: { item: 'enderio:iron_gear' },
      C: { item: 'create:item_vault' },
      V: { item: 'enderio:void_chassis' }
    },
    result: { id: 'enderio:vacuum_chest', count: 1 }
  }).id('kubejs:inno_preview/vacuum_chest_v2');
});
