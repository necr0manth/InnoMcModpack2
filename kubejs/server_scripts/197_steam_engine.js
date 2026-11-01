// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/steam_engine' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['P', 'E', 'C'],
    key: {
      P: { tag: 'c:plates/gold' },
      E: { item: 'simulated:engine_assembly' },
      C: { tag: 'c:storage_blocks/copper' }
    },
    result: { id: 'create:steam_engine', count: 1 }
  }).id('kubejs:steam_engine_assembly');
});
