// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/palis' });
  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:palis_crystal' },
    color: 2437779,
    energy: 5000,
    modifiers: [
      { item: 'ae2:charged_certus_quartz_crystal' },
      { item: 'minecraft:prismarine_shard' },
      { item: 'powah:steel_energized' },
      { item: 'mekanism:enriched_redstone' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_palis_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_palis_crystal_v1');
});
