// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/weighted_ejector' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' G ', 'SDS', 'CMC'],
    key: {
      G: { item: 'create:golden_sheet' },
      S: { item: 'vintageimprovements:iron_spring' },
      D: { item: 'create:depot' },
      C: { item: 'create:cogwheel' },
      M: { item: 'createmechanisms:zinc_mechanism' }
    },
    result: { id: 'create:weighted_ejector', count: 1 }
  }).id('kubejs:inno_preview/weighted_ejector_v1');
});
