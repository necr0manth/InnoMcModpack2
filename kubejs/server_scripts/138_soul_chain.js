// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:soul_chain' });
  event.custom({
    type: 'minecraft:crafting_shaped',
    category: 'building',
    pattern: [' I ', 'QIQ', ' I '],
    key: {
      I: { item: 'enderio:soularium_ingot' },
      Q: { item: 'minecraft:quartz' }
    },
    result: { id: 'enderio:soul_chain', count: 2 }
  }).id('kubejs:inno_preview/soul_chain_v1');
});
