// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'ae2lt:overload_alloy_blank' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['ABC', 'DEF', 'GHA'],
    key: {
      A: { item: 'minecraft:ender_eye' },
      B: { item: 'minecraft:amethyst_shard' },
      C: { item: 'minecraft:diamond' },
      D: { tag: 'c:ingots/copper' },
      E: { item: 'powah:steel_energized' },
      F: { item: 'minecraft:gold_ingot' },
      G: { item: 'minecraft:diamond' },
      H: { item: 'minecraft:amethyst_shard' }
    },
    result: { id: 'ae2lt:overload_alloy_blank', count: 1 }
  }).id('kubejs:inno_preview/overload_alloy_blank_v1');
});
