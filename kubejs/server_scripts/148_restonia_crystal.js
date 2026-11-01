// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:laser/crystalize_restonia_crystal' });
  event.custom({
    type: 'actuallyadditions:laser',
    energy: 40,
    ingredient: { tag: 'mekanism:enriched/redstone' },
    result: { id: 'actuallyadditions:restonia_crystal' }
  }).id('kubejs:inno_preview/restonia_crystal_v1');
});
