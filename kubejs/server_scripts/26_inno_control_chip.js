// Six manually assembled crafters make the first control chip without a precision mechanism.
ServerEvents.recipes(function (event) {
  event.remove({ output: 'create_connected:control_chip' });
  event.remove({ id: 'create_connected:sequenced_assembly/control_chip' });

  event.custom({
    type: 'create:mechanical_crafting',
    pattern: ['GQG', 'WAR'],
    key: {
      G: { item: 'minecraft:gold_nugget' },
      Q: { item: 'minecraft:quartz' },
      W: { item: 'electroenergetics:insulated_wire' },
      A: { item: 'createdeco:andesite_sheet' },
      R: { item: 'minecraft:redstone' }
    },
    result: { id: 'create_connected:control_chip', count: 1 },
    accept_mirrored: false
  }).id('kubejs:inno_bootstrap/control_chip');
});
