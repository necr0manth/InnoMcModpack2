ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:metallurgic_infusing/alloy/infused' });
  event.custom({
    type: 'mekanism:metallurgic_infusing',
    chemical_input: { amount: 10, tag: 'mekanism:redstone' },
    item_input: { count: 1, item: 'enderio:redstone_alloy_ingot' },
    output: { count: 1, id: 'mekanism:alloy_infused' },
    per_tick_usage: false
  }).id('kubejs:alloy_infused_redstone_alloy');
});
