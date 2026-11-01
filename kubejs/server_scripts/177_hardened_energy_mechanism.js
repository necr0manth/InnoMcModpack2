// MMM recipe generation is disabled; assemble the upgraded mechanism with arms.
ServerEvents.recipes(function (event) {
  var incomplete = 'createmechanisms:incomplete_hardened_energy_mechanism';
  var item = function (id) { return { item: id }; };
  var parts = [
    item('powah:steel_energized'),
    item('electroenergetics:insulated_wire')
  ];
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('createmechanisms:basic_energy_mechanism'),
    transitional_item: { id: incomplete },
    sequence: parts.concat([item('powah:dielectric_paste')]).map(function (part) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(incomplete), part],
        results: [{ id: incomplete, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: 'createmechanisms:hardened_energy_mechanism', count: 1, chance: 1.0 }],
    loops: 1
  }).id('kubejs:hardened_energy_mechanism_with_paste');
});
