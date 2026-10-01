// Ordinary drives, spring devices and launchers use mechanical, not precision mechanisms.
ServerEvents.recipes(function (event) {
  [
    'create:crafting/kinetics/rotation_speed_controller',
    'create_connected:crafting/kinetics/kinetic_battery',
    'createsprings:shape_crafting/spring_base',
    'createsprings:shape_crafting/spring_drill',
    'createsprings:shape_crafting/spring_fan',
    'createsprings:shape_crafting/spring_saw',
    'createsprings:shape_crafting/spring_showel',
    'createsprings:shape_crafting/spring_launcher',
    'morepropulsion:mechanical_crafting/engine_mount',
    'createdieselgenerators:mechanical_crafting/chemcial_sprayer',
    'create_aeronautics_throwable_rope_connector:rope_connector_launcher'
  ].forEach(function (id) {
    event.replaceInput({ id: id }, 'create:precision_mechanism',
      'createmechanisms:zinc_mechanism');
  });
});
