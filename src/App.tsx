import React, { useState, useEffect } from 'react';
import { Creature, Region, InventoryItem } from './types';
import { STARTER_CREATURES } from './data/creatures';
import { GAME_REGIONS } from './data/regions';
import { INITIAL_ITEMS } from './data/items';
import { StarterSelection } from './components/StarterSelection';
import { MapView } from './components/MapView';
import { BattleScene } from './components/BattleScene';
import { TrainingMode } from './components/TrainingMode';
import { ChallengeMode } from './components/ChallengeMode';
import { CodexGrimoire } from './components/CodexGrimoire';
import { EvolutionModal } from './components/EvolutionModal';
import { GoogleDriveSaveModal } from './components/GoogleDriveSaveModal';
import { GameSaveData } from './services/driveStorage';
import { sound } from './utils/audio';
import { Volume2, VolumeX, Music, BookOpen, Map, Target, Zap, Cloud, Coins } from 'lucide-react';

const STORAGE_KEY_PLAYER = 'batalha_funcoes_player_creature';

export default function App() {
  // Game States
  const [playerCreature, setPlayerCreature] = useState<Creature | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [regions, setRegions] = useState<Region[]>(GAME_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region>(GAME_REGIONS[0]);
  const [currentStage, setCurrentStage] = useState<Region['stages'][0] | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_ITEMS);
  const [coins, setCoins] = useState<number>(150);

  // Active View Screen
  const [view, setView] = useState<'starter' | 'map' | 'battle' | 'training' | 'challenge'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) return 'map';
    } catch {
      // ignore
    }
    return 'starter';
  });
  
  // Modals & Extras
  const [showCodex, setShowCodex] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [evolvingCreature, setEvolvingCreature] = useState<Creature | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmActive, setBgmActive] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(false);

  // Persist Player Creature
  useEffect(() => {
    if (playerCreature) {
      try {
        localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(playerCreature));
      } catch {
        // ignore storage errors
      }
    }
  }, [playerCreature]);

  // Handle Starter Selection
  const handleSelectStarter = (chosen: Creature) => {
    setPlayerCreature(chosen);
    setView('map');
  };

  // Restore Cloud Save from Google Drive
  const handleRestoreSave = (saveData: GameSaveData) => {
    if (saveData.playerCreature) {
      setPlayerCreature(saveData.playerCreature);
    }
    if (typeof saveData.userCoins === 'number') {
      setCoins(saveData.userCoins);
    }
    if (typeof saveData.unlockedRegionIndex === 'number') {
      setRegions(prev => prev.map((reg, idx) => ({
        ...reg,
        unlocked: idx <= saveData.unlockedRegionIndex,
        stages: reg.stages.map(st => ({
          ...st,
          completed: saveData.clearedLevels?.[st.id] ?? st.completed
        }))
      })));
    }
    setView('map');
  };

  // Start stage from Map
  const handleStartStage = (stage: Region['stages'][0]) => {
    setCurrentStage(stage);
    setView('battle');
  };

  // Victory Handler
  const handleVictory = (updatedPlayer: Creature, earnedXp: number, earnedCoins: number) => {
    setPlayerCreature(updatedPlayer);
    setCoins(prev => prev + earnedCoins);

    // Update Stage status
    if (currentStage) {
      setRegions(prev => prev.map(reg => {
        if (reg.id === selectedRegion.id) {
          const updatedStages = reg.stages.map(st => 
            st.id === currentStage.id ? { ...st, completed: true, stars: 3 } : st
          );
          const isBossStage = currentStage.isBoss;
          return {
            ...reg,
            bossDefeated: isBossStage ? true : reg.bossDefeated,
            stages: updatedStages
          };
        }
        return reg;
      }));

      // Unlock next region if boss was beaten
      if (currentStage.isBoss) {
        const currIdx = regions.findIndex(r => r.id === selectedRegion.id);
        if (currIdx < regions.length - 1) {
          setRegions(prev => prev.map((r, i) => i === currIdx + 1 ? { ...r, unlocked: true } : r));
        }
      }
    }

    setView('map');
  };

  // Defeat Handler
  const handleDefeat = () => {
    // Restore partial HP
    if (playerCreature) {
      setPlayerCreature({
        ...playerCreature,
        currentHp: Math.round(playerCreature.maxHp * 0.5),
        currentEnergy: playerCreature.maxEnergy,
        comboCount: 0,
        statusCondition: null
      });
    }
    setView('map');
  };

  // Sound toggles
  const handleToggleSound = () => {
    const next = sound.toggleSound();
    setSoundEnabled(next);
  };

  const handleToggleBgm = () => {
    const next = sound.toggleBgm();
    setBgmActive(next);
  };

  return (
    <div className={`min-h-screen bg-[#050811] text-slate-100 flex flex-col justify-between font-mono relative ${scanlines ? 'scanlines' : ''}`}>
      {/* 1. TOP HEADER & RETRO CONTROLS BAR */}
      <header className="bg-slate-900/90 border-b-2 border-slate-800 p-2 sm:p-3 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Logo & Title */}
          <div 
            onClick={() => {
              if (playerCreature) setView('map');
            }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center font-pixel text-slate-950 font-black text-sm shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              f(x)
            </div>
            <div>
              <h1 className="font-pixel text-xs sm:text-sm text-amber-300 group-hover:text-amber-200 transition-colors">
                Batalha das Funções
              </h1>
              <span className="text-[9px] text-cyan-400 font-pixel block sm:inline">
                RPG de Função do 2º Grau
              </span>
            </div>
          </div>

          {/* Navigation & Mode Badges */}
          {playerCreature && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  sound.playSelect();
                  setView('map');
                }}
                className={`font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                  view === 'map' ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Map size={12} /> <span className="hidden md:inline">Mapa</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setView('training');
                }}
                className={`font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                  view === 'training' ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Target size={12} /> <span className="hidden md:inline">Treino</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setView('challenge');
                }}
                className={`font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${
                  view === 'challenge' ? 'bg-purple-500 text-slate-950 border-purple-300 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <Zap size={12} /> <span className="hidden md:inline">Desafio</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setShowCodex(true);
                }}
                className="font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border border-amber-600/60 bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 flex items-center gap-1 transition-colors"
              >
                <BookOpen size={12} /> <span className="hidden md:inline">Grimório</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setShowDriveModal(true);
                }}
                className="font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border border-cyan-500/80 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 flex items-center gap-1 transition-all shadow-[0_0_10px_rgba(6,182,212,0.25)]"
                title="Sincronizar Savegame com o Google Drive"
              >
                <Cloud size={12} className="text-cyan-400" /> <span className="hidden sm:inline">Drive Nuvem</span>
              </button>
            </div>
          )}

          {/* User Currency & Audio Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {!playerCreature && (
              <button
                onClick={() => {
                  sound.playSelect();
                  setShowDriveModal(true);
                }}
                className="font-pixel text-[9px] sm:text-[10px] px-2.5 py-1.5 rounded-lg border border-cyan-500/80 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 flex items-center gap-1 transition-all"
              >
                <Cloud size={12} className="text-cyan-400" /> <span>Google Drive</span>
              </button>
            )}

            {playerCreature && (
              <div className="hidden sm:flex items-center gap-1 font-pixel text-[10px] text-amber-300 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                <Coins size={12} className="text-amber-400" /> {coins}
              </div>
            )}

            <button
              onClick={handleToggleSound}
              title="Alternar Efeitos Sonoros"
              className={`p-1.5 rounded-lg border transition-colors ${
                soundEnabled ? 'bg-slate-800 border-slate-700 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button
              onClick={handleToggleBgm}
              title="Alternar Música 8-bit"
              className={`p-1.5 rounded-lg border transition-colors ${
                bgmActive ? 'bg-cyan-950 border-cyan-500 text-cyan-300 animate-pulse' : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <Music size={15} />
            </button>

            <button
              onClick={() => setScanlines(!scanlines)}
              title="Alternar Linhas CRT Retro"
              className={`text-[8px] font-pixel px-1.5 py-1 rounded border ${
                scanlines ? 'bg-purple-950 border-purple-500 text-purple-300' : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              CRT
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN ACTIVE VIEW ROUTER */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 max-w-6xl w-full mx-auto">
        {view === 'starter' && (
          <StarterSelection
            onSelectStarter={handleSelectStarter}
            onOpenDriveCloud={() => setShowDriveModal(true)}
          />
        )}

        {view === 'map' && (
          <MapView
            regions={regions}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onStartStage={handleStartStage}
            onBackToMenu={() => setView('starter')}
          />
        )}

        {view === 'battle' && playerCreature && currentStage && (
          <BattleScene
            playerCreature={playerCreature}
            enemyCreature={currentStage.enemyCreature}
            items={items}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
            onOpenCodex={() => setShowCodex(true)}
            onTriggerEvolution={(creat) => setEvolvingCreature(creat)}
          />
        )}

        {view === 'training' && (
          <TrainingMode onBack={() => setView('map')} />
        )}

        {view === 'challenge' && (
          <ChallengeMode onBack={() => setView('map')} />
        )}
      </main>

      {/* 3. MODALS (Grimório das Fórmulas & Evolução & Google Drive Nuvem) */}
      {showCodex && (
        <CodexGrimoire onClose={() => setShowCodex(false)} />
      )}

      {showDriveModal && (
        <GoogleDriveSaveModal
          playerCreature={playerCreature}
          unlockedRegionIndex={regions.filter(r => r.unlocked).length - 1}
          clearedLevels={regions.reduce((acc, r) => {
            r.stages.forEach(st => {
              if (st.completed) acc[st.id] = true;
            });
            return acc;
          }, {} as Record<string, boolean>)}
          userCoins={coins}
          onRestoreSave={handleRestoreSave}
          onClose={() => setShowDriveModal(false)}
        />
      )}

      {evolvingCreature && (
        <EvolutionModal
          creature={evolvingCreature}
          onComplete={() => {
            const nextStage = Math.min(3, evolvingCreature.stage + 1) as 1 | 2 | 3;
            const nextForm = evolvingCreature.forms[nextStage - 1];
            const updated: Creature = {
              ...evolvingCreature,
              stage: nextStage,
              name: nextForm?.name || evolvingCreature.name,
              imageUrl: nextForm?.imageUrl || evolvingCreature.imageUrl,
              backImageUrl: nextForm?.backImageUrl || evolvingCreature.backImageUrl,
              maxHp: evolvingCreature.maxHp + 25,
              currentHp: evolvingCreature.maxHp + 25,
              attack: evolvingCreature.attack + 12,
              defense: evolvingCreature.defense + 8,
              statusCondition: null
            };
            setPlayerCreature(updated);
            setEvolvingCreature(null);
          }}
        />
      )}

      {/* 4. RETRO FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 p-2 text-center text-[10px] font-mono text-slate-500">
        Batalha das Funções — f(x) = ax² + bx + c • Sistema de Precisão & Turnos Matemáticos
      </footer>
    </div>
  );
}

