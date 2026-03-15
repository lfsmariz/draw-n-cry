async function startCommand(ctx) {
  await ctx.replyWithMarkdown(
    `🃏 *Draw \'n\' Cry — Simulador de Boosters Yu-Gi-Oh!*\n\n` +
    `Abra pacotes virtuais e chore com os resultados 😭\n\n` +
    `*Comandos disponíveis:*\n` +
    `/open <set> — Abre um booster do set informado\n` +
    `/sets — Lista sets disponíveis para abrir\n\n` +
    `*Exemplo:*\n` +
    `/open BPRO`
  );
}

module.exports = { startCommand };
