// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'mekanism:control_circuit/basic' });
  var unfinished = 'create:incomplete_precision_mechanism';
  var item = function (id) { return { item: id }; };
  var parts = [
    { item: 'electroenergetics:insulated_wire' },
    item('minecraft:redstone'),
    item('ae2:silicon'),
    item('minecraft:gold_nugget')
  ];
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: { tag: 'c:plates/osmium' },
    transitional_item: { id: unfinished },
    sequence: parts.map(function (part) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(unfinished), part],
        results: [{ id: unfinished, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [
      { id: 'mekanism:basic_control_circuit', count: 1, chance: 80.0 },
      { id: 'minecraft:iron_nugget', count: 1, chance: 10.0 },
      { id: 'minecraft:redstone', count: 1, chance: 10.0 }
    ],
    loops: 3
  }).id('kubejs:inno_preview/basic_control_circuit_v1');
});
