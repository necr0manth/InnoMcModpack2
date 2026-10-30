// Ordinary item stacks carry Create's sequenced assembly progress component.
StartupEvents.registry('item', function (event) {
  event.create('incomplete_mechanical_crafter')
    .displayName('Incomplete Mechanical Crafter')
    .texture('create:item/incomplete_precision_mechanism');
});
