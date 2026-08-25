import React from 'react';
import { Region } from '../types';
import { sound } from '../utils/audio';
import { GameIcon } from '../utils/iconMap';
import { Map, Lock, Swords, CheckCircle2, Crown } from 'lucide-react';

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
  const getRegionThemeColor = (regionId: string) => {
    switch (regionId) {
      case 'regiao_raizes':
        return { activeBg: 'from-emerald-500 to-green-600', border: 'border-emerald-900', btnClass: 'gba-btn-green' };
      case 'regiao_delta':
        return { activeBg: 'from-orange-500 to-red-600', border: 'border-orange-900', btnClass: 'gba-btn-red' };
      case 'regiao_vertice':
        return { activeBg: 'from-sky-500 to-blue-600', border: 'border-blue-900', btnClass: 'gba-btn-blue' };
      case 'regiao_graficos':
        return { activeBg: 'from-amber-400 to-yellow-500', border: 'border-amber-900', btnClass: 'gba-btn-yellow' };
      default:
        return { activeBg: 'from-purple-500 to-indigo-600', border: 'border-purple-900', btnClass: 'gba-btn-purple' };
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-4 select-none space-y-3 text-[#163323]">
      {/* Top Breadcrumb / Title Bar */}
      <div className="flex items-center justify-between bg-white border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2.5 sm:p-3 shadow-[2px_2px_0_#122b1e]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playCancel();
              onBackToMenu();
            }}
            className="bg-slate-100 hover:bg-slate-200 text-[#1b3b2b] font-pixel text-[9px] sm:text-[10px] px-2.5 py-1 rounded border border-[#1b3b2b]/50 transition-colors cursor-pointer font-bold"
          >
            ⬅ INÍCIO
          </button>
          <h1 className="font-pixel text-[11px] sm:text-xs text-[#143021] font-black flex items-center gap-1.5 uppercase">
            <Map size={14} className="text-emerald-700" /> MAPA DE REGIÕES
          </h1>
        </div>

        <span className="text-[10px] sm:text-xs font-mono font-bold text-emerald-800 bg-[#edf7f1] px-2 py-0.5 rounded">
          {selectedRegion.name}
        </span>
      </div>

      {/* Regions Horizontal Selector */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-5 gap-2">
        {regions.map((region) => {
          const isSelected = region.id === selectedRegion.id;
          const regTheme = getRegionThemeColor(region.id);

          return (
            <button
              key={region.id}
              disabled={!region.unlocked}
              onClick={() => {
                sound.playSelect();
                onSelectRegion(region);
              }}
              className={`p-2.5 border-2 rounded-xl text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? `bg-gradient-to-b ${regTheme.activeBg} text-white ${regTheme.border} shadow-[3px_3px_0_#122b1e] scale-[1.02] z-10` 
                  : region.unlocked 
                    ? 'bg-white text-[#143021] border-[#1b3b2b] hover:bg-[#edf7f1] shadow-xs' 
                    : 'bg-slate-200/60 border-slate-300 opacity-40 cursor-not-allowed text-slate-500'
              }`}
            >
              <div className="text-lg sm:text-xl mb-1 flex items-center justify-center">
                <GameIcon name={region.icon} size={20} />
              </div>
              <div className="min-w-0">
                <div className="font-pixel text-[9px] sm:text-[10px] font-black truncate uppercase">
                  {region.name.replace(/^[^\s]+\s/, '')}
                </div>
                <div className="text-[8px] sm:text-[9px] font-mono font-bold truncate mt-0.5">
                  {region.unlocked ? (region.bossDefeated ? (
                    <span className="flex items-center gap-0.5 text-amber-300 font-bold"><CheckCircle2 size={9} /> Concluído</span>
                  ) : (
                    <span className={isSelected ? 'text-emerald-100' : 'text-emerald-700'}>Disponível</span>
                  )) : (
                    <span className="flex items-center gap-0.5 text-slate-500"><Lock size={9} /> Bloqueado</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Region Stages Grid */}
      <div className="bg-white border-2 sm:border-3 border-[#1b3b2b] rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0_#122b1e] space-y-3">
        <div className="flex items-center justify-between border-b border-[#2d5a42]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg sm:text-xl"><GameIcon name={selectedRegion.icon} size={20} /></span>
            <div>
              <h2 className="font-pixel text-xs sm:text-sm text-[#143021] font-black uppercase">
                {selectedRegion.name}
              </h2>
              <p className="text-[10px] sm:text-[11px] font-mono text-slate-600 font-bold">
                {selectedRegion.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Stages Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {selectedRegion.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`p-3 border-2 rounded-xl flex flex-col justify-between space-y-2.5 transition-all ${
                stage.isBoss 
                  ? 'bg-amber-50/70 border-amber-800 shadow-xs' 
                  : 'bg-[#fbfdfa] border-[#1b3b2b] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-pixel font-bold text-slate-500">
                    FASE {idx + 1}
                  </span>
                  {stage.isBoss ? (
                    <span className="bg-amber-500 text-white text-[7px] font-pixel px-1.5 py-0.5 rounded flex items-center gap-0.5 font-black">
                      <Crown size={8} /> CHEFE
                    </span>
                  ) : stage.completed ? (
                    <span className="text-emerald-700 text-[8px] font-pixel font-bold flex items-center gap-0.5">
                      <CheckCircle2 size={9} /> Concluída
                    </span>
                  ) : null}
                </div>

                <h3 className="font-pixel text-[10px] sm:text-[11px] text-[#143021] font-black uppercase truncate">
                  {stage.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] font-mono text-slate-600 font-bold mt-0.5">
                  {stage.enemyCreature.name} <span className="text-slate-400">(Nv.{stage.enemyCreature.level})</span>
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playConfirm();
                  onStartStage(stage);
                }}
                className={`w-full ${
                  stage.isBoss ? 'gba-btn-red' : 'gba-btn-primary'
                } font-pixel text-[9px] sm:text-[10px] py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer font-bold shadow-xs`}
              >
                <Swords size={11} /> {stage.isBoss ? 'DESAFIAR CHEFE ▶' : 'BATALHAR ▶'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
