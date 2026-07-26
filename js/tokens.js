// Laatat: jalokivet, Afrikan tähti, hevosenkengät, ryöstäjät ja tyhjät.

export const TOKEN_TYPES = {
  star: { id: 'star', name: 'Afrikan tähti', symbol: '★', value: 0, color: '#f6c445' },
  horseshoe: { id: 'horseshoe', name: 'Hevosenkenkä', symbol: 'Ω', value: 0, color: '#c9d1d9' },
  robber: { id: 'robber', name: 'Ryöstäjä', symbol: '☠', value: 0, color: '#8a8f98' },
  ruby: { id: 'ruby', name: 'Rubiini', symbol: '◆', value: 1000, color: '#e0413e' },
  emerald: { id: 'emerald', name: 'Smaragdi', symbol: '◆', value: 600, color: '#2fa36b' },
  topaz: { id: 'topaz', name: 'Topaasi', symbol: '◆', value: 300, color: '#e8a020' },
  empty: { id: 'empty', name: 'Tyhjä', symbol: '·', value: 0, color: '#6f5b45' },
};

// Yhteensä 30 laattaa, yksi jokaiseen kaupunkiin aloituskaupunkeja lukuun ottamatta.
export const TOKEN_COUNTS = {
  star: 1,
  horseshoe: 2,
  robber: 3,
  ruby: 4,
  emerald: 5,
  topaz: 6,
  empty: 9,
};

export function tokenPileTemplate() {
  const pile = [];
  for (const [type, count] of Object.entries(TOKEN_COUNTS)) {
    for (let i = 0; i < count; i++) pile.push(type);
  }
  return pile;
}

/** Sekoittaa laattapinon (Fisher–Yates). */
export function createTokenPile(rng = Math.random) {
  const pile = tokenPileTemplate();
  for (let i = pile.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pile[i], pile[j]] = [pile[j], pile[i]];
  }
  return pile;
}
