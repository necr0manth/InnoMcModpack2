// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'enderio:xp_vacuum' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SPS', 'GXG', 'SVS'],
    key: {
      S: { item: 'enderio:soularium_ingot' },
      P: { item: 'enderio:pulsating_crystal' },
      G: { item: 'enderio:iron_gear' },
      X: { item: 'minecraft:experience_bottle' },
      V: { item: 'enderio:void_chassis' }
    },
    result: { id: 'enderio:xp_vacuum', count: 1 }
  }).id('kubejs:inno_preview/xp_vacuum_v2');
});
