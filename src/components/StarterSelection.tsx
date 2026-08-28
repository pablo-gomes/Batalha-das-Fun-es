import React, { useState } from 'react';
import { Creature } from '../types';
import { STARTER_CREATURES } from '../data/creatures';
import { PixelSprite } from './PixelSprite';
import { sound } from '../utils/audio';
import { ChevronRight } from 'lucide-react';

interface StarterSelectionProps {
  onSelectStarter: (creature: Creature) => void;
  onOpenDriveCloud?: () => void;
  onOpenTutorial?: () => void;
}

export const StarterSelection: React.FC<StarterSelectionProps> = ({
  onSelectStarter,
  onOpenDriveCloud,
  onOpenTutorial
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const creature = STARTER_CREATURES[selectedIdx] || STARTER_CREATURES[0];

  const getElementTheme = (element: string) => {
    switch (element.toLowerCase()) {
      case 'raízes':
      case 'grama':
        return { cardBg: 'from-emerald-500 to-green-600', badgeBg: 'bg-emerald-600', border: 'border-emerald-900', lightBg: 'bg-emerald-50' };
      case 'delta':
      case 'fogo':
        return { cardBg: 'from-orange-500 to-red-600', badgeBg: 'bg-orange-600', border: 'border-orange-900', lightBg: 'bg-orange-50' };
      case 'vértice':
      case 'água':
        return { cardBg: 'from-sky-500 to-blue-600', badgeBg: 'bg-blue-600', border: 'border-blue-900', lightBg: 'bg-sky-50' };
      case 'gráficos':
      case 'elétrico':
        return { cardBg: 'from-amber-400 to-yellow-500', badgeBg: 'bg-amber-500', border: 'border-amber-900', lightBg: 'bg-amber-50' };
      default:
        return { cardBg: 'from-purple-500 to-indigo-600', badgeBg: 'bg-purple-600', border: 'border-purple-900', lightBg: 'bg-purple-50' };
    }
  };

  const theme = getElementTheme(creature.element);

  return (
    <div className="w-full max-w-3xl mx-auto p-1.5 sm:p-4 select-none space-y-3 text-[#163323]">

      {/* Starter Selector Cards Grid */}
      <div data-tour="starter-cards" className="grid grid-cols-2 min-[540px]:grid-cols-4 gap-2">
        {STARTER_CREATURES.map((st, idx) => {
          const isChosen = idx === selectedIdx;
          const stTheme = getElementTheme(st.element);

          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playSelect();
                setSelectedIdx(idx);
              }}
              className={`p-2 sm:p-2.5 border-2 rounded-xl text-center transition-all relative flex flex-col items-center justify-between cursor-pointer ${
                isChosen 
                  ? `bg-gradient-to-b ${stTheme.cardBg} text-white ${stTheme.border} shadow-[3px_3px_0_#122b1e] scale-[1.02] z-10` 
                  : 'bg-white text-[#193325] border-[#1b3b2b] hover:bg-[#edf7f1] shadow-xs'
              }`}
            >
              <div className="h-16 sm:h-20 flex items-center justify-center gba-sprite">
                <PixelSprite creature={st} size={76} />
              </div>
              <div className="w-full mt-1">
                <h3 className="font-pixel text-[9px] sm:text-[10px] font-black uppercase truncate">{st.name}</h3>
                <span className={`text-[8px] font-mono px-2 py-0.5 inline-block mt-0.5 font-bold rounded-full ${
                  isChosen ? 'bg-white/20 text-white' : `${stTheme.badgeBg} text-white`
                }`}>
                  {st.element}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Creature Detail Sheet */}
      <div className="bg-white border-2 sm:border-3 border-[#1b3b2b] rounded-2xl p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center shadow-[3px_3px_0_#122b1e]">
        {/* Left: Creature Preview */}
        <div className="md:col-span-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#2d5a42]/20 pb-2.5 md:pb-0 md:pr-3">
          <div className={`p-3 ${theme.lightBg} border border-[#1b3b2b]/40 rounded-xl w-full flex flex-col items-center`}>
            <div className="gba-sprite mb-1">
              <PixelSprite creature={creature} size={110} />
            </div>
            <h2 className="font-pixel text-xs sm:text-sm text-[#143021] font-black mt-1 uppercase">{creature.name}</h2>
            <span className="text-[10px] font-mono font-bold text-slate-600">{creature.species}</span>
          </div>
        </div>

        {/* Right: Stats & Start */}
        <div className="md:col-span-7 space-y-2.5">
          {/* Base Stats */}
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="bg-[#edf7f1] p-1.5 border border-[#1b3b2b]/30 rounded-lg">
              <span className="text-emerald-800 block text-[8px] font-pixel font-bold">HP</span>
              <strong className="text-[#143021] text-xs sm:text-sm font-black">{creature.maxHp}</strong>
            </div>
            <div className="bg-[#fef2f2] p-1.5 border border-[#1b3b2b]/30 rounded-lg">
              <span className="text-rose-700 block text-[8px] font-pixel font-bold">ATQ</span>
              <strong className="text-rose-950 text-xs sm:text-sm font-black">{creature.attack}</strong>
            </div>
            <div className="bg-[#f0f9ff] p-1.5 border border-[#1b3b2b]/30 rounded-lg">
              <span className="text-sky-700 block text-[8px] font-pixel font-bold">DEF</span>
              <strong className="text-sky-950 text-xs sm:text-sm font-black">{creature.defense}</strong>
            </div>
          </div>

          {/* Evolution Pathway */}
          <div className="bg-[#f7faf8] p-2 border border-[#1b3b2b]/30 rounded-lg flex items-center justify-between text-xs font-mono">
            <span className="text-[8px] font-pixel text-emerald-900 font-bold shrink-0 mr-1.5">EVOLUÇÃO:</span>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-[#143021] font-bold overflow-x-auto whitespace-nowrap">
              <span className="bg-white px-1.5 py-0.2 rounded border border-[#1b3b2b]/40 font-bold">{creature.forms[0]?.name || creature.name}</span>
              <ChevronRight size={14} className="text-emerald-700" />
              <span>{creature.forms[1]?.name || 'Forma 2'}</span>
              <ChevronRight size={14} className="text-emerald-700" />
              <span>{creature.forms[2]?.name || 'Forma 3'}</span>
            </div>
          </div>

          {/* Start Journey Button & Tutorial */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onOpenTutorial && (
              <button
                type="button"
                onClick={() => {
                  sound.playSelect();
                  onOpenTutorial();
                }}
                className="gba-btn-yellow py-2.5 px-3 text-[10px] sm:text-xs font-black tracking-wide flex items-center justify-center gap-1.5 cursor-pointer rounded-xl shrink-0"
              >
                 COMO JOGAR
              </button>
            )}

            <button
              data-tour="starter-choose"
              onClick={() => {
                sound.playConfirm();
                onSelectStarter(creature);
              }}
              className="flex-1 gba-btn-primary py-2.5 text-[10px] sm:text-xs font-black tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-xs rounded-xl"
            >
              ESCOLHER {creature.name.toUpperCase()} 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
