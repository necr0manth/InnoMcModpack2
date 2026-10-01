// A rod holds half an ingot: 45 mB, matching native steel rod melting.
ServerEvents.tags('item', function (event) {
  event.add('c:rods', 'kubejs:steel_rod');
  event.add('c:rods/steel', 'kubejs:steel_rod');
});

ServerEvents.recipes(function (event) {
  // Cast the first rods before the rolling mill; choose the exact new item.
  event.remove({ id: 'createmetallurgy:casting_in_table/steel/rod' });
  event.custom({
    type: 'createmetallurgy:casting_in_table',
    ingredients: [
      { type: 'neoforge:single', amount: 45, fluid: 'createmetallurgy:molten_steel' },
      { item: 'createmetallurgy:graphite_rod_mold' }
    ],
    processing_time: 30,
    result: { item: { id: 'kubejs:steel_rod', count: 1 } }
  }).id('createmetallurgy:casting_in_table/steel/rod');

  event.custom({
    type: 'createaddition:rolling',
    ingredients: [{ tag: 'c:ingots/steel' }],
    results: [{ id: 'kubejs:steel_rod', count: 2 }]
  }).id('kubejs:inno_mmm/rolling/steel_rod');
});
