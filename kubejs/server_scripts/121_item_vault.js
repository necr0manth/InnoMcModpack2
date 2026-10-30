// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/item_vault' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['STS', 'ICI', 'STS'],
    key: {
      S: { tag: 'c:plates/steel' },
      T: { item: 'minecraft:iron_trapdoor' },
      I: { item: 'minecraft:iron_bars' },
      C: { item: 'create:andesite_casing' }
    },
    result: { id: 'create:item_vault', count: 1 }
  }).id('kubejs:inno_preview/item_vault_v4');
});
