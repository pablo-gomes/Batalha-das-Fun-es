export interface SpritePreset {
  id: string;
  name: string;
  category: 'monsters' | 'heroes' | 'retro' | 'anime';
  element: 'Raízes' | 'Vértice' | 'Delta' | 'Parábola' | 'Geral';
  frontUrl: string;
  backUrl?: string;
  description: string;
}

export const SPRITE_PRESETS: SpritePreset[] = [
  // Monsters & Creatures
  {
    id: 'delta_charizard',
    name: 'Dragão Ígneo (Delta)',
    category: 'monsters',
    element: 'Delta',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/6.gif',
    description: 'Chama ardente que domina o discriminante positivo Δ > 0.'
  },
  {
    id: 'root_bulbasaur',
    name: 'Flora Raiz (Bhaskara)',
    category: 'monsters',
    element: 'Raízes',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/3.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/3.gif',
    description: 'Guardião botânico que extrai a força das raízes reais x₁ e x₂.'
  },
  {
    id: 'vertex_blastoise',
    name: 'Hidro Vértice (Apogeu)',
    category: 'monsters',
    element: 'Vértice',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/9.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/9.gif',
    description: 'Tanque aquático com canhões calibrados no vértice central V(Xv, Yv).'
  },
  {
    id: 'spark_pikachu',
    name: 'Raio Quadrático',
    category: 'monsters',
    element: 'Delta',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/25.gif',
    description: 'Eletricidade veloz que calcula funções num piscar de olhos.'
  },
  {
    id: 'shadow_gengar',
    name: 'Espectro da Parábola',
    category: 'monsters',
    element: 'Parábola',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/94.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/94.gif',
    description: 'Manipula sombras curvas e concavidades invertidas (a < 0).'
  },
  {
    id: 'psychic_mewtwo',
    name: 'Lorde dos Mestres',
    category: 'monsters',
    element: 'Geral',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/150.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/150.gif',
    description: 'Poder supremo da Álgebra capaz de resolver qualquer polinômio.'
  },
  {
    id: 'lucario_vertex',
    name: 'Aura do Vértice',
    category: 'heroes',
    element: 'Vértice',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/448.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/448.gif',
    description: 'Canaliza a energia do ponto extremo e do eixo de simetria.'
  },
  {
    id: 'gardevoir_parabola',
    name: 'Fada Cartesiana',
    category: 'heroes',
    element: 'Parábola',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/282.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/282.gif',
    description: 'Elegância matemática desenhando trajetórias de projéteis perfeitas.'
  },
  {
    id: 'dragonite_roots',
    name: 'Dragão Ancestral',
    category: 'monsters',
    element: 'Raízes',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/149.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/149.gif',
    description: 'Lenda aérea que navega pelas coordenadas do plano cartesiano.'
  },
  {
    id: 'rayquaza_boss',
    name: 'Serpente Celeste',
    category: 'anime',
    element: 'Geral',
    frontUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/384.gif',
    backUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/384.gif',
    description: 'O guardião do infinito que governa as curvas celestes.'
  }
];
