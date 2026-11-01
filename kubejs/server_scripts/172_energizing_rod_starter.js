// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:crafting/energizing_rod_starter' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    key: {
      b: { item: 'powah:capacitor_basic_tiny' },
      c: { item: 'powah:dielectric_casing' },
      h: { item: 'powah:dielectric_rod' },
      q: { item: 'ae2lt:overload_crystal' }
    },
    pattern: [' q ', 'bcb', ' h '],
    result: { count: 1, id: 'powah:energizing_rod_starter' }
  }).id('kubejs:energizing_rod_starter_overload');
});
