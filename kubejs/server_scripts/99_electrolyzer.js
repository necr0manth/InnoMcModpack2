// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'petrochem:crafting/null/electrolyzer' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SCS', 'WTW', 'SBS'],
    key: {
      S: { item: 'petrochem:steel_sheet' },
      C: { item: 'electroenergetics:connector' },
      W: { item: 'electroenergetics:insulated_wire' },
      T: { item: 'create:fluid_tank' },
      B: { item: 'createmechanisms:basic_energy_mechanism' }
    },
    result: { id: 'petrochem:electrolyzer', count: 1 }
  }).id('kubejs:inno_preview/electrolyzer');
});
