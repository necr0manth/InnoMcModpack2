// Required component recipe; MMM mechanism recipe generation is disabled.
ServerEvents.recipes(function (event) {
  var incomplete = 'createmechanisms:incomplete_advanced_precision_mechanism';
  var item = function (id) { return { item: id }; };
  var parts = [
    item('enderio:dark_bimetal_gear'),
    item('enderio:energized_gear'),
    { tag: 'c:ingots/conductive_alloy' },
    { tag: 'c:ingots/redstone_alloy' }
  ];
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('create:precision_mechanism'),
    transitional_item: { id: incomplete },
    sequence: parts.map(function (part) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(incomplete), part],
        results: [{ id: incomplete, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: 'createmechanisms:advanced_precision_mechanism', count: 1, chance: 1.0 }],
    loops: 3
  }).id('kubejs:inno_preview/advanced_precision_mechanism_v4');
});
