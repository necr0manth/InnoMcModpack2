// Exact 3x4 layout supplied by the player; assembled with mechanical crafters.
ServerEvents.recipes(function (event) {
  event.custom({
    type: 'create:mechanical_crafting',
    pattern: [' CP', 'SG ', 'MRP', 'B  '],
    key: {
      C: { item: 'create_connected:control_chip' },
      P: { item: 'petrochem:steel_sheet' },
      S: { item: 'createvintageneoforged:iron_spring' },
      G: { item: 'kubejs:brass_gear' },
      M: { item: 'create:precision_mechanism' },
      R: { item: 'create:shaft' },
      B: { item: 'create:brass_casing' }
    },
    result: { id: 'create:mechanical_arm', count: 1 },
    accept_mirrored: false
  }).id('kubejs:inno_bootstrap/compact_mechanical_arm');
});
