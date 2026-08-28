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
import { QuickNotepad } from './components/QuickNotepad';
import { MiniCalculator } from './components/MiniCalculator';
import { ShopView } from './components/ShopView';
import { GameSaveData } from './services/driveStorage';
import { sound } from './utils/audio';
import { preloadSprites } from './utils/spritePreloader';
import { Volume2, VolumeX, Music, BookOpen, Map, Target, Zap, Cloud, StickyNote, Calculator, X, ShoppingBag } from 'lucide-react';

const STORAGE_KEY_PLAYER = 'batalha_funcoes_player_creature';
const STORAGE_KEY_COINS = 'batalha_funcoes_player_coins';
const STORAGE_KEY_ITEMS = 'batalha_funcoes_player_items';

export default function App() {
  // Game States
  const [playerCreature, setPlayerCreature] = useState<Creature | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) {
        const parsed = JSON.parse(saved);
        const starterTemplate = STARTER_CREATURES.find(s => s.id === parsed.id);
        if (starterTemplate) {
          const currentStage = parsed.stage || 1;
          const currentForm = starterTemplate.forms[currentStage - 1] || starterTemplate.forms[0];
          return {
            ...starterTemplate,
            ...parsed,
            name: currentForm ? currentForm.name : parsed.name,
            imageUrl: currentForm ? currentForm.imageUrl : (parsed.imageUrl || starterTemplate.imageUrl),
            backImageUrl: currentForm ? currentForm.backImageUrl : (parsed.backImageUrl || starterTemplate.backImageUrl),
            forms: starterTemplate.forms,
            skills: starterTemplate.skills,
            spriteColor: starterTemplate.spriteColor,
            backSpriteColor: starterTemplate.backSpriteColor
          };
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });


  const [regions, setRegions] = useState<Region[]>(GAME_REGIONS);
  const [selectedRegion, setSelectedRegion] = useState<Region>(GAME_REGIONS[0]);
  const [currentStage, setCurrentStage] = useState<Region['stages'][0] | null>(null);
  
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_ITEMS;
  });

  const [coins, setCoins] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COINS);
      if (saved !== null) return Number(saved);
    } catch {
      // ignore
    }
    return 150;
  });

  // Active View Screen
  const [view, setView] = useState<'starter' | 'map' | 'battle' | 'training' | 'challenge' | 'shop'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) return 'map';
    } catch {
      // ignore
    }
    return 'starter';
  });
  
  // Modals, Tools & Extras
  const [showCodex, setShowCodex] = useState<boolean>(false);
  const [showDriveModal, setShowDriveModal] = useState<boolean>(false);
  const [showNotepad, setShowNotepad] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [evolvingCreature, setEvolvingCreature] = useState<Creature | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [bgmActive, setBgmActive] = useState<boolean>(false);
  const [scanlines, setScanlines] = useState<boolean>(false);

  // Preload all starter and region creature sprites immediately on load
  useEffect(() => {
    const urlsToPreload: string[] = [];

    // Starters
    STARTER_CREATURES.forEach(st => {
      if (st.imageUrl) urlsToPreload.push(st.imageUrl);
      if (st.backImageUrl) urlsToPreload.push(st.backImageUrl);
      st.forms.forEach(f => {
        if (f.imageUrl) urlsToPreload.push(f.imageUrl);
        if (f.backImageUrl) urlsToPreload.push(f.backImageUrl);
      });
    });

    // Region Enemies
    GAME_REGIONS.forEach(reg => {
      reg.stages.forEach(stage => {
        if (stage.enemyCreature.imageUrl) urlsToPreload.push(stage.enemyCreature.imageUrl);
        if (stage.enemyCreature.backImageUrl) urlsToPreload.push(stage.enemyCreature.backImageUrl);
      });
    });

    preloadSprites(urlsToPreload);
  }, []);

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

  // Persist Coins
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COINS, coins.toString());
    } catch {
      // ignore
    }
  }, [coins]);

  // Persist Items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Buy Item Handler
  const handleBuyItem = (itemId: string, quantity: number, totalCost: number) => {
    setCoins(prev => Math.max(0, prev - totalCost));
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, amount: item.amount + quantity } : item
    ));
  };

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
  const handleVictory = (updatedPlayer: Creature, earnedXp: number, earnedCoins: number, updatedItems?: InventoryItem[]) => {
    setPlayerCreature(updatedPlayer);
    setCoins(prev => prev + earnedCoins);
    if (updatedItems) {
      setItems(updatedItems);
    }

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
  const handleDefeat = (updatedItems?: InventoryItem[]) => {
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
    if (updatedItems) {
      setItems(updatedItems);
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
    <div className={`min-h-screen bg-transparent text-black flex flex-col justify-between font-mono relative pb-16 sm:pb-0 ${scanlines ? 'scanlines' : ''}`}>
      {/* 1. TOP HEADER & GBA RETRO NAVIGATION */}
      <header className="bg-[#fbfdfa] border-b-3 sm:border-b-4 border-[#1b3b2b] px-2 sm:px-4 py-2 sticky top-0 z-40 shadow-[0_3px_0_#122b1e]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          {/* Logo & Title */}
          <div 
            onClick={() => {
              if (playerCreature) setView('map');
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0 min-w-0"
          >
            
            <div className="min-w-0">
              <h1 className="font-pixel text-[10px] min-[400px]:text-xs sm:text-sm text-[#143021] font-black truncate drop-shadow-xs">
                BATALHA DAS FUNÇÕES
              </h1>
              <span className="text-[8px] min-[400px]:text-[9px] sm:text-[10px] text-emerald-800 font-mono font-bold block truncate">
                RPG da Função Quadrática
              </span>
            </div>
          </div>

          {/* Center: Main Navigation Tabs (Visible on sm/md/lg desktop) */}
          {playerCreature && (
            <nav className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={() => {
                  sound.playSelect();
                  setView('map');
                }}
                className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg border-2 border-[#1b3b2b] transition-all cursor-pointer ${
                  view === 'map' 
                    ? 'gba-btn-primary shadow-[2px_2px_0_#022c22]' 
                    : 'bg-white text-[#193325] hover:bg-[#edf7f1]'
                }`}
                title="Ir para o Mapa de Fases"
              >
                <Map size={13} className="inline mr-1 text-emerald-700" /> <span className="hidden min-[480px]:inline">MAPA</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setView('training');
                }}
                className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg border-2 border-[#1b3b2b] transition-all cursor-pointer ${
                  view === 'training' 
                    ? 'gba-btn-blue shadow-[2px_2px_0_#082f49]' 
                    : 'bg-white text-[#193325] hover:bg-[#edf7f1]'
                }`}
                title="Praticar exercícios por tema"
              >
                <Target size={13} className="inline mr-1 text-sky-600" /> <span className="hidden min-[480px]:inline">TREINO</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setView('challenge');
                }}
                className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg border-2 border-[#1b3b2b] transition-all cursor-pointer ${
                  view === 'challenge' 
                    ? 'gba-btn-yellow shadow-[2px_2px_0_#451a03]' 
                    : 'bg-white text-[#193325] hover:bg-[#edf7f1]'
                }`}
                title="Desafio de 60 segundos com combos"
              >
                <Zap size={13} className="inline mr-1 text-amber-600" /> <span className="hidden min-[480px]:inline">DESAFIO</span>
              </button>

              <button
                onClick={() => {
                  sound.playSelect();
                  setView('shop');
                }}
                className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1.5 rounded-lg border-2 border-[#1b3b2b] transition-all cursor-pointer ${
                  view === 'shop' 
                    ? 'gba-btn-red shadow-[2px_2px_0_#450a0a]' 
                    : 'bg-white text-[#193325] hover:bg-[#edf7f1]'
                }`}
                title="Comprar itens e poções na Loja"
              >
                <ShoppingBag size={13} className="inline mr-1 text-rose-500" /> <span className="hidden min-[480px]:inline">LOJA</span>
              </button>
            </nav>
          )}

          {/* Right: Quick Tools & Settings */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {playerCreature && (
              <>
                {/* Notepad Toggle Button */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    setShowNotepad(!showNotepad);
                  }}
                  className={`font-pixel text-[9px] sm:text-[10px] px-2 py-1.5 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer ${
                    showNotepad ? 'bg-[#1b3b2b] text-white' : 'bg-white text-[#1b3b2b] hover:bg-[#edf7f1]'
                  }`}
                  title="Exibir/Ocultar Bloco de Notas"
                >
                  <StickyNote size={13} className="inline xl:mr-1 text-amber-600" /> <span className="hidden xl:inline">NOTAS</span>
                </button>

                {/* Calculator Toggle Button */}
                <button
                  onClick={() => {
                    sound.playSelect();
                    setShowCalculator(!showCalculator);
                  }}
                  className={`font-pixel text-[9px] sm:text-[10px] px-2 py-1.5 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer ${
                    showCalculator ? 'bg-[#1b3b2b] text-white' : 'bg-white text-[#1b3b2b] hover:bg-[#edf7f1]'
                  }`}
                  title="Exibir/Ocultar Mini Calculadora"
                >
                  <Calculator size={13} className="inline xl:mr-1 text-sky-600" /> <span className="hidden xl:inline">CALC</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSelect();
                    setShowCodex(true);
                  }}
                  className="font-pixel text-[9px] sm:text-[10px] px-2 py-1.5 border-2 border-[#1b3b2b] rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors cursor-pointer shadow-xs"
                  title="Grimório de Fórmulas e Teoria"
                >
                  <BookOpen size={13} className="inline md:mr-1" /> <span className="hidden md:inline">GRIMÓRIO</span>
                </button>

                <div className="flex items-center gap-1 font-mono text-[10px] sm:text-xs font-black text-amber-950 bg-gradient-to-r from-amber-200 to-yellow-300 px-2 py-1 border-2 border-amber-700 rounded-lg shadow-xs">
                  <span>🪙 {coins}</span>
                </div>
              </>
            )}

            {!playerCreature && (
              <button
                onClick={() => {
                  sound.playSelect();
                  setShowDriveModal(true);
                }}
                className="font-pixel text-[9px] sm:text-[10px] px-3 py-1.5 border-2 border-[#1b3b2b] rounded-lg bg-[#1b3b2b] text-white hover:bg-[#2d5a42] flex items-center gap-1.5 transition-all cursor-pointer font-bold shadow-xs"
              >
                <Cloud size={12} className="text-sky-300" /> <span>NUVEM</span>
              </button>
            )}

            {/* Quick Audio & CRT Toggles */}
            <div className="flex items-center bg-white p-0.5 border-2 border-[#1b3b2b] rounded-lg gap-0.5 shadow-xs">
              <button
                onClick={handleToggleSound}
                title={soundEnabled ? "Desativar Sons" : "Ativar Sons"}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  soundEnabled ? 'text-emerald-700 font-bold' : 'text-slate-400'
                }`}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>

              <button
                onClick={handleToggleBgm}
                title={bgmActive ? "Desativar Música BGM" : "Ativar Música BGM"}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  bgmActive ? 'bg-[#1b3b2b] text-emerald-300' : 'text-slate-400'
                }`}
              >
                <Music size={13} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. WORKSPACE: DESKTOP 3-COLUMNS / MOBILE CENTERED SCREEN */}
      <div className="w-full max-w-[1440px] mx-auto flex-1 flex flex-col lg:flex-row items-start justify-center gap-2 sm:gap-3 p-1.5 sm:p-3">
        {/* LATERAL ESQUERDA: BLOCO DE NOTAS (Desktop view) */}
        {showNotepad && (
          <aside className="hidden lg:flex w-[240px] xl:w-[260px] shrink-0 sticky top-14 z-20 justify-center">
            <QuickNotepad className="w-full" onClose={() => setShowNotepad(false)} />
          </aside>
        )}

        {/* CENTRO: JOGO PRINCIPAL */}
        <main className="flex-1 w-full max-w-4xl flex items-center justify-center">
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
            <ChallengeMode 
              onBack={() => setView('map')} 
              onEarnCoins={(earned) => setCoins(prev => prev + earned)}
            />
          )}

          {view === 'shop' && (
            <ShopView
              coins={coins}
              items={items}
              onBuyItem={handleBuyItem}
              onBack={() => setView('map')}
            />
          )}
        </main>

        {/* LATERAL DIREITA: MINI CALCULADORA (Desktop view) */}
        {showCalculator && (
          <aside className="hidden lg:flex w-[240px] xl:w-[260px] shrink-0 sticky top-14 z-20 justify-center">
            <MiniCalculator className="w-full" onClose={() => setShowCalculator(false)} />
          </aside>
        )}
      </div>

      {/* MOBILE OVERLAY DRAWERS / MODALS FOR NOTEPAD & CALCULATOR (when opened on screens < lg) */}
      {showNotepad && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-xs animate-in fade-in zoom-in-95">
            <QuickNotepad className="w-full shadow-2xl" onClose={() => setShowNotepad(false)} />
          </div>
        </div>
      )}

      {showCalculator && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-xs animate-in fade-in zoom-in-95">
            <MiniCalculator className="w-full shadow-2xl" onClose={() => setShowCalculator(false)} />
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR FOR TOUCH DEVICES */}
      {playerCreature && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fbfdfa] border-t-3 border-[#1b3b2b] px-2 py-1.5 flex items-center justify-around shadow-[0_-3px_0_#122b1e] safe-bottom">
          <button
            onClick={() => {
              sound.playSelect();
              setView('map');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg font-pixel text-[8px] cursor-pointer transition-all ${
              view === 'map' ? 'bg-emerald-600 text-white font-black shadow-xs' : 'text-[#193325] hover:bg-[#edf7f1]'
            }`}
          >
            <Map size={15} />
            <span>MAPA</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setView('training');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg font-pixel text-[8px] cursor-pointer transition-all ${
              view === 'training' ? 'bg-sky-600 text-white font-black shadow-xs' : 'text-[#193325] hover:bg-[#edf7f1]'
            }`}
          >
            <Target size={15} />
            <span>TREINO</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setView('challenge');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg font-pixel text-[8px] cursor-pointer transition-all ${
              view === 'challenge' ? 'bg-amber-500 text-amber-950 font-black shadow-xs' : 'text-[#193325] hover:bg-[#edf7f1]'
            }`}
          >
            <Zap size={15} />
            <span>DESAFIO</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setView('shop');
            }}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg font-pixel text-[8px] cursor-pointer transition-all ${
              view === 'shop' ? 'bg-rose-600 text-white font-black shadow-xs' : 'text-[#193325] hover:bg-[#edf7f1]'
            }`}
          >
            <ShoppingBag size={15} />
            <span>LOJA</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setShowNotepad(true);
            }}
            className="flex flex-col items-center gap-0.5 py-1 px-2 font-pixel text-[8px] cursor-pointer text-slate-600 hover:text-[#1b3b2b]"
          >
            <StickyNote size={15} />
            <span>NOTAS</span>
          </button>

          <button
            onClick={() => {
              sound.playSelect();
              setShowCalculator(true);
            }}
            className="flex flex-col items-center gap-0.5 py-1 px-2 font-pixel text-[8px] cursor-pointer text-slate-600 hover:text-[#1b3b2b]"
          >
            <Calculator size={15} />
            <span>CALC</span>
          </button>
        </nav>
      )}

      {/* 4. MODALS (Grimório das Fórmulas & Evolução & Google Drive Nuvem) */}
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

      {/* 5. RETRO FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 p-2 text-center text-[9px] sm:text-[10px] font-mono text-slate-500">
        Batalha das Funções — f(x) = ax² + bx + c • RPG Matemático Responsivo
      </footer>
    </div>
  );
}
