// Create Metallurgy owns ordinary metals; Blazing Hot retains its Nether materials.
// Three native debris/scrap/netherite melting routes remain for Scorchia + water.
ServerEvents.recipes(function (event) {
  var removedRecipes = [
    'blazinghot:blaze_mixing/melting/andesite_alloy',
    'blazinghot:blaze_mixing/melting/crushed_raw_copper',
    'blazinghot:blaze_mixing/melting/crushed_raw_gold',
    'blazinghot:blaze_mixing/melting/crushed_raw_iron',
    'blazinghot:blaze_mixing/melting/crushed_raw_zinc',
    'blazinghot:blaze_mixing/melting/golden_sheet',
    'blazinghot:blaze_mixing/melting/ingots/brass',
    'blazinghot:blaze_mixing/melting/ingots/copper',
    'blazinghot:blaze_mixing/melting/ingots/gold',
    'blazinghot:blaze_mixing/melting/ingots/iron',
    'blazinghot:blaze_mixing/melting/ingots/zinc',
    'blazinghot:blaze_mixing/melting/nuggets/brass',
    'blazinghot:blaze_mixing/melting/nuggets/copper',
    'blazinghot:blaze_mixing/melting/nuggets/gold',
    'blazinghot:blaze_mixing/melting/nuggets/iron',
    'blazinghot:blaze_mixing/melting/nuggets/zinc',
    'blazinghot:blaze_mixing/melting/plates/brass',
    'blazinghot:blaze_mixing/melting/plates/copper',
    'blazinghot:blaze_mixing/melting/plates/gold',
    'blazinghot:blaze_mixing/melting/plates/iron',
    'blazinghot:blaze_mixing/melting/plates/zinc',
    'blazinghot:blaze_mixing/melting/raw_copper',
    'blazinghot:blaze_mixing/melting/raw_gold',
    'blazinghot:blaze_mixing/melting/raw_iron',
    'blazinghot:blaze_mixing/melting/raw_zinc',
    'blazinghot:blaze_mixing/melting/rods/brass',
    'blazinghot:blaze_mixing/melting/rods/copper',
    'blazinghot:blaze_mixing/melting/rods/gold',
    'blazinghot:blaze_mixing/melting/rods/iron',
    'blazinghot:blaze_mixing/melting/wires/copper',
    'blazinghot:blaze_mixing/melting/wires/gold',
    'blazinghot:blaze_mixing/melting/wires/iron',
    'blazinghot:casting/compat/createaddition/porcelain/rod/brass',
    'blazinghot:casting/compat/createaddition/porcelain/rod/copper',
    'blazinghot:casting/compat/createaddition/porcelain/rod/gold',
    'blazinghot:casting/compat/createaddition/porcelain/rod/iron',
    'blazinghot:casting/compat/createaddition/porcelain/sheet/zinc',
    'blazinghot:casting/compat/createaddition/sturdy/rod/brass',
    'blazinghot:casting/compat/createaddition/sturdy/rod/copper',
    'blazinghot:casting/compat/createaddition/sturdy/rod/gold',
    'blazinghot:casting/compat/createaddition/sturdy/rod/iron',
    'blazinghot:casting/compat/createaddition/sturdy/sheet/zinc',
    'blazinghot:casting/porcelain/andesite_alloy',
    'blazinghot:casting/porcelain/golden_sheet',
    'blazinghot:casting/porcelain/ingot/brass',
    'blazinghot:casting/porcelain/ingot/copper',
    'blazinghot:casting/porcelain/ingot/gold',
    'blazinghot:casting/porcelain/ingot/iron',
    'blazinghot:casting/porcelain/ingot/netherite',
    'blazinghot:casting/porcelain/ingot/zinc',
    'blazinghot:casting/porcelain/netherite_scrap',
    'blazinghot:casting/porcelain/nugget/brass',
    'blazinghot:casting/porcelain/nugget/copper',
    'blazinghot:casting/porcelain/nugget/gold',
    'blazinghot:casting/porcelain/nugget/iron',
    'blazinghot:casting/porcelain/nugget/zinc',
    'blazinghot:casting/porcelain/sheet/brass',
    'blazinghot:casting/porcelain/sheet/copper',
    'blazinghot:casting/porcelain/sheet/iron',
    'blazinghot:casting/sturdy/andesite_alloy',
    'blazinghot:casting/sturdy/golden_sheet',
    'blazinghot:casting/sturdy/ingot/brass',
    'blazinghot:casting/sturdy/ingot/copper',
    'blazinghot:casting/sturdy/ingot/gold',
    'blazinghot:casting/sturdy/ingot/iron',
    'blazinghot:casting/sturdy/ingot/netherite',
    'blazinghot:casting/sturdy/ingot/zinc',
    'blazinghot:casting/sturdy/netherite_scrap',
    'blazinghot:casting/sturdy/nugget/brass',
    'blazinghot:casting/sturdy/nugget/copper',
    'blazinghot:casting/sturdy/nugget/gold',
    'blazinghot:casting/sturdy/nugget/iron',
    'blazinghot:casting/sturdy/nugget/zinc',
    'blazinghot:casting/sturdy/sheet/brass',
    'blazinghot:casting/sturdy/sheet/copper',
    'blazinghot:casting/sturdy/sheet/iron',
    'blazinghot:mixing/melting/andesite_alloy_mixer_only',
    'blazinghot:mixing/melting/golden_sheet_mixer_only',
    'blazinghot:mixing/melting/ingots/brass_mixer_only',
    'blazinghot:mixing/melting/ingots/copper_mixer_only',
    'blazinghot:mixing/melting/ingots/gold_mixer_only',
    'blazinghot:mixing/melting/ingots/iron_mixer_only',
    'blazinghot:mixing/melting/ingots/zinc_mixer_only',
    'blazinghot:mixing/melting/nuggets/brass_mixer_only',
    'blazinghot:mixing/melting/nuggets/copper_mixer_only',
    'blazinghot:mixing/melting/nuggets/gold_mixer_only',
    'blazinghot:mixing/melting/nuggets/iron_mixer_only',
    'blazinghot:mixing/melting/nuggets/zinc_mixer_only',
    'blazinghot:mixing/melting/plates/brass_mixer_only',
    'blazinghot:mixing/melting/plates/copper_mixer_only',
    'blazinghot:mixing/melting/plates/gold_mixer_only',
    'blazinghot:mixing/melting/plates/iron_mixer_only',
    'blazinghot:mixing/melting/plates/zinc_mixer_only',
    'blazinghot:mixing/melting/rods/brass_mixer_only',
    'blazinghot:mixing/melting/rods/copper_mixer_only',
    'blazinghot:mixing/melting/rods/gold_mixer_only',
    'blazinghot:mixing/melting/rods/iron_mixer_only',
    'blazinghot:mixing/melting/wires/copper_mixer_only',
    'blazinghot:mixing/melting/wires/gold_mixer_only',
    'blazinghot:mixing/melting/wires/iron_mixer_only',
    'blazinghot:mixing/molten_andesite',
    'blazinghot:mixing/molten_brass',
    'blazinghot:mixing/molten_netherite'
  ];
  removedRecipes.forEach(function (id) {
    event.remove({ id: id });
  });

  // Keep native costs/heat/fuel/molds/loops; replace only base-metal fluid inputs.
  var adaptedRecipes = [
    'blazinghot:blaze_mixing/molten_blaze_gold',
    'blazinghot:filling/brass_apple',
    'blazinghot:filling/brass_carrot',
    'blazinghot:filling/copper_apple',
    'blazinghot:filling/copper_carrot',
    'blazinghot:filling/glistering_melon',
    'blazinghot:filling/golden_apple',
    'blazinghot:filling/golden_carrot',
    'blazinghot:filling/iron_apple',
    'blazinghot:filling/iron_carrot',
    'blazinghot:filling/zinc_apple',
    'blazinghot:filling/zinc_carrot',
    'blazinghot:mixing/molten_blaze_gold_mixer_only',
    'blazinghot:mixing/molten_sturdy_alloy',
    'blazinghot:sequenced_assembly/enchanted_brass_apple',
    'blazinghot:sequenced_assembly/enchanted_copper_apple',
    'blazinghot:sequenced_assembly/enchanted_golden_apple',
    'blazinghot:sequenced_assembly/enchanted_iron_apple',
    'blazinghot:sequenced_assembly/enchanted_netherite_apple',
    'blazinghot:sequenced_assembly/enchanted_zinc_apple'
  ];
  function useFoundryFluids(value) {
    if (!value || typeof value !== 'object') return;
    if (value.type === 'neoforge:tag'
        && /^c:molten_(iron|gold|copper|brass|zinc|netherite)$/.test(value.tag)) {
      value.type = 'neoforge:single';
      value.fluid = 'createmetallurgy:molten_' + value.tag.substring(9);
      delete value.tag;
    }
    Object.keys(value).forEach(function (key) {
      useFoundryFluids(value[key]);
    });
  }
  adaptedRecipes.forEach(function (id) {
    var adapted;
    event.forEachRecipe({ id: id }, function (recipe) {
      adapted = JSON.parse(recipe.json.toString());
      useFoundryFluids(adapted);
    });
    if (adapted) {
      event.remove({ id: id });
      event.custom(adapted).id(id);
    }
  });
});
