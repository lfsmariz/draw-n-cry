jest.mock('../../src/services/yugioh');
const { openBooster } = require('../../src/services/yugioh');
const { openCommand } = require('../../src/commands/open');

const LOG_GROUP_ID = -5299221515;

const makeCtx = (overrides = {}) => ({
  chat: { id: 999 },
  from: { id: 42 },
  message: { text: '/open Burst Protocol' },
  reply: jest.fn().mockResolvedValue({ message_id: 1 }),
  replyWithMarkdown: jest.fn().mockResolvedValue({}),
  replyWithPhoto: jest.fn().mockResolvedValue({}),
  telegram: {
    deleteMessage: jest.fn().mockResolvedValue({}),
    sendMessage: jest.fn().mockResolvedValue({}),
  },
  ...overrides,
});

const mockCards = [
  { name: 'Blue-Eyes White Dragon', image_url: 'http://img/1.jpg' },
  { name: 'Dark Magician', image_url: 'http://img/2.jpg' },
];

beforeEach(() => {
  openBooster.mockResolvedValue(mockCards);
  process.env.LOG_GROUP_ID = String(LOG_GROUP_ID);
});

afterEach(() => jest.clearAllMocks());

test('ignora mensagens vindas do grupo de log', async () => {
  const ctx = makeCtx({ chat: { id: LOG_GROUP_ID } });
  await openCommand(ctx);
  expect(ctx.reply).not.toHaveBeenCalled();
  expect(openBooster).not.toHaveBeenCalled();
});

test('avisa se nenhum set for informado', async () => {
  const ctx = makeCtx({ message: { text: '/open' } });
  await openCommand(ctx);
  expect(ctx.replyWithMarkdown).toHaveBeenCalledWith(expect.stringContaining('Informe o nome'));
  expect(openBooster).not.toHaveBeenCalled();
});

test('envia uma foto por carta', async () => {
  const ctx = makeCtx();
  await openCommand(ctx);
  expect(ctx.replyWithPhoto).toHaveBeenCalledTimes(mockCards.length);
});

test('caption de cada carta contém uuid, nome e hash', async () => {
  const ctx = makeCtx();
  await openCommand(ctx);

  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;
  const hashRegex = /[0-9a-f]{64}/;

  ctx.replyWithPhoto.mock.calls.forEach(([, options]) => {
    expect(options.caption).toMatch(uuidRegex);
    expect(options.caption).toMatch(hashRegex);
  });
});

test('envia log para o grupo com userId e hashes', async () => {
  const ctx = makeCtx();
  await openCommand(ctx);

  expect(ctx.telegram.sendMessage).toHaveBeenCalledWith(
    LOG_GROUP_ID,
    expect.stringContaining('42'),
    expect.any(Object)
  );
  const logText = ctx.telegram.sendMessage.mock.calls[0][1];
  expect(logText).not.toMatch(/Blue-Eyes|Dark Magician/);
});

test('envia mensagem de erro se openBooster falhar', async () => {
  openBooster.mockRejectedValue(new Error('Set não encontrado'));
  const ctx = makeCtx();
  await openCommand(ctx);
  expect(ctx.replyWithMarkdown).toHaveBeenCalledWith(expect.stringContaining('Set não encontrado'));
});

test('deleta mensagem de loading ao final', async () => {
  const ctx = makeCtx();
  await openCommand(ctx);
  expect(ctx.telegram.deleteMessage).toHaveBeenCalledWith(999, 1);
});
