// New registry entries require a full game restart.
StartupEvents.registry('item', function (event) {
  [['crystal', 'Crystal'], ['shard', 'Shard'], ['clump', 'Clump']].forEach(function (part) {
    event.create(part[0] + '_zinc')
      .displayName('Zinc ' + part[1])
      .texture('mekanism:item/' + part[0] + '_tin')
      .color(0, 0xBCD5C2)
      .tag('c:' + part[0] + 's/zinc');
  });
});

StartupEvents.registry('mekanism:chemical', function (event) {
  var Chemical = Java.loadClass('mekanism.api.chemical.Chemical');
  var ChemicalBuilder = Java.loadClass('mekanism.api.chemical.ChemicalBuilder');
  var ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');
  event.createCustom('kubejs:dirty_zinc', function () {
    return new Chemical(ChemicalBuilder.dirtySlurry().tint(0x7C9782)
      .ore(ResourceLocation.parse('c:ores/zinc')));
  });
  event.createCustom('kubejs:clean_zinc', function () {
    return new Chemical(ChemicalBuilder.cleanSlurry().tint(0xBCD5C2)
      .ore(ResourceLocation.parse('c:ores/zinc')));
  });
});
