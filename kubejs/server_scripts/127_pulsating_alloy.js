ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/pulsating_alloy_ingot' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 4800,
    experience: 0.3,
    inputs: [
      { count: 1, item: 'mekanism:alloy_reinforced' },
      { count: 1, item: 'minecraft:ender_pearl' }
    ],
    output: { count: 2, id: 'enderio:pulsating_alloy_ingot' }
  }).id('kubejs:inno_preview/pulsating_alloy_ingot_v3');
});
