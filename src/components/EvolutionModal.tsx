import React, { useEffect, useState } from 'react';
import { Creature } from '../types';
import { PixelSprite } from './PixelSprite';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface EvolutionModalProps {
  creature: Creature;
  onComplete: () => void;
}

export const EvolutionModal: React.FC<EvolutionModalProps> = ({ creature, onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'morphing' | 'evolved'>('intro');

  const nextStage = Math.min(3, creature.stage + 1) as 1 | 2 | 3;
  const currentForm = creature.forms.find(f => f.stage === creature.stage) || creature.forms[0];
  const evolvedForm = creature.forms.find(f => f.stage === nextStage) || creature.forms[creature.forms.length - 1];

  useEffect(() => {
    sound.playEvolution();

    const t1 = setTimeout(() => {
      setPhase('morphing');
    }, 2000);

    const t2 = setTimeout(() => {
      setPhase('evolved');
      sound.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Title */}
        <h2 className="font-pixel text-base sm:text-lg text-amber-300 animate-pulse">
          {phase === 'evolved' 
            ? '✨ EVOLUÇÃO CONCLUÍDA! ✨' 
            : '⚡ O QUE ESTÁ ACONTECENDO?! ⚡'}
        </h2>

        {/* Sprite Display */}
        <div className="relative h-56 flex items-center justify-center">
          <div className="absolute w-48 h-48 rounded-full bg-cyan-500/20 blur-xl animate-ping" />

          {phase === 'intro' && (
            <div className="animate-bounce">
              <PixelSprite creature={creature} size={180} />
            </div>
          )}

          {phase === 'morphing' && (
            <div className="relative animate-pulse filter brightness-200">
              <PixelSprite 
                creature={{ ...creature, stage: nextStage }} 
                size={200} 
              />
              <div className="absolute inset-0 bg-white/60 rounded-full animate-ping" />
            </div>
          )}

          {phase === 'evolved' && (
            <div className="animate-float">
              <PixelSprite 
                creature={{ ...creature, stage: nextStage, name: evolvedForm.name }} 
                size={220} 
              />
            </div>
          )}
        </div>

        {/* Text Description */}
        <div className="bg-slate-900 border-4 border-amber-400 p-4 rounded-xl shadow-[0_6px_0_#0f172a]">
          <p className="font-pixel text-xs text-white leading-relaxed">
            {phase === 'intro' && `Seu ${currentForm.name} está reagindo ao poder das funções...`}
            {phase === 'morphing' && `A energia quadrática está remodelando o corpo da criatura!`}
            {phase === 'evolved' && (
              <span>
                Parabéns! Seu <strong className="text-amber-400">{currentForm.name}</strong> evoluiu para <strong className="text-cyan-300">{evolvedForm.name}</strong>!
                <br />
                <span className="text-[10px] text-emerald-400 mt-2 block">
                  +25 HP Máximo | +12 Ataque | Habilidade Especial: {evolvedForm.specialSkill}
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Continue Button */}
        {phase === 'evolved' && (
          <button
            onClick={() => {
              sound.playConfirm();
              onComplete();
            }}
            className="font-pixel text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black py-3 px-8 rounded-lg border-2 border-emerald-300 shadow-[0_4px_0_#064e3b] active:translate-y-0.5"
          >
            CONTINUAR AVENTURA ▶
          </button>
        )}
      </div>
    </div>
  );
};
