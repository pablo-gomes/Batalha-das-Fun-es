import React from 'react';
import { Creature } from '../types';

interface CombatHUDProps {
  creature: Creature;
  isPlayer?: boolean;
}

export const CombatHUD: React.FC<CombatHUDProps> = ({ creature, isPlayer = false }) => {
  const hpPercent = Math.max(0, Math.min(100, (creature.currentHp / creature.maxHp) * 100));
  const energyPercent = Math.max(0, Math.min(100, (creature.currentEnergy / creature.maxEnergy) * 100));
  const xpPercent = Math.max(0, Math.min(100, (creature.xp / creature.xpToNextLevel) * 100));

  return (
    <div 
      className={`relative select-none ${
        isPlayer 
          ? 'w-[180px] min-[380px]:w-[210px] sm:w-72 bg-white text-black border-2 sm:border-4 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[4px_4px_0px_#000000]' 
          : 'w-[170px] min-[380px]:w-[195px] sm:w-68 bg-white text-black border-2 sm:border-4 border-black shadow-[2px_2px_0px_#000000] sm:shadow-[4px_4px_0px_#000000]'
      } p-1.5 min-[380px]:p-2 sm:p-2.5 font-pixel`}
    >
      {/* Top row: Name & Level (:L5 style) */}
      <div className="flex items-center justify-between border-b sm:border-b-2 border-black pb-0.5 sm:pb-1 mb-1 sm:mb-1.5 gap-1">
        <div className="flex items-center gap-1 overflow-hidden min-w-0">
          <span className="text-[9px] min-[380px]:text-[10px] sm:text-xs font-black tracking-tight text-black uppercase truncate">
            {creature.name}
          </span>
          <span className="text-[7px] sm:text-[8px] font-mono font-bold bg-black text-white px-1 py-0.2 rounded-xs shrink-0">
            {creature.element}
          </span>
        </div>
        <div className="flex items-center text-[8px] min-[380px]:text-[9px] sm:text-[10px] font-black text-black shrink-0 font-pixel">
          <span className="text-[7px] sm:text-[9px] mr-0.5">:L</span>
          {creature.level}
        </div>
      </div>

      {/* HP Bar Container (Game Boy Style) */}
      <div className="space-y-1 sm:space-y-1.5">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[8px] sm:text-[9px] font-black tracking-tighter text-black shrink-0">
            HP:
          </span>
          <div className="flex-1 bg-white h-2 sm:h-3 border sm:border-2 border-black p-0.5 overflow-hidden rounded-full">
            <div 
              className="h-full bg-black transition-all duration-500 rounded-full"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Player specific: Numeric HP, Energy MP bar & EXP */}
        {isPlayer ? (
          <>
            {/* Numeric HP readout like original Game Boy Pokémon */}
            <div className="flex items-center justify-between text-[9px] min-[380px]:text-[10px] sm:text-xs font-mono font-black text-black px-0.5">
              <div className="flex items-center gap-0.5 sm:gap-1">
                {creature.comboCount > 0 && (
                  <span className="bg-black text-white px-1 py-0.2 font-pixel text-[7px] sm:text-[8px]">
                    x{creature.comboCount}
                  </span>
                )}
                {creature.statusCondition && (
                  <span className="border border-black px-0.5 text-[7px] sm:text-[8px] font-pixel">
                    {creature.statusCondition.slice(0, 4).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="tracking-tighter sm:tracking-wider">
                {Math.round(creature.currentHp)}/{creature.maxHp}
              </span>
            </div>

            {/* MP Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5 pt-0.5">
              <span className="text-[7px] sm:text-[8px] font-bold text-black shrink-0 font-pixel">
                MP:
              </span>
              <div className="flex-1 bg-slate-200 h-1.5 sm:h-2 border border-black p-0.2 overflow-hidden">
                <div 
                  className="h-full bg-slate-800 transition-all duration-300"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-black shrink-0">
                {Math.round(creature.currentEnergy)}/{creature.maxEnergy}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center gap-1">
              <span className="text-[6px] sm:text-[7px] text-slate-700 font-bold font-mono">EXP</span>
              <div className="flex-1 bg-slate-200 h-1 sm:h-1.5 border border-black overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          creature.stage > 1 && (
            <div className="flex items-center justify-end text-[7px] sm:text-[9px] font-mono text-black font-bold">
              <span>★ FORMA {creature.stage}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

