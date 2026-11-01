// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'ae2:network/blocks/energy_energy_acceptor' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SES', 'WCW', 'SES'],
    key: {
      S: { item: 'powah:steel_energized' },
      E: { item: 'actuallyadditions:enori_crystal' },
      W: { item: 'electroenergetics:insulated_wire' },
      C: { tag: 'c:circuits/basic' }
    },
    result: { id: 'ae2:energy_acceptor', count: 1 }
  }).id('kubejs:inno_preview/ae_energy_acceptor_v2');
});
