// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'actuallyadditions:empowerer' });

  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: ['RSP', 'WDW', 'CBC'],
    key: {
      R: { item: 'actuallyadditions:restonia_crystal' },
      S: { tag: 'c:circuits/basic' },
      P: { item: 'createmechanisms:blazing_energy_mechanism' },
      W: { item: 'electroenergetics:insulated_wire' },
      D: { item: 'actuallyadditions:display_stand' },
      C: { item: 'enderio:void_chassis' },
      B: { item: 'actuallyadditions:double_battery' }
    },
    result: { id: 'actuallyadditions:empowerer', count: 1 }
  }).id('kubejs:inno_preview/empowerer_v3');
});
