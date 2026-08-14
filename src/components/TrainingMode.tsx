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
    { key: 'roots', name: 'Raízes (Bhaskara)', icon: '⚡', desc: 'Descubra onde f(x) = 0 cruza o eixo X' },
    { key: 'delta', name: 'Discriminante Δ', icon: '🔥', desc: 'Calcule Δ = b² - 4ac e quantidade de raízes' },
    { key: 'vertex_x', name: 'Abscissa Xᵥ', icon: '🌀', desc: 'Encontre o eixo central x = -b/2a' },
    { key: 'vertex_y', name: 'Ordenada Yᵥ', icon: '🏔️', desc: 'Calcule o valor máximo ou mínimo f(Xᵥ)' },
    { key: 'fx_value', name: 'Valor Numérico f(x)', icon: '🎯', desc: 'Substitua x na função para achar a imagem' },
    { key: 'concavity', name: 'Concavidade (a)', icon: '🛡️', desc: 'Identifique se abre para cima ou para baixo' },
    { key: 'y_intercept', name: 'Interseção Y (0, c)', icon: '📍', desc: 'Ponto exato onde corta a vertical' }
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
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border-2 border-slate-700 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onBack();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs px-3 py-2 rounded border border-slate-600 transition-colors"
          >
            ⬅ Menu
          </button>
          <h1 className="font-pixel text-sm sm:text-base text-cyan-300">
            🎯 Academia de Treinamento Matemático
          </h1>
        </div>

        <div className="font-pixel text-xs text-amber-400">
          Exercícios Resolvidos: {solvedCount}
        </div>
      </div>

      {/* Topic selection chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        {concepts.map((c) => (
          <button
            key={c.key}
            onClick={() => handlePickConcept(c.key)}
            className={`p-2 rounded-lg border text-center transition-all ${
              selectedConcept === c.key
                ? 'bg-cyan-950 border-cyan-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="text-xl mb-0.5">{c.icon}</div>
            <div className="font-pixel text-[9px] truncate">{c.name}</div>
          </button>
        ))}
      </div>

      {/* Main Practice Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Challenge & Input */}
        <div className="md:col-span-7 bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-pixel text-xs text-amber-300">{challenge.title}</span>
              <span className="font-mono text-sm font-bold text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-cyan-800">
                {challenge.formula}
              </span>
            </div>

            <p className="font-pixel text-sm text-white my-3 leading-relaxed">
              {challenge.question}
            </p>

            {/* Step-by-Step hints */}
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => setHintStep(1)}
                className={`text-[9px] font-pixel px-2 py-1 rounded border ${hintStep >= 1 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400'}`}
              >
                💡 Dica 1
              </button>
              <button
                onClick={() => setHintStep(2)}
                className={`text-[9px] font-pixel px-2 py-1 rounded border ${hintStep >= 2 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400'}`}
              >
                💡 Dica 2
              </button>
              <button
                onClick={() => setHintStep(3)}
                className={`text-[9px] font-pixel px-2 py-1 rounded border ${hintStep >= 3 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400'}`}
              >
                💡 Resolução
              </button>
            </div>

            {hintStep > 0 && (
              <div className="bg-slate-950 p-2.5 rounded border border-amber-700/60 text-xs font-mono text-amber-200">
                {hintStep === 1 && challenge.hint1}
                {hintStep === 2 && challenge.hint2}
                {hintStep === 3 && challenge.hint3}
              </div>
            )}
          </div>

          {/* Form / Options */}
          {challenge.inputType === 'choice' && challenge.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {challenge.choices.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(ch.value)}
                  className="bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 text-left p-2.5 rounded-lg font-mono text-xs text-white"
                >
                  {ch.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={userAnswer}
                placeholder="Insira sua resposta..."
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="flex-1 bg-slate-950 border-2 border-cyan-400 rounded-lg px-3 py-2 text-white font-mono text-base"
              />
              <button
                onClick={() => handleSubmit()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-pixel text-xs px-5 py-2 rounded-lg font-bold"
              >
                Verificar
              </button>
            </div>
          )}

          {/* Result Banner */}
          {result && (
            <div className={`p-3 rounded-xl border-2 font-mono text-xs ${
              result.isExact || result.rating === 'PERFEITO' 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' 
                : result.rating === 'ALTA' 
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200' 
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
            }`}>
              <div className="font-pixel text-[11px] mb-1 font-bold">
                {result.message}
              </div>
              <p className="mt-1 text-[11px] text-slate-300">
                <strong>Explicação Completa:</strong> {challenge.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="mt-3 font-pixel text-[10px] bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600"
              >
                Próxima Questão ▶
              </button>
            </div>
          )}
        </div>

        {/* Right: Real-time Parabola Graph */}
        <div className="md:col-span-5 flex flex-col justify-center">
          <ParabolaGraph
            a={challenge.a}
            b={challenge.b}
            c={challenge.c}
            width={340}
            height={260}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
