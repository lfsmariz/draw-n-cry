# Draw 'n' Cry 🃏

Simulador de abertura de boosters Yu-Gi-Oh! para Telegram. Abre pacotes virtuais usando a API do [YGOProDeck](https://ygoprodeck.com/) e chora com os resultados.

## Comandos do bot

| Comando | Descrição |
|---|---|
| `/start` | Apresentação e lista de comandos |
| `/sets [página]` | Lista os sets disponíveis (paginado, 20 por página) |
| `/open <set>` | Abre um booster do set informado |

**Exemplo:** `/open BPRO`

## Primeiro uso

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- Conta no Telegram e um bot criado via [@BotFather](https://t.me/BotFather)

### 2. Crie o bot no Telegram

1. Abra o Telegram e inicie uma conversa com [@BotFather](https://t.me/BotFather)
2. Envie `/newbot` e siga as instruções
3. Copie o **token** fornecido ao final (formato: `123456789:ABCdef...`)

### 3. Clone e instale as dependências

```bash
git clone <url-do-repositório>
cd draw-n-cry
npm install
```

### 4. Configure o `.env`

```bash
cp .env.example .env
```

Edite o `.env` e substitua o valor de `BOT_TOKEN`:

```env
BOT_TOKEN=seu_token_aqui
```

### 5. Inicie o bot

```bash
# Desenvolvimento (hot reload)
npm run dev

# Produção
npm start
```

O bot estará online assim que aparecer a mensagem de inicialização no terminal. Abra o Telegram, encontre seu bot pelo username e envie `/start`.

## Testes

```bash
npm test
```

## Adicionando novos sets

A lista de sets é estática em `src/services/yugioh.js`, no array `SETS`. Para adicionar um set, inclua um objeto `{ name, link }` seguindo o padrão:

```js
{ name: 'Nome do Set', link: 'https://ygoprodeck.com/pack/nome-url-encoded' }
```
