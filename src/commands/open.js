const { openBooster } = require('../services/yugioh');
const crypto = require('crypto');

async function openCommand(ctx) {
  const LOG_GROUP_ID = Number(process.env.LOG_GROUP_ID);
  if (ctx.chat.id === LOG_GROUP_ID) return;

  const args = ctx.message.text.split(' ').slice(1);
  const format = args.join(' ').trim();

  if (!format) {
    return ctx.replyWithMarkdown(
      '⚠️ Informe o nome ou código do set.\n\n*Exemplo:* `/open BPRO`\n\nUse /sets para ver os sets disponíveis.'
    );
  }

  const loadingMsg = await ctx.reply('🔀 Abrindo booster...');
  const userId = String(ctx.from.id);
  const hashes = [];

  try {
    const cards = await openBooster(format);

    for (const card of cards) {
      const uuid = crypto.randomUUID();
      const hash = crypto.createHash('sha256').update(card.name + uuid + userId).digest('hex');
      hashes.push(hash);
      const caption = `🪪 \`${uuid}\`\n📛 *${card.name}*\n🔒 \`${hash}\``;
      await ctx.replyWithPhoto(card.image_url, { caption, parse_mode: 'Markdown' });
    }

    const hashList = hashes.map((h, i) => `${i + 1}. \`${h}\``).join('\n');
    await ctx.telegram.sendMessage(
      LOG_GROUP_ID,
      `👤 *Usuário:* \`${userId}\`\n📦 *Set:* ${format}\n\n*Hashes gerados:*\n${hashList}`,
      { parse_mode: 'Markdown' }
    ).catch(err => console.error('[LOG] Falha ao enviar para o grupo de log:', err.message));
  } catch (err) {
    await ctx.replyWithMarkdown(
      `❌ *Erro ao abrir booster:* ${err.message}\n\nVerifique o nome do set e tente novamente.`
    );
  } finally {
    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
  }
}

module.exports = { openCommand };
