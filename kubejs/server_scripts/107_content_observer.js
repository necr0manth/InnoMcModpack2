// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/logistics/content_observer' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['BEB', 'WOW', 'MCM'],
    key: {
      B: { tag: 'c:plates/brass' },
      E: { item: 'create:electron_tube' },
      W: { item: 'electroenergetics:insulated_wire' },
      O: { item: 'minecraft:observer' },
      M: { item: 'createmechanisms:redstone_mechanism' },
      C: { item: 'create:brass_casing' }
    },
    result: { id: 'create:content_observer', count: 1 }
  }).id('kubejs:inno_preview/content_observer_current_v3');
});
