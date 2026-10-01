// Only Get Creative's mechanical arms can perform these sequenced assembly steps.
ServerEvents.recipes(function (event) {
  var precision = 'create:precision_mechanism';
  var unfinished = 'create:incomplete_precision_mechanism';
  var item = function (id) { return { item: id }; };
  var components = [
    'createmechanisms:zinc_mechanism',
    'createmechanisms:logic_mechanism',
    'createmechanisms:redstone_mechanism',
    'createvintageneoforged:iron_spring',
    'kubejs:brass_gear'
  ];

  // Removes vanilla/Get Creative alternatives and every manual finished output.
  event.remove({ output: precision });
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('create:brass_sheet'),
    transitional_item: { id: unfinished },
    sequence: components.map(function (component) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(unfinished), item(component)],
        results: [{ id: unfinished, count: 1 }],
        keep_held_item: false
      };
    }),
    results: [{ id: precision, count: 1, chance: 1.0 }],
    loops: 1
  }).id('kubejs:inno_mmm/precision_mechanism');
});
