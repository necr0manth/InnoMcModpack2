// Registry changes require a cold restart, not a recipe reload.
StartupEvents.registry('item', function (event) {
  [
    ['iron', 'Iron Gear', 0xDBDFE2],
    ['steel', 'Steel Gear', 0x838A92],
    ['brass', 'Brass Gear', 0xEAC46B]
  ].forEach(function (part) {
    event.create(part[0] + '_gear')
      .displayName(part[1])
      .texture('enderio:item/iron_gear')
      .color(0, part[2]);
  });
  event.create('steel_rod')
    .displayName('Steel Rod')
    .texture('createvintageneoforged:item/iron_rod')
    .color(0, 0x838A92);
});

// Different block IDs preserve each manual step when broken, moved or saved.
StartupEvents.registry('block', function (event) {
  ['zinc', 'precision'].forEach(function (mechanism) {
    for (var stage = 0; stage < 3; stage++) {
      event.create(mechanism + '_mechanism_assembly_' + stage)
        .displayName((mechanism === 'zinc' ? 'Mechanical' : 'Precision') +
          ' Assembly (' + stage + '/3)')
        .texture('create:block/' + (mechanism === 'zinc' ? 'andesite' : 'brass') + '_casing')
        .hardness(1.5)
        .resistance(6);
    }
  });
});
