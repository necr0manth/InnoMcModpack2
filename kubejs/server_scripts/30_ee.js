// EE 1.1.2: mechanical workshop -> AC generation, local drives and FE transfer.
// DC brushes, stators, wire insulation/spools, meter conversions and motor dyeing stay native.
ServerEvents.recipes(event => {
  const ee = 'electroenergetics:';
  const item = id => ({ item: id });
  const plate = metal => ({ tag: 'c:plates/' + metal });
  const shaped = (name, output, count, pattern, key) => {
    event.custom({
      type: 'minecraft:crafting_shaped',
      category: 'misc',
      pattern: pattern,
      key: key,
      result: { id: output, count: count }
    }).id('kubejs:inno_ee/' + name);
  };
  const replace = name => event.remove({ id: ee + 'crafting/' + name });

  // Hand tools and basic electrical regulation do not need precision mechanics.
  event.replaceInput({ id: ee + 'mechanical_crafting/linemans_stick' },
    'create:precision_mechanism', 'kubejs:steel_rod');
  event.replaceInput({ id: ee + 'crafting/voltage_regulator' },
    'create:precision_mechanism', 'createmechanisms:redstone_mechanism');

  // Four affordable terminals per craft; native double/triple/quad regrouping stays available.
  replace('connector');
  shaped('connector', ee + 'connector', 4, [' W ', ' A ', ' T '], {
    W: item(ee + 'insulated_wire'),
    A: item('create:andesite_alloy'),
    T: { tag: 'minecraft:terracotta' }
  });

  replace('alternator_rotor');
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: [' WSW ', 'IWBWI', ' VSV '],
    key: {
      W: item(ee + 'wire_spool'), I: plate('iron'),
      S: item('create:shaft'), B: item('createmechanisms:basic_energy_mechanism'),
      V: item(ee + 'insulated_wire')
    },
    result: { id: ee + 'alternator_rotor', count: 1 }, accept_mirrored: true
  }).id('kubejs:inno_preview/alternator_rotor_current_v3');

  // Upgrade accessible DC brushes; the native generator exposes phase 1/2/3 and neutral.
  shaped('three_phase_alternator_brushes', ee + 'three_phase_alternator_brushes', 1,
    ['BQB', 'WPW', ' A '], {
      B: plate('brass'),
      Q: item(ee + 'quad_connector'),
      W: item(ee + 'wire_spool'),
      P: item('kubejs:steel_rod'),
      A: item(ee + 'alternator_brushes')
    });

  // Only direct motor crafts are replaced. All 16 native *_electric_motor_dye recipes survive.
  const colors = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink',
    'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'];
  const insulatedMotorComparisons = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'];
  colors.forEach(color => {
    const name = color + '_electric_motor';
    replace(name);
    const motorKey = spool => ({
      C: item(ee + 'connector'),
      W: item(ee + spool),
      R: item(ee + 'commutator'),
      P: item('createmechanisms:basic_energy_mechanism'),
      D: item('minecraft:' + color + '_dye'),
      B: item('create:brass_casing')
    });
    if (insulatedMotorComparisons.includes(color)) {
      var motor = spool => ({
        type: 'minecraft:crafting_shaped', category: 'misc',
        pattern: ['C C', 'RPD', 'WBW'], key: motorKey(spool),
        result: { id: ee + name, count: 1 }
      });
      event.custom(motor('wire_spool')).id('kubejs:inno_preview/' + name + '_current_v2');
    } else {
      shaped(name, ee + name, 1, ['C C', 'RPD', 'WBW'], motorKey('copper_wire_spool'));
    }
  });

  // Basic FE connection hardware is available before precision assembly.
  replace('converter');
  shaped('converter', ee + 'converter', 1, ['CW', 'IT'], {
    C: item(ee + 'connector'),
    W: item(ee + 'insulated_wire'),
    I: plate('iron'),
    T: { tag: 'minecraft:terracotta' }
  });

  // These AC instruments are registered in EE 1.1.2 but have no bundled survival recipes.
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GVG', 'ILB', 'WCW'],
    key: {
      G: item('minecraft:glass'),
      V: item(ee + 'voltmeter'),
      I: item(ee + 'inductor'),
      L: item('createmechanisms:logic_mechanism'),
      B: item('mekanism:basic_control_circuit'),
      W: item(ee + 'insulated_wire'),
      C: item(ee + 'double_connector')
    },
    result: { id: ee + 'frequency_meter', count: 1 }
  }).id('kubejs:inno_preview/frequency_meter_current_v2');
  event.custom({
    type: 'minecraft:crafting_shaped', category: 'misc',
    pattern: ['CMC', 'FQF', 'WBW'],
    key: {
      C: item(ee + 'double_connector'), M: item('minecraft:compass'),
      F: item(ee + 'frequency_meter'), Q: item('minecraft:comparator'),
      W: item(ee + 'insulated_wire'), B: item('create:brass_casing')
    },
    result: { id: ee + 'synchroscope', count: 1 }
  }).id('kubejs:inno_preview/synchroscope_current_v2');

  // Optional polymer insulation after Petrochem; native dried-kelp insulation stays available.
  event.custom({
    type: 'create:filling',
    ingredients: [
      item(ee + 'copper_wire'),
      { type: 'neoforge:single', amount: 100, fluid: 'petrochem:plastic' }
    ],
    results: [{ id: ee + 'insulated_wire', count: 1 }]
  }).id('kubejs:inno_ee/polymer_insulated_wire');
});
