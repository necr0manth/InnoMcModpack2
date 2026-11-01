// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'createdieselgenerators:crafting/huge_diesel_engine' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    pattern: ['AFA', 'SES', 'PBP'],
    key: {
      A: { tag: 'c:plates/steel' },
      F: { item: 'minecraft:flint_and_steel' },
      S: { tag: 'c:plates/brass' },
      E: { item: 'create:steam_engine' },
      P: { item: 'create:fluid_pipe' },
      B: { tag: 'c:storage_blocks/brass' }
    },
    result: { id: 'createdieselgenerators:huge_diesel_engine', count: 1 }
  }).id('kubejs:huge_diesel_engine_steel');
});
