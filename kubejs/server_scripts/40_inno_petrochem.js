// Petrochem 1.3.3 / Create 6: a bounded refinery on the installed machines.
// mB ratios are gameplay coefficients, not molar or mass balances.
// A returned brick + iron-bars bed represents supported reactor packing.
// The active catalyst chemistry and high process pressure are abstracted;
// neither ordinary iron nor the mixer is claimed to be an industrial catalyst/reactor.
ServerEvents.recipes(event => {
  const fluid = (id, amount) => ({ type: 'neoforge:single', fluid: id, amount: amount })
  const out = (id, amount) => ({ id: id, amount: amount })
  const bed = [{ item: 'minecraft:brick' }, { item: 'minecraft:iron_bars' }]
  const returnedBed = [{ id: 'minecraft:brick', count: 1 }, { id: 'minecraft:iron_bars', count: 1 }]
  const recipe = (name, type, ingredients, results, fields) => {
    event.custom(Object.assign({ type: type, ingredients: ingredients, results: results }, fields || {}))
      .id('inno:petrochem/' + name)
  }
  const mixing = (name, ingredients, results, time, heat, withBed) => {
    recipe(name, 'create:mixing', withBed ? ingredients.concat(bed) : ingredients,
      withBed ? results.concat(returnedBed) : results,
      { processing_time: time, heat_requirement: heat || 'heated' })
  }
  const hydroTreat = (name, input, clean, amount, hydrogen) => {
    mixing(name, [fluid('petrochem:' + input, amount), fluid('petrochem:hydrogen', hydrogen)],
      [out('petrochem:' + clean, amount), out('petrochem:hydrogen_sulfide', hydrogen / 4)], 200, 'heated', true)
  }

  // Only obsolete oil routes/fuels: unrelated metalworking, biofuels and tools survive.
  const removed = [
    'petrochem:electrolyzing/basic_desalting', 'petrochem:electrolyzing/water_electrolysis',
    'petrochem:distilling/basic_flash', 'petrochem:distilling/basic_atmospheric',
    'petrochem:distilling/basic_vacuum', 'petrochem:mixing/basic_gasoline',
    'petrochem:mixing/basic_plastic', 'petrochem:mixing/basic_deasphalting',
    'petrochem:compacting/coking', 'petrochem:pumpjack/jungle', 'petrochem:pumpjack/swamp',
    'petrochem:diesel_engine_fuel/raw_petroleum', 'petrochem:diesel_engine_fuel/fuel_oil',
    'petrochem:diesel_engine_fuel/diesel', 'petrochem:gasoline_engine_fuel/gasoline',
    'petrochem:gasoline_engine_fuel/kerosene',
    'petrochem:mixing/bronze_alloy',
    'createaddition:liquid_burning/crude_oil',
    'createdieselgenerators:distillation/crude_oil',
    'createdieselgenerators:distillation/superheated_crude_oil'
  ]
  removed.forEach(id => event.remove({ id: id }))

  // Same native bronze recipe, except tin accepts ordinary mined/smelted tin.
  // Preserve native copper, output/default count and heat/default duration.
  recipe('bronze_alloy', 'create:mixing',
    [{ item: 'minecraft:copper_ingot' }, { tag: 'c:nuggets/tin' }],
    [{ id: 'petrochem:bronze_ingot' }], { heat_requirement: 'heated' })

  // Preserve biome production rates, but all wells now supply crude feed.
  // Native pumpjack accepts biome tags, but its KubeJS schema requires an ID.
  // Enumerate the installed is_jungle members (vanilla + Nature's Spirit).
  event.custom({ type: 'petrochem:pumpjack', biome: 'minecraft:jungle',
    results: [out('petrochem:petroleum', 100)] }).id('inno:petrochem/pumpjack_jungle')
  event.custom({ type: 'petrochem:pumpjack', biome: 'minecraft:bamboo_jungle',
    results: [out('petrochem:petroleum', 100)] }).id('inno:petrochem/pumpjack_bamboo_jungle')
  event.custom({ type: 'petrochem:pumpjack', biome: 'minecraft:sparse_jungle',
    results: [out('petrochem:petroleum', 100)] }).id('inno:petrochem/pumpjack_sparse_jungle')
  event.custom({ type: 'petrochem:pumpjack', biome: 'natures_spirit:bamboo_wetlands',
    results: [out('petrochem:petroleum', 100)] }).id('inno:petrochem/pumpjack_bamboo_wetlands')
  event.custom({ type: 'petrochem:pumpjack', biome: 'minecraft:swamp',
    results: [out('petrochem:petroleum', 110)] }).id('inno:petrochem/pumpjack_swamp')

  // FE is per tick (scaled by the electrolyzer knob), not per batch.
  // Electrolyzing processing_time is ignored by this installed implementation.
  recipe('desalting', 'petrochem:electrolyzing',
    [{ type: 'neoforge:tag', tag: 'c:crude_oil', amount: 500 }, fluid('minecraft:water', 100)],
    [out('petrochem:desalted_oil', 500), out('petrochem:oil_brine', 100)], { energy: 60 })
  recipe('water_electrolysis', 'petrochem:electrolyzing', [fluid('minecraft:water', 300)],
    [out('petrochem:hydrogen', 200), out('petrochem:oxygen', 100)], { energy: 80 })
  // Lumped brine concentration/recovery: not a claim that oily brine is potable.
  mixing('brine_recovery', [fluid('petrochem:oil_brine', 100)],
    [out('minecraft:water', 80), { id: 'petrochem:salt_dust', count: 1 }], 200)

  // Native controller enforces flash steam, atmospheric heat/width, vacuum heat/air.
  recipe('flash_distillation', 'petrochem:distilling', [fluid('petrochem:desalted_oil', 1200)],
    [out('petrochem:oil', 1000), out('petrochem:light_naphta', 150), out('petrochem:lpg', 50)],
    { mode: 'DISTIL_FLASH', processing_time: 200 })
  recipe('atmospheric_distillation', 'petrochem:distilling', [fluid('petrochem:oil', 2000)],
    [out('petrochem:oil_residue', 600), out('petrochem:light_diesel', 350),
      out('petrochem:heavy_diesel', 250), out('petrochem:kerosene', 300), out('petrochem:heavy_naphta', 500)],
    { mode: 'DISTIL_ATMOSPHERIC', processing_time: 300 })
  recipe('vacuum_distillation', 'petrochem:distilling', [fluid('petrochem:oil_residue', 600)],
    [out('petrochem:heavy_oil_residue', 200), out('petrochem:heavy_gas_oil', 250), out('petrochem:fuel_oil', 150)],
    { mode: 'DISTIL_VACUUM', processing_time: 300 })

  hydroTreat('light_diesel_hydrotreating', 'light_diesel', 'diesel', 200, 40)
  hydroTreat('heavy_diesel_hydrotreating', 'heavy_diesel', 'desulfurized_heavy_diesel', 200, 80)
  hydroTreat('kerosene_hydrotreating', 'kerosene', 'desulfurized_kerosene', 200, 40)
  hydroTreat('naphtha_hydrotreating', 'heavy_naphta', 'desulfurized_heavy_naphta', 500, 80)
  hydroTreat('gas_oil_hydrotreating', 'heavy_gas_oil', 'hydrotreated_gas_oil', 200, 80)
  mixing('diesel_blending', [fluid('petrochem:diesel', 300), fluid('petrochem:desulfurized_heavy_diesel', 200)],
    [out('petrochem:diesel', 500)], 100)
  // Conditional hydrocracking: hydrogen + heat + returned bed; no JSON pressure claim.
  mixing('gas_oil_hydrocracking', [fluid('petrochem:hydrotreated_gas_oil', 300), fluid('petrochem:hydrogen', 100)],
    [out('petrochem:hydrocracked_gasoline', 240), out('petrochem:lpg', 40)], 300, 'heated', true)
  // Registered untreated_gasoline is the lumped reformate carrier (not raw feed).
  // Reforming releases H2; the feed has already undergone mandatory sulfur removal.
  mixing('naphtha_reforming', [fluid('petrochem:desulfurized_heavy_naphta', 500)],
    [out('petrochem:untreated_gasoline', 450), out('petrochem:hydrogen', 100)], 300, 'heated', true)
  mixing('gasoline_blending', [fluid('petrochem:untreated_gasoline', 300), fluid('petrochem:hydrocracked_gasoline', 200)],
    [out('petrochem:gasoline', 500)], 120)

  // Thermal steam cracking is distinct from subsequent monomer polymerization.
  mixing('naphtha_steam_cracking', [fluid('petrochem:light_naphta', 200), fluid('petrochem:steam', 200)],
    [out('petrochem:ethylene', 120), out('petrochem:lpg', 40)], 300, 'heated')
  mixing('ethylene_polymerization', [fluid('petrochem:ethylene', 200)],
    [out('petrochem:plastic', 180)], 200, 'heated', true)

  recipe('residue_coking', 'create:compacting', [fluid('petrochem:heavy_oil_residue', 600)],
    [out('petrochem:fuel_oil', 300), { id: 'petrochem:petroleum_coke', count: 2 }],
    { processing_time: 300, heat_requirement: 'superheated' })
  // Lumped solvent extraction + solvent recovery + final lube finishing.
  // LPG models the light paraffinic solvent; 95% recovery needs makeup feed.
  // No separate DAO/wax fluids are registered, and this does not simulate hydrotreating.
  mixing('lube_solvent_finishing', [fluid('petrochem:fuel_oil', 500), fluid('petrochem:lpg', 200)],
    [out('petrochem:lubricant', 150), out('petrochem:lpg', 190), { id: 'petrochem:asphalt', count: 2 }], 300)
  // Combined oxidation/Claus recovery: SO2 intermediate is deliberately lumped.
  mixing('sulfur_recovery', [fluid('petrochem:hydrogen_sulfide', 100), fluid('petrochem:oxygen', 100)],
    [out('minecraft:water', 100), { id: 'petrochem:sulfur_dust', count: 1 }], 200)

  // Explicit clean fluids prevent a later broad common tag from reopening raw fuels.
  recipe('diesel_engine_fuel', 'petrochem:diesel_engine_fuel', [fluid('petrochem:diesel', 1)], [], { processing_time: 5 })
  recipe('gasoline_engine_fuel', 'petrochem:gasoline_engine_fuel', [fluid('petrochem:gasoline', 1)], [], { processing_time: 12 })
  recipe('kerosene_engine_fuel', 'petrochem:gasoline_engine_fuel', [fluid('petrochem:desulfurized_kerosene', 1)], [], { processing_time: 15 })
})
