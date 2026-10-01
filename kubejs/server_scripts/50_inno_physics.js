// Behaviour lives in the separately built companion; retain controller/material recipes.
// Native Create actors use the persisted loot flag instead of disabling mounted inventories.
ServerEvents.loaded(function (event) {
  if (!Platform.isLoaded('innophysicalcreate')) {
    throw new Error('[Inno Physics] Missing Inno Physical Create companion: ordinary assemblies are not restricted.');
  }
  var configs = Java.loadClass('com.simibubi.create.infrastructure.config.AllConfigs');
  if (configs.server().kinetics.moveItemsToStorage.get()) {
    throw new Error('[Inno Physics] Set kinetics.contraptions.moveItemsToStorage=false in the effective Create server config.');
  }
  console.info('[Inno Physics] Companion loaded; native actor loot drops into the world.');
});
