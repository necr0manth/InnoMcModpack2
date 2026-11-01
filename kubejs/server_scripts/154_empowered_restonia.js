// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/restonia' });
  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:restonia_crystal' },
    color: 10365735,
    energy: 5000,
    modifiers: [
      { tag: 'mekanism:enriched/redstone' },
      { tag: 'c:alloys/advanced' },
      { tag: 'c:ingots/redstone_alloy' },
      { item: 'powah:steel_energized' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_restonia_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_restonia_crystal_v2');
});
