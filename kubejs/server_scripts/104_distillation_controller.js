// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'petrochem:crafting/null/distillation_controller' });
  event.custom({
  "type": "minecraft:crafting_shaped",
  "category": "misc",
  "pattern": [
    "SCS",
    "PMP",
    "WTW"
  ],
  "key": {
    "S": {
      "tag": "c:plates/steel"
    },
    "C": {
      "item": "mekanism:basic_control_circuit"
    },
    "P": {
      "item": "petrochem:steel_fluid_pipe"
    },
    "M": {
      "item": "createmechanisms:fluid_mechanism"
    },
    "W": {
      "item": "electroenergetics:insulated_wire"
    },
    "T": {
      "item": "create:fluid_tank"
    }
  },
  "result": {
    "id": "petrochem:distillation_controller",
    "count": 1
  }
}).id('kubejs:inno_preview/distillation_controller_current_v2');
});
