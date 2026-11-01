// Upgrade the hardened mechanism with an energizing crystal and conductive alloy.
ServerEvents.recipes(function (event) {
  var incomplete = 'createmechanisms:incomplete_blazing_energy_mechanism';
  var item = function (id) { return { item: id }; };
  var parts = [
    item('powah:crystal_blazing'),
    { tag: 'c:ingots/redstone_alloy' }
  ];
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('createmechanisms:hardened_energy_mechanism'),
    transitional_item: { id: incomplete },
    sequence: parts.concat([
      item('powah:capacitor_blazing'),
      item('enderio:double_layer_capacitor')
    ]).map(function (part) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(incomplete), part],
        results: [{ id: incomplete, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: 'createmechanisms:blazing_energy_mechanism', count: 1, chance: 1.0 }],
    loops: 1
  }).id('kubejs:blazing_energy_mechanism_with_capacitors');
});
