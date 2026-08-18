// Ultra-fast sprite cache and preloader for Batalha das Funções

const preloadedUrls = new Set<string>();

/**
 * Preload an array of image URLs to browser cache for zero-lag rendering
 */
export function preloadSprites(urls: string[]) {
  if (typeof window === 'undefined') return;

  urls.forEach((url) => {
    if (!url || preloadedUrls.has(url)) return;
    preloadedUrls.add(url);

    const img = new Image();
    img.src = url;
  });
}

/**
 * Generate multi-tier fallback URLs for any Pokemon ID
 */
export function getPokemonSpriteUrls(id: number | string) {
  return {
    frontAnimated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`,
    backAnimated: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/${id}.gif`,
    frontPng: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    backPng: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
    frontGen5: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`,
    backGen5: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`,
    artwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
  };
}
