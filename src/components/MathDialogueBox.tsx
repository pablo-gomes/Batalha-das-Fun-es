import React, { useState } from 'react';
import { Creature, MathChallenge, Skill, InventoryItem } from '../types';
import { ParabolaGraph } from './ParabolaGraph';
import { sound } from '../utils/audio';

interface MathDialogueBoxProps {
  playerCreature: Creature;
  enemyCreature: Creature;
  currentChallenge: MathChallenge | null;
  isDefenseTurn: boolean;
  selectedSkill: Skill | null;
  items: InventoryItem[];
  turnMessage: string;
  onSelectAction: (action: 'attack_menu' | 'defend' | 'skills' | 'items' | 'analyze' | 'switch') => void;
  onSelectSkill: (skill: Skill) => void;
  onUseItem: (item: InventoryItem) => void;
  onSubmitAnswer: (answer: string | number) => void;
  onOpenCodex: () => void;
  activeMenu: 'main' | 'skills' | 'items' | 'challenge' | 'graph_inspect';
  setActiveMenu: (menu: 'main' | 'skills' | 'items' | 'challenge' | 'graph_inspect') => void;
}

export const MathDialogueBox: React.FC<MathDialogueBoxProps> = ({
  playerCreature,
  enemyCreature,
  currentChallenge,
  isDefenseTurn,
  selectedSkill,
  items,
  turnMessage,
  onSelectAction,
  onSelectSkill,
  onUseItem,
  onSubmitAnswer,
  onOpenCodex,
  activeMenu,
  setActiveMenu
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [showGraphModal, setShowGraphModal] = useState<boolean>(false);

  const handleNumClick = (val: string) => {
    sound.playSelect();
    if (val === 'CLEAR') {
      setInputValue('');
    } else if (val === 'BACK') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (val === '-') {
      setInputValue((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
    } else {
      setInputValue((prev) => prev + val);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sound.playConfirm();
    onSubmitAnswer(inputValue.trim());
    setInputValue('');
    setHintLevel(0);
  };

  const handleChoiceClick = (choiceVal: string | number) => {
    sound.playConfirm();
    onSubmitAnswer(choiceVal);
    setHintLevel(0);
  };

  return (
    <div className="w-full bg-[#090d16] border-4 border-[#38bdf8] rounded-xl p-3 sm:p-4 text-slate-100 shadow-[0_8px_0_#020617,0_0_24px_rgba(56,189,248,0.3)] relative min-h-[210px] flex flex-col justify-between">
      {/* Dialogue Header bar */}
      <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-[10px] sm:text-xs font-pixel text-cyan-300 uppercase tracking-wider">
            {isDefenseTurn 
              ? '🛡️ FASE DE DEFESA: BLOQUEIE O GOLPE!' 
              : activeMenu === 'challenge' 
                ? `⚡ DESAFIO MATEMÁTICO: ${selectedSkill?.name || 'Ataque'}`
                : `🎮 TURNO DE ${playerCreature.name.toUpperCase()}`
            }
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playSelect();
              onOpenCodex();
            }}
            className="text-[9px] font-pixel bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-1 rounded border border-amber-500/40 flex items-center gap-1 transition-colors"
          >
            📖 Grimório
          </button>
          {activeMenu !== 'main' && !isDefenseTurn && (
            <button
              onClick={() => {
                sound.playCancel();
                setActiveMenu('main');
                setHintLevel(0);
              }}
              className="text-[9px] font-pixel bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600"
            >
              ⬅ Voltar
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Main Battle Action Menu */}
      {activeMenu === 'main' && !isDefenseTurn && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center flex-1">
          {/* Left: Dialogue / Story message */}
          <div className="md:col-span-5 bg-slate-900/80 p-3 rounded-lg border-2 border-slate-700 flex flex-col justify-center">
            <p className="font-pixel text-[11px] sm:text-xs text-slate-200 leading-relaxed">
              {turnMessage || `O que ${playerCreature.name} deve fazer contra ${enemyCreature.name}?`}
            </p>
            <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-cyan-400">
              <span>Energia: {playerCreature.currentEnergy}/{playerCreature.maxEnergy} MP</span>
            </div>
          </div>

          {/* Right: GBA 4-button Action Grid */}
          <div className="md:col-span-7 grid grid-cols-2 gap-2 sm:gap-2.5">
            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('skills');
              }}
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-pixel text-[11px] sm:text-xs py-3 px-3 rounded-lg border-2 border-red-300 shadow-[2px_2px_0_#450a0a] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
            >
              ⚔️ ATACAR
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onSelectAction('defend');
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-pixel text-[11px] sm:text-xs py-3 px-3 rounded-lg border-2 border-blue-300 shadow-[2px_2px_0_#172554] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
            >
              🛡️ DEFENDER
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('items');
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-pixel text-[11px] sm:text-xs py-3 px-3 rounded-lg border-2 border-emerald-300 shadow-[2px_2px_0_#064e3b] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
            >
              🎒 ITENS
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('graph_inspect');
              }}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-700 hover:from-purple-500 hover:to-fuchsia-600 text-white font-pixel text-[11px] sm:text-xs py-3 px-3 rounded-lg border-2 border-purple-300 shadow-[2px_2px_0_#3b0764] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
            >
              📈 GRÁFICO
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Skills / Math Attack Selection */}
      {activeMenu === 'skills' && !isDefenseTurn && (
        <div className="flex-1">
          <p className="text-[10px] font-pixel text-slate-400 mb-2">Escolha uma habilidade matemática:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {playerCreature.skills.map((skill) => {
              const hasEnergy = playerCreature.currentEnergy >= skill.energyCost;
              return (
                <button
                  key={skill.id}
                  disabled={!hasEnergy}
                  onClick={() => {
                    sound.playSelect();
                    onSelectSkill(skill);
                  }}
                  className={`p-2.5 rounded-lg border-2 text-left flex items-center justify-between transition-all ${
                    hasEnergy 
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-cyan-400 active:scale-[0.98]' 
                      : 'bg-slate-950/60 border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{skill.icon}</span>
                      <span className="font-pixel text-[10px] sm:text-[11px] text-white">
                        {skill.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                      {skill.description}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      {skill.energyCost} MP
                    </span>
                    <span className="text-[8px] font-mono text-amber-400">
                      Pwr: {skill.basePower}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Inventory Items Selection */}
      {activeMenu === 'items' && !isDefenseTurn && (
        <div className="flex-1">
          <p className="text-[10px] font-pixel text-slate-400 mb-2">Mochila de Itens Matemáticos:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {items.map((item) => {
              const canUse = item.amount > 0;
              return (
                <button
                  key={item.id}
                  disabled={!canUse}
                  onClick={() => {
                    sound.playConfirm();
                    onUseItem(item);
                  }}
                  className={`p-2 rounded-lg border-2 text-left flex items-center justify-between ${
                    canUse 
                      ? 'bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-emerald-400' 
                      : 'bg-slate-950 border-slate-800 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-pixel text-[10px] text-white">{item.name}</div>
                      <div className="text-[9px] font-mono text-slate-400">{item.description}</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[11px] text-emerald-400 shrink-0 ml-2">
                    x{item.amount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: Graph Inspection */}
      {activeMenu === 'graph_inspect' && !isDefenseTurn && (
        <div className="flex-1 flex flex-col md:flex-row gap-3 items-center">
          <div className="w-full md:w-1/2">
            <ParabolaGraph 
              a={1} 
              b={-4} 
              c={3} 
              width={260} 
              height={140} 
              className="bg-slate-900 border-slate-700" 
            />
          </div>
          <div className="w-full md:w-1/2 text-left text-[10px] font-mono text-slate-300 space-y-1 bg-slate-900 p-2.5 rounded border border-slate-800">
            <p className="font-pixel text-[10px] text-purple-300 mb-1">🔍 Como ler a Parábola:</p>
            <p>• <strong>Raízes (x₁, x₂):</strong> onde f(x) = 0 toca o eixo X horizontal.</p>
            <p>• <strong>Vértice V(Xᵥ, Yᵥ):</strong> ponto de pico máx ou fundo mín.</p>
            <p>• <strong>Corte Y (0, c):</strong> onde cruza a linha vertical Y.</p>
            <p>• <strong>Concavidade:</strong> a &gt; 0 (∪ sorri) / a &lt; 0 (∩ triste).</p>
          </div>
        </div>
      )}

      {/* VIEW 5: THE CORE MATH BATTLE CHALLENGE SCREEN (Math question in place of dialogue!) */}
      {(activeMenu === 'challenge' || isDefenseTurn) && currentChallenge && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Formula & Question Banner */}
          <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-lg p-2.5 mb-2 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="font-pixel text-[11px] text-amber-300">
                {currentChallenge.title}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono font-black text-cyan-300 bg-slate-950 px-2 py-0.5 rounded border border-cyan-700/50">
                  {currentChallenge.formula}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGraphModal(!showGraphModal)}
                  className="text-[9px] font-pixel bg-indigo-900 hover:bg-indigo-800 text-indigo-200 px-2 py-1 rounded border border-indigo-500 transition-colors"
                >
                  {showGraphModal ? 'Ocultar Gráfico' : '📊 Ver Gráfico'}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-pixel text-slate-100 mt-1 leading-snug">
              {currentChallenge.question}
            </p>

            {/* Precision hint */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1">
              <span>🎯 Sistema de Precisão: 100% Exato = Golpe Crítico Máximo!</span>
              <span className="text-amber-400">Tolerância: ±{currentChallenge.tolerance}</span>
            </div>
          </div>

          {/* Optional Inline Parabola Graph Viewer */}
          {showGraphModal && (
            <div className="mb-2">
              <ParabolaGraph 
                a={currentChallenge.a} 
                b={currentChallenge.b} 
                c={currentChallenge.c} 
                width={320} 
                height={150} 
              />
            </div>
          )}

          {/* Hints Accordion (Dica 1, 2, 3) */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setHintLevel(1);
              }}
              className={`text-[9px] font-pixel px-2 py-1 rounded border ${
                hintLevel >= 1 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              💡 Dica 1: Fórmula
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setHintLevel(2);
              }}
              className={`text-[9px] font-pixel px-2 py-1 rounded border ${
                hintLevel >= 2 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              💡 Dica 2: Valores
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSelect();
                setHintLevel(3);
              }}
              className={`text-[9px] font-pixel px-2 py-1 rounded border ${
                hintLevel >= 3 ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
            >
              💡 Dica 3: Resolução
            </button>

            {hintLevel > 0 && (
              <span className="text-[10px] font-mono text-amber-200 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60 flex-1 truncate">
                {hintLevel === 1 && currentChallenge.hint1}
                {hintLevel === 2 && currentChallenge.hint2}
                {hintLevel === 3 && currentChallenge.hint3}
              </span>
            )}
          </div>

          {/* INPUT FORM: Either Multiple Choice or Numeric Input + Keypad */}
          {currentChallenge.inputType === 'choice' && currentChallenge.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentChallenge.choices.map((choice, idx) => (
                <button
                  key={`choice_${idx}`}
                  type="button"
                  onClick={() => handleChoiceClick(choice.value)}
                  className="bg-slate-900 hover:bg-cyan-950 border-2 border-slate-700 hover:border-cyan-400 text-white font-mono font-bold text-xs sm:text-sm py-2.5 px-3 rounded-lg text-left shadow-[2px_2px_0_#0f172a] active:translate-y-0.5 transition-all flex items-center justify-between"
                >
                  <span>{choice.label}</span>
                  <span className="text-[10px] font-pixel text-cyan-400">▶</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-2 items-stretch">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  autoFocus
                  placeholder="Digite sua resposta matemática..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-slate-950 border-2 border-cyan-400 rounded-lg px-3 py-2 text-white font-mono text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-cyan-300 shadow-inner"
                />

                {/* Quick keypad toggles on mobile */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleNumClick('-')}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 font-pixel text-xs px-2.5 rounded border border-slate-600"
                  >
                    ±
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNumClick('CLEAR')}
                    className="bg-slate-800 hover:bg-slate-700 text-rose-300 font-pixel text-[9px] px-2 rounded border border-slate-600"
                  >
                    C
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`font-pixel text-[11px] sm:text-xs py-2.5 px-5 rounded-lg border-2 shadow-[2px_2px_0_#020617] active:translate-y-0.5 transition-all shrink-0 ${
                  isDefenseTurn
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-cyan-300'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-black border-amber-300'
                }`}
              >
                {isDefenseTurn ? '🛡️ ERGUER DEFESA!' : '⚡ LANÇAR ATAQUE!'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
