// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'createpropulsion:crafting/liquid_burner' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['CCC', 'SHS', ' M '],
    key: {
      C: { tag: 'c:plates/copper' },
      S: { tag: 'c:plates/steel' },
      H: { item: 'createmechanisms:heat_mechanism' },
      M: { item: 'createmechanisms:fluid_mechanism' }
    },
    result: { id: 'createpropulsion:liquid_burner', count: 1 }
  }).id('kubejs:liquid_burner_mechanisms');
});
