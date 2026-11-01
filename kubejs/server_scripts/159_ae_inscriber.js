// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'ae2:network/blocks/inscribers' });
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['ISPSI', 'FCMCF', 'IRWRI', ' SPS '],
    key: {
      I: { tag: 'c:plates/iron' },
      P: { item: 'minecraft:piston' },
      S: { item: 'powah:steel_energized' },
      F: { item: 'ae2:fluix_crystal' },
      C: { item: 'mekanism:basic_control_circuit' },
      M: { item: 'createmechanisms:advanced_precision_mechanism' },
      R: { item: 'actuallyadditions:restonia_crystal' },
      W: { item: 'electroenergetics:insulated_wire' }
    },
    result: { id: 'ae2:inscriber', count: 1 },
    accept_mirrored: false
  }).id('kubejs:inno_preview/ae_inscriber_v5');
});
