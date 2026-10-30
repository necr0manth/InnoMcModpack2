// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'create:crafting/kinetics/hose_pulley' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['GM ', 'PCP', ' K '],
    key: {
      G: { item: 'create:cogwheel' },
      M: { item: 'createmechanisms:fluid_mechanism' },
      P: { item: 'create:fluid_pipe' },
      C: { item: 'create:copper_casing' },
      K: { item: 'minecraft:dried_kelp_block' }
    },
    result: { id: 'create:hose_pulley', count: 1 }
  }).id('kubejs:inno_preview/hose_pulley_v1');
});
