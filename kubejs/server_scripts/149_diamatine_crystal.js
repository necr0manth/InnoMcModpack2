// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:laser/crystalize_diamatine_crystal' });
  event.custom({
    type: 'actuallyadditions:laser',
    energy: 60,
    ingredient: { tag: 'mekanism:enriched/diamond' },
    result: { id: 'actuallyadditions:diamatine_crystal' }
  }).id('kubejs:inno_preview/diamatine_crystal_v1');
});
