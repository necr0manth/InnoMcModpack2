// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/sequenced_gearshift' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' B ', 'GLG', ' E '],
    key: {
      B: { item: 'create:brass_sheet' },
      G: { item: 'create:cogwheel' },
      L: { item: 'createmechanisms:logic_mechanism' },
      E: { item: 'create:gearshift' }
    },
    result: { id: 'create:sequenced_gearshift', count: 1 }
  }).id('kubejs:inno_preview/sequenced_gearshift_v1');
});
