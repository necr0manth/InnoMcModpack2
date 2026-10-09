// First arm: placed brass casing, then individual components; no finished precision mechanism.
// Get Creative also applies these same steps to stage items on stationary depots.
ServerEvents.recipes(function (event) {
  var components = [
    'petrochem:steel_sheet',
    'create:shaft',
    'petrochem:steel_sheet',
    'create:wrench',
    'create:brass_sheet',
    'createmechanisms:zinc_mechanism',
    'createmechanisms:logic_mechanism',
    'createmechanisms:redstone_mechanism',
    'vintageimprovements:iron_spring',
    'kubejs:brass_gear',
    'create:wrench',
    'create_connected:control_chip',
    'vintageimprovements:iron_spring',
    'kubejs:brass_gear',
    'create:wrench'
  ];
  components.forEach(function (component, index) {
    var input = index === 0 ? 'create:brass_casing' : 'kubejs:arm_assembly_' + index;
    var output = index === components.length - 1 ? 'create:mechanical_arm' : 'kubejs:arm_assembly_' + (index + 1);
    var json = {
      type: 'create:item_application',
      ingredients: [{ item: input }, { item: component }],
      results: [{ id: output, count: 1 }]
    };
    var retainedTool = component === 'create:wrench';
    if (retainedTool) json.keep_held_item = true;
    event.custom(json).id('kubejs:inno_arm/manual/step_' + (index + 1));
    // Its own recipe type takes priority over item_application, preserving the tool.
    if (retainedTool) {
      event.custom({
        type: 'get_creative:arm_assembly',
        ingredients: [{ item: input }, { item: component }],
        results: [{ id: output, count: 1 }],
        keep_held_item: true
      }).id('kubejs:inno_arm/automatic/tool_step_' + (index + 1));
    }
  });
});
