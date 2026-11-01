// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/diamatine' });

  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:diamatine_crystal' },
    color: 6522834,
    energy: 5000,
    modifiers: [
      { item: 'minecraft:amethyst_shard' },
      { tag: 'c:alloys/elite' },
      { item: 'minecraft:quartz' },
      { item: 'minecraft:glowstone_dust' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_diamatine_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_diamatine_crystal_current_v3');
});
