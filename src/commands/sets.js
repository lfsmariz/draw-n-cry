const { getSets } = require('../services/yugioh');

const PAGE_SIZE = 20;

async function setsCommand(ctx) {
  const args = ctx.message.text.split(' ').slice(1);
  const page = Math.max(1, parseInt(args[0]) || 1);

  const loadingMsg = await ctx.reply('📚 Carregando sets...');

  try {
    const sets = getSets();

    if (!Array.isArray(sets) || sets.length === 0) {
      return ctx.reply('Nenhum set encontrado.');
    }

    const totalPages = Math.ceil(sets.length / PAGE_SIZE);
    const safePage = Math.min(page, totalPages);
    const slice = sets.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const lines = slice.map((s, i) => {
      const num = (safePage - 1) * PAGE_SIZE + i + 1;
      return `${num}. ${s.name}`;
    });

    const nav = [];
    if (safePage > 1) nav.push(`/sets ${safePage - 1}`);
    if (safePage < totalPages) nav.push(`/sets ${safePage + 1}`);

    const text =
      `📦 *Sets disponíveis* (${safePage}/${totalPages})\n\n` +
      lines.join('\n') +
      `\n\n${nav.join('  |  ')}\n\n` +
      `Para abrir: \`/open <nome do set>\`\n` +
      `Exemplo: \`/open ${slice[0]?.format}\``;

    await ctx.replyWithMarkdown(text);
  } catch (err) {
    await ctx.replyWithMarkdown(`❌ *Erro ao buscar sets:* ${err.message}`);
  } finally {
    await ctx.telegram.deleteMessage(ctx.chat.id, loadingMsg.message_id).catch(() => {});
  }
}

module.exports = { setsCommand };
