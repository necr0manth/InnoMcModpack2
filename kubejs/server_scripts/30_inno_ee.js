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
    W: item(ee + 'copper_wire'),
    A: item('create:andesite_alloy'),
    T: { tag: 'minecraft:terracotta' }
  });

  replace('alternator_rotor');
  shaped('alternator_rotor', ee + 'alternator_rotor', 1, ['WIW', 'SBS', 'WIW'], {
    W: item(ee + 'copper_wire_spool'),
    I: plate('iron'),
    S: item('create:shaft'),
    B: item('createmechanisms:basic_energy_mechanism')
  });

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
  colors.forEach(color => {
    const name = color + '_electric_motor';
    replace(name);
    shaped(name, ee + name, 1, ['C C', 'RPD', 'WBW'], {
      C: item(ee + 'connector'),
      W: item(ee + 'copper_wire_spool'),
      R: item(ee + 'commutator'),
      P: item('createmechanisms:basic_energy_mechanism'),
      D: item('minecraft:' + color + '_dye'),
      B: item('create:brass_casing')
    });
  });

  // Basic FE connection hardware is available before precision assembly.
  replace('converter');
  shaped('converter', ee + 'converter', 1, ['CW', 'IT'], {
    C: item(ee + 'connector'),
    W: item(ee + 'copper_wire'),
    I: plate('iron'),
    T: { tag: 'minecraft:terracotta' }
  });

  // These AC instruments are registered in EE 1.1.2 but have no bundled survival recipes.
  shaped('frequency_meter', ee + 'frequency_meter', 1, [' G ', 'IVP', ' C '], {
    G: item('minecraft:glass'),
    I: item(ee + 'inductor'),
    V: item(ee + 'voltmeter'),
    P: item('create:precision_mechanism'),
    C: item(ee + 'double_connector')
  });
  shaped('synchroscope', ee + 'synchroscope', 1, ['CMC', 'FPF', ' B '], {
    C: item(ee + 'double_connector'),
    M: item('minecraft:compass'),
    F: item(ee + 'frequency_meter'),
    P: item('create:precision_mechanism'),
    B: item('create:brass_casing')
  });

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
