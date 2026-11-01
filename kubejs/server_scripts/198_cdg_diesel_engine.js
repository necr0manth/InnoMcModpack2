// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'createdieselgenerators:crafting/diesel_engine' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' A ', 'PBP', 'SFS'],
    key: {
      A: { item: 'simulated:engine_assembly' },
      P: { item: 'createdieselgenerators:engine_piston' },
      B: { tag: 'c:storage_blocks/brass' },
      S: { tag: 'c:plates/steel' },
      F: { item: 'create:fluid_tank' }
    },
    result: { id: 'createdieselgenerators:diesel_engine', count: 1 }
  }).id('kubejs:diesel_engine_steel');
});
