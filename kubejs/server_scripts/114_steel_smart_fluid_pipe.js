// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'petrochem:crafting/null/steel_smart_fluid_pipe' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' E ', 'BPB', ' L '],
    key: {
      B: { tag: 'c:plates/bronze' },
      E: { item: 'create:electron_tube' },
      P: { item: 'petrochem:steel_fluid_pipe' },
      L: { item: 'createmechanisms:logic_mechanism' }
    },
    result: { id: 'petrochem:steel_smart_fluid_pipe', count: 1 }
  }).id('kubejs:inno_preview/steel_smart_fluid_pipe_v1');
});
