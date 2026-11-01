// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowering/enori' });
  event.custom({
    type: 'actuallyadditions:empowering',
    base: { item: 'actuallyadditions:enori_crystal' },
    color: 13421772,
    energy: 5000,
    modifiers: [
      { item: 'mekanism:enriched_iron' },
      { tag: 'c:ingots/steel' },
      { tag: 'c:ingots/dark_steel' },
      { tag: 'c:dusts/coal' }
    ],
    result: { count: 1, id: 'actuallyadditions:empowered_enori_crystal' },
    time: 50
  }).id('kubejs:inno_preview/empowered_enori_crystal_v2');
});
