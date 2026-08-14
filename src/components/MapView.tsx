import React from 'react';
import { Region } from '../types';
import { sound } from '../utils/audio';

interface MapViewProps {
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (region: Region) => void;
  onStartStage: (stage: Region['stages'][0]) => void;
  onBackToMenu: () => void;
}

export const MapView: React.FC<MapViewProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  onStartStage,
  onBackToMenu
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-5 select-none space-y-4">
      {/* Top Navigation */}
      <div className="flex items-center justify-between bg-slate-900 border-2 border-slate-700 p-3 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onBackToMenu();
            }}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs px-3 py-2 rounded border border-slate-600 transition-colors"
          >
            ⬅ Menu Principal
          </button>
          <h1 className="font-pixel text-sm sm:text-base text-amber-300">
            🗺️ Mapa das Regiões Quadráticas
          </h1>
        </div>

        <div className="text-[11px] font-mono text-cyan-400">
          Escolha uma região para batalhar e aprender
        </div>
      </div>

      {/* Regions Horizontal / Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {regions.map((region) => {
          const isSelected = region.id === selectedRegion.id;
          return (
            <button
              key={region.id}
              disabled={!region.unlocked}
              onClick={() => {
                sound.playSelect();
                onSelectRegion(region);
              }}
              className={`p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                isSelected 
                  ? 'bg-slate-800 border-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.4)] scale-105 z-10' 
                  : region.unlocked 
                    ? 'bg-slate-900/90 border-slate-700 hover:border-slate-500' 
                    : 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl mb-1">{region.icon}</div>
              <div className="font-pixel text-[10px] text-white truncate">
                {region.name.replace(/^[^\s]+\s/, '')}
              </div>
              <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                {region.unlocked ? (region.bossDefeated ? '✓ Concluído' : 'Em progresso') : '🔒 Bloqueado'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Region Details & Stages Grid */}
      <div className="bg-slate-900 border-4 border-slate-700 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-slate-800 pb-4 mb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{selectedRegion.icon}</span>
              <div>
                <h2 className="font-pixel text-base sm:text-lg text-amber-300">
                  {selectedRegion.name}
                </h2>
                <p className="text-xs font-mono text-cyan-300">
                  {selectedRegion.subtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Foco Matemático:</span>
            <div className="flex gap-1">
              {selectedRegion.conceptFocus.map((c) => (
                <span key={c} className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700 text-[10px]">
                  {c === 'roots' ? 'Raízes (x₁, x₂)' : c === 'delta' ? 'Discriminante (Δ)' : c === 'vertex_x' ? 'Vértice (Xᵥ, Yᵥ)' : 'Gráficos'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stages list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {selectedRegion.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border-2 flex flex-col justify-between space-y-3 ${
                stage.isBoss 
                  ? 'bg-gradient-to-b from-rose-950/40 to-slate-900 border-rose-600/80 shadow-[0_4px_12px_rgba(225,29,72,0.2)]' 
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-pixel text-slate-400">
                    Fase {idx + 1}
                  </span>
                  {stage.isBoss && (
                    <span className="bg-rose-950 text-rose-300 border border-rose-700 text-[9px] font-pixel px-1.5 py-0.5 rounded">
                      👑 CHEFE
                    </span>
                  )}
                </div>

                <h3 className="font-pixel text-xs text-white">
                  {stage.name}
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-1">
                  Inimigo: <strong className="text-cyan-300">{stage.enemyCreature.name}</strong> (Nv. {stage.enemyCreature.level})
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playConfirm();
                  onStartStage(stage);
                }}
                className={`w-full font-pixel text-[11px] py-2.5 px-3 rounded-lg border-2 shadow active:translate-y-0.5 transition-all ${
                  stage.isBoss 
                    ? 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white border-rose-300' 
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white border-emerald-300'
                }`}
              >
                ⚔️ ENTRAR NA BATALHA
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
