// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'aeronautics:propeller_bearing' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SZS', ' C '],
    key: {
      S: { tag: 'c:plates/steel' },
      Z: { item: 'createmechanisms:zinc_mechanism' },
      C: { item: 'create:brass_casing' }
    },
    result: { id: 'aeronautics:propeller_bearing', count: 1 }
  }).id('kubejs:propeller_bearing_steel');
});
