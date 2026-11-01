// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'simulated:swivel_bearing' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' S ', 'PIP', ' G '],
    key: {
      S: { item: 'create:shaft' },
      P: { tag: 'c:plates/steel' },
      I: { item: 'create:industrial_iron_block' },
      G: { item: 'create:cogwheel' }
    },
    result: { id: 'simulated:swivel_bearing', count: 1 }
  }).id('kubejs:swivel_bearing_steel');
});
