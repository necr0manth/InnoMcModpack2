// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/void' });
  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:void_crystal' },
    color: 3355443,
    energy: 5000,
    modifiers: [
      { tag: 'mekanism:enriched/carbon' },
      { tag: 'c:ingots/dark_steel' },
      { tag: 'c:gems/black_quartz' },
      { item: 'minecraft:flint' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_void_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_void_crystal_v1');
});
