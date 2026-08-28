import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { GameIcon } from '../utils/iconMap';
import { 
  Sparkles, 
  Swords, 
  Shield, 
  Zap, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  CheckCircle2, 
  Flame, 
  HelpCircle,
  Play
} from 'lucide-react';

interface BattleGuideModalProps {
  onClose: () => void;
  playerCreatureName?: string;
  enemyCreatureName?: string;
}

interface GuideStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  tip: string;
  icon: string;
  actionPreview?: 'attack' | 'precision' | 'defense' | 'items' | 'codex';
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'intro',
    badge: 'GUIA DE BATALHA',
    title: 'Como Funciona o Combate RPG!',
    description: 'Nas batalhas, o poder dos seus ataques depende do seu conhecimento sobre a Função Quadrática f(x) = ax² + bx + c. Cada acerto causa dano real no adversário!',
    tip: 'Observe os coeficientes a, b e c da função do oponente para calcular com rapidez!',
    icon: 'Swords',
    actionPreview: 'attack'
  },
  {
    id: 'skills',
    badge: 'HABILIDADES & MP',
    title: '1. Escolhendo Golpes & Gastando Energia',
    description: 'Clique em "HABILIDADES" para escolher o golpe do seu monstrinho. Cada habilidade consome Energia (MP) e invoca um cálculo específico (Raízes x₁/x₂, Discriminante Δ ou Vértice V).',
    tip: 'Se ficar sem MP, use uma postura Defensiva (+10 MP) ou use um Éter na mochila!',
    icon: 'Swords',
    actionPreview: 'attack'
  },
  {
    id: 'precision',
    badge: 'SISTEMA DE PRECISÃO',
    title: '2. Precisão 100% & Dano Crítico',
    description: 'Respostas exatas garantem 100% de Precisão e Acerto Crítico (1.5x de Dano)! Além disso, cada acerto consecutivo aumenta seu COMBO, multiplicando ainda mais seu dano.',
    tip: 'Quanto maior sua precisão matemática, mais rápido você derrota os chefes!',
    icon: 'Swords',
    actionPreview: 'precision'
  },
  {
    id: 'defense',
    badge: 'DEFESA REATIVA',
    title: '3. Turno de Defesa do Inimigo',
    description: 'Quando for a vez do inimigo, ele lançará um ataque quadrático! Uma pergunta rápida de defesa surgirá na tela. Responda corretamente para bloquear o golpe e tomar ZERO dano!',
    tip: 'Defesas perfeitas anulam completamente o golpe do inimigo!',
    icon: 'Swords',
    actionPreview: 'defense'
  },
  {
    id: 'items_tools',
    badge: 'ITENS & GRIMÓRIO',
    title: '4. Poções & Consulta a Fórmulas',
    description: 'Precisa curar HP ou recuperar MP? Clique em "ITENS". Se esquecer uma fórmula durante o combate, clique em "GRIMÓRIO" ou use o "BLOCO DE NOTAS" para rascunhar.',
    tip: 'Você nunca perde sua vez ao consultar o Grimório ou fazer anotações!',
    icon: 'Swords',
    actionPreview: 'codex'
  }
];

export const BattleGuideModal: React.FC<BattleGuideModalProps> = ({
  onClose,
  playerCreatureName = 'Seu Monstrinho',
  enemyCreatureName = 'Inimigo'
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const step = GUIDE_STEPS[currentStepIdx];
  const isFirst = currentStepIdx === 0;
  const isLast = currentStepIdx === GUIDE_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      sound.playVictory();
      localStorage.setItem('batalha_funcoes_battle_guide_seen', 'true');
      onClose();
    } else {
      sound.playSelect();
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      sound.playCancel();
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleClose = () => {
    sound.playCancel();
    localStorage.setItem('batalha_funcoes_battle_guide_seen', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0f2419] border-3 sm:border-4 border-[#1b3b2b] rounded-3xl p-3.5 sm:p-5 shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_0_2px_#34d399] flex flex-col justify-between max-h-[92vh] overflow-y-auto custom-scrollbar text-white">
        
        {/* TOP BAR */}
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-emerald-800/70">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-pixel text-[8px] sm:text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase shadow-xs flex items-center gap-1">
              <Sparkles size={11} className="text-emerald-950" /> {step.badge}
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-bold text-emerald-300">
              {currentStepIdx + 1}/{GUIDE_STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="candy-btn-skip px-2.5 py-1 text-[8px] sm:text-[9px] cursor-pointer font-black"
              title="Continuar jogando normalmente"
            >
              CONTINUAR JOGANDO
            </button>

            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-emerald-950/80 transition-colors"
              title="Fechar Guia (Esc)"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="my-3 space-y-3">
          {/* Mascote & Balão */}
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center shrink-0">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif"
                alt="Prof. Pikachu"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-mascot-float relative z-10 gba-sprite"
              />
              <span className="font-pixel text-[7px] sm:text-[8px] bg-yellow-400 text-amber-950 px-1.5 py-0.5 rounded font-black border border-amber-800 shadow-xs mt-1">
                PROF. PIKACHU
              </span>
            </div>

            <div className="bubble-speech flex-1 p-3 text-[#143021] relative">
              <h3 className="font-pixel text-xs sm:text-sm text-emerald-950 font-black mb-1.5 flex items-center gap-1.5">
                <GameIcon name={step.icon} size={15} /> {step.title}
              </h3>

              <p className="font-mono text-[11px] sm:text-xs text-slate-800 leading-relaxed font-bold">
                {step.description}
              </p>

              <div className="mt-2 pt-1.5 border-t border-emerald-200/80 flex items-start gap-1.5 bg-emerald-50/90 p-1.5 rounded-lg">
                <Zap size={14} className="shrink-0 text-amber-600" />
                <p className="font-mono text-[10px] text-emerald-900 font-black italic">
                  "{step.tip}"
                </p>
              </div>
            </div>
          </div>

          {/* PREVIEWS VISUAIS */}
          <div className="bg-[#163625] border-2 border-[#2b5a3e] rounded-2xl p-2.5 text-white">
            {step.actionPreview === 'attack' && (
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[9px]">
                <div className="bg-[#0b1c13] p-1.5 rounded-lg border border-emerald-500/50">
                  <span className="text-emerald-400 font-bold block">1. ESCOLHA GOLPE</span>
                  <span className="text-slate-300 text-[8px]">Raízes / Delta / Vértice</span>
                </div>
                <div className="bg-[#0b1c13] p-1.5 rounded-lg border border-yellow-500/50">
                  <span className="text-yellow-300 font-bold block">2. RESOLVA f(x)</span>
                  <span className="text-slate-300 text-[8px]">Calcule a fórmula</span>
                </div>
                <div className="bg-[#0b1c13] p-1.5 rounded-lg border border-red-500/50">
                  <span className="text-rose-400 font-bold block">3. DANO NO INIMIGO</span>
                  <span className="text-slate-300 text-[8px]">Crítico 1.5x Dano!</span>
                </div>
              </div>
            )}

            {step.actionPreview === 'precision' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono font-bold">
                  <span className="text-yellow-300"> Precisão: 100% (PERFEITO)</span>
                  <span className="text-emerald-400">Dano: 1.5x Crítico + Combo </span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full border border-yellow-500/60 p-0.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500 rounded-full w-full animate-pulse"></div>
                </div>
              </div>
            )}

            {step.actionPreview === 'defense' && (
              <div className="flex items-center justify-between text-[9px] font-mono bg-[#0b1c13] p-2 rounded-xl border border-sky-500/40">
                <span className="text-sky-300 font-bold"> Bloqueio Perfeito:</span>
                <span className="text-yellow-300">Resposta Exata = 0 Dano Sofrido!</span>
              </div>
            )}

            {step.actionPreview === 'codex' && (
              <div className="flex items-center justify-around text-[9px] font-mono bg-[#0b1c13] p-2 rounded-xl border border-emerald-500/40">
                <span className="text-teal-300 font-bold"> Grimório: Fórmulas</span>
                <span className="text-amber-300 font-bold"> Notas: Rascunho</span>
                <span className="text-sky-300 font-bold"> Calc: Contas Rápidas</span>
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2.5 border-t-2 border-emerald-800/70">
          
          <button
            onClick={handleClose}
            className="gba-btn text-[#193325] text-[8px] sm:text-[9px] px-3 py-1.5 rounded-xl cursor-pointer order-2 sm:order-1 flex items-center gap-1 font-bold"
          >
            <Play size={12} /> CONTINUAR JOGANDO
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1 order-1 sm:order-2">
            {GUIDE_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  sound.playSelect();
                  setCurrentStepIdx(idx);
                }}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentStepIdx
                    ? 'w-5 h-2 bg-yellow-400 border border-yellow-600 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                    : 'w-2 h-2 bg-emerald-900 border border-emerald-700 hover:bg-emerald-700'
                }`}
                title={`Ir para etapa ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next / Prev */}
          <div className="flex items-center gap-1.5 order-3">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="bg-slate-800 hover:bg-slate-700 text-white font-pixel text-[8px] sm:text-[9px] px-2.5 py-1.5 rounded-lg border border-slate-600 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={12} />
              </button>
            )}

            <button
              onClick={handleNext}
              className={`${
                isLast ? 'gba-btn-yellow text-amber-950 font-black' : 'gba-btn-primary'
              } font-pixel text-[8px] sm:text-[9px] px-3 py-1.5 rounded-lg cursor-pointer flex items-center gap-1 shadow-[2px_2px_0_#022c22] transition-transform active:scale-95`}
            >
              {isLast ? (
                <>
                  <Swords size={12} /> LUTAR AGORA!
                </>
              ) : (
                <>
                  PRÓXIMO <ChevronRight size={12} />
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
