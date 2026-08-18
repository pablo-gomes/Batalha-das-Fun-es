import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { Eraser, StickyNote, Minimize2, Maximize2, X } from 'lucide-react';

interface QuickNotepadProps {
  className?: string;
  onClose?: () => void;
}

export const QuickNotepad: React.FC<QuickNotepadProps> = ({ className = '', onClose }) => {
  const [note, setNote] = useState<string>(() => {
    return localStorage.getItem('batalha_funcoes_notepad') || '';
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('batalha_funcoes_notepad', note);
  }, [note]);

  const handleClear = () => {
    sound.playCancel();
    setNote('');
  };

  const handleInsertTemplate = (template: string) => {
    sound.playSelect();
    setNote(prev => (prev ? prev + '\n' + template : template));
  };

  return (
    <div className={`w-full max-w-[280px] bg-white border-3 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] p-2.5 flex flex-col justify-between select-none text-black transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <StickyNote size={14} />
          <span className="font-pixel text-[10px] font-black uppercase">
            RASCUNHO
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Limpar Rascunho"
            className="p-1 bg-white hover:bg-black hover:text-white border border-black transition-colors cursor-pointer"
          >
            <Eraser size={11} />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir' : 'Minimizar'}
            className="p-1 bg-white hover:bg-black hover:text-white border border-black transition-colors cursor-pointer sm:hidden"
          >
            {isCollapsed ? <Maximize2 size={11} /> : <Minimize2 size={11} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Fechar"
              className="p-1 bg-white hover:bg-black hover:text-white border border-black transition-colors cursor-pointer lg:hidden"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Quick formula tags to insert into notes */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            <button
              onClick={() => handleInsertTemplate('Δ = b² - 4ac')}
              className="text-[8px] font-mono font-bold bg-slate-100 hover:bg-black hover:text-white border border-black px-1.5 py-0.5 cursor-pointer"
            >
              +Δ
            </button>
            <button
              onClick={() => handleInsertTemplate('Xv = -b / (2a)')}
              className="text-[8px] font-mono font-bold bg-slate-100 hover:bg-black hover:text-white border border-black px-1.5 py-0.5 cursor-pointer"
            >
              +Xv
            </button>
            <button
              onClick={() => handleInsertTemplate('Yv = -Δ / (4a)')}
              className="text-[8px] font-mono font-bold bg-slate-100 hover:bg-black hover:text-white border border-black px-1.5 py-0.5 cursor-pointer"
            >
              +Yv
            </button>
            <button
              onClick={() => handleInsertTemplate('x = (-b ± √Δ) / 2a')}
              className="text-[8px] font-mono font-bold bg-slate-100 hover:bg-black hover:text-white border border-black px-1.5 py-0.5 cursor-pointer"
            >
              +Bhaskara
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Anote seus cálculos aqui...&#10;Ex:&#10;a=1, b=-4, c=3&#10;Δ = 16 - 12 = 4&#10;x = (4 ± 2) / 2&#10;x1 = 3, x2 = 1"
            className="w-full h-36 sm:h-52 bg-slate-50 border-2 border-black p-2 font-mono text-xs font-bold text-black resize-none focus:outline-none shadow-inner custom-scrollbar leading-relaxed"
          />

          <div className="text-[8px] font-mono text-slate-500 font-bold mt-1 text-right">
            Salvo automaticamente ✓
          </div>
        </>
      )}
    </div>
  );
};

