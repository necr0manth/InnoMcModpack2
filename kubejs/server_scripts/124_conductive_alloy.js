// Replace the identified native recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/conductive_alloy_ingot' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 6400,
    experience: 0.3,
    inputs: [
      { count: 1, tag: 'c:ingots/electrum' },
      { count: 1, item: 'mekanism:alloy_infused' }
    ],
    output: { count: 2, id: 'enderio:conductive_alloy_ingot' }
  }).id('kubejs:inno_preview/conductive_alloy_ingot_v2');
});
