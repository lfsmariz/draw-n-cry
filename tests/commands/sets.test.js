jest.mock('../../src/services/yugioh');
const { getSets } = require('../../src/services/yugioh');
const { setsCommand } = require('../../src/commands/sets');

const makeCtx = (text = '/sets') => ({
  chat: { id: 1 },
  message: { text },
  reply: jest.fn().mockResolvedValue({ message_id: 1 }),
  replyWithMarkdown: jest.fn().mockResolvedValue({}),
  telegram: { deleteMessage: jest.fn().mockResolvedValue({}) },
});

const makeSets = (n) =>
  Array.from({ length: n }, (_, i) => ({ name: `Set ${i + 1}`, format: `set-${i + 1}` }));

afterEach(() => jest.clearAllMocks());

test('exibe primeira página por padrão', async () => {
  getSets.mockReturnValue(makeSets(25));
  const ctx = makeCtx();
  await setsCommand(ctx);
  const text = ctx.replyWithMarkdown.mock.calls[0][0];
  expect(text).toContain('1/2');
  expect(text).toContain('Set 1');
  expect(text).not.toContain('Set 21');
});

test('exibe página solicitada', async () => {
  getSets.mockReturnValue(makeSets(25));
  const ctx = makeCtx('/sets 2');
  await setsCommand(ctx);
  const text = ctx.replyWithMarkdown.mock.calls[0][0];
  expect(text).toContain('2/2');
  expect(text).toContain('Set 21');
});

test('clamp em página além do total', async () => {
  getSets.mockReturnValue(makeSets(5));
  const ctx = makeCtx('/sets 99');
  await setsCommand(ctx);
  const text = ctx.replyWithMarkdown.mock.calls[0][0];
  expect(text).toContain('1/1');
});

test('avisa se lista estiver vazia', async () => {
  getSets.mockReturnValue([]);
  const ctx = makeCtx();
  await setsCommand(ctx);
  expect(ctx.reply).toHaveBeenCalledWith('Nenhum set encontrado.');
});

test('deleta mensagem de loading ao final', async () => {
  getSets.mockReturnValue(makeSets(3));
  const ctx = makeCtx();
  await setsCommand(ctx);
  expect(ctx.telegram.deleteMessage).toHaveBeenCalledWith(1, 1);
});
