// Replace the native primary recipe; retain unrelated alternatives.
ServerEvents.recipes(function (event) {
  event.remove({ id: 'powah:crafting/capacitor_basic' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'misc',
    key: {
      i: { item: 'minecraft:iron_ingot' },
      p: { item: 'powah:dielectric_paste' },
      r: { item: 'enderio:redstone_alloy_ingot' }
    },
    pattern: [' ip', 'iri', 'pi '],
    result: { count: 4, id: 'powah:capacitor_basic' }
  }).id('kubejs:capacitor_basic_redstone_alloy');
});
