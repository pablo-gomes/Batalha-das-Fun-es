import React, { useState } from 'react';
import { Creature } from '../types';
import { STARTER_CREATURES } from '../data/creatures';
import { PixelSprite } from './PixelSprite';
import { sound } from '../utils/audio';
import { Cloud, Gamepad2 } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto p-4 select-none space-y-5">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-pixel text-lg sm:text-2xl text-amber-300 flex items-center justify-center gap-2">
          <Gamepad2 size={18} className="text-amber-400" /> Escolha sua Criatura Inicial!
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-300">
          Cada criatura é especialista em um fundamento da Função do 2º Grau.
        </p>

        {onOpenDriveCloud && (
          <div className="pt-1">
            <button
              onClick={() => {
                sound.playSelect();
                onOpenDriveCloud();
              }}
              className="inline-flex items-center gap-2 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/80 text-cyan-300 px-3.5 py-1.5 rounded-full font-mono text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Cloud size={14} className="text-cyan-400" />
              <span>Já tem um save? <strong>Carregar do Google Drive</strong></span>
            </button>
          </div>
        )}
      </div>

      {/* Starter Selector Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STARTER_CREATURES.map((st, idx) => {
          const isChosen = idx === selectedIdx;
          return (
            <button
              key={st.id}
              onClick={() => {
                sound.playSelect();
                setSelectedIdx(idx);
              }}
              className={`p-3 rounded-2xl border-4 text-center transition-all relative overflow-hidden ${
                isChosen 
                  ? 'bg-slate-800 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-105' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="h-28 flex items-center justify-center">
                <PixelSprite creature={st} size={110} />
              </div>
              <h3 className="font-pixel text-xs text-white mt-1 truncate">{st.name}</h3>
              <span 
                className="text-[9px] font-mono px-2 py-0.5 rounded-full inline-block mt-1 font-bold text-white shadow-sm"
                style={{ backgroundColor: st.elementColor }}
              >
                {st.element}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Selected Creature Sheet */}
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0">
          <PixelSprite creature={creature} size={160} />
          <h2 className="font-pixel text-base text-amber-300 mt-2">{creature.name}</h2>
          <span className="text-xs font-mono text-cyan-300">{creature.species}</span>
        </div>

        <div className="md:col-span-8 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">HP MÁXIMO</span>
              <strong className="text-emerald-400 text-sm">{creature.maxHp}</strong>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">ATAQUE</span>
              <strong className="text-rose-400 text-sm">{creature.attack}</strong>
            </div>
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px]">DEFESA</span>
              <strong className="text-blue-400 text-sm">{creature.defense}</strong>
            </div>
          </div>

          {/* Evolutions Roadmap */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-pixel text-amber-300">LINHA EVOLUTIVA:</div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span>1. {creature.forms[0]?.name || creature.name}</span>
              <span className="text-slate-500">➔</span>
              <span>2. {creature.forms[1]?.name || 'Evolução 2'}</span>
              <span className="text-slate-500">➔</span>
              <span className="text-amber-400 font-bold">3. {creature.forms[2]?.name || 'Evolução 3'}</span>
            </div>
          </div>

          {/* Special skills preview */}
          <div>
            <div className="text-[10px] font-pixel text-cyan-300 mb-1">HABILIDADES MATEMÁTICAS:</div>
            <div className="grid grid-cols-2 gap-2">
              {creature.skills.slice(0, 2).map((sk) => (
                <div key={sk.id} className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] font-mono">
                  <span className="text-amber-300 font-bold flex items-center gap-1"><GameIcon name={sk.icon} size={12} /> {sk.name}</span>
                  <p className="text-slate-400 text-[9px] line-clamp-1">{sk.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playConfirm();
              onSelectStarter(creature);
            }}
            className="w-full font-pixel text-xs bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black py-3.5 px-6 rounded-xl border-2 border-amber-300 shadow-[0_4px_0_#78350f] active:translate-y-0.5 transition-all mt-2"
          >
            ESCOLHER {creature.name.toUpperCase()} E COMEÇAR ▶
          </button>
        </div>
      </div>
    </div>
  );
};

