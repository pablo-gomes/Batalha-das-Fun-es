import React, { useState, useEffect } from 'react';
import { MathChallenge, MathConcept } from '../types';
import { generateMathChallenge, calculatePrecision } from '../utils/mathEngine';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { ParabolaGraph } from './ParabolaGraph';
import { Timer, Trophy } from 'lucide-react';

interface ChallengeModeProps {
  onBack: () => void;
  onEarnCoins?: (earned: number) => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({ onBack, onEarnCoins }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [score, setScore] = useState<number>(0);
  const [earnedCoins, setEarnedCoins] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [challenge, setChallenge] = useState<MathChallenge | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [lastFeedback, setLastFeedback] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const startChallenge = () => {
    sound.playConfirm();
    setTimeLeft(60);
    setScore(0);
    setEarnedCoins(0);
    setCombo(0);
    setHighestCombo(0);
    setGameOver(false);
    setIsPlaying(true);
    setLastFeedback('');
    setShowGraph(false);
    generateNextQuestion();
  };

  const generateNextQuestion = () => {
    const pool: MathConcept[] = ['fx_value', 'delta', 'roots', 'vertex_x', 'concavity', 'y_intercept'];
    const randomConcept = pool[Math.floor(Math.random() * pool.length)];
    setChallenge(generateMathChallenge(randomConcept, 'medio'));
    setUserAnswer('');
  };

  const handleSkipQuestion = () => {
    sound.playCancel();
    setCombo(0);
    setLastFeedback(' Pergunta pulada! Combo zerado.');
    generateNextQuestion();
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
      const coinsGained = 10 + (2 * newCombo);

      setScore((prev) => prev + pts);
      setEarnedCoins((prev) => prev + coinsGained);
      if (onEarnCoins) onEarnCoins(coinsGained);

      setTimeLeft((prev) => Math.min(90, prev + 3));
      setLastFeedback(` EXATO (+${pts} pts | +${coinsGained}) • +3s! x${newCombo}`);
    } else if (res.rating === 'ALTA') {
      sound.playCorrect(false);
      const pts = 60 * (combo + 1);
      const coinsGained = 5;

      setScore((prev) => prev + pts);
      setEarnedCoins((prev) => prev + coinsGained);
      if (onEarnCoins) onEarnCoins(coinsGained);

      setLastFeedback(` ALTA PRECISÃO (+${pts} pts | +${coinsGained})`);
    } else {
      sound.playWrong();
      setCombo(0);
      setLastFeedback(' INCORRETO! Combo zerado.');
    }

    generateNextQuestion();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-5 select-none space-y-3 sm:space-y-4 text-[#163323]">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl p-2.5 sm:p-3.5 shadow-[4px_4px_0_#122b1e]">
        <button
          onClick={() => {
            sound.playCancel();
            onBack();
          }}
          className="bg-white hover:bg-[#edf7f1] text-[#1b3b2b] font-pixel text-[9px] sm:text-xs px-2.5 sm:px-3 py-1.5 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
        >
           VOLTAR
        </button>
        <h1 className="font-pixel text-[11px] sm:text-sm text-[#143021] font-black flex items-center gap-1.5 uppercase truncate">
           DESAFIO TURBO (60S)
        </h1>
        <div className="font-pixel text-[9px] sm:text-[11px] text-amber-950 bg-amber-200 px-3 py-1 border-2 border-amber-800 rounded-lg font-black shadow-xs">
          PTS: {score}
        </div>
      </div>

      {!isPlaying && !gameOver ? (
        <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-5 sm:p-8 text-center space-y-4 sm:space-y-5 shadow-[4px_4px_0_#122b1e]">
          <div className="text-4xl sm:text-6xl flex justify-center"><Timer size={52} className="text-amber-600" /></div>
          <h2 className="font-pixel text-xs sm:text-base text-[#143021] font-black uppercase">Teste sua agilidade e precisão!</h2>
          <p className="font-mono text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed font-bold">
            Resolva o máximo de problemas em 60 segundos. Respostas perfeitas concedem <strong>+3 segundos</strong>, moedas e bônus de combos!
          </p>
          <button
            onClick={startChallenge}
            className="gba-btn-yellow font-pixel text-[11px] sm:text-sm py-3 px-8 rounded-xl font-black cursor-pointer shadow-[3px_3px_0_#451a03]"
          >
             INICIAR DESAFIO
          </button>
        </div>
      ) : gameOver ? (
        <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-5 sm:p-8 text-center space-y-4 sm:space-y-5 shadow-[4px_4px_0_#122b1e]">
          <div className="text-4xl sm:text-6xl flex justify-center"><Trophy size={52} className="text-amber-600" /></div>
          <h2 className="font-pixel text-sm sm:text-lg text-emerald-950 font-black">TEMPO ESGOTADO!</h2>
          <div className="bg-[#f0f7f2] p-4 border-2 border-[#1b3b2b] rounded-xl font-mono text-sm sm:text-base space-y-1.5 max-w-xs mx-auto font-bold shadow-inner">
            <div>Pontuação: <strong className="text-emerald-950">{score} pts</strong></div>
            <div>Maior Combo: <strong className="text-amber-700">x{highestCombo}</strong></div>
            {earnedCoins > 0 && <div className="text-emerald-800">Moedas Ganhas: <strong>+{earnedCoins}</strong></div>}
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button
              onClick={startChallenge}
              className="gba-btn-primary font-pixel text-[10px] sm:text-xs py-2.5 px-5 rounded-lg cursor-pointer font-black"
            >
              JOGAR DE NOVO 
            </button>
            <button
              onClick={onBack}
              className="bg-white hover:bg-slate-100 text-[#1b3b2b] font-pixel text-[10px] sm:text-xs py-2.5 px-5 border-2 border-[#1b3b2b] rounded-lg cursor-pointer font-bold shadow-xs"
            >
              VOLTAR AO MAPA
            </button>
          </div>
        </div>
      ) : (
        /* Active Game */
        <div className="space-y-3">
          {/* Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-[#fbfdfa] border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2 text-center shadow-xs">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-600">TEMPO</div>
              <div className={`font-pixel text-base sm:text-2xl mt-0.5 font-black ${timeLeft <= 10 ? 'text-rose-600 animate-ping' : 'text-emerald-900'}`}>
                {timeLeft}s
              </div>
            </div>

            <div className="bg-[#fbfdfa] border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2 text-center shadow-xs">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-600">PONTOS</div>
              <div className="font-pixel text-base sm:text-2xl text-[#143021] font-black mt-0.5">
                {score}
              </div>
            </div>

            <div className="bg-[#fbfdfa] border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2 text-center shadow-xs">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-600">MOEDAS</div>
              <div className="font-pixel text-base sm:text-2xl text-amber-600 font-black mt-0.5">
                {earnedCoins}
              </div>
            </div>

            <div className="bg-[#fbfdfa] border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2 text-center shadow-xs">
              <div className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-600">COMBO</div>
              <div className="font-pixel text-base sm:text-2xl text-orange-600 font-black mt-0.5">
                x{combo}
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {lastFeedback && (
            <div className="bg-[#f0f7f2] border-2 border-[#1b3b2b] rounded-lg py-1.5 px-3 text-center font-mono text-[11px] sm:text-xs font-black text-[#143021] shadow-xs">
              {lastFeedback}
            </div>
          )}

          {/* Question Card */}
          {challenge && (
            <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-3.5 sm:p-5 space-y-3 shadow-[4px_4px_0_#122b1e]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#2d5a42]/30 pb-2">
                <span className="font-pixel text-[10px] sm:text-xs text-[#143021] font-black uppercase">{challenge.title}</span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      sound.playSelect();
                      setShowGraph(!showGraph);
                    }}
                    className={`font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 rounded border-2 border-[#1b3b2b] transition-colors cursor-pointer font-bold ${
                      showGraph ? 'bg-[#1b3b2b] text-white' : 'bg-slate-100 text-[#1b3b2b] hover:bg-slate-200'
                    }`}
                  >
                    {showGraph ? ' OCULTAR GRÁFICO' : ' VER GRÁFICO'}
                  </button>

                  <button
                    onClick={handleSkipQuestion}
                    className="font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 border-2 border-rose-800 bg-rose-100 hover:bg-rose-200 text-rose-900 rounded transition-colors cursor-pointer font-bold"
                  >
                     PULAR
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <span className="font-mono text-xs sm:text-sm font-black text-emerald-950 bg-emerald-100 px-3 py-0.5 rounded border border-emerald-400">
                  {challenge.formula}
                </span>
              </div>

              {/* Toggleable Parabola Graph */}
              {showGraph && (
                <div className="flex justify-center p-2 bg-white border-2 border-[#1b3b2b] rounded-lg my-2 gba-sprite">
                  <ParabolaGraph 
                    a={challenge.a} 
                    b={challenge.b} 
                    c={challenge.c} 
                    width={300} 
                    height={190} 
                  />
                </div>
              )}

              <p className="font-pixel text-[11px] sm:text-sm text-[#143021] leading-relaxed font-bold">
                {challenge.question}
              </p>

              {challenge.inputType === 'choice' && challenge.choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {challenge.choices.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSubmit(ch.value)}
                      className="bg-white hover:bg-emerald-50 border-2 border-[#1b3b2b] text-left p-3 rounded-lg font-mono text-xs font-black text-[#143021] transition-all cursor-pointer shadow-[2px_2px_0_#122b1e]"
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    autoFocus
                    value={userAnswer}
                    placeholder="Digite e confirme..."
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    className="flex-1 bg-white border-2 border-[#1b3b2b] rounded-lg px-3 py-2 text-[#143021] font-mono font-black text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                  />
                  <button
                    onClick={() => handleSubmit()}
                    className="gba-btn-primary font-pixel text-[10px] sm:text-xs px-5 py-2 rounded-lg font-black cursor-pointer shrink-0"
                  >
                    ENVIAR 
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
