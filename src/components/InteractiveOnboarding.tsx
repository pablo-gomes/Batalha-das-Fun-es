import React, { useState, useEffect, useLayoutEffect } from 'react';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X,
  Swords
} from 'lucide-react';

interface InteractiveOnboardingProps {
  onClose: () => void;
  playerCreatureName?: string;
  currentView?: 'starter' | 'map' | 'battle' | 'training' | 'challenge' | 'shop';
  onNavigateView?: (view: 'starter' | 'map' | 'training' | 'challenge' | 'shop') => void;
}

interface MascotInfo {
  name: string;
  species: string;
  avatarUrl: string;
  badgeBg: string;
}

const MASCOTS: MascotInfo[] = [
  {
    name: 'Prof. Pikachu',
    species: 'Mascote Elétrico',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/25.gif',
    badgeBg: 'bg-yellow-400 text-amber-950 border-amber-800'
  },
  {
    name: 'Charmander',
    species: 'Elemento Delta',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/4.gif',
    badgeBg: 'bg-orange-500 text-white border-orange-900'
  },
  {
    name: 'Bulbasaur',
    species: 'Elemento Raízes',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/1.gif',
    badgeBg: 'bg-emerald-500 text-white border-emerald-900'
  },
  {
    name: 'Squirtle',
    species: 'Elemento Vértice',
    avatarUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/7.gif',
    badgeBg: 'bg-sky-500 text-white border-sky-900'
  }
];

interface TourStep {
  id: string;
  targetSelector: string;
  targetFallbackSelector?: string;
  badge: string;
  title: string;
  instruction: string;
  mascotDialogue: string;
  preferredPlacement: 'top' | 'bottom' | 'center';
  targetView?: 'starter' | 'map' | 'training' | 'challenge' | 'shop';
}

export const InteractiveOnboarding: React.FC<InteractiveOnboardingProps> = ({
  onClose,
  playerCreatureName,
  currentView = 'starter',
  onNavigateView
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedMascotIdx, setSelectedMascotIdx] = useState<number>(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Dynamic steps based on current view
  const isStarterView = currentView === 'starter';

  const tourSteps: TourStep[] = isStarterView ? [
    {
      id: 'welcome',
      targetSelector: '',
      badge: 'GUIA INTERATIVO',
      title: 'Bem-vindo ao RPG Matemático!',
      instruction: 'Eu serei seu Mascote Guia! Vou te orientar passo a passo para você dominar a interface e as Funções Quadráticas f(x) = ax² + bx + c.',
      mascotDialogue: 'Observe onde estou apontando na tela para dar seus primeiros passos!',
      preferredPlacement: 'center'
    },
    {
      id: 'starter_cards',
      targetSelector: '[data-tour="starter-cards"]',
      badge: 'INICIAL • MONSTRINHOS',
      title: '1. Escolha seu Monstrinho',
      instruction: 'Clique em um dos cards acima para selecionar seu Inicial: cada monstrinho tem um elemento matemático (Raízes, Delta Δ, Vértice ou Gráficos)!',
      mascotDialogue: 'Escolha o elemento que você mais quer treinar ou o seu monstrinho favorito!',
      preferredPlacement: 'bottom'
    },
    {
      id: 'starter_choose',
      targetSelector: '[data-tour="starter-choose"]',
      badge: 'INICIAL • CONFIRMAÇÃO',
      title: '2. Iniciar a Jornada',
      instruction: 'Após selecionar seu Pokémon favorito, clique no botão verde "ESCOLHER" para entrar no Mapa de Fases.',
      mascotDialogue: 'Ao confirmar, você receberá seu primeiro kit de poções e moedas!',
      preferredPlacement: 'top'
    },
    {
      id: 'cloud_sync',
      targetSelector: '[data-tour="tool-cloud"]',
      badge: 'SALVAR • GOOGLE DRIVE',
      title: '3. Nuvem & Restauração',
      instruction: 'Já jogou antes em outro dispositivo? Clique no botão NUVEM no topo para carregar seu progresso salvo no Google Drive.',
      mascotDialogue: 'Você nunca perde seu progresso e suas evoluções!',
      preferredPlacement: 'bottom'
    },
    {
      id: 'guide_button',
      targetSelector: '[data-tour="tool-guide"]',
      badge: 'SUPORTE • GUIA',
      title: '4. Reabrir o Guia',
      instruction: 'Se esquecer alguma função ou controle, basta clicar no botão GUIA no canto superior a qualquer momento.',
      mascotDialogue: 'Eu estarei sempre por perto para te ajudar!',
      preferredPlacement: 'bottom'
    },
    {
      id: 'finish',
      targetSelector: '',
      badge: 'PRONTO PARA JOGAR',
      title: 'Tudo Pronto!',
      instruction: 'Escolha seu Monstrinho Inicial e entre na Batalha das Funções! Acerte os cálculos com 100% de precisão para desferir Dano Crítico de 1.5x!',
      mascotDialogue: 'Boa sorte, treinador! Vamos aos cálculos!',
      preferredPlacement: 'center'
    }
  ] : [
    {
      id: 'welcome',
      targetSelector: '',
      badge: 'GUIA INTERATIVO',
      title: 'Bem-vindo, Treinador!',
      instruction: 'Eu serei seu Mascote Guia! Vou te mostrar exatamente onde clicar para navegar e aproveitar todos os recursos do jogo.',
      mascotDialogue: 'Siga minha mão indicadora para conhecer cada botão da interface!',
      preferredPlacement: 'center'
    },
    {
      id: 'nav_map',
      targetSelector: '[data-tour="nav-map"]',
      targetFallbackSelector: '[data-tour="mobile-nav-map"]',
      badge: 'NAVEGAÇÃO • MAPA',
      title: '1. Mapa de Fases & Chefes',
      instruction: 'Clique no botão MAPA para avançar pelas 5 regiões, combater monstros matemáticos e derrotar os grandes chefes de cada bioma.',
      mascotDialogue: 'Derrotar chefes libera a evolução do seu monstrinho para os estágios 2 e 3!',
      preferredPlacement: 'bottom',
      targetView: 'map'
    },
    {
      id: 'nav_training',
      targetSelector: '[data-tour="nav-training"]',
      targetFallbackSelector: '[data-tour="mobile-nav-training"]',
      badge: 'NAVEGAÇÃO • TREINO',
      title: '2. Modo Treino Livre',
      instruction: 'Clique em TREINO para exercitar fórmulas isoladas (Raízes, Delta Δ, Vértice Xv/Yv, Concavidade) sem perder HP ou gastar itens.',
      mascotDialogue: 'Ideal para revisar a matéria antes de enfrentar chefes difíceis!',
      preferredPlacement: 'bottom',
      targetView: 'training'
    },
    {
      id: 'nav_challenge',
      targetSelector: '[data-tour="nav-challenge"]',
      targetFallbackSelector: '[data-tour="mobile-nav-challenge"]',
      badge: 'NAVEGAÇÃO • DESAFIO',
      title: '3. Desafio Rápido de 60s',
      instruction: 'Clique em DESAFIO para uma corrida contra o relógio! Resolva enigmas em sequência para acumular combos e muitas moedas .',
      mascotDialogue: 'Quanto mais rápido você responder, maiores serão seus multiplicadores de moedas!',
      preferredPlacement: 'bottom',
      targetView: 'challenge'
    },
    {
      id: 'nav_shop',
      targetSelector: '[data-tour="nav-shop"]',
      targetFallbackSelector: '[data-tour="mobile-nav-shop"]',
      badge: 'NAVEGAÇÃO • LOJA',
      title: '4. Loja de Poções & Itens',
      instruction: 'Clique em LOJA para comprar Poções de Vida (HP), Éter de Energia (MP), Dicas de Fórmulas e Escudos de Defesa.',
      mascotDialogue: 'Use as moedas conquistadas nas batalhas para se abastecer!',
      preferredPlacement: 'bottom',
      targetView: 'shop'
    },
    {
      id: 'tool_grimorio',
      targetSelector: '[data-tour="tool-grimorio"]',
      badge: 'FERRAMENTAS • GRIMÓRIO',
      title: '5. Grimório de Fórmulas',
      instruction: 'Esqueceu como calcular o discriminante Δ ou o vértice? Clique no GRIMÓRIO para consultar a teoria completa a qualquer instante!',
      mascotDialogue: 'O Grimório está sempre disponível, inclusive no meio dos combates.',
      preferredPlacement: 'bottom'
    },
    {
      id: 'tool_notepad_calc',
      targetSelector: '[data-tour="tool-notepad"]',
      targetFallbackSelector: '[data-tour="tool-calc"]',
      badge: 'FERRAMENTAS • APOIO',
      title: '6. Bloco de Notas & Calculadora',
      instruction: 'Abra o BLOCO DE NOTAS para rascunhar na tela e a CALCULADORA para conferir operações rápidas sem sair do jogo.',
      mascotDialogue: 'Chega de papel rascunho: você tem tudo direto na sua tela!',
      preferredPlacement: 'bottom'
    },
    {
      id: 'finish',
      targetSelector: '',
      badge: 'PRONTO PARA JOGAR',
      title: 'Excelente! Você está Pronto!',
      instruction: 'Agora você domina a navegação! Lembre-se: respostas com 100% de precisão geram Acertos Críticos de 1.5x de Dano!',
      mascotDialogue: 'Que a força da Álgebra esteja com você! Boa batalha!',
      preferredPlacement: 'center'
    }
  ];

  const step = tourSteps[currentStepIndex] || tourSteps[0];
  const mascot = MASCOTS[selectedMascotIdx];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === tourSteps.length - 1;

  // Track target element position on screen
  const updateTargetPosition = () => {
    if (!step.targetSelector) {
      setTargetRect(null);
      return;
    }

    let el = document.querySelector(step.targetSelector) as HTMLElement | null;
    if (!el && step.targetFallbackSelector) {
      el = document.querySelector(step.targetFallbackSelector) as HTMLElement | null;
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    } else {
      setTargetRect(null);
    }
  };

  useLayoutEffect(() => {
    updateTargetPosition();
    const handleResize = () => updateTargetPosition();
    const handleScroll = () => updateTargetPosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    const timer = setTimeout(updateTargetPosition, 60);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
      clearTimeout(timer);
    };
  }, [currentStepIndex, currentView]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, tourSteps.length]);

  const handleNext = () => {
    if (isLastStep) {
      sound.playVictory();
      localStorage.setItem('batalha_funcoes_tutorial_seen', 'true');
      onClose();
    } else {
      sound.playSelect();
      const nextIdx = currentStepIndex + 1;
      const nextStep = tourSteps[nextIdx];
      if (nextStep?.targetView && onNavigateView && nextStep.targetView !== currentView) {
        onNavigateView(nextStep.targetView);
      }
      setCurrentStepIndex(nextIdx);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      sound.playCancel();
      const prevIdx = currentStepIndex - 1;
      const prevStep = tourSteps[prevIdx];
      if (prevStep?.targetView && onNavigateView && prevStep.targetView !== currentView) {
        onNavigateView(prevStep.targetView);
      }
      setCurrentStepIndex(prevIdx);
    }
  };

  const handleSkip = () => {
    sound.playCancel();
    localStorage.setItem('batalha_funcoes_tutorial_seen', 'true');
    onClose();
  };

  const handleSwitchMascot = () => {
    sound.playSelect();
    setSelectedMascotIdx(prev => (prev + 1) % MASCOTS.length);
  };

  // Safe viewport positioning calculation to guarantee the card and all buttons are ALWAYS fully visible
  const getBubblePositionStyle = (): React.CSSProperties => {
    const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const margin = 12;
    const cardWidth = Math.min(460, windowWidth - 24);

    if (!targetRect || step.preferredPlacement === 'center') {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '500px',
        width: 'calc(100vw - 24px)',
        maxHeight: 'calc(100vh - 24px)'
      };
    }

    // Horizontal alignment
    const targetCenter = targetRect.left + (targetRect.width / 2);
    let left = targetCenter - (cardWidth / 2);
    left = Math.max(12, Math.min(windowWidth - cardWidth - 12, left));

    // Vertical alignment: if target is in bottom half, position card ABOVE target so bottom buttons are never cut off
    if (targetRect.top > windowHeight * 0.45) {
      const bottom = Math.max(12, windowHeight - targetRect.top + margin);
      return {
        bottom: `${bottom}px`,
        left: `${left}px`,
        maxWidth: `${cardWidth}px`,
        width: 'calc(100vw - 24px)',
        maxHeight: `min(340px, ${Math.max(180, targetRect.top - margin * 2)}px)`
      };
    } else {
      // Target in top half: position card BELOW target
      const top = targetRect.bottom + margin;
      return {
        top: `${top}px`,
        left: `${left}px`,
        maxWidth: `${cardWidth}px`,
        width: 'calc(100vw - 24px)',
        maxHeight: `min(340px, ${Math.max(180, windowHeight - targetRect.bottom - margin * 2)}px)`
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto select-none">
      
      {/* 1. DARK SPOTLIGHT OVERLAY */}
      {targetRect ? (
        <>
          {/* Spotlight Highlight Box over the exact target element */}
          <div
            style={{
              position: 'fixed',
              left: `${targetRect.left - 6}px`,
              top: `${targetRect.top - 6}px`,
              width: `${targetRect.width + 12}px`,
              height: `${targetRect.height + 12}px`,
              borderRadius: '14px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.78), 0 0 24px rgba(250, 204, 21, 0.95), inset 0 0 10px rgba(250, 204, 21, 0.5)',
              border: '3px solid #facc15',
              zIndex: 9998,
              pointerEvents: 'none'
            }}
            className="animate-pulse"
          />

          {/* Animated Pointing Finger next to the highlighted button */}
          <div
            style={{
              position: 'fixed',
              left: `${targetRect.left + (targetRect.width / 2) - 20}px`,
              top: targetRect.top > 80 ? `${targetRect.top - 36}px` : `${targetRect.bottom + 6}px`,
              zIndex: 9999,
              pointerEvents: 'none'
            }}
            className="animate-bounce flex flex-col items-center"
          >
            <span className="text-2xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
              {targetRect.top > 80 ? '' : ''}
            </span>
          </div>
        </>
      ) : (
        /* Full Backdrop for Intro & Finish steps */
        <div 
          onClick={handleSkip}
          className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9990] cursor-pointer" 
          title="Clique para fechar o tutorial"
        />
      )}

      {/* 2. FLOATING MASCOT TUTOR & SPEECH BUBBLE */}
      <div 
        style={getBubblePositionStyle()}
        className="fixed z-[9999] transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        <div className="relative bg-[#0f2419] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_0_2px_#34d399] text-white flex flex-col justify-between overflow-y-auto custom-scrollbar max-h-full">
          
          {/* Header: Badge de Etapa, Botão PULAR Superior, Trocar Mascote & Fechar */}
          <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-800/70 mb-2.5 shrink-0 gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-pixel text-[8px] sm:text-[9px] px-2 py-0.5 rounded-full font-black uppercase shadow-xs flex items-center gap-1 truncate">
                <Sparkles size={11} className="text-emerald-950 shrink-0" /> {step.badge}
              </span>
              <span className="font-mono text-[10px] sm:text-xs font-bold text-emerald-300 shrink-0">
                {currentStepIndex + 1}/{tourSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Botão Pular também no topo para acesso instantâneo */}
              <button
                onClick={handleSkip}
                className="candy-btn-skip px-2.5 py-1 text-[8px] sm:text-[9px] cursor-pointer font-black"
                title="Pular todo o tutorial"
              >
                PULAR
              </button>

              <button
                onClick={handleSwitchMascot}
                className="bg-[#173e2a] hover:bg-[#20553a] text-emerald-200 border border-emerald-600/50 px-2 py-1 rounded-lg text-[8px] sm:text-[9px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                title="Trocar Mascote Pokémon"
              >
                <Sparkles size={12} />
              </button>

              <button
                onClick={handleSkip}
                className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer hover:bg-emerald-950/80 transition-colors"
                title="Fechar Tutorial (Esc)"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Conteúdo Principal: Mascote Falante + Instrução Direta */}
          <div className="flex items-start gap-2.5 min-h-0 py-0.5">
            
            {/* Mascote com Sprite Animado */}
            <div className="flex flex-col items-center shrink-0">
              <div 
                className="relative group cursor-pointer"
                onClick={() => sound.playConfirm()}
                title="Clique para ouvir o mascote!"
              >
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-pulse"></div>
                <img
                  src={mascot.avatarUrl}
                  alt={mascot.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] animate-mascot-float relative z-10 gba-sprite"
                />
              </div>

              <span className={`font-pixel text-[7px] sm:text-[8px] px-1.5 py-0.5 rounded font-black border shadow-xs mt-1 truncate max-w-[80px] text-center ${mascot.badgeBg}`}>
                {mascot.name.toUpperCase()}
              </span>
            </div>

            {/* Balão de Fala do Mascote */}
            <div className="bubble-speech flex-1 p-2 sm:p-2.5 text-[#143021] relative min-w-0">
              <h3 className="font-pixel text-[10px] sm:text-xs text-emerald-950 font-black mb-1 flex items-center gap-1.5 truncate">
                {step.title}
              </h3>

              <p className="font-mono text-[10px] sm:text-[11px] text-slate-800 leading-snug font-bold">
                {step.instruction}
              </p>

              <div className="mt-1.5 pt-1 border-t border-emerald-200/80 flex items-start gap-1 bg-emerald-50/90 p-1 rounded-md">
                <Sparkles size={12} className="shrink-0 text-amber-600" />
                <p className="font-mono text-[9px] sm:text-[10px] text-emerald-900 font-black italic line-clamp-2">
                  "{step.mascotDialogue}"
                </p>
              </div>
            </div>

          </div>

          {/* Barra Inferior: Pular, Indicadores de Bolinhas & Próximo */}
          <div className="flex items-center justify-between gap-2 pt-2.5 mt-2 border-t-2 border-emerald-800/70 shrink-0">
            
            {/* Botão Pular Inferior */}
            <button
              onClick={handleSkip}
              className="candy-btn-skip px-3 py-1 text-[8px] sm:text-[9px] cursor-pointer shrink-0"
            >
              PULAR
            </button>

            {/* Bolinhas de Progresso */}
            <div className="flex items-center gap-1">
              {tourSteps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    sound.playSelect();
                    setCurrentStepIndex(idx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    idx === currentStepIndex
                      ? 'w-4 h-1.5 sm:w-5 sm:h-2 bg-yellow-400 border border-yellow-600 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                      : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-900 border border-emerald-700 hover:bg-emerald-700'
                  }`}
                  title={`Ir para etapa ${idx + 1}`}
                />
              ))}
            </div>

            {/* Botões de Navegação Anterior & Próximo */}
            <div className="flex items-center gap-1.5">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-pixel text-[8px] sm:text-[9px] px-2 py-1 rounded-lg border border-slate-600 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={12} />
                </button>
              )}

              <button
                onClick={handleNext}
                className={`${
                  isLastStep ? 'gba-btn-yellow text-amber-950 font-black' : 'gba-btn-primary'
                } font-pixel text-[8px] sm:text-[9px] px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-[2px_2px_0_#022c22] transition-transform active:scale-95`}
              >
                {isLastStep ? (
                  <>
                    <Swords size={12} /> COMEÇAR!
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

    </div>
  );
};
