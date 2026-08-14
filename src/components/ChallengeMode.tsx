import React, { useState, useEffect } from 'react';
import { MathChallenge, MathConcept } from '../types';
import { generateMathChallenge, calculatePrecision } from '../utils/mathEngine';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ChallengeModeProps {
  onBack: () => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);

  const startChallenge = () => {
    sound.playConfirm();
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setGameOver(false);
    setIsPlaying(true);
    setLastFeedback('');
    generateNextQuestion();
  };

  const generateNextQuestion = () => {
    const pool: MathConcept[] = ['fx_value', 'delta', 'roots', 'vertex_x', 'concavity', 'y_intercept'];
    const randomConcept = pool[Math.floor(Math.random() * pool.length)];
    setChallenge(generateMathChallenge(randomConcept, 'medio'));
    setUserAnswer('');
  };

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setIsPlaying(false);
          sound.playVictory();
          confetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, gameOver]);

  const handleSubmit = (ansVal?: string | number) => {
    if (!challenge) return;
    const ans = ansVal !== undefined ? ansVal : userAnswer;
    if (!ans && ans !== 0) return;

    const res = calculatePrecision(challenge, ans);

    if (res.isExact || res.rating === 'PERFEITO') {
      sound.playCorrect(true);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > highestCombo) setHighestCombo(newCombo);

      const pts = 100 * newCombo;
      setScore((prev) => prev + pts);
      setTimeLeft((prev) => Math.min(90, prev + 3)); // +3 seconds bonus!
      setLastFeedback(`🔥 100% EXATO! +${pts} pts (+3s) Combo x${newCombo}`);
    } else if (res.rating === 'ALTA') {
      sound.playCorrect(false);
      const pts = 60 * (combo + 1);
      setScore((prev) => prev + pts);
      setLastFeedback(`⚡ ALTA PRECISÃO! +${pts} pts`);
    } else {
      sound.playWrong();
      setCombo(0);
      setLastFeedback('❌ RESPOSTA INCORRETA! Combo perdido.');
    }

    generateNextQuestion();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 select-none space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border-2 border-slate-700 p-3 rounded-xl">
        <button
          onClick={() => {
            sound.playCancel();
            onBack();
          }}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs px-3 py-2 rounded border border-slate-600"
        >
          ⬅ Voltar
        </button>
        <h1 className="font-pixel text-sm sm:text-base text-amber-300">
          ⚡ Desafio Contrarrelógio (60 Segundos)
        </h1>
        <div className="font-pixel text-xs text-cyan-300">
          Recorde Atual: {score}
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="bg-slate-900 border-4 border-amber-400 p-8 rounded-2xl text-center space-y-6">
          <div className="text-5xl">⏱️</div>
          <h2 className="font-pixel text-lg text-white">Pronto para testar sua agilidade?</h2>
          <p className="font-mono text-sm text-slate-300 max-w-md mx-auto">
            Resolva o máximo de funções do 2º grau que conseguir antes que o tempo acabe. Acertos perfeitos concedem <strong>+3 segundos</strong> e combos gigantescos!
          </p>
          <button
            onClick={startChallenge}
            className="font-pixel text-sm bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black py-4 px-10 rounded-xl border-2 border-amber-300 shadow-[0_6px_0_#78350f] active:translate-y-1"
          >
            ▶ INICIAR DESAFIO!
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-slate-900 border-4 border-emerald-400 p-8 rounded-2xl text-center space-y-5">
          <div className="text-5xl">🏆</div>
          <h2 className="font-pixel text-xl text-amber-300">TEMPO ESGOTADO!</h2>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-lg space-y-2 max-w-sm mx-auto">
            <div className="text-cyan-300">Pontuação Total: <strong>{score} pts</strong></div>
            <div className="text-amber-400">Maior Combo: <strong>x{highestCombo}</strong></div>
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={startChallenge}
              className="font-pixel text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-6 rounded-lg"
            >
              Jogar Novamente
            </button>
            <button
              onClick={onBack}
              className="font-pixel text-xs bg-slate-800 hover:bg-slate-700 text-white py-3 px-6 rounded-lg"
            >
              Menu Principal
            </button>
          </div>
        </div>
      ) : (
        /* Active Game */
        <div className="space-y-4">
          {/* Status Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900 border-2 border-cyan-500 p-3 rounded-xl text-center">
              <div className="text-[10px] font-pixel text-slate-400">TEMPO RESTANTE</div>
              <div className={`font-pixel text-2xl mt-1 ${timeLeft <= 10 ? 'text-rose-500 animate-ping' : 'text-cyan-300'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-amber-500 p-3 rounded-xl text-center">
              <div className="text-[10px] font-pixel text-slate-400">PONTUAÇÃO</div>
              <div className="font-pixel text-2xl text-amber-400 mt-1">
                {score}
              </div>
            </div>

            <div className="bg-slate-900 border-2 border-purple-500 p-3 rounded-xl text-center">
              <div className="text-[10px] font-pixel text-slate-400">COMBO ATUAL</div>
              <div className="font-pixel text-2xl text-purple-400 mt-1">
                x{combo}
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {lastFeedback && (
            <div className="bg-slate-950 border border-slate-800 p-2 rounded text-center font-mono text-xs text-amber-300 animate-bounce">
              {lastFeedback}
            </div>
          )}

          {/* Question Card */}
          {challenge && (
            <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-pixel text-xs text-amber-300">{challenge.title}</span>
                <span className="font-mono text-base font-bold text-cyan-300 bg-slate-950 px-3 py-1 rounded border border-cyan-800">
                  {challenge.formula}
                </span>
              </div>

              <p className="font-pixel text-sm sm:text-base text-white">
                {challenge.question}
              </p>

              {challenge.inputType === 'choice' && challenge.choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {challenge.choices.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(ch.value)}
                      className="bg-slate-950 hover:bg-slate-800 border-2 border-slate-700 hover:border-cyan-400 text-left p-3 rounded-xl font-mono text-sm text-white transition-all active:scale-95"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    autoFocus
                    value={userAnswer}
                    placeholder="Digite a resposta e pressione Enter..."
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-slate-950 border-2 border-cyan-400 rounded-xl px-4 py-3 text-white font-mono text-lg focus:outline-none"
                  />
                  <button
                    onClick={() => handleSubmit()}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs px-6 py-3 rounded-xl font-black"
                  >
                    Enviar ▶
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
