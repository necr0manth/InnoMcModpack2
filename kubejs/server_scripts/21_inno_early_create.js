// Manual bootstrap uses CDG's native held-use hammer/cutters, not crafting remainders.
// Keep sheet yield 1:1: extra sheets could be recycled back into ingots.
ServerEvents.recipes(function (event) {
  var replacedRecipes = [
    'create:crafting/kinetics/mechanical_mixer',
    // These nugget recipes bypass the manual cutters.
    'electroenergetics:crafting/copper_wire',
    'electroenergetics:crafting/iron_wire',
    // CDG selects the first matching held-use recipe: retain only the EE output.
    'createdieselgenerators:compat/createaddition/copper_wire',
    'createdieselgenerators:compat/createaddition/iron_wire',
    // Wire automation belongs to the saw, not the rolling mill.
    'createaddition:rolling/copper_plate',
    'createaddition:rolling/iron_plate',
    'createaddition:rolling/gold_plate',
    'createaddition:rolling/electrum_plate'
  ];
  replacedRecipes.forEach(function (id) {
    event.remove({ id: id });
  });

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['AWA', 'SBS', ' Q '],
    key: {
      A: { item: 'createdeco:andesite_sheet' },
      W: { item: 'createmechanisms:wooden_mechanism' },
      S: { item: 'create:shaft' },
      B: { item: 'create_connected:six_way_gearbox' },
      Q: { item: 'create:whisk' }
    },
    result: { id: 'create:mechanical_mixer', count: 1 }
  }).id('kubejs:inno_early/mechanical_mixer');

  // The mixer needs these sheets before the press and foundry are available.
  event.custom({
    type: 'createdieselgenerators:hammering',
    ingredients: [{ item: 'create:andesite_alloy' }],
    results: [{ id: 'createdeco:andesite_sheet', count: 1 }]
  }).id('kubejs:inno_early/hammering/andesite_sheet');

  event.custom({
    type: 'createdieselgenerators:hammering',
    ingredients: [{ tag: 'c:ingots/osmium' }],
    results: [{ id: 'vintageimprovements:osmium_sheet', count: 1 }]
  }).id('kubejs:inno_early/hammering/osmium_sheet');

  // Native held-use cutters keep 3 wires/plate; the chosen saw produces 4.
  // The matching foundry recycling correction is in 22_inno_foundry.js.
  ['copper', 'iron'].forEach(function (metal) {
    event.custom({
      type: 'create:cutting',
      ingredients: [{ tag: 'c:plates/' + metal }],
      processing_time: 100,
      results: [{ id: 'electroenergetics:' + metal + '_wire', count: 4 }]
    }).id('kubejs:inno_early/cutting/' + metal + '_wire');
  });
  ['gold', 'electrum'].forEach(function (metal) {
    event.custom({
      type: 'create:cutting',
      ingredients: [{ tag: 'c:plates/' + metal }],
      processing_time: 100,
      results: [{ id: 'createaddition:' + metal + '_wire', count: 2 }]
    }).id('kubejs:inno_early/cutting/' + metal + '_wire');
  });
});
