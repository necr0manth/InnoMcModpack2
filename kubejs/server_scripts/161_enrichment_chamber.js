// Replace the verified native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:enrichment_chamber' });

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GCG', 'WXW', 'RBR'],
    key: {
      G: { tag: 'c:gems/fluorite' },
      C: { tag: 'c:circuits/basic' },
      W: { item: 'electroenergetics:insulated_wire' },
      X: { item: 'enderio:void_chassis' },
      R: { tag: 'c:dusts/redstone' },
      B: { item: 'createmechanisms:hardened_energy_mechanism' }
    },
    result: { id: 'mekanism:enrichment_chamber', count: 1 }
  }).id('kubejs:inno_preview/enrichment_chamber_current_v6');
});
