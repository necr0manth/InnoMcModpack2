// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'create:crafting/kinetics/smart_fluid_pipe' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' E ', 'LPM'],
    key: {
      E: { item: 'create:electron_tube' },
      L: { item: 'createmechanisms:logic_mechanism' },
      P: { item: 'create:fluid_pipe' },
      M: { item: 'createmechanisms:fluid_mechanism' }
    },
    result: { id: 'create:smart_fluid_pipe', count: 1 }
  }).id('kubejs:inno_preview/smart_fluid_pipe_v1');
});
