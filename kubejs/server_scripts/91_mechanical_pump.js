// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/mechanical_pump' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' S ', 'CMC', 'GPG'],
    key: {
      S: { item: 'create:shaft' },
      C: { item: 'create:copper_sheet' },
      M: { item: 'createmechanisms:fluid_mechanism' },
      G: { item: 'create:cogwheel' },
      P: { item: 'create:fluid_pipe' }
    },
    result: { id: 'create:mechanical_pump', count: 1 }
  }).id('kubejs:inno_preview/mechanical_pump_v3');
});
