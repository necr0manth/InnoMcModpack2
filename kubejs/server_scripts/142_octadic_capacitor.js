// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:octadic_capacitor' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    pattern: [' V ', 'CGC', ' V '],
    key: {
      V: { item: 'enderio:vibrant_crystal' },
      C: { item: 'enderio:double_layer_capacitor' },
      G: { item: 'minecraft:glowstone' }
    },
    result: { id: 'enderio:octadic_capacitor', count: 1 }
  }).id('kubejs:inno_preview/octadic_capacitor_v3');
});
