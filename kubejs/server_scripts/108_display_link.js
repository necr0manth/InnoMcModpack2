// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/logistics/display_link' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' L ', 'BRB', ' C '],
    key: {
      L: { item: 'createmechanisms:logic_mechanism' },
      B: { tag: 'c:plates/brass' },
      R: { item: 'create:redstone_link' },
      C: { item: 'create:brass_casing' }
    },
    result: { id: 'create:display_link', count: 1 }
  }).id('kubejs:inno_preview/display_link_current_v2');
});
