# Brawl Tournament Site — read-only public version

## Как менять счёт

Единственное место, которое нужно менять после публикации сайта:

`data/state.json`

### Round Robin

Внутри файла есть:

- `matches.A` — группа A
- `matches.B` — группа B
- `matches.C` — группа C
- `matches.D` — группа D

У каждого матча:

```json
{
  "p1": "Игрок 1",
  "p2": "Игрок 2",
  "s1": "",
  "s2": ""
}
```

Например, если игрок 1 выиграл 2:1:

```json
{
  "p1": "Игрок 1",
  "p2": "Игрок 2",
  "s1": "2",
  "s2": "1"
}
```

После изменения:

1. GitHub → Commit changes.
2. Render автоматически создаст новый deploy.
3. После `Your service is live` обновите сайт.

### Play-off

Когда все 12 матчей Round Robin имеют корректный счёт, сайт автоматически строит Double Elimination.

Ключи матчей Play-off:

- `qf1`, `qf2`, `qf3`, `qf4` — четвертьфиналы
- `sf1`, `sf2` — полуфиналы
- `uf` — Winners Final
- `lb1`, `lb2`, `lb3`, `lb4`, `lb5` — матчи Losers Bracket
- `lbf` — Losers Final
- `gf` — Grand Final

Play-off хранится в `playoffs`. Если нужно заранее прописать счёт конкретного уже определившегося матча, используются `s1` и `s2`.

### Важно

Сайт является публичным и **только для просмотра**. Поля счёта в браузере отключены.

Сервер намеренно не предоставляет API для изменения турнира. Данные меняются только через `data/state.json` в GitHub.

Не удаляйте папку `data` и файл `data/state.json`.

## Render

Build Command:

`npm install`

Start Command:

`npm start`
