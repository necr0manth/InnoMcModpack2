// Late Blaze Mixer assembly uses mechanical arms; its press step stays on a depot.
ServerEvents.recipes(function (event) {
  if (!Platform.isLoaded('blazinghot')) return;
  var unfinished = 'blazinghot:incomplete_blaze_mixer';
  var item = function (id) { return { item: id }; };
  var components = [
    'blazinghot:blaze_whisk',
    'create:cogwheel',
    'create:piston_extension_pole'
  ];

  event.remove({ id: 'blazinghot:sequenced_assembly/blaze_mixer' });
  event.custom({
    type: 'create:sequenced_assembly',
    ingredient: item('blazinghot:blaze_casing'),
    transitional_item: { id: unfinished },
    sequence: [{
      type: 'create:pressing',
      ingredients: [item(unfinished)],
      results: [{ id: unfinished }]
    }].concat(components.map(function (component) {
      return {
        type: 'get_creative:arm_assembly',
        ingredients: [item(unfinished), item(component)],
        results: [{ id: unfinished }],
        keep_held_item: false
      };
    })),
    results: [{ id: 'blazinghot:blaze_mixer' }],
    // Create 6.0.10's recipe codec defaults omitted native loops to 1.
    loops: 1
  }).id('kubejs:inno_blazinghot/blaze_mixer');
});
