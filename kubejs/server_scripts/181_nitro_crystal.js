ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:energizing/nitro_crystal' });
  event.custom({
    type: 'powah:energizing',
    energy: 20000000,
    ingredients: [
      { tag: 'c:nether_stars' },
      { item: 'actuallyadditions:empowered_restonia_crystal' },
      { tag: 'c:storage_blocks/redstone' },
      { item: 'powah:blazing_crystal_block' }
    ],
    result: { count: 16, id: 'powah:crystal_nitro' }
  }).id('kubejs:nitro_crystal_empowered_restonia');
});
