ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:metallurgic_infusing/alloy/reinforced' });
  event.custom({
    type: 'mekanism:metallurgic_infusing',
    chemical_input: { amount: 20, tag: 'mekanism:diamond' },
    item_input: { count: 1, tag: 'c:ingots/conductive_alloy' },
    output: { count: 1, id: 'mekanism:alloy_reinforced' },
    per_tick_usage: false
  }).id('kubejs:alloy_reinforced_conductive_alloy');
});
