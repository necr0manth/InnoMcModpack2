// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:crafting/energizing_orb' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GGG', 'BCB', 'RRR'],
    key: {
      G: { item: 'minecraft:glass' },
      B: { tag: 'c:circuits/basic' },
      C: { item: 'powah:dielectric_casing' },
      R: { tag: 'c:ingots/construction_alloy' }
    },
    result: { id: 'powah:energizing_orb', count: 1 }
  }).id('kubejs:inno_preview/energizing_orb_v2');
});
