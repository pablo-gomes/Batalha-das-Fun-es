import React, { useState } from 'react';
import { Creature, MathChallenge, Skill, InventoryItem } from '../types';
import { ParabolaGraph } from './ParabolaGraph';
import { sound } from '../utils/audio';
import { GameIcon } from '../utils/iconMap';
import { BookOpen, ArrowLeft, Swords, ShieldCheck, Package, BarChart2 } from 'lucide-react';

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
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);

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
    if (isDefenseTurn) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onSubmitAnswer(inputValue.trim());
    setInputValue('');
    setHintLevel(0);
  };

  const handleChoiceClick = (choiceVal: string | number) => {
    sound.playConfirm();
    if (isDefenseTurn) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    onSubmitAnswer(choiceVal);
    setHintLevel(0);
  };

  const handleCycleHint = () => {
    sound.playSelect();
    setHintLevel(prev => (prev >= 3 ? 0 : prev + 1));
  };

  return (
    <div className="w-full bg-white border-3 sm:border-4 border-[#1b3b2b] rounded-xl p-2.5 sm:p-4 text-[#163323] shadow-[3px_3px_0_#122b1e] relative min-h-[160px] sm:min-h-[180px] flex flex-col justify-between">
      {/* Dialogue Header bar */}
      <div className="flex items-center justify-between border-b border-[#2d5a42]/20 pb-1.5 mb-1.5 gap-1.5">
        <span className="text-[9px] sm:text-xs font-pixel font-bold text-[#163323] uppercase truncate">
          {isDefenseTurn 
            ? <span className="text-rose-600"> BLOQUEIE O ATAQUE!</span>
            : activeMenu === 'challenge' 
              ? <span className="text-sky-700"> {selectedSkill?.name || 'ATAQUE'}</span>
              : <span>O que fará {playerCreature.name.toUpperCase()}?</span>
          }
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              sound.playSelect();
              onOpenCodex();
            }}
            className="text-[8px] sm:text-[9px] font-pixel bg-teal-600 text-white px-2 py-1 rounded cursor-pointer hover:bg-teal-700 shadow-xs"
            title="Abrir o Grimório"
          >
            <BookOpen size={10} className="inline mr-1" /> <span className="hidden min-[380px]:inline">Grimório</span>
          </button>
          {activeMenu !== 'main' && !isDefenseTurn && (
            <button
              onClick={() => {
                sound.playCancel();
                setActiveMenu('main');
                setHintLevel(0);
              }}
              className="text-[8px] sm:text-[9px] font-pixel bg-slate-100 hover:bg-slate-200 text-[#1b3b2b] px-2 py-1 rounded border border-[#1b3b2b]/40 cursor-pointer"
            >
              <ArrowLeft size={10} className="inline mr-0.5" /> Voltar
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Main Battle Action Menu (Classic 4-button Clean Grid) */}
      {activeMenu === 'main' && !isDefenseTurn && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center flex-1">
          {/* Left: Dialogue message */}
          <div className="md:col-span-6 bg-[#f7faf8] p-2.5 sm:p-3 rounded-lg border border-[#1b3b2b]/30 flex flex-col justify-center">
            <p className="font-pixel text-[10px] sm:text-xs text-[#193325] leading-relaxed">
              {turnMessage || `Escolha uma ação para ${playerCreature.name}.`}
            </p>
          </div>

          {/* Right: 4-button Action Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('skills');
              }}
              className="gba-btn-red py-2.5 sm:py-3 px-2 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1.5 rounded-lg"
            >
              <Swords size={13} /> ATACAR
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                onSelectAction('defend');
              }}
              className="gba-btn-yellow py-2.5 sm:py-3 px-2 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1.5 rounded-lg"
            >
              <ShieldCheck size={13} /> DEFENDER
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('items');
              }}
              className="gba-btn-green py-2.5 sm:py-3 px-2 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1.5 rounded-lg"
            >
              <Package size={13} /> MOCHILA
            </button>

            <button
              onClick={() => {
                sound.playSelect();
                setActiveMenu('graph_inspect');
              }}
              className="gba-btn-blue py-2.5 sm:py-3 px-2 text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1.5 rounded-lg"
            >
              <BarChart2 size={13} /> GRÁFICO
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: Skills / Math Attack Selection */}
      {activeMenu === 'skills' && !isDefenseTurn && (
        <div className="flex-1 space-y-1.5 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {playerCreature.skills.map((skill) => {
              const hasEnergy = playerCreature.currentEnergy >= skill.energyCost;
              const isHovered = hoveredSkill?.id === skill.id;
              return (
                <button
                  key={skill.id}
                  disabled={!hasEnergy}
                  onMouseEnter={() => setHoveredSkill(skill)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  onClick={() => {
                    sound.playSelect();
                    onSelectSkill(skill);
                  }}
                  title={skill.description}
                  className={`p-2 border rounded-lg text-left flex items-center justify-between transition-all ${
                    hasEnergy 
                      ? isHovered
                        ? 'bg-emerald-50 border-emerald-600 text-[#163323] cursor-pointer shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white hover:bg-emerald-50 border-[#1b3b2b] text-[#163323] cursor-pointer shadow-xs' 
                      : 'bg-slate-100 border-slate-300 opacity-40 cursor-not-allowed text-slate-400'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <div className="font-pixel text-[9px] sm:text-[10px] font-bold text-[#143021] truncate">
                      {skill.name}
                    </div>
                  </div>
                  <span className="text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded font-mono text-[9px] font-bold shrink-0">
                    {skill.energyCost} MP
                  </span>
                </button>
              );
            })}
          </div>

          {/* Description preview bar on hover */}
          <div className="bg-[#f0fdf4] border border-emerald-700/30 rounded-lg px-2.5 py-1.5 min-h-[32px] flex items-center shadow-xs">
            {hoveredSkill ? (
              <div className="flex items-center gap-1.5 text-[#163323] w-full animate-in fade-in duration-150">
                <span className="font-pixel text-[8px] bg-sky-600 text-white px-1.5 py-0.5 rounded shrink-0">
                  {hoveredSkill.type.toUpperCase()}
                </span>
                <p className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight truncate">
                  <strong className="text-emerald-950">{hoveredSkill.name}:</strong> {hoveredSkill.description}
                </p>
              </div>
            ) : (
              <p className="font-mono text-[10px] text-slate-500 italic">
                ⚡ Passe o mouse sobre uma habilidade para ver detalhes do ataque.
              </p>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: Inventory Items Selection */}
      {activeMenu === 'items' && !isDefenseTurn && (
        <div className="flex-1 space-y-1.5 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {items.map((item) => {
              const canUse = item.amount > 0;
              const isHovered = hoveredItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  disabled={!canUse}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => {
                    sound.playConfirm();
                    onUseItem(item);
                  }}
                  title={item.description}
                  className={`p-2 border rounded-lg text-left flex items-center justify-between transition-all ${
                    canUse 
                      ? isHovered
                        ? 'bg-emerald-50 border-emerald-600 text-[#163323] cursor-pointer shadow-xs ring-1 ring-emerald-500'
                        : 'bg-white hover:bg-emerald-50 border-[#1b3b2b] text-[#163323] cursor-pointer shadow-xs' 
                      : 'bg-slate-100 border-slate-300 opacity-40 cursor-not-allowed text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <GameIcon name={item.icon} size={15} />
                    <span className="font-pixel text-[9px] sm:text-[10px] font-bold text-[#143021] truncate">{item.name}</span>
                  </div>
                  <span className={`font-pixel text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    canUse ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-500'
                  }`}>
                    x{item.amount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Description preview bar on hover */}
          <div className="bg-[#f0fdf4] border border-emerald-700/30 rounded-lg px-2.5 py-1.5 min-h-[32px] flex items-center shadow-xs">
            {hoveredItem ? (
              <div className="flex items-center gap-1.5 text-[#163323] w-full animate-in fade-in duration-150">
                <div className="shrink-0">
                  <GameIcon name={hoveredItem.icon} size={14} />
                </div>
                <p className="font-mono text-[10px] sm:text-[11px] font-bold leading-tight truncate">
                  <strong className="text-emerald-950">{hoveredItem.name}:</strong> {hoveredItem.description}
                </p>
                <span className="shrink-0 font-pixel text-[8px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1 py-0.5 rounded ml-auto">
                  Qtd: {hoveredItem.amount}
                </span>
              </div>
            ) : (
              <p className="font-mono text-[10px] text-slate-500 italic">
                ✨ Passe o mouse sobre um item para ver a descrição e seus efeitos.
              </p>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: Graph Inspection */}
      {activeMenu === 'graph_inspect' && !isDefenseTurn && (
        <div className="flex-1 flex flex-col sm:flex-row gap-2 items-center justify-center">
          <ParabolaGraph 
            a={1} 
            b={-4} 
            c={3} 
            width={240} 
            height={110} 
            className="bg-white border border-[#1b3b2b] rounded-lg shadow-xs" 
          />
          <div className="text-xs font-mono text-[#193325] space-y-0.5 bg-[#f7faf8] p-2 rounded-lg border border-[#1b3b2b]/30">
            <p>• <strong>Raízes:</strong> f(x) = 0</p>
            <p>• <strong>Vértice:</strong> ponto extremo</p>
            <p>• <strong>Corte Y:</strong> (0, c)</p>
          </div>
        </div>
      )}

      {/* VIEW 5: THE CORE MATH BATTLE CHALLENGE SCREEN */}
      {(activeMenu === 'challenge' || isDefenseTurn) && currentChallenge && (
        <div className="flex-1 flex flex-col justify-between space-y-2">
          {/* Question & Formula */}
          <div className="bg-[#f0fdf4] border border-emerald-600/40 rounded-lg p-2.5 space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between gap-1 border-b border-emerald-600/20 pb-1">
              <span className="font-pixel text-[9px] sm:text-[10px] font-black text-emerald-950 uppercase">
                {currentChallenge.title}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-black text-emerald-950 bg-white border border-emerald-500 px-2 py-0.5 rounded shadow-xs">
                  {currentChallenge.formula}
                </span>
                <button
                  type="button"
                  onClick={() => setShowGraphModal(!showGraphModal)}
                  className="font-pixel text-[8px] sm:text-[9px] bg-white hover:bg-emerald-50 text-emerald-900 px-2 py-1 border border-emerald-600 rounded transition-colors cursor-pointer font-bold shadow-xs"
                >
                  {showGraphModal ? ' Ocultar Gráfico' : ' Ver Gráfico'}
                </button>
              </div>
            </div>

            <p className="text-[10px] sm:text-xs font-pixel text-[#143021] font-bold leading-relaxed">
              {currentChallenge.question}
            </p>
          </div>

          {/* Interactive Parabola Graph Viewer when toggled */}
          {showGraphModal && (
            <div className="flex justify-center p-1.5 bg-white border border-[#1b3b2b] rounded-lg shadow-sm">
              <ParabolaGraph 
                a={currentChallenge.a} 
                b={currentChallenge.b} 
                c={currentChallenge.c} 
                width={280} 
                height={130} 
                className="w-full max-w-[300px]"
              />
            </div>
          )}

          {/* Progressive Hint button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCycleHint}
              className="text-[8px] font-pixel px-2 py-0.5 border border-amber-500 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded cursor-pointer"
            >
               {hintLevel === 0 ? 'DICA' : `DICA (${hintLevel}/3)`}
            </button>

            {hintLevel > 0 && (
              <span className="bg-amber-50 border border-amber-300 rounded px-2 py-0.5 text-[10px] sm:text-xs font-mono text-amber-950 flex-1 truncate">
                {hintLevel === 1 && `Fórmula: ${currentChallenge.hint1}`}
                {hintLevel === 2 && `Valores: ${currentChallenge.hint2}`}
                {hintLevel === 3 && `Resolução: ${currentChallenge.hint3}`}
              </span>
            )}
          </div>

          {/* INPUT FORM */}
          {currentChallenge.inputType === 'choice' && currentChallenge.choices ? (
            <div className="grid grid-cols-2 gap-1.5">
              {currentChallenge.choices.map((choice, idx) => (
                <button
                  key={`choice_${idx}`}
                  type="button"
                  onClick={() => handleChoiceClick(choice.value)}
                  className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] text-[#143021] font-mono font-bold text-xs py-2 px-2.5 rounded-lg text-left shadow-xs transition-all cursor-pointer truncate"
                >
                  {choice.label}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="flex gap-1.5 items-stretch">
              <input
                type="text"
                inputMode="decimal"
                placeholder="Resposta..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-white border border-[#1b3b2b] rounded-lg px-2.5 py-1.5 text-[#143021] font-mono font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner"
              />

              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleNumClick('-')}
                  className="bg-slate-100 text-[#1b3b2b] font-pixel text-xs px-2 border border-[#1b3b2b] rounded cursor-pointer"
                >
                  ±
                </button>
                <button
                  type="button"
                  onClick={() => handleNumClick('CLEAR')}
                  className="bg-rose-100 text-rose-800 font-pixel text-[8px] px-2 border border-rose-300 rounded cursor-pointer font-bold"
                >
                  C
                </button>
              </div>

              <button
                type="submit"
                className={`${
                  isDefenseTurn ? 'gba-btn-yellow' : 'gba-btn-primary'
                } text-[9px] sm:text-[10px] py-1.5 px-3 rounded-lg shrink-0 font-bold`}
              >
                {isDefenseTurn ? 'DEFENDER ' : 'CONFIRMAR '}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
