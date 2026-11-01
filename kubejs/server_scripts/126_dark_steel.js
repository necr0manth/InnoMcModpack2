// Final: replace both native primary alloy-smelting variants.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/dark_steel_ingot' });
  event.remove({ id: 'enderio:dark_steel_ingot_with_coal' });
  event.custom({
    type: 'enderio:alloy_smelting',
    energy: 6400,
    experience: 0.3,
    inputs: [
      { count: 1, tag: 'c:ingots/steel' },
      { count: 2, tag: 'c:dusts/coal' },
      { count: 1, item: 'minecraft:obsidian' }
    ],
    output: { count: 1, id: 'enderio:dark_steel_ingot' }
  }).id('kubejs:inno_preview/dark_steel_ingot_v3');
});
