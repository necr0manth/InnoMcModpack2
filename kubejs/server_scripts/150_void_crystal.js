// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:laser/crystalize_void_crystal' });
  event.custom({
    type: 'actuallyadditions:laser',
    energy: 60,
    ingredient: { tag: 'c:dusts/grains_of_infinity' },
    result: { id: 'actuallyadditions:void_crystal' }
  }).id('kubejs:inno_preview/void_crystal_v1');
});
