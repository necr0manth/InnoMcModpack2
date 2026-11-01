// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'createpropulsion:crafting/stirling_engine' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['CSC', 'SES', 'CHC'],
    key: {
      C: { tag: 'c:plates/copper' },
      S: { tag: 'c:plates/steel' },
      E: { item: 'simulated:engine_assembly' },
      H: { item: 'createmechanisms:heat_mechanism' }
    },
    result: { id: 'createpropulsion:stirling_engine', count: 1 }
  }).id('kubejs:stirling_engine_steel');
});
