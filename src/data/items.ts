import { InventoryItem } from '../types';

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'potion_hp',
    name: 'Poção Matemática',
    icon: 'FlaskConical',
    description: 'Restaura 30 pontos de Vida (HP) da sua criatura instantaneamente.',
    type: 'heal_hp',
    amount: 5,
    value: 30,
    cost: 50
  },
  {
    id: 'potion_energy',
    name: 'Éter Discriminante',
    icon: 'Zap',
    description: 'Restaura 45 pontos de Energia (MP) para usar habilidades matemáticas.',
    type: 'restore_energy',
    amount: 5,
    value: 45,
    cost: 40
  },
  {
    id: 'calc_hint',
    name: 'Calculadora Mística',
    icon: 'Gem',
    description: 'Desbloqueia todas as 3 dicas passo a passo da função atual sem perder recompensas.',
    type: 'dica_extra',
    amount: 3,
    value: 1,
    cost: 80
  },
  {
    id: 'parabola_shield',
    name: 'Escudo Parabólico',
    icon: 'Shield',
    description: 'Reduz em 50% o dano do próximo golpe sofrido pela criatura.',
    type: 'shield',
    amount: 3,
    value: 50,
    cost: 60
  },
  {
    id: 'combo_multiplier',
    name: 'Multiplicador Crítico',
    icon: 'Flame',
    description: 'Dobra (+100%) o dano do próximo ataque se a resposta tiver alta precisão.',
    type: 'damage_boost',
    amount: 2,
    value: 2,
    cost: 100
  },
  {
    id: 'potion_hp_max',
    name: 'Super Poção Quadrática',
    icon: 'Sparkles',
    description: 'Restaura 70 pontos de Vida (HP) da sua criatura instantaneamente.',
    type: 'heal_hp',
    amount: 4,
    value: 70,
    cost: 100
  },
  {
    id: 'potion_energy_max',
    name: 'Éter Supremo',
    icon: 'Zap',
    description: 'Restaura 100 pontos de Energia (MP) para usar habilidades matemáticas.',
    type: 'restore_energy',
    amount: 4,
    value: 100,
    cost: 90
  }
];
