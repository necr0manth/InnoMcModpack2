// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.custom({
    type: 'create:milling',
    ingredients: [{ item: 'minecraft:coal' }],
    processing_time: 150,
    results: [{ id: 'mekanism:dust_coal', count: 1 }]
  }).id('kubejs:inno_preview/coal_dust_milling_v1');
});
