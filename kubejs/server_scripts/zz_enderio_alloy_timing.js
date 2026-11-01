// Ender IO alloy materials only; other alloy smelter products are unchanged.
ServerEvents.recipes(event => {
  const alloys = [
    'enderio:conductive_alloy_ingot', 'enderio:redstone_alloy_ingot',
    'enderio:energetic_alloy_ingot', 'enderio:pulsating_alloy_ingot',
    'enderio:vibrant_alloy_ingot', 'enderio:dark_steel_ingot',
    'enderio:end_steel_ingot', 'enderio:soularium_ingot',
    'enderio_evolution:construction_alloy_ingot', 'enderio_evolution:crude_steel_ingot',
    'enderio_evolution:crystalline_alloy_ingot', 'enderio_evolution:crystalline_pink_slime_ingot',
    'enderio_evolution:energetic_silver_ingot', 'enderio_evolution:melodic_alloy_ingot',
    'enderio_evolution:stellar_alloy_ingot', 'enderio_evolution:vivid_alloy_ingot'
  ];
  function slowAlloy(recipe) {
    if (recipe.removed || !recipe.json || recipe.getId() === 'kubejs:inno_preview/vibrant_alloy_ingot_current_v2') return;
    const data = JSON.parse(recipe.json.toString());
    if (data.type !== 'enderio:alloy_smelting' || !data.output || alloys.indexOf(data.output.id) < 0) return;
    recipe.merge({ energy: data.energy * 8 });
  }
  // forEachRecipe only visits originalRecipes in this KubeJS version.
  event.forEachRecipe({ type: 'enderio:alloy_smelting' }, slowAlloy);
  event.addedRecipes.forEach(slowAlloy);
});
