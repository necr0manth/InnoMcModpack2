// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'simulated:altitude_sensor' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' G ', 'PEP', ' A '],
    key: {
      G: { item: 'minecraft:glass_bottle' },
      P: { item: 'minecraft:paper' },
      E: { item: 'create:electron_tube' },
      A: { item: 'create:andesite_casing' }
    },
    result: { id: 'simulated:altitude_sensor', count: 1 }
  }).id('kubejs:altitude_sensor_steel');
});
