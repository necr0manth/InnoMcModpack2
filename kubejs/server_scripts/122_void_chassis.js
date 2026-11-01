// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:void_chassis' });

  var unfinished = 'create:incomplete_precision_mechanism';
  var item = function (id) { return { item: id }; };
  var components = ['enderio:grains_of_infinity', 'enderio:iron_gear', 'enderio:grains_of_infinity'];
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('mekanism:steel_casing'),
    transitional_item: { id: unfinished },
    sequence: components.map(function (component) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(unfinished), item(component)],
        results: [{ id: unfinished, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: 'enderio:void_chassis', count: 1, chance: 1.0 }],
    loops: 1
  }).id('kubejs:inno_preview/void_chassis_v6');
});
