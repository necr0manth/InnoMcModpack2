// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/energetic_alloy_ingot' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 9600,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'enderio:conductive_alloy_ingot' },
      { count: 1, item: 'minecraft:gold_ingot' },
      { count: 1, item: 'minecraft:glowstone_dust' }
    ],
    output: { count: 1, id: 'enderio:energetic_alloy_ingot' }
  }).id('kubejs:inno_preview/energetic_alloy_ingot_v1');
});
