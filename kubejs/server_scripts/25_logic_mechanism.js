// Exact ingredients from the requested logic-mechanism recipe screenshot.
ServerEvents.recipes(function (event) {
  event.remove({ output: 'createmechanisms:logic_mechanism' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GRG', 'PAP', 'WBW'],
    key: {
      G: { item: 'minecraft:gold_nugget' },
      R: { item: 'minecraft:redstone' },
      P: { item: 'create:polished_rose_quartz' },
      A: { item: 'createdeco:andesite_sheet' },
      W: { item: 'electroenergetics:insulated_wire' },
      B: { item: 'create:brass_sheet' }
    },
    result: { id: 'createmechanisms:logic_mechanism', count: 1 }
  }).id('kubejs:inno_mmm/logic_mechanism');
});
