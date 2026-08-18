import React, { useState } from 'react';
import { Creature, MathChallenge, Skill, InventoryItem } from '../types';
import { ParabolaGraph } from './ParabolaGraph';
import { sound } from '../utils/audio';
import { GameIcon } from '../utils/iconMap';
import { BookOpen, ArrowLeft, Swords, ShieldCheck, Package, BarChart2, Delete } from 'lucide-react';

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

  const handleCycleHint = () => {
    sound.playSelect();
    setHintLevel(prev => (prev >= 3 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-white border-3 sm:border-4 border-black rounded-lg sm:rounded-xl p-2.5 sm:p-4 text-black shadow-[3px_3px_0_#000000] sm:shadow-[4px_4px_0_#000000] relative min-h-[180px] sm:min-h-[200px] flex flex-col justify-between">
      {/* Dialogue Header bar */}
      <div className="flex items-center justify-between border-b sm:border-b-2 border-black pb-1.5 sm:pb-2 mb-1.5 sm:mb-2 gap-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black shrink-0" />
          <span className="text-[9px] sm:text-xs font-pixel font-bold text-black uppercase tracking-tight truncate">
            {isDefenseTurn 
              ? <>DEFESA: BLOQUEIE!</>
              : activeMenu === 'challenge' 
                ? <>{selectedSkill?.name || 'ATAQUE'}</>
                : <>TURNO: {playerCreature.name.toUpperCase()}</>
            }
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              sound.playSelect();
              onOpenCodex();
            }}
            className="text-[8px] sm:text-[9px] font-pixel bg-white hover:bg-black hover:text-white text-black px-1.5 sm:px-2 py-1 border border-black sm:border-2 transition-colors cursor-pointer"
            title="Abrir o Grimório de Fórmulas"
          >
            <BookOpen size={10} className="inline mr-0.5" /> <span className="hidden min-[380px]:inline">Grimório</span>
          </button>
          {activeMenu !== 'main' && !isDefenseTurn && (
            <button
              onClick={() => {
                sound.playCancel();
                setActiveMenu('main');
                setHintLevel(0);
              }}
              className="text-[8px] sm:text-[9px] font-pixel bg-white hover:bg-black hover:text-white text-black px-1.5 sm:px-2 py-1 border border-black sm:border-2 transition-colors cursor-pointer"
            >
              <ArrowLeft size={10} className="inline mr-0.5" /> Voltar
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Main Battle Action Menu (Classic Pokémon GBA/Game Boy 2x2 Grid) */}
      {activeMenu === 'main' && !isDefenseTurn && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center flex-1">
          {/* Left: Dialogue / Story message */}
          <div className="md:col-span-6 bg-slate-50 p-2 sm:p-3 border-2 border-black flex flex-col justify-center">
            <p className="font-pixel text-[10px] sm:text-xs text-black leading-relaxed font-bold">
              {turnMessage || `O que ${playerCreature.name} deve fazer contra ${enemyCreature.name}?`}
            </p>
            <div className="mt-1.5 sm:mt-2 flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold text-black border-t border-dashed border-black pt-1">
              <span>ENERGIA: {playerCreature.currentEnergy}/{playerCreature.maxEnergy} MP</span>
              <span className="text-[10px] text-slate-600">ATQ:{playerCreature.attack} DEF:{playerCreature.defense}</span>
            </div>
          </div>

          {/* Right: 4-button Action Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('skills');
              }}
              className="gb-btn py-2.5 sm:py-3.5 px-2 text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1 sm:gap-1.5"
            >
              <Swords size={12} className="shrink-0" /> ATACAR
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onSelectAction('defend');
              }}
              className="gb-btn py-2.5 sm:py-3.5 px-2 text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1 sm:gap-1.5"
            >
              <ShieldCheck size={12} className="shrink-0" /> DEFENDER
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('items');
              }}
              className="gb-btn py-2.5 sm:py-3.5 px-2 text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1 sm:gap-1.5"
            >
              <Package size={12} className="shrink-0" /> MOCHILA
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('graph_inspect');
              }}
              className="gb-btn py-2.5 sm:py-3.5 px-2 text-[10px] sm:text-[11px] font-black flex items-center justify-center gap-1 sm:gap-1.5"
            >
              <BarChart2 size={12} className="shrink-0" /> GRÁFICO
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Skills / Math Attack Selection */}
      {activeMenu === 'skills' && !isDefenseTurn && (
        <div className="flex-1 space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between font-mono font-bold text-[11px] sm:text-xs">
            <span className="font-pixel text-[9px] sm:text-[10px] text-black">ESCOLHA UMA HABILIDADE:</span>
            <span>MP: {playerCreature.currentEnergy}/{playerCreature.maxEnergy}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
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
                  className={`p-2 sm:p-2.5 border-2 border-black text-left flex items-center justify-between transition-all ${
                    hasEnergy 
                      ? 'bg-white hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0_#000]' 
                      : 'bg-slate-200 border-slate-400 opacity-50 cursor-not-allowed text-slate-500'
                  }`}
                >
                  <div className="flex flex-col pr-1 min-w-0">
                    <span className="font-pixel text-[9px] sm:text-[10px] font-bold truncate">
                      {skill.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono line-clamp-1 mt-0.5">
                      {skill.description}
                    </span>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-1.5 font-mono font-bold text-xs">
                    <span className="text-[10px] sm:text-xs">{skill.energyCost} MP</span>
                    <span className="text-[8px] sm:text-[9px]">Pwr {skill.basePower}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: Inventory Items Selection */}
      {activeMenu === 'items' && !isDefenseTurn && (
        <div className="flex-1 space-y-1.5 sm:space-y-2">
          <p className="font-pixel text-[9px] sm:text-[10px] text-black">ITENS DA MOCHILA:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
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
                  className={`p-2 sm:p-2.5 border-2 border-black text-left flex items-center justify-between transition-all ${
                    canUse 
                      ? 'bg-white hover:bg-black hover:text-white cursor-pointer shadow-[2px_2px_0_#000]' 
                      : 'bg-slate-200 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <GameIcon name={item.icon} size={16} />
                    <div className="min-w-0">
                      <div className="font-pixel text-[9px] sm:text-[10px] font-bold truncate">{item.name}</div>
                      <div className="text-[9px] sm:text-[10px] font-mono line-clamp-1">{item.description}</div>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] sm:text-xs shrink-0 ml-1.5 font-black">
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
        <div className="flex-1 flex flex-col md:flex-row gap-2 sm:gap-3 items-center">
          <div className="w-full md:w-1/2 flex justify-center gb-sprite-mono">
            <ParabolaGraph 
              a={1} 
              b={-4} 
              c={3} 
              width={260} 
              height={130} 
              className="bg-white border-2 border-black w-full max-w-[280px]" 
            />
          </div>
          <div className="w-full md:w-1/2 text-left text-xs font-mono text-black space-y-1 bg-slate-50 p-2 sm:p-2.5 border-2 border-black">
            <p className="font-pixel text-[9px] sm:text-[10px] font-bold mb-1">LEITURA DA PARÁBOLA:</p>
            <p>• <strong>Raízes (x₁, x₂):</strong> onde f(x) = 0 cruza X.</p>
            <p>• <strong>Vértice V(Xᵥ, Yᵥ):</strong> ponto extremo.</p>
            <p>• <strong>Corte Y (0, c):</strong> interseção vertical.</p>
            <p>• <strong>Concavidade:</strong> a &gt; 0 (cima) | a &lt; 0 (baixo).</p>
          </div>
        </div>
      )}

      {/* VIEW 5: THE CORE MATH BATTLE CHALLENGE SCREEN */}
      {(activeMenu === 'challenge' || isDefenseTurn) && currentChallenge && (
        <div className="flex-1 flex flex-col justify-between space-y-2">
          {/* Formula & Question Banner */}
          <div className="bg-white border-2 border-black p-2 sm:p-3 space-y-1 sm:space-y-1.5 shadow-[2px_2px_0_#000]">
            <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-black pb-1">
              <span className="font-pixel text-[10px] sm:text-[11px] font-black text-black uppercase">
                {currentChallenge.title}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] sm:text-xs font-mono font-black text-white bg-black px-1.5 sm:px-2 py-0.5">
                  {currentChallenge.formula}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGraphModal(!showGraphModal)}
                  className="text-[8px] sm:text-[9px] font-pixel bg-white hover:bg-black hover:text-white text-black px-1.5 py-0.5 border border-black transition-colors cursor-pointer"
                >
                  {showGraphModal ? 'Ocultar' : 'Gráfico'}
                </button>
              </div>
            </div>

            <p className="text-[11px] sm:text-sm font-pixel text-black font-black leading-relaxed">
              {currentChallenge.question}
            </p>

            {/* Precision & Tolerance indicator */}
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono font-bold text-slate-700 pt-0.5">
              <span>Precisão 100% = Crítico</span>
              <span className="border border-black px-1">Tolerância: ±{currentChallenge.tolerance}</span>
            </div>
          </div>

          {/* Optional Inline Parabola Graph Viewer */}
          {showGraphModal && (
            <div className="flex justify-center p-1.5 bg-white border-2 border-black gb-sprite-mono">
              <ParabolaGraph 
                a={currentChallenge.a} 
                b={currentChallenge.b} 
                c={currentChallenge.c} 
                width={280} 
                height={120} 
                className="w-full max-w-[300px]"
              />
            </div>
          )}

          {/* Progressive Hint Button & Box */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCycleHint}
              className="text-[8px] sm:text-[9px] font-pixel px-2 py-1 border sm:border-2 border-black bg-white hover:bg-black hover:text-white text-black font-bold transition-all shrink-0 cursor-pointer shadow-[1px_1px_0_#000]"
            >
              💡 {hintLevel === 0 ? 'DICA' : `DICA (${hintLevel}/3)`}
            </button>

            {hintLevel > 0 ? (
              <div className="bg-slate-100 border border-black px-2 py-0.5 sm:py-1 text-[11px] sm:text-xs font-mono font-bold text-black flex-1 truncate">
                {hintLevel === 1 && `Fórmula: ${currentChallenge.hint1}`}
                {hintLevel === 2 && `Valores: ${currentChallenge.hint2}`}
                {hintLevel === 3 && `Resolução: ${currentChallenge.hint3}`}
              </div>
            ) : (
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-600 font-bold truncate">
                (Clique em Dica para ajuda passo a passo)
              </span>
            )}
          </div>

          {/* INPUT FORM */}
          {currentChallenge.inputType === 'choice' && currentChallenge.choices ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              {currentChallenge.choices.map((choice, idx) => (
                <button
                  key={`choice_${idx}`}
                  type="button"
                  onClick={() => handleChoiceClick(choice.value)}
                  className="bg-white hover:bg-black hover:text-white border-2 border-black text-black font-mono font-black text-xs sm:text-sm py-2 sm:py-2.5 px-3 text-left shadow-[2px_2px_0_#000] active:translate-y-0.5 transition-all flex items-center justify-between cursor-pointer"
                >
                  <span>{choice.label}</span>
                  <span className="font-pixel text-[9px] sm:text-[10px]">▶</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {/* Form Input + Main Action Button */}
              <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 items-stretch">
                <div className="flex-1 flex gap-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Digite sua resposta..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-white border-2 sm:border-3 border-black px-2.5 py-1.5 sm:py-2 text-black font-mono font-bold text-sm sm:text-base focus:outline-none shadow-inner"
                  />

                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleNumClick('-')}
                      title="Alternar sinal"
                      className="bg-white hover:bg-black hover:text-white text-black font-pixel text-xs px-2 border border-black font-bold cursor-pointer"
                    >
                      ±
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNumClick('BACK')}
                      title="Apagar"
                      className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] px-2 border border-black font-bold cursor-pointer"
                    >
                      ⌫
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNumClick('CLEAR')}
                      title="Limpar"
                      className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] px-2 border border-black font-bold cursor-pointer"
                    >
                      C
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="gb-btn-primary text-[10px] sm:text-xs py-2 sm:py-2.5 px-4 shrink-0"
                >
                  {isDefenseTurn ? 'DEFENDER ▶' : 'CONFIRMAR ▶'}
                </button>
              </form>

              {/* Mobile Quick On-Screen Number Keypad for Touch Convenience */}
              <div className="grid grid-cols-6 sm:hidden gap-1 pt-0.5 font-mono font-black text-xs">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '-'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleNumClick(digit)}
                    className="bg-slate-100 active:bg-black active:text-white border border-black py-1.5 text-center cursor-pointer font-bold text-xs"
                  >
                    {digit}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

