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
      setTimeLeft((prev) => Math.min(90, prev + 3)); // +3s bonus
      setLastFeedback(`🔥 EXATO (+${pts} pts) • +3s! x${newCombo}`);
    } else if (res.rating === 'ALTA') {
      sound.playCorrect(false);
      const pts = 60 * (combo + 1);
      setScore((prev) => prev + pts);
      setLastFeedback(`⚡ ALTA PRECISÃO (+${pts} pts)`);
    } else {
      sound.playWrong();
      setCombo(0);
      setLastFeedback('❌ INCORRETO! Combo zerado.');
    }

    generateNextQuestion();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-5 select-none space-y-3 sm:space-y-4 text-black">
      {/* Header */}
      <div className="flex items-center justify-between bg-white border-3 sm:border-4 border-black p-2.5 sm:p-3 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
        <button
          onClick={() => {
            sound.playCancel();
            onBack();
          }}
          className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 border-black transition-colors cursor-pointer font-bold"
        >
          ⬅ VOLTAR
        </button>
        <h1 className="font-pixel text-[11px] sm:text-sm text-black font-black flex items-center gap-1.5 uppercase truncate">
          ⚡ DESAFIO (60S)
        </h1>
        <div className="font-pixel text-[9px] sm:text-[11px] text-black bg-white px-2 sm:px-2.5 py-1 border-2 border-black font-bold">
          PTS: <strong className="text-black">{score}</strong>
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-8 text-center space-y-4 sm:space-y-5 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
          <div className="text-3xl sm:text-5xl">⏱️</div>
          <h2 className="font-pixel text-xs sm:text-base text-black font-black uppercase">Teste sua agilidade e precisão!</h2>
          <p className="font-mono text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed font-bold">
            Resolva o máximo de problemas em 60 segundos. Respostas perfeitas concedem <strong>+3 segundos</strong> e combos!
          </p>
          <button
            onClick={startChallenge}
            className="gb-btn-primary font-pixel text-[11px] sm:text-xs py-3 px-6 sm:px-8 font-black cursor-pointer shadow-[3px_3px_0_#000]"
          >
            ▶ INICIAR DESAFIO
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-white border-3 sm:border-4 border-black p-4 sm:p-8 text-center space-y-4 sm:space-y-5 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
          <div className="text-3xl sm:text-5xl">🏆</div>
          <h2 className="font-pixel text-sm sm:text-lg text-black font-black">TEMPO ESGOTADO!</h2>
          <div className="bg-slate-50 p-3 sm:p-4 border-2 border-black font-mono text-sm sm:text-base space-y-1 max-w-xs mx-auto font-bold">
            <div>Pontuação: <strong className="text-black">{score} pts</strong></div>
            <div>Maior Combo: <strong className="text-black">x{highestCombo}</strong></div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
            <button
              onClick={startChallenge}
              className="gb-btn-primary font-pixel text-[10px] sm:text-xs py-2.5 px-4 sm:px-5 cursor-pointer"
            >
              JOGAR DE NOVO ▶
            </button>
            <button
              onClick={onBack}
              className="gb-btn font-pixel text-[10px] sm:text-xs py-2.5 px-4 sm:px-5 cursor-pointer font-bold"
            >
              MENU
            </button>
          </div>
        </div>
      ) : (
        /* Active Game */
        <div className="space-y-2.5 sm:space-y-3">
          {/* Status Bar */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            <div className="bg-white border-2 sm:border-3 border-black p-1.5 sm:p-2.5 text-center shadow-[2px_2px_0_#000]">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-700">TEMPO</div>
              <div className={`font-pixel text-base sm:text-2xl mt-0.5 font-black ${timeLeft <= 10 ? 'text-black animate-ping' : 'text-black'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-white border-2 sm:border-3 border-black p-1.5 sm:p-2.5 text-center shadow-[2px_2px_0_#000]">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-700">PONTOS</div>
              <div className="font-pixel text-base sm:text-2xl text-black font-black mt-0.5">
                {score}
              </div>
            </div>

            <div className="bg-white border-2 sm:border-3 border-black p-1.5 sm:p-2.5 text-center shadow-[2px_2px_0_#000]">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-700">COMBO</div>
              <div className="font-pixel text-base sm:text-2xl text-black font-black mt-0.5">
                x{combo}
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {lastFeedback && (
            <div className="bg-white border-2 border-black py-1 px-2.5 text-center font-mono text-[11px] sm:text-xs font-black text-black">
              {lastFeedback}
            </div>
          )}

          {/* Question Card */}
          {challenge && (
            <div className="bg-white border-3 sm:border-4 border-black p-3 sm:p-5 space-y-2.5 sm:space-y-3 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
              <div className="flex flex-wrap items-center justify-between gap-1.5 border-b-2 border-black pb-2">
                <span className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">{challenge.title}</span>
                <span className="font-mono text-xs sm:text-sm font-black text-white bg-black px-2 sm:px-2.5 py-0.5">
                  {challenge.formula}
                </span>
              </div>

              <p className="font-pixel text-[11px] sm:text-sm text-black leading-relaxed font-bold">
                {challenge.question}
              </p>

              {challenge.inputType === 'choice' && challenge.choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                  {challenge.choices.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(ch.value)}
                      className="bg-white hover:bg-black hover:text-white border-2 border-black text-left p-2.5 sm:p-3 font-mono text-xs font-black text-black transition-all cursor-pointer shadow-[2px_2px_0_#000]"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 pt-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    value={userAnswer}
                    placeholder="Digite e confirme..."
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-white border-2 sm:border-3 border-black px-3 py-1.5 sm:py-2 text-black font-mono font-bold text-sm sm:text-base focus:outline-none shadow-inner"
                  />
                  <button
                    onClick={() => handleSubmit()}
                    className="gb-btn-primary font-pixel text-[10px] sm:text-xs px-4 sm:px-5 py-2 font-bold cursor-pointer shrink-0"
                  >
                    ENVIAR ▶
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

