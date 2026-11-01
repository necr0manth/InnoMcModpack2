// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:vibrant_crystal' });
  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:emeradic_crystal' },
    color: 3492376,
    energy: 5000,
    modifiers: [
      { tag: 'c:nuggets/vibrant_alloy' },
      { tag: 'c:nuggets/vibrant_alloy' },
      { item: 'minecraft:ender_pearl' },
      { item: 'minecraft:glowstone_dust' }
    ],
    result: { id: 'enderio:vibrant_crystal', count: 1 },
    time: 50
  }).id('kubejs:inno_preview/vibrant_crystal_v2');
});
