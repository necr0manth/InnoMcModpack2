// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/adjustable_chain_gearshift' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' B ', 'ELE', ' D '],
    key: {
      B: { item: 'create:brass_sheet' },
      E: { item: 'create:electron_tube' },
      L: { item: 'createmechanisms:logic_mechanism' },
      D: { item: 'create:encased_chain_drive' }
    },
    result: { id: 'create:adjustable_chain_gearshift', count: 1 }
  }).id('kubejs:inno_preview/adjustable_chain_gearshift_v1');
});
