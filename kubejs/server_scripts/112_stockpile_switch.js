// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/logistics/stockpile_switch' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' C ', 'BLB', ' H '],
    key: {
      C: { item: 'minecraft:comparator' },
      B: { item: 'create:brass_sheet' },
      L: { item: 'createmechanisms:logic_mechanism' },
      H: { item: 'create:brass_casing' }
    },
    result: { id: 'create:stockpile_switch', count: 1 }
  }).id('kubejs:inno_preview/stockpile_switch_v1');
});
