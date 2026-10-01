// Separate ordinary blocks preserve every assembly step when broken or saved.
// Adding registry entries requires a full restart.
StartupEvents.registry('block', function (event) {
  for (var stage = 1; stage <= 14; stage++) {
    event.create('arm_assembly_' + stage)
      .displayName('Mechanical Arm Assembly (' + stage + '/14)')
      .texture('create:block/brass_casing')
      .hardness(1.5)
      .resistance(6);
  }
});
