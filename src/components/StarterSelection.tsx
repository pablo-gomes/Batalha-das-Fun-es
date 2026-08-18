import React, { useState } from 'react';
import { Creature } from '../types';
import { STARTER_CREATURES } from '../data/creatures';
import { PixelSprite } from './PixelSprite';
import { sound } from '../utils/audio';
import { Cloud } from 'lucide-react';
import { GameIcon } from '../utils/iconMap';

interface StarterSelectionProps {
  onSelectStarter: (creature: Creature) => void;
  onOpenDriveCloud?: () => void;
}

export const StarterSelection: React.FC<StarterSelectionProps> = ({
  onSelectStarter,
  onOpenDriveCloud
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const creature = STARTER_CREATURES[selectedIdx] || STARTER_CREATURES[0];

  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-5 select-none space-y-3 sm:space-y-4 text-black">

      {/* Starter Selector Cards Grid */}
      <div className="grid grid-cols-2 min-[540px]:grid-cols-4 gap-2 sm:gap-2.5">
        {STARTER_CREATURES.map((st, idx) => {
          const isChosen = idx === selectedIdx;
          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playSelect();
                setSelectedIdx(idx);
              }}
              className={`p-2 sm:p-3 border-2 sm:border-4 text-center transition-all relative flex flex-col items-center justify-between cursor-pointer ${
                isChosen 
                  ? 'bg-black text-white border-black shadow-[3px_3px_0_#475569] sm:shadow-[4px_4px_0_#475569] scale-[1.01] z-10' 
                  : 'bg-white text-black border-black hover:bg-slate-100 shadow-[2px_2px_0_#000]'
              }`}
            >
              <div className="h-20 sm:h-24 flex items-center justify-center gb-sprite-mono">
                <PixelSprite creature={st} size={84} />
              </div>
              <div className="w-full mt-1 sm:mt-2">
                <h3 className="font-pixel text-[10px] sm:text-[11px] font-black uppercase truncate">{st.name}</h3>
                <span className={`text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 inline-block mt-0.5 font-black border ${
                  isChosen ? 'border-white text-white' : 'border-black text-black'
                }`}>
                  {st.element}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Creature Detail Sheet */}
      <div className="bg-white border-3 sm:border-4 border-black p-3 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
        {/* Left: Creature Preview */}
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r-2 border-black pb-2.5 md:pb-0 md:pr-4">
          <div className="p-2 sm:p-3 bg-white border-2 border-black w-full flex flex-col items-center gb-sprite-mono">
            <PixelSprite creature={creature} size={120} />
            <h2 className="font-pixel text-xs sm:text-base text-black font-black mt-1.5 uppercase">{creature.name}</h2>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600">{creature.species}</span>
          </div>
        </div>

        {/* Right: Stats, Evolution & Skills */}
        <div className="md:col-span-8 space-y-2.5 sm:space-y-3">
          {/* Base Stats */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center font-mono">
            <div className="bg-white p-1.5 sm:p-2 border-2 border-black">
              <span className="text-black block text-[8px] sm:text-[9px] font-pixel font-bold">HP</span>
              <strong className="text-black text-xs sm:text-base font-black">{creature.maxHp}</strong>
            </div>
            <div className="bg-white p-1.5 sm:p-2 border-2 border-black">
              <span className="text-black block text-[8px] sm:text-[9px] font-pixel font-bold">ATAQUE</span>
              <strong className="text-black text-xs sm:text-base font-black">{creature.attack}</strong>
            </div>
            <div className="bg-white p-1.5 sm:p-2 border-2 border-black">
              <span className="text-black block text-[8px] sm:text-[9px] font-pixel font-bold">DEFESA</span>
              <strong className="text-black text-xs sm:text-base font-black">{creature.defense}</strong>
            </div>
          </div>

          {/* Evolution Pathway */}
          <div className="bg-white p-2 sm:p-2.5 border-2 border-black flex items-center justify-between text-xs font-mono">
            <span className="text-[8px] sm:text-[9px] font-pixel text-black font-black shrink-0 mr-1.5">EVOLUÇÃO:</span>
            <div className="flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs text-black font-bold overflow-x-auto whitespace-nowrap">
              <span className="border-b border-black">{creature.forms[0]?.name || creature.name}</span>
              <span>➔</span>
              <span>{creature.forms[1]?.name || 'Forma 2'}</span>
              <span>➔</span>
              <span>{creature.forms[2]?.name || 'Forma 3'}</span>
            </div>
          </div>

          {/* Skills preview */}
          <div>
            <div className="text-[8px] sm:text-[9px] font-pixel text-black font-black mb-1">HABILIDADES:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {creature.skills.slice(0, 2).map((sk) => (
                <div key={sk.id} className="bg-white p-1.5 sm:p-2 border-2 border-black text-xs font-mono flex flex-col justify-between">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-black flex items-center gap-1 text-[11px] sm:text-xs">
                      <GameIcon name={sk.icon} size={11} /> {sk.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-black border border-black px-1">{sk.energyCost} MP</span>
                  </div>
                  <p className="text-slate-600 text-[9px] sm:text-[10px] line-clamp-1 mt-0.5 font-bold">{sk.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Start Journey Button */}
          <button
            onClick={() => {
              sound.playConfirm();
              onSelectStarter(creature);
            }}
            className="w-full gb-btn-primary py-2.5 sm:py-3 text-[11px] sm:text-sm font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[3px_3px_0_#000] border-2 border-black hover:bg-black hover:text-white transition-all"
          >
            ESCOLHER {creature.name.toUpperCase()} E INICIAR ▶
          </button>
        </div>
      </div>
    </div>
  );
};
