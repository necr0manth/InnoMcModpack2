// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:energizing/spirited_crystal' });

  event.custom({
    type: 'powah:energizing',
    energy: 1000000,
    ingredients: [
      { item: 'actuallyadditions:empowered_emeradic_crystal' },
      { item: 'actuallyadditions:restonia_crystal' },
      { item: 'powah:steel_energized' }
    ],
    result: { count: 1, id: 'powah:crystal_spirited' }
  }).id('kubejs:inno_preview/spirited_crystal_v3');
});
