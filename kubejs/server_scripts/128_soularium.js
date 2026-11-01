// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/soularium_ingot' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 6400,
    experience: 0.3,
    inputs: [
      { count: 2, item: 'minecraft:gold_ingot' },
      { count: 1, item: 'minecraft:soul_sand' },
      { count: 1, item: 'minecraft:soul_soil' }
    ],
    output: { count: 1, id: 'enderio:soularium_ingot' }
  }).id('kubejs:inno_preview/soularium_ingot_v1');
});
