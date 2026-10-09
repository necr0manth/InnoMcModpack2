// A small workshop progression uses MMM items; all four MMM recipe generators are disabled.
ServerEvents.tags('item', function (event) {
  ['iron', 'steel', 'brass'].forEach(function (metal) {
    event.add('c:gears', 'kubejs:' + metal + '_gear');
    event.add('c:gears/' + metal, 'kubejs:' + metal + '_gear');
  });
  event.add('c:rods/iron', 'createaddition:iron_rod');
});

ServerEvents.recipes(function (event) {
  var item = function (id) { return { item: id }; };
  var tag = function (id) { return { tag: id }; };
  var recipe = function (name, json) {
    event.custom(json).id('kubejs:inno_mmm/' + name);
  };
  var shaped = function (name, output, count, pattern, key) {
    recipe(name, {
      type: 'minecraft:crafting_shaped', category: 'misc',
      pattern: pattern, key: key, result: { id: output, count: count }
    });
  };
  var apply = function (name, stage, component, output) {
    // Native Create handles placed blocks by hand; Get Creative uses the same recipe on depots.
    recipe(name, {
      type: 'create:item_application',
      ingredients: [item(stage), item(component)],
      results: [{ id: output, count: 1 }]
    });
  };
  var wooden = 'createmechanisms:wooden_mechanism';
  var mechanical = 'createmechanisms:zinc_mechanism';
  var control = 'createmechanisms:redstone_mechanism';
  var precision = 'create:precision_mechanism';
  var energy = 'createmechanisms:basic_energy_mechanism';
  var steelSheet = item('petrochem:steel_sheet');

  // Remove alternative finished outputs, including the former early press/crusher recipes.
  [wooden, mechanical, control, precision, energy,
    'create:mechanical_press', 'createaddition:rolling_mill',
    'vintageimprovements:spring_coiling_machine',
    'create:mechanical_arm', 'create:mechanical_crafter', 'create:crushing_wheel',
    'vintageimprovements:lathe', 'vintageimprovements:curving_press'
  ].forEach(function (output) { event.remove({ output: output }); });

  ['iron', 'steel', 'brass'].forEach(function (metal) {
    var gear = 'kubejs:' + metal + '_gear';
    shaped('gear/' + metal, gear, 1, [' I ', 'I I', ' I '], {
      I: item(metal === 'steel' ? 'createmetallurgy:steel_ingot' :
        (metal === 'brass' ? 'create:brass_ingot' : 'minecraft:iron_ingot'))
    });
    // Four ingots = 360 mB, matching native gear melting. Choose an explicit item,
    // because the iron gear tag also contains Ender IO's different gear.
    event.remove({ id: 'createmetallurgy:casting_in_table/' + metal + '/gear' });
    recipe('casting/' + metal + '_gear', {
      type: 'createmetallurgy:casting_in_table',
      ingredients: [
        { type: 'neoforge:single', amount: 360, fluid: 'createmetallurgy:molten_' + metal },
        item('createmetallurgy:graphite_gear_mold')
      ],
      processing_time: 240,
      result: { item: { id: gear, count: 1 } }
    });
  });

  shaped('wooden_mechanism', wooden, 1, ['SCS', 'RPG'], {
    S: item('create:shaft'), C: item('create:cogwheel'), R: item('minecraft:redstone'),
    P: item('minecraft:oak_planks'), G: item('minecraft:gold_nugget')
  });
  shaped('zinc_mechanism', mechanical, 1, ['NWN', 'AGA', 'RPR'], {
    N: item('create:zinc_nugget'), W: item(wooden),
    A: item('create:andesite_alloy'), G: item('kubejs:iron_gear'),
    R: item('kubejs:steel_rod'), P: item('createaddition:zinc_sheet')
  });
  // Keep completion recipes for existing stage blocks, but no longer craft their starting stage.
  apply('zinc/gear', 'kubejs:zinc_mechanism_assembly_0', 'kubejs:steel_gear',
    'kubejs:zinc_mechanism_assembly_1');
  apply('zinc/shaft', 'kubejs:zinc_mechanism_assembly_1', 'createaddition:iron_rod',
    'kubejs:zinc_mechanism_assembly_2');
  apply('zinc/finish', 'kubejs:zinc_mechanism_assembly_2', 'create:zinc_ingot', mechanical);

  shaped('redstone_mechanism', control, 1, ['RQR', 'EGE', 'RAR'], {
    R: item('minecraft:redstone'), Q: item('create:polished_rose_quartz'),
    E: item('create:electron_tube'), G: item('kubejs:iron_gear'),
    A: item('createdeco:andesite_sheet')
  });
  // Precision mechanisms are assembled exclusively by mechanical arms in script 29.
  // Registered legacy precision stage blocks remain available for save compatibility.

  shaped('mechanical_press', 'create:mechanical_press', 1, ['GMG', 'RBR', 'PSP'], {
    G: item('kubejs:iron_gear'), M: item(mechanical), R: item('kubejs:steel_rod'),
    B: item('create_connected:six_way_gearbox'), P: steelSheet, S: tag('c:storage_blocks/steel')
  });
  shaped('rolling_mill', 'createaddition:rolling_mill', 1, ['PRP', 'GRG', 'PCP'], {
    P: steelSheet, R: item('kubejs:steel_rod'), G: item('kubejs:iron_gear'),
    C: item('create:andesite_casing')
  });
  shaped('spring_coiling_machine', 'vintageimprovements:spring_coiling_machine', 1,
    [' P ', 'WMS', ' PC'], {
      P: steelSheet, W: item('vintageimprovements:spring_coiling_machine_wheel'),
      M: item(mechanical), S: item('create:shaft'), C: item('create:andesite_casing')
    });
  // The coiler bends a finished rod; rod production belongs to rolling/manual cutters.
  event.remove({ id: 'vintageimprovements:coiling/iron_rod' });
  recipe('coiling/iron_spring', {
    type: 'vintageimprovements:coiling',
    spring_color: '828282',
    ingredients: [tag('c:rods/iron')],
    results: [{ id: 'vintageimprovements:iron_spring', count: 1 }],
    processing_time: 150
  });

  // Crafters use the world bootstrap in script 27 or arm assembly in script 32.
  recipe('crushing_wheels', {
    type: 'create:mechanical_crafting',
    pattern: ['AAAAA', 'AGSGA', 'ASMSA', 'AGSGA', 'AAAAA'],
    key: { A: item('create:andesite_alloy'), G: item('kubejs:steel_gear'),
      S: tag('c:stones'), M: item(mechanical) },
    result: { id: 'create:crushing_wheel', count: 2 }, accept_mirrored: true
  });
  shaped('basic_energy_mechanism', energy, 1, [' I ', 'WMW', ' CI'], {
    I: item('create:iron_sheet'), W: item('electroenergetics:copper_wire_spool'),
    M: item(mechanical), C: item('electroenergetics:commutator')
  });
});
