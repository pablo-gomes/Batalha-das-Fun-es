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

  const nextStage = Math.min(3, (creature.stage || 1) + 1) as 1 | 2 | 3;
  const currentForm = creature.forms?.find(f => f.stage === creature.stage) || creature.forms?.[0] || {
    stage: creature.stage || 1,
    name: creature.name,
    specialSkill: 'Golpe das Raízes',
    imageUrl: creature.imageUrl,
    backImageUrl: creature.backImageUrl
  };
  const evolvedForm = creature.forms?.find(f => f.stage === nextStage) || creature.forms?.[creature.forms.length - 1] || currentForm;

  useEffect(() => {
    sound.playEvolution();

    const t1 = setTimeout(() => {
      setPhase('morphing');
    }, 2000);

    const t2 = setTimeout(() => {
      setPhase('evolved');
      sound.playVictory();
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-3 sm:p-4 select-none">
      <div className="max-w-md w-full text-center space-y-3.5 sm:space-y-5">
        {/* Title */}
        <h2 className="font-pixel text-xs sm:text-lg text-amber-300 font-black px-2 drop-shadow-md">
          {phase === 'evolved' 
            ? '✨ EVOLUÇÃO CONCLUÍDA! ✨' 
            : '⚡ O QUE ESTÁ ACONTECENDO?! ⚡'}
        </h2>

        {/* Sprite Display with Colored Aura */}
        <div className="relative h-44 sm:h-56 flex items-center justify-center gba-sprite">
          {/* Glowing colorful aura backdrop */}
          <div className="absolute w-40 h-40 bg-gradient-to-tr from-amber-400 via-emerald-400 to-sky-400 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none" />

          {phase === 'intro' && (
            <div className="animate-bounce relative z-10">
              <PixelSprite creature={creature} size={140} />
            </div>
          )}

          {phase === 'morphing' && (
            <div className="relative z-10 animate-pulse filter brightness-150">
              <PixelSprite 
                creature={{ ...creature, stage: nextStage }} 
                size={160} 
              />
            </div>
          )}

          {phase === 'evolved' && (
            <div className="relative z-10 animate-float">
              <PixelSprite 
                creature={{ ...creature, stage: nextStage, name: evolvedForm.name }} 
                size={170} 
              />
            </div>
          )}
        </div>

        {/* Text Description */}
        <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl p-4 shadow-[4px_4px_0_#122b1e] text-[#163323]">
          <p className="font-pixel text-[11px] sm:text-xs leading-relaxed font-bold">
            {phase === 'intro' && `Seu ${currentForm.name} está reagindo aos cálculos...`}
            {phase === 'morphing' && `A energia quadrática está transformando a criatura!`}
            {phase === 'evolved' && (
              <span>
                Parabéns! Seu <strong className="text-emerald-800">{currentForm.name}</strong> evoluiu para <strong className="text-emerald-950 font-black">{evolvedForm.name}</strong>!
                <br />
                <span className="text-[10px] sm:text-xs font-mono font-black mt-2 block border-t border-[#2d5a42]/30 pt-1.5 text-emerald-900 bg-emerald-50 rounded p-1">
                  +25 HP Máximo | +12 Ataque | Habilidade: {evolvedForm.specialSkill}
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
            className="gba-btn-primary font-pixel text-[11px] sm:text-xs py-3 px-8 rounded-xl cursor-pointer shadow-[3px_3px_0_#022c22]"
          >
            CONTINUAR AVENTURA ▶
          </button>
        )}
      </div>
    </div>
  );
};
