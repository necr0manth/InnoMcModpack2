// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create_high_seas:boat_engine' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' L ', 'BEP'],
    key: {
      L: { item: 'minecraft:lever' },
      B: { item: 'minecraft:blast_furnace' },
      E: { item: 'simulated:engine_assembly' },
      P: { item: 'create:propeller' }
    },
    result: { id: 'create_high_seas:boat_engine', count: 1 }
  }).id('kubejs:boat_engine_assembly');
});
