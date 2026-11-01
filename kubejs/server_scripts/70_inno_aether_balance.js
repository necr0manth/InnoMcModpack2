// 70_inno_aether_balance.js
// Aether: mid-game gate. Часть пакета aether_balance_v1.
// Серверный скрипт (server_scripts) — нужен и на сервере, и в сингле.

ServerEvents.recipes(event => {
  // ГЕЙТ: Алтарь (Enchanter) — сердце прогресии Aether
  // (зачарование гравитита, healing stone, remedy bucket и т.д.)
  // Было:  8 холистоуна + 1 кристалл занита  (крафтится в первые минуты в Aether)
  // Стало: 8 холистоуна + 1 АЛМАЗ           (требует подготовки в обычном мире)
  event.remove({ id: 'aether:altar' })
  event.shaped('aether:altar', [
    'HHH',
    'HDH',
    'HHH'
  ], {
    H: 'aether:holystone',
    D: 'minecraft:diamond'
  }).id('kubejs:inno_aether_altar_gated')
})
