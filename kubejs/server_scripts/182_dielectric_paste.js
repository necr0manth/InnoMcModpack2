ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:crafting/dielectric_paste' });
  event.remove({ id: 'powah:crafting/dielectric_paste_2' });

  event.custom({
    type: 'create:mixing',
    ingredients: [
      { tag: 'minecraft:coals' },
      { tag: 'minecraft:coals' },
      { tag: 'minecraft:coals' },
      { item: 'minecraft:clay_ball' },
      { item: 'minecraft:clay_ball' },
      { item: 'minecraft:lava_bucket' }
    ],
    results: [{ id: 'powah:dielectric_paste', count: 24 }]
  }).id('kubejs:dielectric_paste_mixing_lava');

  event.custom({
    type: 'create:mixing',
    ingredients: [
      { tag: 'minecraft:coals' },
      { tag: 'minecraft:coals' },
      { item: 'minecraft:clay_ball' },
      { item: 'minecraft:blaze_powder' }
    ],
    results: [{ id: 'powah:dielectric_paste', count: 16 }]
  }).id('kubejs:dielectric_paste_mixing_blaze');
});
