// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'data_energistics:crafting/data_framework' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['DAD', 'PFP', 'DAD'],
    key: {
      D: { tag: 'c:gems/data_crystal' },
      A: { tag: 'c:alloys/advanced' },
      P: { item: 'powah:steel_energized' },
      F: { item: 'ae2:fluix_block' }
    },
    result: { id: 'data_energistics:data_framework', count: 1 }
  }).id('kubejs:inno_preview/data_framework_v1');
});
