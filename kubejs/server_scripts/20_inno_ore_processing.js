// Restored author ore processing; keep first-metal and direct Create crushed routes.
// Closed SAG/Mekanism machinery retains these recipes for later progression.
ServerEvents.recipes(event => {
  function registerOreProcessing(material) {
    const materialId = material.materialId
    const ingot = material.ingot
    const crushedOre = material.crushedOre || `create:crushed_raw_${materialId}`
    const dirtyDust = material.dirtyDust || `createmetallurgy:dirty_${materialId}_dust`
    const normalDust = material.normalDust || `createmetallurgy:${materialId}_dust`
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
})
