// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/display_board' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['IGI', 'AEA', ' G '],
    key: {
      I: { item: 'create:iron_sheet' },
      G: { item: 'minecraft:glass_pane' },
      A: { item: 'create:andesite_alloy' },
      E: { item: 'create:electron_tube' }
    },
    result: { id: 'create:display_board', count: 2 }
  }).id('kubejs:inno_preview/display_board_v1');
});
