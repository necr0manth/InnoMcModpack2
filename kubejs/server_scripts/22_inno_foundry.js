// Cold mortar and native foundry recipes stay intact; only bootstrap gates change.
ServerEvents.recipes(function (event) {
  [
    'createmetallurgy:crafting/content/sturdy_whisk',
    'createdieselgenerators:crafting/burner',
    'create:mixing/brass_ingot',
    'createbigcannons:mixing/alloy_steel',
    'petrochem:mixing/steel_alloy_coal',
    'petrochem:mixing/steel_alloy_coke'
  ].forEach(function (id) {
    event.remove({ id: id });
  });

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' A ', 'BAB', 'BBB'],
    key: {
      A: { item: 'create:andesite_alloy' },
      B: { tag: 'c:plates/osmium' }
    },
    result: { id: 'createmetallurgy:sturdy_whisk', count: 1 }
  }).id('kubejs:inno_foundry/sturdy_whisk');

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['FIF', ' S ', 'ABA'],
    key: {
      F: { item: 'minecraft:flint_and_steel' },
      I: { tag: 'c:ingots/copper' },
      S: { item: 'create:shaft' },
      A: { item: 'create:andesite_alloy' },
      B: { item: 'createmetallurgy:refractory_mortar' }
    },
    result: { id: 'createdieselgenerators:burner', count: 1 }
  }).id('kubejs:inno_foundry/burner');

  // A vanilla stonecutter makes the first mold without a mechanical press.
  event.custom({
    type: 'minecraft:stonecutting',
    ingredient: { item: 'createmetallurgy:graphite' },
    result: { id: 'createmetallurgy:graphite_blank_mold', count: 1 }
  }).id('kubejs:inno_foundry/graphite_blank_mold');

  // Both steel providers must work with the chosen press output.
  event.replaceInput({ id: 'petrochem:pressing/steel_sheet' },
    'petrochem:steel_ingot', '#c:ingots/steel');

  // A plate represents 90 mB: four EE wires must not recycle into 180 mB.
  // Preserve native 45 mB recycling for other providers' wires.
  ['copper', 'iron'].forEach(function (metal) {
    var nativeId = 'createmetallurgy:melting/' + metal + '/wire';
    event.remove({ id: nativeId });
    event.custom({
      type: 'createmetallurgy:melting',
      heat_requirement: 'heated',
      ingredients: [{
        type: 'neoforge:difference',
        base: { tag: 'c:wires/' + metal },
        subtracted: { item: 'electroenergetics:' + metal + '_wire' }
      }],
      processing_time: 16,
      results: [{ id: 'createmetallurgy:molten_' + metal, amount: 45 }]
    }).id(nativeId);
    event.custom({
      type: 'createmetallurgy:melting',
      heat_requirement: 'heated',
      ingredients: [
        { item: 'electroenergetics:' + metal + '_wire' },
        { item: 'electroenergetics:' + metal + '_wire' }
      ],
      processing_time: 16,
      results: [{ id: 'createmetallurgy:molten_' + metal, amount: 45 }]
    }).id('kubejs:inno_foundry/melting/' + metal + '_wire');
  });
});
