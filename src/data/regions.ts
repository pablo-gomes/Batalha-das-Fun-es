import { Region } from '../types';
import { createEnemyCreature } from './creatures';

export const GAME_REGIONS: Region[] = [
  {
    id: 'floresta_raizes',
    name: '🌱 Floresta das Raízes',
    subtitle: 'O Reino da Fatoração e Bhaskara',
    theme: 'roots',
    icon: '🌱',
    bgGradient: 'from-emerald-950 via-slate-900 to-emerald-900',
    unlocked: true,
    bossDefeated: false,
    conceptFocus: ['roots', 'fx_value', 'concavity'],
    stages: [
      {
        id: 'floresta_1',
        name: 'Trilha dos Coeficientes',
        isBoss: false,
        levelReq: 1,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Raíz Silvestre', 'Raízes', 3)
      },
      {
        id: 'floresta_2',
        name: 'Bosque de Fatorino',
        isBoss: false,
        levelReq: 3,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Fatorino Ágil', 'Raízes', 5)
      },
      {
        id: 'floresta_boss',
        name: 'Clareira Sagrada: Guardião Bhaskara',
        isBoss: true,
        bossName: 'Guardião Bhaskara',
        levelReq: 5,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Guardião Bhaskara', 'Raízes', 7, true)
      }
    ]
  },
  {
    id: 'montanha_vertice',
    name: '🏔️ Montanha do Vértice',
    subtitle: 'Picos de Máximo e Abismos de Mínimo',
    theme: 'vertex',
    icon: '🏔️',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
    unlocked: false,
    bossDefeated: false,
    conceptFocus: ['vertex_x', 'vertex_y', 'vertex_point', 'max_min'],
    stages: [
      {
        id: 'montanha_1',
        name: 'Encosta do Xᵥ',
        isBoss: false,
        levelReq: 6,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Sentinela do Eixo', 'Vértice', 8)
      },
      {
        id: 'montanha_2',
        name: 'Planalto dos Extremos',
        isBoss: false,
        levelReq: 8,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Golem Simétrico', 'Vértice', 10)
      },
      {
        id: 'montanha_boss',
        name: 'Cume Celeste: Titã do Apogeu',
        isBoss: true,
        bossName: 'Titã do Apogeu',
        levelReq: 10,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Titã do Apogeu', 'Vértice', 12, true)
      }
    ]
  },
  {
    id: 'vulcao_delta',
    name: '🌋 Vulcão do Delta',
    subtitle: 'O Domínio do Discriminante',
    theme: 'delta',
    icon: '🌋',
    bgGradient: 'from-red-950 via-slate-900 to-amber-950',
    unlocked: false,
    bossDefeated: false,
    conceptFocus: ['delta', 'roots', 'fx_value'],
    stages: [
      {
        id: 'vulcao_1',
        name: 'Cratera Δ < 0 (Sem Raízes)',
        isBoss: false,
        levelReq: 11,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Fagulha Discriminante', 'Delta', 12)
      },
      {
        id: 'vulcao_2',
        name: 'Rio de Magma Δ = 0 (Raiz Única)',
        isBoss: false,
        levelReq: 13,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Salamandra de Fogo', 'Delta', 14)
      },
      {
        id: 'vulcao_boss',
        name: 'Coração do Vulcão: Vulcano Δ > 0',
        isBoss: true,
        bossName: 'Vulcano Discriminante',
        levelReq: 15,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Vulcano Discriminante', 'Delta', 17, true)
      }
    ]
  },
  {
    id: 'vale_parabolas',
    name: '🌌 Vale das Parábolas',
    subtitle: 'Planos Cartesianos e Gráficos Vivos',
    theme: 'parabola',
    icon: '🌌',
    bgGradient: 'from-purple-950 via-slate-900 to-fuchsia-950',
    unlocked: false,
    bossDefeated: false,
    conceptFocus: ['concavity', 'y_intercept', 'symmetry_axis', 'graph_interpret'],
    stages: [
      {
        id: 'vale_1',
        name: 'Trilhas Cartesianas',
        isBoss: false,
        levelReq: 16,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Espectro Cartesiano', 'Parábola', 17)
      },
      {
        id: 'vale_2',
        name: 'Labirinto de Simetria',
        isBoss: false,
        levelReq: 18,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Ilusão de Gauss', 'Parábola', 19)
      },
      {
        id: 'vale_boss',
        name: 'Templo da Curva: Rei da Parábola',
        isBoss: true,
        bossName: 'Rei da Parábola',
        levelReq: 20,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Rei da Parábola', 'Parábola', 22, true)
      }
    ]
  },
  {
    id: 'torre_funcoes',
    name: '🏰 Torre das Funções',
    subtitle: 'O Santuário Supremo da Álgebra',
    theme: 'general',
    icon: '🏰',
    bgGradient: 'from-amber-950 via-slate-900 to-yellow-950',
    unlocked: false,
    bossDefeated: false,
    conceptFocus: ['supreme', 'roots', 'vertex_point', 'delta'],
    stages: [
      {
        id: 'torre_1',
        name: 'Salão dos Mestres',
        isBoss: false,
        levelReq: 22,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Arquimago Algébrico', 'Geral', 23)
      },
      {
        id: 'torre_2',
        name: 'Câmara do Conhecimento',
        isBoss: false,
        levelReq: 24,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Avatar Polinomial', 'Geral', 25)
      },
      {
        id: 'torre_boss',
        name: 'Trono Eterno: Soberano Quadrático',
        isBoss: true,
        bossName: 'Soberano Quadrático',
        levelReq: 26,
        stars: 0,
        completed: false,
        enemyCreature: createEnemyCreature('Soberano Quadrático', 'Geral', 28, true)
      }
    ]
  }
];
