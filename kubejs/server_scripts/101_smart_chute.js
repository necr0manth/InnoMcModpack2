// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/smart_chute' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' E ', 'BLB', ' C '],
    key: {
      B: { tag: 'c:plates/brass' },
      E: { item: 'create:electron_tube' },
      L: { item: 'createmechanisms:logic_mechanism' },
      C: { item: 'create:chute' }
    },
    result: { id: 'create:smart_chute', count: 1 }
  }).id('kubejs:inno_preview/smart_chute_v2');
});
