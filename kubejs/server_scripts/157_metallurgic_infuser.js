// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:metallurgic_infuser' });

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['WHW', 'FCF', 'WBW'],
    key: {
      W: { item: 'electroenergetics:insulated_wire' },
      H: { item: 'createmechanisms:advanced_heat_mechanism' },
      F: { item: 'mekanism:basic_control_circuit' },
      C: { item: 'enderio:void_chassis' },
      B: { item: 'createmechanisms:hardened_energy_mechanism' }
    },
    result: { id: 'mekanism:metallurgic_infuser', count: 1 }
  }).id('kubejs:inno_preview/metallurgic_infuser_v6');
});
