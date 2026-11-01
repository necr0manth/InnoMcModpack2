// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'aeronautics:gyroscopic_propeller_bearing' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['G', 'B'],
    key: {
      G: { item: 'simulated:gyroscopic_mechanism' },
      B: { item: 'aeronautics:propeller_bearing' }
    },
    result: { id: 'aeronautics:gyroscopic_propeller_bearing', count: 1 }
  }).id('kubejs:gyroscopic_propeller_bearing_upgrade');
});
