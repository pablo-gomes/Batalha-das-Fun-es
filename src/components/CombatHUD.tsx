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

  // Determine HP bar color (Green -> Yellow -> Red)
  const getHpColor = (pct: number) => {
    if (pct > 50) return 'bg-emerald-400';
    if (pct > 20) return 'bg-amber-400';
    return 'bg-rose-500';
  };

  return (
    <div 
      className={`relative select-none ${
        isPlayer 
          ? 'w-64 sm:w-72 bg-[#e2e8f0] text-slate-900 border-4 border-[#334155] rounded-tl-2xl rounded-br-2xl shadow-[4px_4px_0px_#0f172a]' 
          : 'w-60 sm:w-68 bg-[#e2e8f0] text-slate-900 border-4 border-[#334155] rounded-tr-2xl rounded-bl-2xl shadow-[4px_4px_0px_#0f172a]'
      } p-2 sm:p-2.5 font-pixel`}
    >
      {/* Top row: Name, Element & Level */}
      <div className="flex items-center justify-between border-b-2 border-slate-300 pb-1 mb-1.5">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-[11px] sm:text-xs font-bold tracking-tight text-slate-900 uppercase truncate">
            {creature.name}
          </span>
          <span 
            className="text-[9px] px-1 py-0.2 rounded font-mono font-bold text-white shadow-sm"
            style={{ backgroundColor: creature.elementColor }}
          >
            {creature.element}
          </span>
        </div>
        <div className="flex items-center text-[10px] sm:text-[11px] font-bold text-slate-800 shrink-0">
          <span className="text-[8px] text-slate-600 mr-0.5">Lv</span>
          {creature.level}
        </div>
      </div>

      {/* HP Bar Container */}
      <div className="flex items-center gap-1.5 mb-1">
        <span className="bg-amber-500 text-slate-950 text-[8px] px-1 rounded-sm font-black tracking-tighter">
          HP
        </span>
        <div className="flex-1 bg-slate-700 h-3 rounded-full border border-slate-900 p-0.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getHpColor(hpPercent)}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Numeric HP & Combo display for Player */}
      {isPlayer && (
        <>
          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-700 px-0.5 mb-1">
            <div className="flex items-center gap-1">
              {creature.comboCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[8px] font-pixel px-1.5 py-0.5 rounded shadow animate-pulse">
                  🔥 COMBO x{creature.comboCount}
                </span>
              )}
              {creature.statusCondition === 'concentrado' && (
                <span className="bg-blue-600 text-white text-[8px] font-pixel px-1 rounded">
                  CONCENTRADO (+10%)
                </span>
              )}
              {creature.statusCondition === 'avancado' && (
                <span className="bg-purple-600 text-white text-[8px] font-pixel px-1 rounded animate-pulse">
                  AVANÇADO (+25%)
                </span>
              )}
            </div>
            <span className="text-right">
              <span className={creature.currentHp < creature.maxHp * 0.25 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}>
                {Math.round(creature.currentHp)}
              </span>
              / {creature.maxHp}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="flex items-center gap-1.5 mb-1">
            <span className="bg-cyan-500 text-slate-950 text-[8px] px-1 rounded-sm font-black tracking-tighter">
              MP
            </span>
            <div className="flex-1 bg-slate-700 h-2 rounded-full border border-slate-900 p-0.5 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
            <span className="text-[8px] font-mono text-slate-600 shrink-0">
              {Math.round(creature.currentEnergy)}/{creature.maxEnergy}
            </span>
          </div>

          {/* XP Bar */}
          <div className="flex items-center gap-1">
            <span className="text-[7px] text-slate-500 font-bold">EXP</span>
            <div className="flex-1 bg-slate-300 h-1.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* Enemy Stage / Boss badge if applicable */}
      {!isPlayer && creature.stage > 1 && (
        <div className="flex items-center justify-end text-[8px] font-mono text-slate-600 mt-0.5">
          <span className="text-purple-700 font-bold">★ Forma {creature.stage}</span>
        </div>
      )}
    </div>
  );
};
