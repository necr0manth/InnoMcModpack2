// Replace the native primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'simulated:sequenced_assembly/engine_assembly' });
  event.custom({
  "type": "create:sequenced_assembly",
  "ingredient": {
    "tag": "c:plates/steel"
  },
  "loops": 8,
  "results": [
    {
      "chance": 50.0,
      "id": "simulated:engine_assembly"
    },
    {
      "chance": 16.0,
      "id": "create:iron_sheet"
    },
    {
      "chance": 15.0,
      "id": "minecraft:iron_nugget"
    },
    {
      "chance": 10.0,
      "id": "create:industrial_iron_block"
    },
    {
      "chance": 8.0,
      "id": "minecraft:iron_bars"
    },
    {
      "id": "minecraft:iron_helmet"
    }
  ],
  "sequence": [
    {
      "type": "create:cutting",
      "ingredients": [
        {
          "item": "simulated:incomplete_engine_assembly"
        }
      ],
      "results": [
        {
          "id": "simulated:incomplete_engine_assembly"
        }
      ]
    },
    {
      "type": "create:pressing",
      "ingredients": [
        {
          "item": "simulated:incomplete_engine_assembly"
        }
      ],
      "results": [
        {
          "id": "simulated:incomplete_engine_assembly"
        }
      ]
    }
  ],
  "transitional_item": {
    "id": "simulated:incomplete_engine_assembly"
  }
}).id('kubejs:engine_assembly_steel');
});
