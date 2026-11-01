// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'simulated:velocity_sensor' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['P', 'C', 'E'],
    key: {
      P: { item: 'create:propeller' },
      C: { item: 'create:andesite_casing' },
      E: { item: 'create:electron_tube' }
    },
    result: { id: 'simulated:velocity_sensor', count: 1 }
  }).id('kubejs:velocity_sensor_steel');
});
