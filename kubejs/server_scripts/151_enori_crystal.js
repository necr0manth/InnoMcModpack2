// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:laser/crystalize_enori_crystal' });
  event.custom({
    type: 'actuallyadditions:laser',
    energy: 80,
    ingredient: { item: 'mekanism:enriched_iron' },
    result: { id: 'actuallyadditions:enori_crystal' }
  }).id('kubejs:inno_preview/enori_crystal_v1');
});
