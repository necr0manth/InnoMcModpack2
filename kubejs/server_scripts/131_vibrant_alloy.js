// Final: preserve the evaluated recipe and replace the identified primary recipe.
ServerEvents.recipes(event => {
  event.remove({ id: 'enderio:alloy_smelting/vibrant_alloy_ingot' });
  event.custom({
    "type": "enderio:alloy_smelting",
    "energy": 115200,
    "experience": 0.3,
    "inputs": [
        {
            "count": 1,
            "tag": "c:ingots/energetic_alloy"
        },
        {
            "count": 1,
            "item": "minecraft:ender_eye"
        },
        {
            "count": 1,
            "item": "actuallyadditions:diamatine_crystal"
        }
    ],
    "output": {
        "count": 1,
        "id": "enderio:vibrant_alloy_ingot"
    }
}).id('kubejs:inno_preview/vibrant_alloy_ingot_current_v2');
});
