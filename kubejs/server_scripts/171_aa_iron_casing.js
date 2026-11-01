// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:iron_casing' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SIS', 'IQI', 'SIS'],
    key: {
      S: { tag: 'c:plates/steel' },
      I: { tag: 'c:ingots/iron' },
      Q: { tag: 'c:gems/black_quartz' }
    },
    result: { id: 'actuallyadditions:iron_casing', count: 1 }
  }).id('kubejs:inno_preview/aa_iron_casing_v1');
});
