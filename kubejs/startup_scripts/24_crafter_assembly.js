// Permanent block IDs preserve manual progress across breaking, moving and saves.
// These registry additions require a full restart.
StartupEvents.registry('block', function (event) {
  for (var stage = 1; stage <= 10; stage++) {
    event.create('crafter_assembly_' + stage)
      .displayName('Mechanical Crafter Assembly (' + stage + '/10)')
      .texture('create:block/brass_casing')
      .hardness(1.5)
      .resistance(6);
  }
});
