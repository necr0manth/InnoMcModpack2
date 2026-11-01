// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:pulsating_crystal' });
  event.custom({
    type: 'powah:energizing',
    energy: 100000,
    ingredients: [
      { item: 'actuallyadditions:diamatine_crystal' },
      { item: 'enderio:pulsating_alloy_ingot' },
      { item: 'minecraft:ender_pearl' }
    ],
    result: { id: 'enderio:pulsating_crystal', count: 1 }
  }).id('kubejs:inno_preview/pulsating_crystal_v2');
});
