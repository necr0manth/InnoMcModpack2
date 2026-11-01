// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'ae2:network/blocks/crystal_processing_charger' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['EWE', 'EOR', 'EWE'],
    key: {
      E: { item: 'powah:steel_energized' },
      W: { item: 'electroenergetics:insulated_wire' },
      O: { item: 'ae2lt:overload_crystal' },
      R: { item: 'actuallyadditions:enori_crystal' }
    },
    result: { id: 'ae2:charger', count: 1 }
  }).id('kubejs:inno_preview/ae_charger_v2');
});
