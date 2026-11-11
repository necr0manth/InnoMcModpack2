# InnoMcModpack2

## Игроку

**Minecraft 1.21.1 · NeoForge 21.1.256 · Java 21**

### Надёжный способ — архив релиза

1. Создайте профиль Minecraft 1.21.1 с **NeoForge 21.1.256**. В Prism Launcher версию NeoForge можно выбрать при создании инстанса. Для официального лаунчера используйте [установщик NeoForge](https://maven.neoforged.net/releases/net/neoforged/neoforge/21.1.256/neoforge-21.1.256-installer.jar) и выберите **Install client**.
2. В [Releases](https://github.com/necr0manth/InnoMcModpack2/releases) скачайте `client-pack.zip` из **Assets** нужного релиза.
3. Распакуйте содержимое архива в `.minecraft` выбранного профиля. В Prism это каталог Minecraft конкретного инстанса. Папки `mods/`, `config/` и `kubejs/` должны оказаться прямо в каталоге игры. Для чистой установки используйте отдельный профиль, чтобы старые JAR из другой сборки не остались в `mods/`.
4. Запустите профиль NeoForge. Для игры на сервере добавьте `mods.innomc.ru` в списке серверов.

### Установка через AutoModpack

1. Создайте профиль с теми же версиями Minecraft, NeoForge и Java. Положите [AutoModpack 5.0.0-rc.7](https://github.com/Skidamek/AutoModpack/releases/tag/v5.0.0-rc.7) в `mods/`.
2. Запустите игру, подключитесь к `mods.innomc.ru` и подтвердите загрузку сборки. После загрузки перезапустите игру, если AutoModpack попросит, и снова подключитесь к серверу.
3. После первого подключения AutoModpack запоминает пакет. При доступном сервере он синхронизирует файлы. В клиентском конфиге из релиза также включена проверка обновлений при старте. Если первая загрузка через сервер не проходит, используйте архив релиза.

Управление описано в [памятке по игре](CONTROLS.md) и [памятке по интерфейсам](CONTROLS-INTERFACES.md).

## Разработчику

Запускайте из корня Git-репозитория.

```sh
python3 build_pack.py          # build/client и build/server
python3 build_pack.py client   # только клиент
python3 build_pack.py server   # только сервер
python3 build_pack.py client -o /путь/к/клиенту
```

Сборщик берёт список файлов из индекса Git, а содержимое — с диска. Правки уже отслеживаемых файлов видны в локальной сборке сразу. Новый файл попадёт в неё после `git add`. Каталог результата очищается перед копированием. `-o` действует при сборке одной стороны.

| Куда нужен файл | Где хранить |
| --- | --- |
| Клиент и сервер | По нужному пути в корне. Действуют `.gitignore` и `.packignore`. |
| Только клиент | В корне. Добавьте исключение для сервера в `.client_files`. |
| Только сервер | В `server_pack/`. На сервере его содержимое накладывается поверх общей сборки. |
| Только для репозитория | Добавьте путь в `.packignore`. |

Во всех трёх файлах используется [синтаксис `.gitignore`](https://git-scm.com/docs/gitignore). В клиентскую сборку входит отслеживаемый `automodpack/client.conf`. Серверный `automodpack/` администратор настраивает отдельно.

Default Options читает `config/defaultoptions/keybindings.txt` на клиенте и использует его для ещё не сохранённых назначений. Для настройки сборки меняйте этот файл. Личный `options.txt` исключён из поставки.

Чтобы AutoModpack не перезаписывал локальные `kubejs/` и `config/`, выберите **Сетевая игра → Modpacks → InnoMcModpack2 → Stop syncing** в рабочем инстансе. Возобновить синхронизацию можно через **Resume syncing**. При закрытой игре тот же переключатель доступен как `detached` в `automodpack/client/active-state.json`. Настройка `update-selected-modpack-on-launch: false` отключает только проверку при старте.

## Администратору

**Build Modpack** публикует артефакты `client-pack` и `server-pack`. При отправке тега `v*` workflow прикладывает `client-pack.zip` и `server-pack.zip` к GitHub Release.

**Deploy via SFTP** и **Deploy via rsync over SSH** запускаются вручную. Оба выкладывают сервер в `SFTP_TARGET_DIR`, а файлы для игроков — в `SFTP_TARGET_DIR/automodpack/host-modpack/main`. `smart` отправляет новые и изменившиеся файлы по манифестам. `full` ставит в очередь все управляемые файлы. Оба режима удаляют устаревшие файлы, известные предыдущему манифесту. Для rsync нужны SSH shell и rsync на сервере, для SFTP достаточно доступа к файловой системе.

Перед первым запуском задайте в Actions переменную `SFTP_TARGET_DIR` и секреты `SFTP_HOST`, `SFTP_USERNAME`, `SFTP_PASSWORD`, при необходимости `SFTP_PORT` (по умолчанию 22). Указывайте цель явно. При пустом значении SFTP использует видимый `/`, а rsync завершится ошибкой.

Задайте Actions-переменную `SFTP_HOST_KEY` с проверенным публичным ключом именно SFTP-узла. [Как проверить ключ и задать переменную](deployment/ssh-host-key.md).

Вручную подготовьте сервер Minecraft **1.21.1** с NeoForge **21.1.256** и Java **21**. Скопируйте [шаблон AutoModpack](deployment/automodpack-server.conf.example) в `SFTP_TARGET_DIR/automodpack/server.conf`. Деплой управляет файлами раздаваемой сборки и оставляет этот конфиг и остальные служебные данные AutoModpack администратору. В режиме `HOLEPUNCH` пустой `advertised-endpoint-host` и порт `-1` используют параметры Minecraft-соединения. `mods.innomc.ru` — SRV-имя для входа в игру. В шаблоне `validate-secrets: false`, поэтому пакет может скачать любой, кто знает его endpoint.

После выкладки выполните `/automodpack generate` или перезапустите сервер. После ручного изменения `server.conf` выполните `/automodpack config reload`. Если менялись сетевые параметры, выполните ещё `/automodpack host restart`.

`config/`, `defaultconfigs/` и `kubejs/` синхронизируются с опубликованной версией. JAR помечены `editable`. Локальное изменение или удаление такого JAR сохраняется до публикации новой версии этого файла. Обновлённые JAR применяются после перезапуска игры.

**Update World Configs** предназначен для отдельного обновления `world/serverconfig`. Пока проверяйте путь и переносите нужные значения вручную. Workflow передаёт каталог `defaultconfigs/` целиком, а `defaultconfigs/create-server.toml` содержит только один ключ.

**SFTP diagnostics** измеряет передачу на временных файлах и читает текущие манифесты. Рабочие файлы сборки этим workflow не выкладываются.
