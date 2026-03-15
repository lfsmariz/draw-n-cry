const { getRarityEmoji, getSets, openBooster } = require('../../src/services/yugioh');

describe('getRarityEmoji', () => {
  test.each([
    ['Common', '⚪'],
    ['Rare', '🔵'],
    ['Super Rare', '🟡'],
    ['Ultra Rare', '🟠'],
    ['Secret Rare', '🔴'],
    ['Prismatic Secret Rare', '🌈'],
    ['Starlight Rare', '✨'],
    ['Quarter Century Secret Rare', '💎'],
  ])('%s → %s', (rarity, expected) => {
    expect(getRarityEmoji(rarity)).toBe(expected);
  });

  test('raridade desconhecida retorna ❓', () => {
    expect(getRarityEmoji('Fake Rare')).toBe('❓');
  });
});

describe('getSets', () => {
  test('retorna array não vazio', () => {
    const sets = getSets();
    expect(Array.isArray(sets)).toBe(true);
    expect(sets.length).toBeGreaterThan(0);
  });

  test('cada set tem name e format', () => {
    getSets().forEach(s => {
      expect(typeof s.name).toBe('string');
      expect(typeof s.format).toBe('string');
    });
  });
});

describe('openBooster', () => {
  afterEach(() => jest.restoreAllMocks());

  test('retorna array de cartas em sucesso', async () => {
    const cards = [{ id: 1, name: 'Blue-Eyes', rarity: 'Ultra Rare', image_url: 'http://img', type: 'Monster', price: '10.00', setcode: 'LOB-001' }];
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [cards],
    });

    const result = await openBooster('Legend of Blue Eyes White Dragon');
    expect(result).toEqual(cards);
  });

  test('lança erro se API retornar status não-ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 400 });
    await expect(openBooster('invalid')).rejects.toThrow('API retornou status 400');
  });

  test('lança erro se resposta não for array válido', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ error: 'not found' }),
    });
    await expect(openBooster('invalid')).rejects.toThrow('Set não encontrado ou sem cartas disponíveis');
  });
});
