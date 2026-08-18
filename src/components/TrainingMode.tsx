import React, { useState } from 'react';
import { MathChallenge, MathConcept } from '../types';
import { generateMathChallenge, calculatePrecision } from '../utils/mathEngine';
import { ParabolaGraph } from './ParabolaGraph';
import { sound } from '../utils/audio';

interface TrainingModeProps {
  onBack: () => void;
}

export const TrainingMode: React.FC<TrainingModeProps> = ({ onBack }) => {
  const [selectedConcept, setSelectedConcept] = useState<MathConcept>('roots');
  const [challenge, setChallenge] = useState<MathChallenge>(() => generateMathChallenge('roots', 'medio'));
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [result, setResult] = useState<ReturnType<typeof calculatePrecision> | null>(null);
  const [hintStep, setHintStep] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);

  const concepts: { key: MathConcept; name: string; icon: string; desc: string }[] = [
    { key: 'roots', name: 'Raízes (x₁, x₂)', icon: '⚡', desc: 'Pontos onde f(x) = 0 cruza o eixo X' },
    { key: 'delta', name: 'Discriminante (Δ)', icon: '🔥', desc: 'Cálculo de Δ = b² - 4ac' },
    { key: 'vertex_x', name: 'Abscissa (Xᵥ)', icon: '🌀', desc: 'Eixo de simetria x = -b/2a' },
    { key: 'vertex_y', name: 'Ordenada (Yᵥ)', icon: '🏔️', desc: 'Valor extremo y = -Δ/4a' },
    { key: 'fx_value', name: 'Valor f(x)', icon: '🎯', desc: 'Substituição de x na equação' },
    { key: 'concavity', name: 'Concavidade (a)', icon: '🛡️', desc: 'Sentido da abertura da parábola' },
    { key: 'y_intercept', name: 'Corte Y (0, c)', icon: '📍', desc: 'Ponto onde cruza o eixo Y' }
  ];

  const handlePickConcept = (c: MathConcept) => {
    sound.playSelect();
    setSelectedConcept(c);
    setChallenge(generateMathChallenge(c, 'medio'));
    setUserAnswer('');
    setResult(null);
    setHintStep(0);
  };

  const handleNextQuestion = () => {
    sound.playConfirm();
    setChallenge(generateMathChallenge(selectedConcept, 'medio'));
    setUserAnswer('');
    setResult(null);
    setHintStep(0);
  };

  const handleCycleHint = () => {
    sound.playSelect();
    setHintStep(prev => (prev >= 3 ? 0 : prev + 1));
  };

  const handleSubmit = (val?: string | number) => {
    const ans = val !== undefined ? val : userAnswer;
    if (!ans && ans !== 0) return;
    const res = calculatePrecision(challenge, ans);
    setResult(res);
    if (res.isExact || res.rating === 'PERFEITO' || res.rating === 'ALTA') {
      sound.playCorrect(res.isExact);
      setSolvedCount(prev => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-1.5 sm:p-5 select-none space-y-2.5 sm:space-y-3.5 text-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-3 sm:border-4 border-black p-2.5 sm:p-3 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onBack();
            }}
            className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 border-black transition-colors cursor-pointer font-bold"
          >
            ⬅ VOLTAR
          </button>
          <h1 className="font-pixel text-[11px] sm:text-sm text-black font-black flex items-center gap-1.5 uppercase">
            🎯 TREINO MATEMÁTICO
          </h1>
        </div>

        <div className="font-pixel text-[9px] sm:text-[11px] text-black bg-white px-2 sm:px-2.5 py-1 border-2 border-black font-bold">
          RESOLVIDOS: <strong className="text-black">{solvedCount}</strong>
        </div>
      </div>

      {/* Topic selection chips */}
      <div className="grid grid-cols-2 min-[440px]:grid-cols-4 md:grid-cols-7 gap-1.5">
        {concepts.map((c) => (
          <button
            key={c.key}
            onClick={() => handlePickConcept(c.key)}
            className={`p-1.5 sm:p-2 border-2 text-center transition-all cursor-pointer ${
              selectedConcept === c.key
                ? 'bg-black border-black text-white shadow-[2px_2px_0_#000]'
                : 'bg-white border-black text-black hover:bg-slate-100'
            }`}
          >
            <div className="text-base sm:text-lg mb-0.5">{c.icon}</div>
            <div className="font-pixel text-[8px] sm:text-[9px] font-bold truncate">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3.5 items-stretch">
        {/* Left: Challenge & Input */}
        <div className="md:col-span-7 bg-white border-3 sm:border-4 border-black p-3 sm:p-4 flex flex-col justify-between space-y-2.5 sm:space-y-3 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-black pb-2 mb-2">
              <span className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">{challenge.title}</span>
              <span className="font-mono text-xs sm:text-sm font-black text-white bg-black px-2 sm:px-2.5 py-0.5">
                {challenge.formula}
              </span>
            </div>

            <p className="font-pixel text-[11px] sm:text-sm text-black my-2 sm:my-2.5 leading-relaxed font-bold">
              {challenge.question}
            </p>

            {/* Progressive Hint Button & Box */}
            <div className="space-y-1.5 my-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCycleHint}
                  className="text-[8px] sm:text-[9px] font-pixel px-2 sm:px-2.5 py-1 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold transition-all cursor-pointer shadow-[1px_1px_0_#000]"
                >
                  💡 {hintStep === 0 ? 'VER DICA' : `DICA (${hintStep}/3)`}
                </button>
                {hintStep === 0 && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-600 truncate">
                    (Clique para ajuda passo a passo)
                  </span>
                )}
              </div>

              {hintStep > 0 && (
                <div className="bg-slate-100 p-2 border border-black text-xs font-mono font-bold text-black">
                  {hintStep === 1 && `Fórmula: ${challenge.hint1}`}
                  {hintStep === 2 && `Valores: ${challenge.hint2}`}
                  {hintStep === 3 && `Resolução: ${challenge.hint3}`}
                </div>
              )}
            </div>
          </div>

          {/* Form / Options */}
          {challenge.inputType === 'choice' && challenge.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1">
              {challenge.choices.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(ch.value)}
                  className="bg-white hover:bg-black hover:text-white border-2 border-black text-left p-2 sm:p-2.5 font-mono text-xs font-black text-black transition-all cursor-pointer shadow-[2px_2px_0_#000]"
                >
                  {ch.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-1">
              <input
                type="text"
                value={userAnswer}
                placeholder="Insira sua resposta..."
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-white border-2 sm:border-3 border-black px-3 py-1.5 sm:py-2 text-black font-mono font-bold text-sm sm:text-base focus:outline-none shadow-inner"
              />
              <button
                onClick={() => handleSubmit()}
                className="gb-btn-primary font-pixel text-[10px] sm:text-xs px-4 py-2 font-bold cursor-pointer shrink-0"
              >
                VERIFICAR ▶
              </button>
            </div>
          )}

          {/* Result Banner */}
          {result && (
            <div className="p-2.5 sm:p-3 border-2 border-black font-mono text-xs bg-slate-50 shadow-[2px_2px_0_#000]">
              <div className="font-pixel text-[10px] sm:text-[11px] mb-1 font-black text-black">
                {result.message}
              </div>
              <p className="text-xs text-slate-800 mt-1 font-bold">
                <strong>Explicação:</strong> {challenge.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="mt-2.5 font-pixel text-[9px] sm:text-[10px] bg-black text-white hover:bg-slate-800 px-3 py-1.5 border border-black cursor-pointer font-bold"
              >
                PRÓXIMA QUESTÃO ▶
              </button>
            </div>
          )}
        </div>

        {/* Right: Real-time Parabola Graph */}
        <div className="md:col-span-5 bg-white border-3 sm:border-4 border-black p-2.5 sm:p-3 flex flex-col items-center justify-center shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] gb-sprite-mono">
          <ParabolaGraph
            a={challenge.a}
            b={challenge.b}
            c={challenge.c}
            width={300}
            height={200}
            className="w-full max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

