// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/emeradic' });

  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:emeradic_crystal' },
    color: 3492376,
    energy: 5000,
    modifiers: [
      { tag: 'c:nuggets/vibrant_alloy' },
      { tag: 'c:fuels/bio' },
      { item: 'minecraft:moss_block' },
      { item: 'minecraft:slime_ball' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_emeradic_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_emeradic_crystal_v3');
});
