// One access registry shared with the client. Materials/process recipes remain installed.
const innoAccess = JsonIO.read('kubejs/config/inno_mvp_access.json')
const innoAccessItems = {}
const innoAccessNamespaces = {}
innoAccess.groups.forEach(group => {
  if (group.status === 'available') return
  group.items.forEach(id => { innoAccessItems[id] = group })
  group.namespaces.forEach(namespace => { innoAccessNamespaces[namespace] = group })
})

function innoAccessGroup(id) {
  return innoAccessItems[id] || innoAccessNamespaces[String(id).split(':')[0]]
}

function innoAccessDeny(event, id) {
  const group = innoAccessGroup(id)
  if (!group || group.status !== 'permanent') return
  if (event.player) event.player.tell(Text.red('MVP: ' + group.reason))
  event.cancel()
}

function innoAccessCombatTemplates() {
  innoAccess.rankRestrictions.forEach(function(restriction) {
    var rank = Number(restriction.rank)
    var modifier = String(restriction.modifier)
    var ranks = Item.of(restriction.item).item.getDefaultRelicTemplate()
      .getAbilities().getAbilities().get(restriction.ability).getRankModifiers()
    // Iterate the original Java entries: Multimap.remove(Object,Object) would box JS5 as Double.
    // Installed Rhino reuses a const binding inside while; var reads each advancing entry.
    var iterator = ranks.entries().iterator()
    var observed = []
    while (iterator.hasNext()) {
      var entry = iterator.next()
      var entryRank = Number(entry.getKey())
      var entryModifier = String(entry.getValue())
      observed.push([entryRank, entryModifier])
      if (entryRank === rank && entryModifier === modifier) iterator.remove()
    }
    if (ranks.containsValue(modifier)) throw new Error('inno_access rank restriction failed: ' + restriction.item + ' target=' + rank + '/' + modifier + ' observed=' + JSON.stringify(observed) + ' remaining=' + String(ranks))
  })
  Java.loadClass('it.hurts.sskirillss.relics.handlers.CacheHandler').clearTemplateCache()
  var ring = Item.of('relics:ring_of_the_seven_deadly_sins').item
  ring.getDefaultLootTemplate().setEntries(Java.loadClass('java.util.Collections').emptyList())
  Java.loadClass('it.hurts.sskirillss.relics.level.RelicLootModifier').processRelicCache(ring)
  console.info('[inno_access] rank5 survival/salvation disabled; Seven Sins native loot disabled')
}

ServerEvents.recipes(event => {
  // Native soulbinding output.id bypasses the ordinary output filter; preserve other processing.
  ;[
    'enderio:soulbinding/farming_station',
    'enderio:soulbinding/vibrant_photovoltaic_module',
    'enderio:soulbinding/powered_spawner',
    'enderio:soulbinding/soul_engine',
    'enderio:soulbinding/pulsating_photovoltaic_module',
    'enderio:soulbinding/energetic_photovoltaic_module'
  ].forEach(id => { event.remove({ id: id }) })
  const registered = {}
  Item.getList().forEach(stack => { registered[stack.id] = true })
  Object.keys(innoAccessItems).forEach(id => {
    if (registered[id]) event.remove({ output: id })
    else console.warn('[inno_access] Unregistered explicit item: ' + id)
  })
  Object.keys(innoAccessNamespaces).forEach(namespace => {
    event.remove({ mod: namespace })
    event.remove({ output: new RegExp('^' + namespace + ':') })
  })
  innoAccessCombatTemplates()
})

ServerEvents.generateData('last', event => {
  const overrides = JsonIO.read('kubejs/config/inno_access_loot_overrides.json')
  Object.keys(overrides).forEach(path => { event.json(path, overrides[path]) })
})

ServerEvents.tags('item', event => {
  // Mimic loot is tag-driven in Reliquified Artifacts; ordinary relics remain.
  event.remove('reliquified_artifacts:mimic_loot', 'relics:ring_of_the_seven_deadly_sins')
  event.remove('reliquified_artifacts:mimificable', 'relics:ring_of_the_seven_deadly_sins')
})

ServerEvents.loaded(() => { innoAccessCombatTemplates() })

ItemEvents.rightClicked(event => { innoAccessDeny(event, event.item.id) })
BlockEvents.placed(event => { innoAccessDeny(event, event.block.id) })
BlockEvents.rightClicked(event => {
  innoAccessDeny(event, event.item.id)
  innoAccessDeny(event, event.block.id)
})

const $InnoAccessMerchant = Java.loadClass('net.minecraft.world.entity.npc.AbstractVillager')
ItemEvents.entityInteracted(event => {
  innoAccessDeny(event, event.item.id)
  if (!(event.target instanceof $InnoAccessMerchant)) return
  // Remove blocked sale outputs before opening the merchant screen, including AA engineer trades.
  const offers = event.target.getOffers().iterator()
  while (offers.hasNext()) {
    if (innoAccessGroup(offers.next().getResult().id)) offers.remove()
  }
})
