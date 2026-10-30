// MMM recipe generators are disabled; no native primary recipe is active.
ServerEvents.recipes(function (event) {
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['IBI', 'CFC', 'ISI'],
    key: {
      I: { item: 'minecraft:iron_bars' },
      B: { item: 'minecraft:blaze_powder' },
      C: { tag: 'c:plates/copper' },
      F: { item: 'minecraft:furnace' },
      S: { item: 'create:sturdy_sheet' }
    },
    result: { id: 'createmechanisms:heat_mechanism', count: 1 }
  }).id('kubejs:inno_preview/heat_mechanism_v3');
});
