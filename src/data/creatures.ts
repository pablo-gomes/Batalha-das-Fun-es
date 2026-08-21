import { Creature, Skill } from '../types';

export const ALL_SKILLS: Record<string, Skill> = {
  golpe_raizes: {
    id: 'golpe_raizes',
    name: 'Golpe das Raízes',
    concept: 'roots',
    category: 'offensive',
    energyCost: 15,
    basePower: 35,
    accuracy: 95,
    description: 'Encontra as raízes x₁ e x₂ da função para desferir um golpe duplo cortante.',
    icon: 'Zap',
    requiredLevel: 1
  },
  explosao_delta: {
    id: 'explosao_delta',
    name: 'Explosão do Delta',
    concept: 'delta',
    category: 'offensive',
    energyCost: 20,
    basePower: 45,
    accuracy: 90,
    description: 'Calcula o discriminante Δ = b² - 4ac para liberar uma detonação térmica.',
    icon: 'Flame',
    requiredLevel: 3
  },
  vortice_vertice: {
    id: 'vortice_vertice',
    name: 'Vórtice do Vértice',
    concept: 'vertex_point',
    category: 'offensive',
    energyCost: 25,
    basePower: 55,
    accuracy: 85,
    description: 'Calcula o ponto extremo V(Xv, Yv) para aprisionar o inimigo em gravidade máxima.',
    icon: 'Orbit',
    requiredLevel: 5
  },
  precisao_fx: {
    id: 'precisao_fx',
    name: 'Precisão de f(x)',
    concept: 'fx_value',
    category: 'offensive',
    energyCost: 10,
    basePower: 25,
    accuracy: 100,
    description: 'Ataque rápido e ágil calculando o valor numérico exato da função.',
    icon: 'Crosshair',
    requiredLevel: 1
  },
  barreira_concavidade: {
    id: 'barreira_concavidade',
    name: 'Barreira Côncava',
    concept: 'concavity',
    category: 'defensive',
    energyCost: 15,
    basePower: 0,
    accuracy: 100,
    description: 'Identifica o sinal de a para erguer uma cúpula parabólica refletora de dano.',
    icon: 'Shield',
    requiredLevel: 2
  },
  corte_eixo_y: {
    id: 'corte_eixo_y',
    name: 'Lança do Ponto C',
    concept: 'y_intercept',
    category: 'offensive',
    energyCost: 12,
    basePower: 28,
    accuracy: 95,
    description: 'Focaliza a interseção no eixo Y (0, c) para um disparo perfurante instantâneo.',
    icon: 'MapPin',
    requiredLevel: 2
  },
  eixo_simetria: {
    id: 'eixo_simetria',
    name: 'Espelho de Simetria',
    concept: 'symmetry_axis',
    category: 'defensive',
    energyCost: 18,
    basePower: 0,
    accuracy: 95,
    description: 'Calcula o eixo x = -b/2a para duplicar a defesa e recuperar 15 de energia.',
    icon: 'Ruler',
    requiredLevel: 4
  },
  ataque_supremo_bhaskara: {
    id: 'ataque_supremo_bhaskara',
    name: 'Apocalipse Quadrático',
    concept: 'supreme',
    category: 'supreme',
    energyCost: 40,
    basePower: 90,
    accuracy: 80,
    description: 'Invoca a sabedoria suprema dos Mestres da Álgebra em um meteoro parabólico.',
    icon: 'Bomb',
    requiredLevel: 8
  }
};

export const STARTER_CREATURES: Creature[] = [
  {
    id: 'radicoide',
    name: 'Raizmon',
    species: 'Criatura das Raízes',
    element: 'Raízes',
    elementColor: '#10b981',
    level: 5,
    xp: 0,
    xpToNextLevel: 100,
    maxHp: 45,
    currentHp: 45,
    maxEnergy: 50,
    currentEnergy: 50,
    attack: 16,
    defense: 12,
    speed: 15,
    stage: 1,
    comboCount: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif',
    backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/1.gif',
    forms: [
      {
        stage: 1,
        name: 'Raizmon',
        spriteKey: 'radicoide_1',
        title: 'Brotinho Fatorador',
        hpBonus: 0,
        atkBonus: 0,
        defBonus: 0,
        specialSkill: 'Golpe das Raízes',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/1.gif'
      },
      {
        stage: 2,
        name: 'Raizel',
        spriteKey: 'radicoide_2',
        title: 'Guerreiro de Bhaskara',
        hpBonus: 25,
        atkBonus: 12,
        defBonus: 8,
        specialSkill: 'Explosão do Delta',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/2.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/2.gif'
      },
      {
        stage: 3,
        name: 'Radimax',
        spriteKey: 'radicoide_3',
        title: 'Arquimago das Fatorações',
        hpBonus: 55,
        atkBonus: 26,
        defBonus: 18,
        specialSkill: 'Apocalipse Quadrático',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/3.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/3.gif'
      }
    ],
    skills: [
      ALL_SKILLS.golpe_raizes,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.barreira_concavidade,
      ALL_SKILLS.explosao_delta
    ],
    spriteColor: {
      primary: '#10b981',
      secondary: '#047857',
      accent: '#a7f3d0',
      aura: 'rgba(16, 185, 129, 0.4)'
    },
    backSpriteColor: {
      primary: '#059669',
      secondary: '#064e3b',
      accent: '#6ee7b7'
    }
  },
  {
    id: 'Vertix',
    name: 'Vertix',
    species: 'Criatura do Vértice',
    element: 'Vértice',
    elementColor: '#3b82f6',
    level: 5,
    xp: 0,
    xpToNextLevel: 100,
    maxHp: 52,
    currentHp: 52,
    maxEnergy: 45,
    currentEnergy: 45,
    attack: 14,
    defense: 16,
    speed: 11,
    stage: 1,
    comboCount: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/7.gif',
    backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/7.gif',
    forms: [
      {
        stage: 1,
        name: 'Vertix',
        spriteKey: 'Vertix_1',
        title: 'Sentinela do Apogeu',
        hpBonus: 0,
        atkBonus: 0,
        defBonus: 0,
        specialSkill: 'Vórtice do Vértice',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/7.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/7.gif'
      },
      {
        stage: 2,
        name: 'Vertigonix',
        spriteKey: 'Vertix_2',
        title: 'Guardião do Extremo',
        hpBonus: 30,
        atkBonus: 9,
        defBonus: 14,
        specialSkill: 'Espelho de Simetria',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/8.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/8.gif'
      },
      {
        stage: 3,
        name: 'Vertexar',
        spriteKey: 'Vertix_3',
        title: 'Mestre da Curvatura',
        hpBonus: 65,
        atkBonus: 20,
        defBonus: 30,
        specialSkill: 'Apocalipse Quadrático',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/9.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/9.gif'
      }
    ],
    skills: [
      ALL_SKILLS.vortice_vertice,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.barreira_concavidade,
      ALL_SKILLS.eixo_simetria
    ],
    spriteColor: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#93c5fd',
      aura: 'rgba(59, 130, 246, 0.4)'
    },
    backSpriteColor: {
      primary: '#2563eb',
      secondary: '#1e3a8a',
      accent: '#60a5fa'
    }
  },
  {
    id: 'X-mander',
    name: 'X-mander',
    species: 'Criatura do Delta',
    element: 'Delta',
    elementColor: '#ef4444',
    level: 5,
    xp: 0,
    xpToNextLevel: 100,
    maxHp: 42,
    currentHp: 42,
    maxEnergy: 55,
    currentEnergy: 55,
    attack: 18,
    defense: 10,
    speed: 17,
    stage: 1,
    comboCount: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/4.gif',
    backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/4.gif',
    forms: [
      {
        stage: 1,
        name: 'X-mander',
        spriteKey: 'X-mander_1',
        title: 'Chama Discriminante',
        hpBonus: 0,
        atkBonus: 0,
        defBonus: 0,
        specialSkill: 'Explosão do Delta',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/4.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/4.gif'
      },
      {
        stage: 2,
        name: 'X-meleon',
        spriteKey: 'X-mander_2',
        title: 'Salamandra Quadrática',
        hpBonus: 22,
        atkBonus: 15,
        defBonus: 7,
        specialSkill: 'Golpe das Raízes',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/5.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/5.gif'
      },
      {
        stage: 3,
        name: 'X-lizard',
        spriteKey: 'X-mander_3',
        title: 'Dragão do Discriminante',
        hpBonus: 50,
        atkBonus: 32,
        defBonus: 16,
        specialSkill: 'Apocalipse Quadrático',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/6.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/6.gif'
      }
    ],
    skills: [
      ALL_SKILLS.explosao_delta,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.corte_eixo_y,
      ALL_SKILLS.golpe_raizes
    ],
    spriteColor: {
      primary: '#ef4444',
      secondary: '#b91c1c',
      accent: '#fca5a5',
      aura: 'rgba(239, 68, 68, 0.4)'
    },
    backSpriteColor: {
      primary: '#dc2626',
      secondary: '#7f1d1d',
      accent: '#f87171'
    }
  },
  {
    id: 'curvagon',
    name: 'Curvagon',
    species: 'Criatura Gráfica',
    element: 'Parábola',
    elementColor: '#8b5cf6',
    level: 5,
    xp: 0,
    xpToNextLevel: 100,
    maxHp: 48,
    currentHp: 48,
    maxEnergy: 50,
    currentEnergy: 50,
    attack: 15,
    defense: 14,
    speed: 14,
    stage: 1,
    comboCount: 0,
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/92.gif',
    backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/92.gif',
    forms: [
      {
        stage: 1,
        name: 'Curvagon',
        spriteKey: 'curvagon_1',
        title: 'Traçador Cartesiano',
        hpBonus: 0,
        atkBonus: 0,
        defBonus: 0,
        specialSkill: 'Barreira Côncava',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/92.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/92.gif'
      },
      {
        stage: 2,
        name: 'Geometrix',
        spriteKey: 'curvagon_2',
        title: 'Espectro da Parábola',
        hpBonus: 26,
        atkBonus: 11,
        defBonus: 11,
        specialSkill: 'Lança do Ponto C',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/93.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/93.gif'
      },
      {
        stage: 3,
        name: 'Arquimedes Supremo',
        spriteKey: 'curvagon_3',
        title: 'Soberano das Curvas',
        hpBonus: 58,
        atkBonus: 24,
        defBonus: 24,
        specialSkill: 'Apocalipse Quadrático',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/94.gif',
        backImageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/94.gif'
      }
    ],
    skills: [
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.corte_eixo_y,
      ALL_SKILLS.barreira_concavidade,
      ALL_SKILLS.vortice_vertice
    ],
    spriteColor: {
      primary: '#8b5cf6',
      secondary: '#6d28d9',
      accent: '#c4b5fd',
      aura: 'rgba(139, 92, 246, 0.4)'
    },
    backSpriteColor: {
      primary: '#7c3aed',
      secondary: '#4c1d95',
      accent: '#a78bfa'
    }
  }
];

// PNG Sprite dictionary for all game enemies and bosses
export const ENEMY_SPRITE_REGISTRY: Record<string, { front: string; back?: string }> = {
  // Floresta das Raízes
  'Raiz Silvestre': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/43.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/43.gif'
  },
  'Raíz Silvestre': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/43.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/43.gif'
  },
  'Fatorino Ágil': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/252.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/252.gif'
  },
  'Guardião Bhaskara': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/254.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/254.gif'
  },

  // Montanha do Vértice
  'Sentinela do Eixo': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/447.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/447.gif'
  },
  'Golem Simétrico': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/448.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/448.gif'
  },
  'Titã do Apogeu': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/248.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/248.gif'
  },

  // Vulcão do Delta
  'Fagulha Discriminante': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/155.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/155.gif'
  },
  'Salamandra de Fogo': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/126.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/126.gif'
  },
  'Vulcano Discriminante': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/157.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/157.gif'
  },

  // Vale das Parábolas
  'Espectro Cartesiano': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/200.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/200.gif'
  },
  'Ilusão de Gauss': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/65.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/65.gif'
  },
  'Rei da Parábola': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/282.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/282.gif'
  },

  // Torre das Funções
  'Arquimago Algébrico': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/149.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/149.gif'
  },
  'Avatar Polinomial': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/150.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/150.gif'
  },
  'Soberano Quadrático': {
    front: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/384.gif',
    back: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/384.gif'
  }
};

export function createEnemyCreature(
  name: string,
  element: 'Raízes' | 'Vértice' | 'Delta' | 'Parábola' | 'Geral',
  level: number,
  isBoss: boolean = false
): Creature {
  const hpBase = isBoss ? 70 + level * 12 : 30 + level * 6;
  const atkBase = isBoss ? 14 + level * 2.5 : 8 + level * 1.8;
  const defBase = isBoss ? 12 + level * 2.2 : 6 + level * 1.5;

  const colors = {
    Raízes: { primary: '#10b981', secondary: '#065f46', accent: '#6ee7b7', aura: 'rgba(16,185,129,0.3)' },
    Vértice: { primary: '#3b82f6', secondary: '#1e40af', accent: '#93c5fd', aura: 'rgba(59,130,246,0.3)' },
    Delta: { primary: '#ef4444', secondary: '#991b1b', accent: '#fca5a5', aura: 'rgba(239,68,68,0.3)' },
    Parábola: { primary: '#8b5cf6', secondary: '#5b21b6', accent: '#c4b5fd', aura: 'rgba(139,92,246,0.3)' },
    Geral: { primary: '#f59e0b', secondary: '#b45309', accent: '#fde68a', aura: 'rgba(245,158,11,0.3)' }
  }[element];

  const spriteData = ENEMY_SPRITE_REGISTRY[name] || ENEMY_SPRITE_REGISTRY[name.replace('í', 'i')] || ENEMY_SPRITE_REGISTRY[name.replace('i', 'í')];

  // Specific skills tailored to the enemy's elemental concept
  const elementalSkills = {
    Raízes: [
      ALL_SKILLS.golpe_raizes,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.barreira_concavidade,
      ...(isBoss ? [ALL_SKILLS.ataque_supremo_bhaskara] : [ALL_SKILLS.explosao_delta])
    ],
    Vértice: [
      ALL_SKILLS.vortice_vertice,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.eixo_simetria,
      ALL_SKILLS.barreira_concavidade,
      ...(isBoss ? [ALL_SKILLS.ataque_supremo_bhaskara] : [])
    ],
    Delta: [
      ALL_SKILLS.explosao_delta,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.corte_eixo_y,
      ALL_SKILLS.golpe_raizes,
      ...(isBoss ? [ALL_SKILLS.ataque_supremo_bhaskara] : [])
    ],
    Parábola: [
      ALL_SKILLS.corte_eixo_y,
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.barreira_concavidade,
      ALL_SKILLS.vortice_vertice,
      ...(isBoss ? [ALL_SKILLS.ataque_supremo_bhaskara] : [])
    ],
    Geral: [
      ALL_SKILLS.precisao_fx,
      ALL_SKILLS.vortice_vertice,
      ALL_SKILLS.explosao_delta,
      ALL_SKILLS.ataque_supremo_bhaskara
    ]
  }[element];

  return {
    id: `enemy_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    name,
    species: isBoss ? `Chefe ${element}` : `Fera ${element}`,
    element,
    elementColor: colors.primary,
    level,
    xp: level * 35,
    xpToNextLevel: 100,
    maxHp: Math.round(hpBase),
    currentHp: Math.round(hpBase),
    maxEnergy: 50,
    currentEnergy: 50,
    attack: Math.round(atkBase),
    defense: Math.round(defBase),
    speed: 10 + level,
    stage: isBoss ? (level >= 12 ? 3 : 2) : (level >= 8 ? 2 : 1),
    comboCount: 0,
    forms: [],
    imageUrl: spriteData?.front,
    backImageUrl: spriteData?.back || spriteData?.front,
    skills: elementalSkills,
    spriteColor: colors
  };
}

