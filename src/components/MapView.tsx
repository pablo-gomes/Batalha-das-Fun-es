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
  return (
    <div className="w-full max-w-5xl mx-auto p-1.5 sm:p-4 select-none space-y-2.5 sm:space-y-3.5 text-black">
      {/* Top Breadcrumb / Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-3 sm:border-4 border-black p-2.5 sm:p-3 gap-1.5 sm:gap-2 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000]">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playCancel();
              onBackToMenu();
            }}
            className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] sm:text-xs px-2 sm:px-2.5 py-1 sm:py-1.5 border-2 border-black transition-colors flex items-center gap-1 cursor-pointer font-bold"
          >
            ⬅ INÍCIO
          </button>
          <h1 className="font-pixel text-[11px] sm:text-sm text-black font-black flex items-center gap-1.5 uppercase">
            <Map size={14} /> MAPA DE REGIÕES
          </h1>
        </div>

        <div className="text-[11px] sm:text-xs font-mono text-slate-700 font-bold">
          Selecione a região e enfrente as fases
        </div>
      </div>

      {/* Regions Horizontal / Responsive Selector */}
      <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
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
              className={`p-2 sm:p-2.5 border-2 sm:border-4 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected 
                  ? 'bg-black text-white border-black shadow-[3px_3px_0_#475569] sm:shadow-[4px_4px_0_#475569] scale-[1.01] z-10' 
                  : region.unlocked 
                    ? 'bg-white text-black border-black hover:bg-slate-100 shadow-[2px_2px_0_#000]' 
                    : 'bg-slate-200 border-slate-400 opacity-40 cursor-not-allowed text-slate-500'
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
                    <span className="flex items-center gap-0.5 text-emerald-600"><CheckCircle2 size={9} /> Concluído</span>
                  ) : (
                    <span>Disponível</span>
                  )) : (
                    <span className="flex items-center gap-0.5"><Lock size={9} /> Bloqueado</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Region Details & Stages Grid */}
      <div className="bg-white border-3 sm:border-4 border-black p-3 sm:p-5 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] space-y-3 sm:space-y-4">
        {/* Region Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-black pb-2.5 sm:pb-3 gap-2.5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 bg-white border-2 border-black text-xl sm:text-2xl flex items-center justify-center shrink-0">
              <GameIcon name={selectedRegion.icon} size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="font-pixel text-xs sm:text-base text-black font-black uppercase truncate">
                {selectedRegion.name}
              </h2>
              <p className="text-[11px] sm:text-xs font-mono text-slate-700 font-bold mt-0.5 line-clamp-1">
                {selectedRegion.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-black font-bold">
            <span className="text-[10px] sm:text-[11px]">Tema:</span>
            <div className="flex flex-wrap gap-1">
              {selectedRegion.conceptFocus.map((c) => (
                <span key={c} className="bg-black text-white px-1.5 py-0.5 border border-black text-[9px] sm:text-[10px] font-black">
                  {c === 'roots' ? 'Raízes' : c === 'delta' ? 'Δ' : c === 'vertex_x' ? 'Vértice' : 'Gráficos'}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stages Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {selectedRegion.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`p-3 sm:p-3.5 border-3 sm:border-4 flex flex-col justify-between space-y-2.5 sm:space-y-3 transition-all ${
                stage.isBoss 
                  ? 'bg-slate-50 border-black shadow-[3px_3px_0_#000]' 
                  : 'bg-white border-black shadow-[2px_2px_0_#000]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] sm:text-[9px] font-pixel font-bold text-slate-600">
                    FASE {idx + 1}
                  </span>
                  {stage.isBoss ? (
                    <span className="bg-black text-white text-[7px] sm:text-[8px] font-pixel px-1.5 py-0.5 flex items-center gap-1 font-black">
                      <Crown size={8} /> CHEFE
                    </span>
                  ) : stage.completed ? (
                    <span className="text-black text-[8px] sm:text-[9px] font-pixel font-bold flex items-center gap-1">
                      <CheckCircle2 size={9} /> Concluída
                    </span>
                  ) : null}
                </div>

                <h3 className="font-pixel text-[11px] sm:text-xs text-black font-black uppercase">
                  {stage.name}
                </h3>
                <p className="text-[11px] sm:text-xs font-mono text-slate-700 font-bold mt-1">
                  Inimigo: <strong className="text-black">{stage.enemyCreature.name}</strong> <span className="text-slate-500">(Nv. {stage.enemyCreature.level})</span>
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playConfirm();
                  onStartStage(stage);
                }}
                className="w-full bg-white hover:bg-black hover:text-white font-pixel text-[10px] sm:text-[11px] py-2.5 px-3 border-2 border-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0_#000] font-bold"
              >
                <Swords size={12} /> {stage.isBoss ? 'DESAFIAR CHEFE ▶' : 'BATALHAR ▶'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
