# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # desenvolvimento com hot reload (nodemon)
npm start      # produção
```

Requer `.env` com `BOT_TOKEN=<token do BotFather>`.

## Architecture

Bot Telegram de simulação de abertura de boosters Yu-Gi-Oh!, usando **Telegraf** (CommonJS).

**Fluxo de um comando `/open <set>`:**
1. `src/index.js` registra os comandos e inicializa o bot via `bot.launch()`
2. `src/commands/open.js` chama `openBooster(format)` de `src/services/yugioh.js`
3. O serviço faz `fetch` para `https://ygoprodeck.com/api/pack-sim/pack-open.php?format=<set>&...`
4. As cartas retornadas são enviadas como `replyWithMediaGroup` (imagens) + `replyWithMarkdown` (resumo)

**Lista de sets** é estática em `src/services/yugioh.js` no array `SETS` — não há chamada de API para listagem. Para adicionar sets, edite esse array com `{ name, link }` seguindo o padrão `https://ygoprodeck.com/pack/<nome-url-encoded>`.

**Mapeamento de raridades** para emojis também está em `yugioh.js` (`RARITY_EMOJI`).
