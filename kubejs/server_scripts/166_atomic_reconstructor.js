// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:atomic_reconstructor' });
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['AGA', 'BCB', 'WIW', 'FOF'],
    key: {
      A: { item: 'mekanism:alloy_atomic' },
      G: { item: 'minecraft:glass_pane' },
      W: { item: 'electroenergetics:insulated_wire' },
      C: { item: 'enderio:void_chassis' },
      I: { item: 'createmechanisms:blazing_energy_mechanism' },
      B: { tag: 'c:circuits/basic' },
      O: { item: 'ae2lt:overload_crystal' },
      F: { tag: 'c:gems/fluix' }
    },
    result: { id: 'actuallyadditions:atomic_reconstructor', count: 1 },
    accept_mirrored: false
  }).id('kubejs:inno_preview/atomic_reconstructor_v6');
});
