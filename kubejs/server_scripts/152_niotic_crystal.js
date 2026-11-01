// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:energizing/niotic_crystal' });
  event.custom({
    type: 'powah:energizing',
    energy: 300000,
    ingredients: [{ item: 'actuallyadditions:empowered_diamatine_crystal' }],
    result: { count: 1, id: 'powah:crystal_niotic' }
  }).id('kubejs:inno_preview/niotic_crystal_current_v2');
});
