import { InventoryItem } from '../types';

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'potion_hp',
    name: 'Poção Matemática',
    icon: 'FlaskConical',
    description: 'Restaura 30 pontos de Vida (HP) da sua criatura instantaneamente.',
    type: 'heal_hp',
    amount: 3,
    value: 30,
    cost: 50
  },
  {
    id: 'potion_energy',
    name: 'Éter Discriminante',
    icon: 'Zap',
    description: 'Restaura 25 pontos de Energia para usar habilidades matemáticas.',
    type: 'restore_energy',
    amount: 3,
    value: 25,
    cost: 40
  },
  {
    id: 'calc_hint',
    name: 'Calculadora Mística',
    icon: 'Gem',
    description: 'Desbloqueia todas as 3 dicas passo a passo da função atual sem perder recompensas.',
    type: 'dica_extra',
    amount: 2,
    value: 1,
    cost: 80
  },
  {
    id: 'parabola_shield',
    name: 'Escudo Parabólico',
    icon: 'Shield',
    description: 'Reduz em 50% o dano do próximo golpe sofrido pela criatura.',
    type: 'shield',
    amount: 2,
    value: 50,
    cost: 60
  },
  {
    id: 'combo_multiplier',
    name: 'Multiplicador Crítico',
    icon: 'Flame',
    description: 'Dobra (+100%) o dano do próximo ataque se a resposta tiver alta precisão.',
    type: 'damage_boost',
    amount: 1,
    value: 2,
    cost: 100
  },
  {
    id: 'formula_codex',
    name: 'Livro de Bhaskara',
    icon: 'BookOpen',
    description: 'Mostra todas as fórmulas da função quadrática durante a batalha.',
    type: 'formula_book',
    amount: 1,
    value: 1,
    cost: 120
  }
];
