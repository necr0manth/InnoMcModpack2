// Run from the Minecraft directory: node tests/check_temporary_bans.cjs
const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')
const server = fs.readFileSync('kubejs/server_scripts/10_banned_items.js', 'utf8')
const late = fs.readFileSync('kubejs/server_scripts/zzzz_permanent_fe_bans.js', 'utf8')
const client = fs.readFileSync('kubejs/client_scripts/10_banned_items.js', 'utf8')
const config = JSON.parse(fs.readFileSync('kubejs/config/banned_items.json', 'utf8'))
const targets = ["mekanism:metallurgic_infuser", "enderio:alloy_smelter", "powah:energizing_rod_starter", "powah:energizing_orb"]
const available = config.groups.filter(g => g.status === 'available').flatMap(g => g.items)
for (const id of targets) assert.ok(available.includes(id), id)
assert.match(server, /const APPLY_TEMPORARY_BANS = (true|false)/)
function match(filter, recipe) {
  if (filter.or && !filter.or.some(f => match(f, recipe))) return false
  if (filter.not && match(filter.not, recipe)) return false
  if (filter.id && filter.id !== recipe.id) return false
  if (filter.mod && !recipe.id.startsWith(filter.mod + ':')) return false
  if (filter.output) {
    const f = filter.output
    if (!(typeof f === 'string' ? f === recipe.output : f.test(recipe.output))) return false
  }
  return true
}
function run(data, enabled) {
  const filters = [], tooltips = [], hidden = []
  const common = { JsonIO: { read: () => data }, console: { warn: () => {} } }
  vm.runInNewContext(server.replace(/const APPLY_TEMPORARY_BANS = (true|false)/, 'const APPLY_TEMPORARY_BANS = ' + enabled), {
    ...common, Item: { getList: () => data.groups.flatMap(g => g.items).map(id => ({ id })) },
    ServerEvents: { recipes: cb => cb({ remove: filter => filters.push(filter) }) }
  })
  if (data.groups.some(g => g.key === 'fe_generators')) vm.runInNewContext(late, { ...common, ServerEvents: { recipes: cb => cb({ remove: filter => filters.push(filter) }) } })
  vm.runInNewContext(client, { ...common, Text: { red: v => v, gray: v => v },
    RecipeViewerEvents: { removeEntries: (type, cb) => cb({ remove: id => hidden.push(id) }) },
    ItemEvents: { modifyTooltips: cb => cb({ add: (id, lines) => tooltips.push({ id, lines }) }) }
  })
  const removed = (id, output) => filters.some(f => match(f, { id, output }))
  const entries = (list, id) => list.filter(entry => typeof entry === 'string' ? entry === id : entry.test(id))
  return { filters, removed, hidden: id => entries(hidden, id).length > 0,
    labels: id => tooltips.filter(x => entries([x.id], id).length).map(x => x.lines[0]) }
}
for (const enabled of [false, true]) {
  const result = run(config, enabled)
  for (const id of targets) {
    assert.ok(!result.removed('kubejs:approved', id), id + ' custom recipe')
    assert.ok(!result.removed(id.split(':')[0] + ':native_recipe', id), id + ' native mod filter')
    assert.ok(!result.labels(id).includes('Временно забанено'), id + ' tooltip')
  }
  for (const [recipe, output] of [
    ['ae2:transform/fluix_crystals', 'ae2:fluix_crystal'],
    ['ae2:decorative/fluix_block', 'ae2:fluix_block'],
    ['ae2:decorative/quartz_block', 'ae2:quartz_block'],
    ['ae2lt:lightning_strike/simple_damaged_budding_overload_crystal', 'ae2lt:damaged_budding_overload_crystal']
  ]) assert.ok(!result.removed(recipe, output), recipe + ' early crystal bootstrap')
  assert.ok(result.removed('mekanism:pump', 'mekanism:electric_pump'))
  assert.ok(result.hidden('mekanism:electric_pump'))
  for (const id of ['actuallyadditions:display_stand', 'actuallyadditions:double_battery', 'powah:energizing_rod_basic', 'ae2:controller']) {
    assert.equal(result.removed('kubejs:other', id), enabled, id)
  }
  for (const name of ['farming_station', 'powered_spawner']) {
    assert.equal(result.removed('enderio:soulbinding/' + name, 'minecraft:stone'), enabled)
  }
  for (const name of ['vibrant_photovoltaic_module', 'soul_engine', 'pulsating_photovoltaic_module', 'energetic_photovoltaic_module']) {
    assert.ok(result.removed('enderio:soulbinding/' + name, 'minecraft:stone'))
  }
  for (const id of config.groups.find(g => g.key === 'fe_generators').items) {
    assert.ok(result.removed('kubejs:late_recipe', id), id)
    assert.ok(result.hidden(id), id)
  }
  assert.ok(!result.removed('kubejs:inno_ee/converter', 'electroenergetics:converter'))
}
const group = (status, items, namespaces = []) => ({ status, reason: 'test', items, namespaces })
for (const groups of [
  [group('available', ['test:yes', 'test:permanent', 'locked:overlap']), group('pending_recipe', ['test:yes', 'test:pending'], ['test']), group('permanent', ['test:permanent'], ['locked']), group('future_status', ['other:unknown'])],
  [group('permanent', ['test:permanent'], ['locked']), group('future_status', ['other:unknown']), group('pending_recipe', ['test:yes', 'test:pending'], ['test']), group('available', ['test:yes', 'test:permanent', 'locked:overlap'])]
]) for (const enabled of [false, true]) {
  const result = run({ groups }, enabled)
  assert.equal(result.removed('test:custom', 'test:yes'), false)
  assert.equal(result.removed('test:custom', 'test:pending'), enabled)
  assert.equal(result.removed('other:custom', 'test:other'), enabled)
  assert.equal(result.removed('test:custom', 'other:other'), enabled)
  assert.equal(result.removed('other:custom', 'test:permanent'), true)
  assert.ok(result.removed('other:custom', 'locked:overlap'))
  assert.ok(result.hidden('locked:overlap'))
  assert.equal(result.removed('other:custom', 'other:unknown'), enabled)
  assert.ok(result.hidden('test:permanent'))
  assert.ok(result.labels('test:permanent').includes('Забанено навсегда'))
  assert.ok(!result.labels('test:yes').includes('Временно забанено'))
  assert.ok(result.labels('test:pending').includes('Временно забанено'))
}
console.log('PASS: true/false, exact ready outputs, namespace ID/output filters, pending prerequisites, permanent priority, client and soulbinding')
