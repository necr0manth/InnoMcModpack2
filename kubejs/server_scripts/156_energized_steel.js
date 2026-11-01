// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:energizing/energized_steel' });
  event.custom({
    type: 'powah:energizing',
    energy: 10000,
    ingredients: [
      { tag: 'c:ingots/steel' },
      { tag: 'c:ingots/gold' }
    ],
    result: { count: 2, id: 'powah:steel_energized' }
  }).id('kubejs:inno_preview/energized_steel_v2');
});
