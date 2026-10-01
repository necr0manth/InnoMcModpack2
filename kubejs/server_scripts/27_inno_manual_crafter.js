// Bootstrap one crafter with the same material cost as its precision-based recipe.
// Three retained-tool operations make the manual route longer, without extra materials.
ServerEvents.recipes(function (event) {
  var steps = [
    ['table', 'create:brass_casing', 'minecraft:crafting_table', 'kubejs:crafter_assembly_1'],
    ['secure_table', 'kubejs:crafter_assembly_1', 'create:wrench', 'kubejs:crafter_assembly_2', true],
    ['mechanism', 'kubejs:crafter_assembly_2', 'createmechanisms:zinc_mechanism', 'kubejs:crafter_assembly_3'],
    ['logic', 'kubejs:crafter_assembly_3', 'createmechanisms:logic_mechanism', 'kubejs:crafter_assembly_4'],
    ['redstone', 'kubejs:crafter_assembly_4', 'createmechanisms:redstone_mechanism', 'kubejs:crafter_assembly_5'],
    ['secure_control', 'kubejs:crafter_assembly_5', 'create:wrench', 'kubejs:crafter_assembly_6', true],
    ['spring', 'kubejs:crafter_assembly_6', 'createvintageneoforged:iron_spring', 'kubejs:crafter_assembly_7'],
    ['gear', 'kubejs:crafter_assembly_7', 'kubejs:brass_gear', 'kubejs:crafter_assembly_8'],
    ['sheet', 'kubejs:crafter_assembly_8', 'create:brass_sheet', 'kubejs:crafter_assembly_9'],
    ['tube', 'kubejs:crafter_assembly_9', 'create:electron_tube', 'kubejs:crafter_assembly_10'],
    ['finish', 'kubejs:crafter_assembly_10', 'create:wrench', 'create:mechanical_crafter', true]
  ];
  steps.forEach(function (step) {
    var json = {
      type: 'create:item_application',
      ingredients: [{ item: step[1] }, { item: step[2] }],
      results: [{ id: step[3], count: 1 }]
    };
    if (step[4]) json.keep_held_item = true;
    event.custom(json).id('kubejs:inno_manual_crafter/' + step[0]);
    // Own Get Creative recipes preserve tools; item-application fallback does not.
    if (step[4]) {
      event.custom({
        type: 'get_creative:arm_assembly',
        ingredients: [{ item: step[1] }, { item: step[2] }],
        results: [{ id: step[3], count: 1 }],
        keep_held_item: true
      }).id('kubejs:inno_manual_crafter/' + step[0] + '_using_arm');
    }
  });
});
