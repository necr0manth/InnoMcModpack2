// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/deployer' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['SES', 'ICI', ' MH'],
    key: {
      S: { item: 'create:shaft' },
      E: { item: 'create:electron_tube' },
      I: { item: 'create:iron_sheet' },
      C: { item: 'create:andesite_casing' },
      M: { item: 'createmechanisms:zinc_mechanism' },
      H: { item: 'create:brass_hand' }
    },
    result: { id: 'create:deployer', count: 1 }
  }).id('kubejs:inno_preview/deployer_v1');
});
