ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio_evolution:alloy_smelter/construction_alloy_ingot' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 10000,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'minecraft:copper_ingot' },
      { count: 1, item: 'enderio_evolution:crude_steel_ingot' },
      { count: 1, tag: 'c:ingots/andesite_alloy' }
    ],
    output: { count: 1, id: 'enderio_evolution:construction_alloy_ingot' }
  }).id('kubejs:construction_alloy_andesite');
});
