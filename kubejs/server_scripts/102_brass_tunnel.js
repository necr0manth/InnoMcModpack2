// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/logistics/brass_tunnel' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['T', 'E', 'L'],
    key: {
      T: { item: 'create:andesite_tunnel' },
      E: { item: 'create:electron_tube' },
      L: { item: 'createmechanisms:logic_mechanism' }
    },
    result: { id: 'create:brass_tunnel', count: 1 }
  }).id('kubejs:inno_preview/brass_tunnel_v3');
});
