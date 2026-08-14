export type MathConcept = 
  | 'fx_value' 
  | 'roots' 
  | 'delta' 
  | 'vertex_x' 
  | 'vertex_y' 
  | 'vertex_point' 
  | 'concavity' 
  | 'symmetry_axis' 
  | 'y_intercept' 
  | 'max_min' 
  | 'graph_interpret' 
  | 'supreme';

export type QuestionInputType = 'number' | 'number_pair' | 'choice' | 'boolean';

export interface MathChallenge {
  id: string;
  concept: MathConcept;
  title: string;
  formula: string; // e.g. "f(x) = x² - 5x + 6"
  a: number;
  b: number;
  c: number;
  question: string; // e.g. "Calcule as raízes x₁ e x₂ da função:"
  paramX?: number; // for f(x)
  inputType: QuestionInputType;
  choices?: { label: string; value: string | number; isCorrect: boolean }[];
  targetAnswer: number | [number, number] | string;
  exactTargetString: string;
  tolerance: number; // for precision calculation
  hint1: string; // Formula hint
  hint2: string; // Substitution hint
  hint3: string; // Step-by-step partial resolution
  explanation: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'mestre' | 'lendario';
}

export interface PrecisionResult {
  accuracyPercentage: number; // 0 to 100
  rating: 'PERFEITO' | 'ALTA' | 'MEDIA' | 'BAIXA' | 'FALHA';
  damageMultiplier: number;
  message: string;
  isExact: boolean;
}

export interface Skill {
  id: string;
  name: string;
  concept: MathConcept;
  category: 'offensive' | 'defensive' | 'support' | 'supreme';
  energyCost: number;
  basePower: number;
  accuracy: number;
  description: string;
  icon: string;
  requiredLevel: number;
}

export interface CreatureForm {
  stage: 1 | 2 | 3;
  name: string;
  spriteKey: string;
  title: string;
  hpBonus: number;
  atkBonus: number;
  defBonus: number;
  specialSkill: string;
  imageUrl?: string;
  backImageUrl?: string;
  customImageUrl?: string;
  customBackImageUrl?: string;
}

export interface Creature {
  id: string;
  name: string;
  species: string;
  element: 'Raízes' | 'Vértice' | 'Delta' | 'Parábola' | 'Geral';
  elementColor: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  maxHp: number;
  currentHp: number;
  maxEnergy: number;
  currentEnergy: number;
  attack: number;
  defense: number;
  speed: number;
  stage: 1 | 2 | 3;
  forms: CreatureForm[];
  skills: Skill[];
  comboCount: number;
  statusCondition?: 'concentrado' | 'avancado' | 'evolucao_temp' | null;
  imageUrl?: string;
  backImageUrl?: string;
  customImageUrl?: string;
  customBackImageUrl?: string;
  customPixelated?: boolean;
  spriteColor: {
    primary: string;
    secondary: string;
    accent: string;
    aura: string;
  };
  backSpriteColor?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: 'heal_hp' | 'restore_energy' | 'dica_extra' | 'shield' | 'damage_boost' | 'formula_book';
  amount: number;
  value: number;
  cost: number;
}

export interface Region {
  id: string;
  name: string;
  subtitle: string;
  theme: string;
  icon: string;
  bgGradient: string;
  unlocked: boolean;
  bossDefeated: boolean;
  conceptFocus: MathConcept[];
  stages: {
    id: string;
    name: string;
    isBoss: boolean;
    bossName?: string;
    levelReq: number;
    stars: number;
    completed: boolean;
    enemyCreature: Creature;
  }[];
}

export interface CombatLog {
  id: string;
  text: string;
  type: 'player' | 'enemy' | 'system' | 'crit' | 'precision' | 'combo' | 'heal';
  timestamp: number;
}
