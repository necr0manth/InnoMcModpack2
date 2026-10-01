// Repair 9 native recipes and suppress 37 stale resources before recipe decoding.
// Original resource paths override the malformed JAR JSON; false creates no recipe.
ServerEvents.generateData('last', function (event) {
  var repaired = {
    "astrological:recipe/cracked_light_jade_tiles/cracked_light_jade_tiles.json": {
      "type": "minecraft:smelting",
      "category": "misc",
      "cookingtime": 200,
      "experience": 0.9,
      "ingredient": {
        "item": "astrological:light_jade_tiles"
      },
      "result": {
        "id": "astrological:cracked_light_jade_tiles",
        "count": 1
      }
    },
    "astrological:recipe/cracked_light_jade_tiles/cracked_light_jade_tiles_blasting.json": {
      "type": "minecraft:blasting",
      "category": "misc",
      "cookingtime": 100,
      "experience": 0.9,
      "ingredient": {
        "item": "astrological:light_jade_tiles"
      },
      "result": {
        "id": "astrological:cracked_light_jade_tiles",
        "count": 1
      }
    },
    "astrological:recipe/purpurite_tiles/popped_purpurite.json": {
      "type": "minecraft:smelting",
      "category": "misc",
      "cookingtime": 200,
      "experience": 0.9,
      "ingredient": {
        "item": "astrological:purpurite_blob"
      },
      "result": {
        "id": "astrological:popped_purpurite",
        "count": 1
      }
    },
    "astrological:recipe/purpurite_tiles/popped_purpurite_blasting.json": {
      "type": "minecraft:blasting",
      "category": "misc",
      "cookingtime": 100,
      "experience": 0.9,
      "ingredient": {
        "item": "astrological:purpurite_blob"
      },
      "result": {
        "id": "astrological:popped_purpurite",
        "count": 1
      }
    },
    "cbc_at:recipe/cutting/rocket_pod_breech_cast_mould.json": {
      "type": "create:cutting",
      "ingredients": [
        {
          "tag": "minecraft:logs"
        }
      ],
      "results": [
        {
          "id": "cbc_at:rocket_pod_breech_mould"
        }
      ]
    },
    "cbc_at:recipe/cutting/rocket_pod_rail_cast_mould.json": {
      "type": "create:cutting",
      "ingredients": [
        {
          "tag": "minecraft:logs"
        }
      ],
      "results": [
        {
          "id": "cbc_at:rocket_pod_rail_mould"
        }
      ]
    },
    "cbc_at:recipe/cutting/twin_autocannon_barrel_cast_mould.json": {
      "type": "create:cutting",
      "ingredients": [
        {
          "tag": "minecraft:logs"
        }
      ],
      "results": [
        {
          "id": "cbc_at:twin_autocannon_barrel_mould"
        }
      ]
    },
    "cbc_at:recipe/munition/rocket/rocket_fuzing.json": {
      "type": "cbc_at:rocket_fuzing",
      "category": "misc"
    },
    "createdeco:recipe/placard.json": {
      "type": "minecraft:crafting_shapeless",
      "category": "misc",
      "group": "dye_placard",
      "ingredients": [
        {
          "tag": "createdeco:placards"
        },
        {
          "item": "minecraft:white_dye"
        }
      ],
      "result": {
        "count": 1,
        "id": "create:placard"
      }
    }
  };
  Object.keys(repaired).forEach(function (resource) {
    event.json(resource, repaired[resource]);
  });

  var suppressed = [
    "ae2cs:recipe/mek_crushing/quantum_crystal_dust.json",
    "ae2lt:recipe/assembler/overload_processor.json",
    "createsprings:recipe/sequenced_assembly/pse.json",
    "createsprings:recipe/sequenced_assembly/punchcard.json",
    "gearbox:recipe/centrifuging/test.json",
    "gearbox:recipe/centrifuging/test2.json",
    "gearbox:recipe/compressing/obsidian.json",
    "gearbox:recipe/compressing/test.json",
    "gearbox:recipe/compressing/test2.json",
    "gearbox:recipe/distilling/test.json",
    "gearbox:recipe/electrolyzing/test.json",
    "gearbox:recipe/irradiating/test01.json",
    "gearbox:recipe/laser_drilling/test.json",
    "gearbox:recipe/mechanizing/test.json",
    "gearbox:recipe/pumpjack/test.json",
    "gearbox:recipe/pyroprocessing/test.json",
    "gearbox:recipe/reacting/test.json",
    "gearbox:recipe/sapping/test.json",
    "gearbox:recipe/sequenced_assembly/test_assembly.json",
    "gearbox:recipe/transmuting/test01.json",
    "productivebees:recipe/bee_produce/enderio_evolution/construction_alloy.json",
    "productivebees:recipe/bee_produce/enderio_evolution/crude_steel.json",
    "productivebees:recipe/bee_produce/enderio_evolution/crystalline_alloy.json",
    "productivebees:recipe/bee_produce/enderio_evolution/crystalline_pink_slime.json",
    "productivebees:recipe/bee_produce/enderio_evolution/energetic_silver.json",
    "productivebees:recipe/bee_produce/enderio_evolution/melodic_alloy.json",
    "productivebees:recipe/bee_produce/enderio_evolution/stellar_alloy.json",
    "productivebees:recipe/bee_produce/enderio_evolution/vivid_alloy.json",
    "productivebees:recipe/centrifuge/enderio_evolution/construction_alloy.json",
    "productivebees:recipe/centrifuge/enderio_evolution/crude_steel.json",
    "productivebees:recipe/centrifuge/enderio_evolution/crystalline_alloy.json",
    "productivebees:recipe/centrifuge/enderio_evolution/crystalline_pink_slime.json",
    "productivebees:recipe/centrifuge/enderio_evolution/energetic_silver.json",
    "productivebees:recipe/centrifuge/enderio_evolution/melodic_alloy.json",
    "productivebees:recipe/centrifuge/enderio_evolution/stellar_alloy.json",
    "productivebees:recipe/centrifuge/enderio_evolution/vivid_alloy.json",
    "s_a_b:recipe/glassarmor.json"
  ];
  suppressed.forEach(function (resource) {
    event.json(resource, {
      type: 'minecraft:crafting_shapeless',
      'neoforge:conditions': [{ type: 'neoforge:false' }]
    });
  });
});
