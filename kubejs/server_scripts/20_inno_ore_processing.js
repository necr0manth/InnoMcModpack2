// Restored author ore processing; keep first-metal and direct Create crushed routes.
// Closed SAG/Mekanism machinery retains these recipes for later progression.
ServerEvents.recipes(event => {
  function registerOreProcessing(material) {
    const materialId = material.materialId
    const ingot = material.ingot
    const crushedOre = material.crushedOre || `create:crushed_raw_${materialId}`
    const dirtyDust = material.dirtyDust || `mekanism:dirty_dust_${materialId}`
    // Almost Unified selects Mekanism dusts and hides the non-canonical variants in EMI.
    const normalDust = material.normalDust || `mekanism:dust_${materialId}`
    const dirtySlurry = material.dirtySlurry || `mekanism:dirty_${materialId}`
    const shard = material.shard || `mekanism:shard_${materialId}`
    const clump = material.clump || `mekanism:clump_${materialId}`
    const clumpTag = material.clumpTag || `c:clumps/${materialId}`
    const oreInputs = material.oreInputs || [
      `minecraft:raw_${materialId}`,
      `minecraft:${materialId}_ore`,
      `minecraft:deepslate_${materialId}_ore`
    ]
    const recipePrefix = `kubejs:ore_processing/${materialId}`

    const conflictingRecipeIds = [
      `create:milling/crushed_raw_${materialId}`,
      `create:splashing/dirty_${materialId}_dust`,
      `createmetallurgy:melting/${materialId}/raw_material`,
      `createmetallurgy:melting/${materialId}/raw_crushed`,
      `enderio:sag_milling/raw_${materialId}`,
      `enderio:sag_milling/${materialId}_ore`,
      `mekanism:processing/${materialId}/dust/from_dirty_dust`,
      `mekanism:processing/${materialId}/dirty_dust/from_clump`,
      `blazinghot:blaze_mixing/melting/crushed_raw_${materialId}`,
      `create_processing:hot_pressing/superheated/crushed/create/${materialId}_ingot_from_crushed_raw_${materialId}`
    ].concat(material.conflictingRecipeIds || [])

    for (const branch of ['dust', 'clump', 'shard', 'slurry/dirty']) {
      for (const source of ['from_ore', 'from_raw_ore', 'from_raw_block']) {
        conflictingRecipeIds.push(`mekanism:processing/${materialId}/${branch}/${source}`)
      }
    }

    for (const recipeId of conflictingRecipeIds) {
      event.remove({ id: recipeId })
    }

    event.custom({
      type: 'enderio:sag_milling',
      energy: 2400,
      input: {
        item: crushedOre
      },
      outputs: [
        {
          item: {
            count: 1,
            id: dirtyDust
          }
        },
        {
          chance: 0.5,
          item: {
            count: 1,
            id: dirtyDust
          }
        }
      ],
      bonus: 'multiply_output'
    }).id(`${recipePrefix}/sag_milling`)

    event.custom({
      type: 'mekanism:injecting',
      chemical_input: {
        amount: 1,
        chemical: 'mekanism:hydrogen_chloride'
      },
      item_input: {
        count: 1,
        item: crushedOre
      },
      output: {
        count: 2,
        id: shard
      },
      per_tick_usage: true
    }).id(`${recipePrefix}/injecting_crushed`)

    event.custom({
      type: 'mekanism:purifying',
      chemical_input: {
        amount: 1,
        chemical: 'mekanism:oxygen'
      },
      item_input: {
        count: 2,
        item: crushedOre
      },
      output: {
        count: 3,
        id: clump
      },
      per_tick_usage: true
    }).id(`${recipePrefix}/purifying_crushed`)

    event.custom({
      type: 'mekanism:enriching',
      input: {
        count: 3,
        item: crushedOre
      },
      output: {
        count: 4,
        id: normalDust
      }
    }).id(`${recipePrefix}/enriching_crushed`)

    event.custom({
      type: 'create:splashing',
      ingredients: [
        {
          item: dirtyDust
        }
      ],
      results: [
        {
          count: 1,
          id: normalDust
        },
        {
          chance: 0.5,
          count: 1,
          id: normalDust
        }
      ]
    }).id(`${recipePrefix}/splashing`)

    event.smelting(ingot, dirtyDust).id(`${recipePrefix}/smelting`)
    event.blasting(ingot, dirtyDust).id(`${recipePrefix}/blasting`)
    event.smelting(ingot, normalDust).id(`${recipePrefix}/smelting_normal_dust`)
    event.blasting(ingot, normalDust).id(`${recipePrefix}/blasting_normal_dust`)

    event.custom({
      type: 'mekanism:dissolution',
      chemical_input: {
        amount: 1,
        chemical: 'mekanism:sulfuric_acid'
      },
      item_input: {
        count: 1,
        item: dirtyDust
      },
      output: {
        amount: 600,
        id: dirtySlurry
      },
      per_tick_usage: true
    }).id(`${recipePrefix}/dissolution`)

    event.custom({
      type: 'mekanism:crushing',
      input: {
        count: 1,
        tag: clumpTag
      },
      output: {
        count: 1,
        id: normalDust
      }
    }).id(`${recipePrefix}/crushing_clump`)
  }

  registerOreProcessing({
    materialId: 'gold',
    ingot: 'minecraft:gold_ingot',
    oreInputs: [
      'minecraft:raw_gold',
      'minecraft:gold_ore',
      'minecraft:deepslate_gold_ore',
      'minecraft:nether_gold_ore'
    ]
  })

  registerOreProcessing({
    materialId: 'iron',
    ingot: 'minecraft:iron_ingot',
    conflictingRecipeIds: [
      'create_processing:magnetic_pressing/magnetic/basic/iron_nugget_from_crushed_raw_iron'
    ]
  })

  registerOreProcessing({
    materialId: 'copper',
    ingot: 'minecraft:copper_ingot'
  })

  registerOreProcessing({
    materialId: 'lead',
    ingot: 'mekanism:ingot_lead',
    oreInputs: ['mekanism:raw_lead', 'mekanism:lead_ore', 'mekanism:deepslate_lead_ore']
  })

  registerOreProcessing({
    materialId: 'osmium',
    ingot: 'mekanism:ingot_osmium',
    oreInputs: ['mekanism:raw_osmium', 'mekanism:osmium_ore', 'mekanism:deepslate_osmium_ore']
  })

  registerOreProcessing({
    materialId: 'uranium',
    ingot: 'mekanism:ingot_uranium',
    oreInputs: ['mekanism:raw_uranium', 'mekanism:uranium_ore', 'mekanism:deepslate_uranium_ore']
  })

  registerOreProcessing({
    materialId: 'tin',
    ingot: 'mekanism:ingot_tin',
    oreInputs: ['mekanism:raw_tin', 'mekanism:tin_ore', 'mekanism:deepslate_tin_ore']
  })

  // Mekanism has no zinc intermediates; reuse existing dusts and register only missing stages.
  registerOreProcessing({
    materialId: 'zinc',
    ingot: 'create:zinc_ingot',
    dirtyDust: 'createmetallurgy:dirty_zinc_dust',
    normalDust: 'createmetallurgy:zinc_dust',
    dirtySlurry: 'kubejs:dirty_zinc',
    shard: 'kubejs:shard_zinc',
    clump: 'kubejs:clump_zinc',
    oreInputs: ['create:raw_zinc', 'create:zinc_ore', 'create:deepslate_zinc_ore']
  })

  event.custom({
    type: 'mekanism:washing',
    chemical_input: { amount: 1, chemical: 'kubejs:dirty_zinc' },
    fluid_input: { amount: 5, tag: 'minecraft:water' },
    output: { amount: 1, id: 'kubejs:clean_zinc' }
  }).id('kubejs:ore_processing/zinc/washing_slurry')

  event.custom({
    type: 'mekanism:crystallizing',
    input: { amount: 200, chemical: 'kubejs:clean_zinc' },
    output: { count: 1, id: 'kubejs:crystal_zinc' }
  }).id('kubejs:ore_processing/zinc/crystallizing')

  event.custom({
    type: 'mekanism:injecting',
    chemical_input: { amount: 1, chemical: 'mekanism:hydrogen_chloride' },
    item_input: { count: 1, tag: 'c:crystals/zinc' },
    output: { count: 1, id: 'kubejs:shard_zinc' },
    per_tick_usage: true
  }).id('kubejs:ore_processing/zinc/injecting_crystal')

  event.custom({
    type: 'mekanism:purifying',
    chemical_input: { amount: 1, chemical: 'mekanism:oxygen' },
    item_input: { count: 1, tag: 'c:shards/zinc' },
    output: { count: 1, id: 'kubejs:clump_zinc' },
    per_tick_usage: true
  }).id('kubejs:ore_processing/zinc/purifying_shard')
})
