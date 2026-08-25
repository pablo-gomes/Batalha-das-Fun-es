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
    <div className="w-full max-w-5xl mx-auto p-1.5 sm:p-5 select-none space-y-2.5 sm:space-y-3.5 text-[#163323]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl p-2.5 sm:p-3.5 shadow-[4px_4px_0_#122b1e]">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onBack();
            }}
            className="bg-white hover:bg-[#edf7f1] text-[#1b3b2b] font-pixel text-[9px] sm:text-xs px-2.5 sm:px-3 py-1.5 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
          >
            ⬅ VOLTAR
          </button>
          <h1 className="font-pixel text-[11px] sm:text-sm text-[#143021] font-black flex items-center gap-1.5 uppercase">
            🎯 DOJO DE TREINO MATEMÁTICO
          </h1>
        </div>

        <div className="font-pixel text-[9px] sm:text-[11px] text-emerald-950 bg-emerald-100 px-3 py-1 border-2 border-emerald-700 rounded-lg font-black shadow-xs">
          ACERTOS: {solvedCount}
        </div>
      </div>

      {/* Topic selection chips */}
      <div className="grid grid-cols-2 min-[440px]:grid-cols-4 md:grid-cols-7 gap-2">
        {concepts.map((c) => (
          <button
            key={c.key}
            onClick={() => handlePickConcept(c.key)}
            className={`p-2 border-2 rounded-xl text-center transition-all cursor-pointer ${
              selectedConcept === c.key
                ? 'gba-btn-primary shadow-[2px_2px_0_#022c22] scale-[1.02]'
                : 'bg-[#fbfdfa] border-[#1b3b2b] text-[#143021] hover:bg-[#edf7f1] shadow-xs'
            }`}
          >
            <div className="text-base sm:text-lg mb-0.5">{c.icon}</div>
            <div className="font-pixel text-[8px] sm:text-[9px] font-black truncate">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
        {/* Left: Challenge & Input */}
        <div className="md:col-span-7 bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between space-y-3 shadow-[4px_4px_0_#122b1e]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-[#2d5a42]/30 pb-2 mb-2">
              <span className="font-pixel text-[10px] sm:text-xs text-[#143021] font-black uppercase">{challenge.title}</span>
              <span className="font-mono text-xs sm:text-sm font-black text-emerald-950 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-400">
                {challenge.formula}
              </span>
            </div>

            <p className="font-pixel text-[11px] sm:text-sm text-[#193325] my-2 sm:my-2.5 leading-relaxed font-bold">
              {challenge.question}
            </p>

            {/* Progressive Hint Button & Box */}
            <div className="space-y-1.5 my-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCycleHint}
                  className="text-[8px] sm:text-[9px] font-pixel px-2.5 py-1 border border-amber-600 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded transition-all cursor-pointer shadow-xs"
                >
                  💡 {hintStep === 0 ? 'VER DICA' : `DICA (${hintStep}/3)`}
                </button>
                {hintStep === 0 && (
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 truncate">
                    (Clique para ajuda passo a passo)
                  </span>
                )}
              </div>

              {hintStep > 0 && (
                <div className="bg-amber-50 p-2.5 border border-amber-400 rounded-lg text-xs font-mono font-bold text-amber-950 shadow-inner">
                  {hintStep === 1 && `Fórmula: ${challenge.hint1}`}
                  {hintStep === 2 && `Valores: ${challenge.hint2}`}
                  {hintStep === 3 && `Resolução: ${challenge.hint3}`}
                </div>
              )}
            </div>
          </div>

          {/* Form / Options */}
          {challenge.inputType === 'choice' && challenge.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {challenge.choices.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(ch.value)}
                  className="bg-white hover:bg-emerald-50 border-2 border-[#1b3b2b] text-left p-2.5 rounded-lg font-mono text-xs font-black text-[#143021] transition-all cursor-pointer shadow-[2px_2px_0_#122b1e]"
                >
                  {ch.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="text"
                value={userAnswer}
                placeholder="Insira sua resposta..."
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-white border-2 border-[#1b3b2b] rounded-lg px-3 py-2 text-[#143021] font-mono font-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
              />
              <button
                onClick={() => handleSubmit()}
                className="gba-btn-primary font-pixel text-[10px] sm:text-xs px-4 py-2 rounded-lg font-black cursor-pointer shrink-0"
              >
                VERIFICAR ▶
              </button>
            </div>
          )}

          {/* Result Banner */}
          {result && (
            <div className="p-3 border-2 border-[#1b3b2b] rounded-xl font-mono text-xs bg-[#f0f7f2] shadow-[2px_2px_0_#122b1e]">
              <div className="font-pixel text-[10px] sm:text-[11px] mb-1 font-black text-emerald-950">
                {result.message}
              </div>
              <p className="text-xs text-slate-800 mt-1 font-bold">
                <strong>Explicação:</strong> {challenge.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="mt-2.5 font-pixel text-[9px] sm:text-[10px] gba-btn-blue px-3 py-1.5 rounded-lg border border-sky-900 cursor-pointer font-black"
              >
                PRÓXIMA QUESTÃO ▶
              </button>
            </div>
          )}
        </div>

        {/* Right: Real-time Parabola Graph */}
        <div className="md:col-span-5 bg-white border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-3 flex flex-col items-center justify-center shadow-[4px_4px_0_#122b1e] gba-sprite">
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
