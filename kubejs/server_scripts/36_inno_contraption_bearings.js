ServerEvents.recipes(event => {
  event.replaceInput({ id: 'createaddition:crafting/servo_motor' },
    'create:mechanical_bearing', 'simulated:swivel_bearing');
  event.replaceInput({ id: 'createdieselgenerators:crafting/pumpjack_bearing' },
    'create:mechanical_bearing', 'simulated:swivel_bearing');
  event.replaceInput({ id: 'createsprings:shape_crafting/friction_welder' },
    'create:mechanical_bearing', 'simulated:swivel_bearing');
});
