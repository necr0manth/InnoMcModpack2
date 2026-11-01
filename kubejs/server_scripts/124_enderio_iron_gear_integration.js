// Ender IO's iron gear is a distinct component, not the workshop gear.
ServerEvents.recipes(function (event) {
  [
    'enderio:impulse_hopper',
    'enderio:vat',
    'enderio:crafter',
    'enderio:sag_mill',
    'enderio:painting_machine',
    'enderio:energized_gear',
    'enderio:alloy_smelter',
    'enderio:drain',
    'enderio:stirling_generator',
    'enderio:dark_bimetal_gear',
    'enderio_evolution:machine/simple_stirling_generator'
  ].forEach(function (id) {
    event.replaceInput({ id: id }, '#c:gears/iron', 'enderio:iron_gear');
  });
});
