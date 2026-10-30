// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SWS', 'PBP', ' C '],
    key: {
      S: { tag: 'c:plates/copper' },
      W: { item: 'createmechanisms:wooden_mechanism' },
      P: { item: 'create:fluid_pipe' },
      B: { tag: 'c:plates/iron' },
      C: { item: 'create:cogwheel' }
    },
    result: { id: 'createmechanisms:fluid_mechanism', count: 1 }
  }).id('kubejs:inno_preview/fluid_mechanism_v3');
});
