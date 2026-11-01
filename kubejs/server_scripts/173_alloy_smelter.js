// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:alloy_smelter' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GHG', 'WVW', 'OFO'],
    key: {
      G: { item: 'enderio:iron_gear' },
      H: { item: 'createmechanisms:heat_mechanism' },
      W: { item: 'electroenergetics:insulated_wire' },
      V: { item: 'enderio:void_chassis' },
      O: { item: 'minecraft:obsidian' },
      F: { item: 'createmechanisms:basic_energy_mechanism' }
    },
    result: { id: 'enderio:alloy_smelter', count: 1 }
  }).id('kubejs:inno_preview/alloy_smelter_v3');
});
