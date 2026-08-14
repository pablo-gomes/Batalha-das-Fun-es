import { MathChallenge, MathConcept, PrecisionResult } from '../types';

export function formatQuadraticFunction(a: number, b: number, c: number): string {
  let str = 'f(x) = ';
  // a term
  if (a === 1) str += 'x²';
  else if (a === -1) str += '-x²';
  else str += `${a}x²`;

  // b term
  if (b !== 0) {
    if (b > 0) str += ` + ${b === 1 ? '' : b}x`;
    else str += ` - ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`;
  }

  // c term
  if (c !== 0) {
    if (c > 0) str += ` + ${c}`;
    else str += ` - ${Math.abs(c)}`;
  } else if (b === 0) {
    // just ax^2
  }

  return str;
}

export function generateMathChallenge(
  concept: MathConcept, 
  difficulty: 'facil' | 'medio' | 'dificil' | 'mestre' | 'lendario' = 'medio'
): MathChallenge {
  const id = `chal_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  if (concept === 'fx_value') {
    // f(x) for a given x
    const a = difficulty === 'facil' ? 1 : (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
    const b = (Math.floor(Math.random() * 5) - 2) * (difficulty === 'facil' ? 1 : 2);
    const c = Math.floor(Math.random() * 9) - 4;
    const xVal = Math.floor(Math.random() * 5) - 2; // e.g. -2, -1, 0, 1, 2, 3

    const correct = a * xVal * xVal + b * xVal + c;
    const formula = formatQuadraticFunction(a, b, c);

    return {
      id,
      concept,
      title: '🎯 Precisão de f(x)',
      formula,
      a, b, c,
      paramX: xVal,
      question: `Calcule o valor numérico de f(${xVal}):`,
      inputType: 'number',
      targetAnswer: correct,
      exactTargetString: `${correct}`,
      tolerance: 2,
      hint1: `Substitua a variável x por (${xVal}) em toda a expressão.`,
      hint2: `f(${xVal}) = ${a}·(${xVal})² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}·(${xVal}) ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
      hint3: `(${xVal})² = ${xVal * xVal}. Multiplique os coeficientes e some os termos.`,
      explanation: `f(${xVal}) = ${a}·(${xVal * xVal}) + (${b * xVal}) + (${c}) = ${correct}`,
      difficulty
    };
  }

  if (concept === 'delta') {
    // Discriminant Delta = b^2 - 4ac
    let a = 1;
    let b = 4;
    let c = 3;

    if (difficulty === 'facil') {
      a = 1;
      b = (Math.floor(Math.random() * 4) + 1) * 2; // 2, 4, 6, 8
      c = Math.floor(Math.random() * 5) + 1; // 1 to 5
    } else {
      a = Math.random() > 0.5 ? 1 : 2;
      b = Math.floor(Math.random() * 8) - 4;
      c = Math.floor(Math.random() * 6) - 3;
    }

    const delta = b * b - 4 * a * c;
    const formula = formatQuadraticFunction(a, b, c);

    return {
      id,
      concept,
      title: '🔥 Explosão do Delta (Δ)',
      formula,
      a, b, c,
      question: `Calcule o discriminante Δ = b² - 4ac:`,
      inputType: 'number',
      targetAnswer: delta,
      exactTargetString: `${delta}`,
      tolerance: 3,
      hint1: `A fórmula do discriminante é Δ = b² - 4·a·c.`,
      hint2: `Identifique os coeficientes: a = ${a}, b = ${b}, c = ${c}.`,
      hint3: `Δ = (${b})² - 4·(${a})·(${c}) = ${b * b} - (${4 * a * c})`,
      explanation: `Δ = (${b})² - 4·(${a})·(${c}) = ${b * b} - (${4 * a * c}) = ${delta}. Como Δ ${delta > 0 ? '> 0 (2 raízes reais)' : delta === 0 ? '= 0 (1 raiz real)' : '< 0 (sem raízes reais)'}.`,
      difficulty
    };
  }

  if (concept === 'roots') {
    // Clean integer roots r1, r2 -> f(x) = a(x - r1)(x - r2)
    const rootsPool = [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const r1 = rootsPool[Math.floor(Math.random() * rootsPool.length)];
    let r2 = rootsPool[Math.floor(Math.random() * rootsPool.length)];
    if (r1 === r2 && difficulty !== 'facil') {
      r2 = (r1 + 2) % 5;
    }

    const a = 1;
    const b = -(r1 + r2);
    const c = r1 * r2;
    const formula = formatQuadraticFunction(a, b, c);
    const sortedRoots = [Math.min(r1, r2), Math.max(r1, r2)];

    // If multiple choice for intuitive mobile play
    const fake1 = [sortedRoots[0] + 1, sortedRoots[1] + 1];
    const fake2 = [-sortedRoots[0], -sortedRoots[1]].sort((x, y) => x - y);
    const fake3 = [sortedRoots[0] - 1, sortedRoots[1] + 2];

    return {
      id,
      concept,
      title: '⚡ Golpe das Raízes (x₁ e x₂)',
      formula,
      a, b, c,
      question: `Encontre as raízes reais (x₁ e x₂) que zeram a função f(x) = 0:`,
      inputType: 'choice',
      choices: [
        { label: `x₁ = ${sortedRoots[0]}  e  x₂ = ${sortedRoots[1]}`, value: `${sortedRoots[0]},${sortedRoots[1]}`, isCorrect: true },
        { label: `x₁ = ${fake1[0]}  e  x₂ = ${fake1[1]}`, value: `${fake1[0]},${fake1[1]}`, isCorrect: false },
        { label: `x₁ = ${fake2[0]}  e  x₂ = ${fake2[1]}`, value: `${fake2[0]},${fake2[1]}`, isCorrect: false },
        { label: `x₁ = ${fake3[0]}  e  x₂ = ${fake3[1]}`, value: `${fake3[0]},${fake3[1]}`, isCorrect: false }
      ].sort(() => Math.random() - 0.5),
      targetAnswer: `${sortedRoots[0]},${sortedRoots[1]}`,
      exactTargetString: `x₁ = ${sortedRoots[0]}, x₂ = ${sortedRoots[1]}`,
      tolerance: 0,
      hint1: `Use a fórmula de Bhaskara: x = (-b ± √Δ) / 2a ou Soma e Produto: S = -b/a = ${-b}, P = c/a = ${c}.`,
      hint2: `Δ = (${b})² - 4·(1)·(${c}) = ${b * b - 4 * c}. √Δ = ${Math.sqrt(b * b - 4 * c)}.`,
      hint3: `x = (-(${b}) ± ${Math.sqrt(b * b - 4 * c)}) / 2.`,
      explanation: `As raízes são x₁ = ${sortedRoots[0]} e x₂ = ${sortedRoots[1]}, pois f(${sortedRoots[0]}) = 0 e f(${sortedRoots[1]}) = 0.`,
      difficulty
    };
  }

  if (concept === 'vertex_x' || concept === 'vertex_y' || concept === 'vertex_point') {
    // Vertex V(Xv, Yv) where Xv = -b / 2a, Yv = -Delta / 4a
    // Let's choose Xv as an integer
    const xv = Math.floor(Math.random() * 7) - 3; // -3 to 3
    const a = Math.random() > 0.4 ? 1 : -1;
    const b = -2 * a * xv;
    const yv = Math.floor(Math.random() * 9) - 4; // integer Yv
    // Yv = c - a*xv^2 => c = Yv + a*xv^2
    const c = yv + a * xv * xv;

    const formula = formatQuadraticFunction(a, b, c);

    if (concept === 'vertex_x') {
      return {
        id,
        concept,
        title: '🌀 Vórtice do Vértice (Xᵥ)',
        formula,
        a, b, c,
        question: `Calcule a coordenada X do vértice (Xᵥ = -b / 2a):`,
        inputType: 'number',
        targetAnswer: xv,
        exactTargetString: `${xv}`,
        tolerance: 1,
        hint1: `A fórmula da abscissa do vértice é Xᵥ = -b / (2·a).`,
        hint2: `Identifique: a = ${a}, b = ${b}. Portanto, -b = ${-b}.`,
        hint3: `Xᵥ = -(${b}) / (2·${a}) = ${-b} / ${2 * a}`,
        explanation: `Xᵥ = -(${b}) / (2·${a}) = ${xv}. O eixo de simetria da parábola é a reta vertical x = ${xv}.`,
        difficulty
      };
    } else if (concept === 'vertex_y') {
      return {
        id,
        concept,
        title: '🌀 Vórtice do Vértice (Yᵥ)',
        formula,
        a, b, c,
        question: `Calcule a ordenada Y do vértice (Yᵥ = -Δ / 4a ou f(Xᵥ)):`,
        inputType: 'number',
        targetAnswer: yv,
        exactTargetString: `${yv}`,
        tolerance: 2,
        hint1: `Você pode usar Yᵥ = -Δ / (4·a) ou simplesmente calcular f(Xᵥ) substituindo Xᵥ = ${xv}.`,
        hint2: `f(${xv}) = ${a}·(${xv})² ${b >= 0 ? '+' : '-'} ${Math.abs(b)}·(${xv}) ${c >= 0 ? '+' : '-'} ${Math.abs(c)}`,
        hint3: `Yᵥ = ${a * xv * xv} + (${b * xv}) + (${c}) = ${yv}`,
        explanation: `Yᵥ = ${yv}. Como a ${a > 0 ? '> 0' : '< 0'}, o vértice é um ponto de ${a > 0 ? 'MÍNIMO' : 'MÁXIMO'} global da função com valor ${yv}.`,
        difficulty
      };
    } else {
      // Vertex point V(Xv, Yv)
      const fakeV1 = `(${xv + 1}, ${yv})`;
      const fakeV2 = `(${-xv}, ${yv})`;
      const fakeV3 = `(${xv}, ${-yv})`;
      return {
        id,
        concept,
        title: '🌀 Ponto do Vértice V(Xᵥ, Yᵥ)',
        formula,
        a, b, c,
        question: `Determine as coordenadas completas do Vértice V(Xᵥ, Yᵥ):`,
        inputType: 'choice',
        choices: [
          { label: `V(${xv}, ${yv})`, value: `(${xv}, ${yv})`, isCorrect: true },
          { label: `V${fakeV1}`, value: fakeV1, isCorrect: false },
          { label: `V${fakeV2}`, value: fakeV2, isCorrect: false },
          { label: `V${fakeV3}`, value: fakeV3, isCorrect: false }
        ].sort(() => Math.random() - 0.5),
        targetAnswer: `(${xv}, ${yv})`,
        exactTargetString: `V(${xv}, ${yv})`,
        tolerance: 0,
        hint1: `Xᵥ = -b/(2a) e Yᵥ = -Δ/(4a) ou f(Xᵥ).`,
        hint2: `Xᵥ = -(${b}) / (2·${a}) = ${xv}.`,
        hint3: `Yᵥ = f(${xv}) = ${yv}.`,
        explanation: `O vértice é o ponto V(${xv}, ${yv}).`,
        difficulty
      };
    }
  }

  if (concept === 'concavity') {
    const a = Math.random() > 0.5 ? Math.floor(Math.random() * 3) + 1 : -(Math.floor(Math.random() * 3) + 1);
    const b = Math.floor(Math.random() * 6) - 3;
    const c = Math.floor(Math.random() * 7) - 3;
    const formula = formatQuadraticFunction(a, b, c);
    const isUp = a > 0;

    return {
      id,
      concept,
      title: '🛡️ Barreira da Concavidade',
      formula,
      a, b, c,
      question: `Para onde está voltada a concavidade da parábola desta função?`,
      inputType: 'choice',
      choices: [
        { label: 'Para CIMA ( ∪ ) [a > 0]', value: 'cima', isCorrect: isUp },
        { label: 'Para BAIXO ( ∩ ) [a < 0]', value: 'baixo', isCorrect: !isUp }
      ],
      targetAnswer: isUp ? 'cima' : 'baixo',
      exactTargetString: isUp ? 'Para CIMA (a > 0)' : 'Para BAIXO (a < 0)',
      tolerance: 0,
      hint1: `Observe o sinal do coeficiente principal 'a' (que acompanha x²).`,
      hint2: `No caso de f(x), o coeficiente a = ${a}.`,
      hint3: `Se a > 0, concavidade para cima (sorriso). Se a < 0, concavidade para baixo (triste).`,
      explanation: `Como a = ${a} (${a > 0 ? 'positivo / a > 0' : 'negativo / a < 0'}), a parábola tem concavidade voltada para ${isUp ? 'CIMA e possui ponto de mínimo' : 'BAIXO e possui ponto de máximo'}.`,
      difficulty
    };
  }

  if (concept === 'y_intercept') {
    const a = Math.random() > 0.5 ? 1 : -1;
    const b = Math.floor(Math.random() * 6) - 3;
    const c = Math.floor(Math.random() * 11) - 5; // -5 to +5
    const formula = formatQuadraticFunction(a, b, c);

    return {
      id,
      concept,
      title: '📍 Interseção com o Eixo Y',
      formula,
      a, b, c,
      question: `Qual é o valor onde o gráfico corta o eixo vertical Y (quando x = 0)?`,
      inputType: 'number',
      targetAnswer: c,
      exactTargetString: `${c}`,
      tolerance: 1,
      hint1: `O gráfico cruza o eixo Y no ponto (0, c), ou seja, f(0).`,
      hint2: `Calcule f(0): substitua x por 0.`,
      hint3: `f(0) = ${a}·(0)² + ${b}·(0) + (${c}) = ${c}.`,
      explanation: `O corte no eixo Y é exatamente o termo independente c = ${c}, no par ordenado (0, ${c}).`,
      difficulty
    };
  }

  if (concept === 'symmetry_axis') {
    const xv = Math.floor(Math.random() * 7) - 3;
    const a = 1;
    const b = -2 * xv;
    const c = 2;
    const formula = formatQuadraticFunction(a, b, c);

    return {
      id,
      concept,
      title: '📐 Eixo de Simetria da Parábola',
      formula,
      a, b, c,
      question: `Qual é a equação da reta vertical do Eixo de Simetria (x = ?)?`,
      inputType: 'number',
      targetAnswer: xv,
      exactTargetString: `x = ${xv}`,
      tolerance: 1,
      hint1: `O eixo de simetria passa exatamente pelo vértice: x = -b / (2a).`,
      hint2: `a = ${a}, b = ${b}. Então x = -(${b}) / (2·${a}).`,
      hint3: `x = ${-b} / 2 = ${xv}.`,
      explanation: `A reta do eixo de simetria é x = ${xv}, dividindo a parábola em duas metades espelhadas.`,
      difficulty
    };
  }

  // Fallback: Supreme Challenge
  const rootsPool = [-3, -2, -1, 1, 2, 3];
  const r1 = rootsPool[Math.floor(Math.random() * rootsPool.length)];
  const r2 = r1 + 2;
  const a = 1;
  const b = -(r1 + r2);
  const c = r1 * r2;
  const delta = b * b - 4 * a * c;
  const xv = -b / (2 * a);
  const yv = a * xv * xv + b * xv + c;
  const formula = formatQuadraticFunction(a, b, c);

  return {
    id,
    concept: 'supreme',
    title: '💥 Ataque Supremo de Bhaskara',
    formula,
    a, b, c,
    question: `Desafio Total: Calcule o discriminante Δ desta função quadrática:`,
    inputType: 'number',
    targetAnswer: delta,
    exactTargetString: `${delta}`,
    tolerance: 2,
    hint1: `Δ = b² - 4ac. As raízes reais são x₁ = ${Math.min(r1, r2)} e x₂ = ${Math.max(r1, r2)}.`,
    hint2: `a = ${a}, b = ${b}, c = ${c}.`,
    hint3: `Δ = (${b})² - 4·(${a})·(${c}) = ${delta}.`,
    explanation: `Δ = ${delta} (possui 2 raízes reais). Vértice V(${xv}, ${yv}).`,
    difficulty: 'mestre'
  };
}

/**
 * Evaluates the precision of player input against the mathematical challenge
 */
export function calculatePrecision(challenge: MathChallenge, userInputValue: string | number): PrecisionResult {
  if (challenge.inputType === 'choice' || challenge.inputType === 'boolean') {
    const isExact = String(userInputValue).trim() === String(challenge.targetAnswer).trim();
    if (isExact) {
      return {
        accuracyPercentage: 100,
        rating: 'PERFEITO',
        damageMultiplier: 1.5,
        message: '100% PRECISÃO PERFEITA! CRÍTICO!',
        isExact: true
      };
    } else {
      return {
        accuracyPercentage: 0,
        rating: 'FALHA',
        damageMultiplier: 0.15,
        message: 'RESPOSTA INCORRETA! Ataque falhou.',
        isExact: false
      };
    }
  }

  // Numeric precision evaluation
  const numInput = typeof userInputValue === 'number' ? userInputValue : parseFloat(String(userInputValue).replace(',', '.'));
  const target = typeof challenge.targetAnswer === 'number' ? challenge.targetAnswer : parseFloat(String(challenge.targetAnswer));

  if (isNaN(numInput)) {
    return {
      accuracyPercentage: 0,
      rating: 'FALHA',
      damageMultiplier: 0,
      message: 'Valor inválido inserido!',
      isExact: false
    };
  }

  const diff = Math.abs(numInput - target);

  if (diff === 0) {
    return {
      accuracyPercentage: 100,
      rating: 'PERFEITO',
      damageMultiplier: 1.5, // 150% damage
      message: 'ACERTO 100% EXATO! DANO CRÍTICO!',
      isExact: true
    };
  }

  const maxTolerance = Math.max(challenge.tolerance * 2, 4);
  if (diff <= 1) {
    const pct = Math.round(Math.max(85, 100 - (diff / maxTolerance) * 30));
    return {
      accuracyPercentage: pct,
      rating: 'ALTA',
      damageMultiplier: 1.15,
      message: `${pct}% ALTA PRECISÃO! Golpe potente! (Alvo: ${target})`,
      isExact: false
    };
  } else if (diff <= maxTolerance) {
    const pct = Math.round(Math.max(40, 100 - (diff / maxTolerance) * 60));
    return {
      accuracyPercentage: pct,
      rating: 'MEDIA',
      damageMultiplier: 0.75,
      message: `${pct}% PRECISÃO MÉDIA. Dano moderado. (Alvo: ${target})`,
      isExact: false
    };
  } else if (diff <= maxTolerance * 2) {
    const pct = 20;
    return {
      accuracyPercentage: pct,
      rating: 'BAIXA',
      damageMultiplier: 0.35,
      message: `${pct}% BAIXA PRECISÃO. Dano fraco. (Alvo: ${target})`,
      isExact: false
    };
  } else {
    return {
      accuracyPercentage: 0,
      rating: 'FALHA',
      damageMultiplier: 0.1,
      message: `RESPOSTA MUITO DISTANTE! (Alvo: ${target})`,
      isExact: false
    };
  }
}

/**
 * Generates an enemy incoming quadratic attack that the player needs to defend against
 */
export function generateEnemyDefenseChallenge(enemyLevel: number): MathChallenge {
  // Enemy attack challenge (e.g. identify roots or vertex to shield against the blast)
  const concepts: MathConcept[] = ['vertex_x', 'delta', 'concavity', 'fx_value', 'y_intercept'];
  const picked = concepts[Math.floor(Math.random() * concepts.length)];
  const challenge = generateMathChallenge(picked, enemyLevel >= 15 ? 'dificil' : enemyLevel >= 8 ? 'medio' : 'facil');
  
  challenge.title = `🛡️ DEFESA: Bloquear Ataque Inimigo!`;
  challenge.question = `⚠️ O Inimigo atacou com a parábola! ${challenge.question}`;
  return challenge;
}
