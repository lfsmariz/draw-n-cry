const API_BASE = 'http://ygoprodeck.com/api/pack-sim';

const RARITY_EMOJI = {
  'Common': '⚪',
  'Rare': '🔵',
  'Super Rare': '🟡',
  'Ultra Rare': '🟠',
  'Secret Rare': '🔴',
  'Prismatic Secret Rare': '🌈',
  'Starlight Rare': '✨',
  'Quarter Century Secret Rare': '💎',
};

async function openBooster(format) {
  const url = `${API_BASE}/pack-open.php?format=${encodeURIComponent(format)}&settype=1&server=origin&_=${Date.now()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API retornou status ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
    throw new Error('Set não encontrado ou sem cartas disponíveis');
  }

  return data[0];
}

const SETS = [
  { name: 'The Legend of Blue Eyes White Dragon', link: 'https://ygoprodeck.com/pack/The%20Legend%20of%20Blue%20Eyes%20White%20Dragon' },
  { name: 'Metal Raiders', link: 'https://ygoprodeck.com/pack/Metal%20Raiders' },
  { name: 'Tournament Pack 1', link: 'https://ygoprodeck.com/pack/Tournament%20Pack%3A%201st%20Season' },
].map(s => ({
  name: s.name,
  format: decodeURIComponent(s.link.split('/pack/')[1] ?? s.name),
}));

function getSets() {
  return SETS;
}

function getRarityEmoji(rarity) {
  return RARITY_EMOJI[rarity] ?? '❓';
}

module.exports = { openBooster, getSets, getRarityEmoji };
