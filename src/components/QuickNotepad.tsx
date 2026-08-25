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
    <div className={`w-full max-w-[280px] bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl shadow-[4px_4px_0_#122b1e] p-2.5 flex flex-col justify-between select-none text-[#163323] transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#2d5a42]/30 pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <StickyNote size={15} className="text-amber-600" />
          <span className="font-pixel text-[10px] font-black uppercase text-[#143021]">
            BLOCO DE NOTAS
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClear}
            title="Limpar Rascunho"
            className="p-1 bg-white hover:bg-rose-50 text-rose-700 border border-[#1b3b2b] rounded transition-colors cursor-pointer"
          >
            <Eraser size={11} />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expandir' : 'Minimizar'}
            className="p-1 bg-white hover:bg-[#edf7f1] text-[#1b3b2b] border border-[#1b3b2b] rounded transition-colors cursor-pointer sm:hidden"
          >
            {isCollapsed ? <Maximize2 size={11} /> : <Minimize2 size={11} />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Fechar"
              className="p-1 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 rounded transition-colors cursor-pointer lg:hidden"
            >
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Quick formula tags to insert into notes */}
          <div className="flex flex-wrap gap-1 mb-2">
            <button
              onClick={() => handleInsertTemplate('Δ = b² - 4ac')}
              className="text-[8px] font-mono font-bold bg-[#edf7f1] hover:bg-emerald-200 text-emerald-950 border border-emerald-500 px-1.5 py-0.5 rounded cursor-pointer shadow-2xs"
            >
              +Δ
            </button>
            <button
              onClick={() => handleInsertTemplate('Xv = -b / (2a)')}
              className="text-[8px] font-mono font-bold bg-[#e0f2fe] hover:bg-sky-200 text-sky-950 border border-sky-500 px-1.5 py-0.5 rounded cursor-pointer shadow-2xs"
            >
              +Xv
            </button>
            <button
              onClick={() => handleInsertTemplate('Yv = -Δ / (4a)')}
              className="text-[8px] font-mono font-bold bg-[#f3e8ff] hover:bg-purple-200 text-purple-950 border border-purple-500 px-1.5 py-0.5 rounded cursor-pointer shadow-2xs"
            >
              +Yv
            </button>
            <button
              onClick={() => handleInsertTemplate('x = (-b ± √Δ) / 2a')}
              className="text-[8px] font-mono font-bold bg-[#fef3c7] hover:bg-amber-200 text-amber-950 border border-amber-500 px-1.5 py-0.5 rounded cursor-pointer shadow-2xs"
            >
              +Bhaskara
            </button>
          </div>

          {/* Text Area */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Rascunho de cálculo...&#10;Ex:&#10;a=1, b=-4, c=3&#10;Δ = 16 - 12 = 4&#10;x = (4 ± 2) / 2&#10;x1 = 3, x2 = 1"
            className="w-full h-36 sm:h-52 bg-[#fdfcf7] border-2 border-[#1b3b2b] rounded-lg p-2.5 font-mono text-xs font-bold text-[#143021] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner custom-scrollbar leading-relaxed"
          />

          <div className="text-[8px] font-mono text-emerald-800 font-bold mt-1 text-right">
            Salvo automaticamente ✓
          </div>
        </>
      )}
    </div>
  );
};
