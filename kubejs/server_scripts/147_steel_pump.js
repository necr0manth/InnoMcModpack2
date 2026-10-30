// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'petrochem:crafting/null/steel_pump' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SGS', 'PMP', ' A '],
    key: {
      S: { tag: 'c:plates/steel' },
      G: { tag: 'c:gears/steel' },
      P: { item: 'petrochem:steel_fluid_pipe' },
      M: { item: 'createmechanisms:fluid_mechanism' },
      A: { item: 'create:shaft' }
    },
    result: { id: 'petrochem:steel_pump', count: 1 }
  }).id('kubejs:inno_preview/steel_pump_v1');
});
