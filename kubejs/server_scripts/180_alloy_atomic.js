ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:metallurgic_infusing/alloy/atomic' });
  event.custom({
    type: 'mekanism:metallurgic_infusing',
    chemical_input: { amount: 40, tag: 'mekanism:refined_obsidian' },
    item_input: { count: 1, tag: 'c:ingots/pulsating_alloy' },
    output: { count: 1, id: 'mekanism:alloy_atomic' },
    per_tick_usage: false
  }).id('kubejs:alloy_atomic_pulsating_alloy');
});
