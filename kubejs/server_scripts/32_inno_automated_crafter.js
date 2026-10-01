// After the bootstrap, mechanical arms assemble crafters using precision mechanisms.
ServerEvents.recipes(function (event) {
  var unfinished = 'kubejs:incomplete_mechanical_crafter';
  var item = function (id) { return { item: id }; };
  var components = [
    'create:precision_mechanism',
    'minecraft:crafting_table',
    'create:electron_tube'
  ];

  // The earlier script removes native alternatives before adding the manual route.
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('create:brass_casing'),
    transitional_item: { id: unfinished },
    sequence: components.map(function (component) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(unfinished), item(component)],
        results: [{ id: unfinished, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: 'create:mechanical_crafter', count: 1, chance: 1.0 }],
    loops: 1
  }).id('kubejs:inno_bootstrap/automated_mechanical_crafter');
});
