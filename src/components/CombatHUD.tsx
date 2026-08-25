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

  const getHpBarColor = (percent: number) => {
    if (percent > 50) return 'from-emerald-400 to-green-500';
    if (percent > 20) return 'from-yellow-400 to-amber-500';
    return 'from-rose-400 to-red-500 animate-pulse';
  };

  return (
    <div 
      className={`select-none ${
        isPlayer 
          ? 'w-[170px] min-[380px]:w-[195px] sm:w-68' 
          : 'w-[160px] min-[380px]:w-[185px] sm:w-64'
      } bg-white border-2 sm:border-3 border-[#1b3b2b] rounded-lg shadow-[2px_2px_0px_#122b1e] p-2 font-pixel`}
    >
      {/* Top row: Name & Level */}
      <div className="flex items-center justify-between border-b border-[#2d5a42]/20 pb-1 mb-1 gap-1">
        <span className="text-[9px] sm:text-[11px] font-black tracking-tight text-[#143021] uppercase truncate">
          {creature.name}
        </span>
        
        <span className="text-[8px] sm:text-[9px] font-black text-[#1b3b2b] shrink-0">
          <span className="text-[#2d6a4f] mr-0.5">:L</span>{creature.level}
        </span>
      </div>

      {/* HP Bar */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 bg-[#f0f7f2] p-1 rounded">
          <span className="text-[7px] sm:text-[8px] font-black text-[#c53030] shrink-0">
            HP
          </span>
          <div className="flex-1 bg-[#102a1c]/15 h-2.5 sm:h-3 border border-[#1b3b2b]/60 overflow-hidden rounded-full p-[1px]">
            <div 
              className={`h-full bg-gradient-to-r ${getHpBarColor(hpPercent)} transition-all duration-300 rounded-full`}
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Player: Clean numeric HP, MP & EXP */}
        {isPlayer && (
          <>
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-[#143021] px-0.5">
              <div className="flex items-center gap-1">
                {creature.comboCount > 1 && (
                  <span className="bg-amber-500 text-white px-1 rounded text-[7px]">
                    x{creature.comboCount}
                  </span>
                )}
              </div>
              <span>
                {Math.round(creature.currentHp)}/{creature.maxHp}
              </span>
            </div>

            {/* MP & EXP combined slim bar */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-[6px] sm:text-[7px] text-[#0284c7] font-bold shrink-0">MP</span>
              <div className="flex-1 bg-[#0c4a6e]/15 h-1.5 border border-[#0369a1]/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300 rounded-full"
                  style={{ width: `${energyPercent}%` }}
                />
              </div>
              <span className="text-[7px] font-mono text-slate-600">
                {Math.round(creature.currentEnergy)}
              </span>
            </div>

            {/* EXP Bar */}
            <div className="flex items-center gap-1.5 pt-0.2">
              <span className="text-[6px] text-[#7c3aed] font-bold shrink-0 font-mono">XP</span>
              <div className="flex-1 bg-[#3b0764]/10 h-1 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
