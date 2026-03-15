require('dotenv').config();
const { Telegraf } = require('telegraf');
const { startCommand } = require('./commands/start');
const { openCommand } = require('./commands/open');
const { setsCommand } = require('./commands/sets');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('❌ BOT_TOKEN não definido no .env');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start(startCommand);
bot.command('open', openCommand);
bot.command('sets', setsCommand);

bot.catch((err, ctx) => {
  console.error(`Erro no update ${ctx.updateType}:`, err);
});

bot.launch().then(() => {
  console.log('🤖 Bot iniciado!');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
