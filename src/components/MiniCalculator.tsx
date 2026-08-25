import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Calculator, Minimize2, Maximize2, X } from 'lucide-react';

interface MiniCalculatorProps {
  className?: string;
  onClose?: () => void;
}

export const MiniCalculator: React.FC<MiniCalculatorProps> = ({ className = '', onClose }) => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleDigit = (digit: string) => {
    sound.playSelect();
    if (isNewNumber || display === '0') {
      setDisplay(digit);
      setIsNewNumber(false);
    } else {
      if (display.length < 10) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    sound.playSelect();
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleClear = () => {
    sound.playCancel();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    sound.playSelect();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const handleToggleSign = () => {
    sound.playSelect();
    const val = parseFloat(display);
    if (!isNaN(val)) {
      setDisplay((-val).toString());
    }
  };

  const handleSquare = () => {
    sound.playSelect();
    const val = parseFloat(display);
    if (!isNaN(val)) {
      const res = Math.round(val * val * 1000) / 1000;
      setDisplay(res.toString());
      setIsNewNumber(true);
    }
  };

  const handleSqrt = () => {
    sound.playSelect();
    const val = parseFloat(display);
    if (!isNaN(val) && val >= 0) {
      const res = Math.round(Math.sqrt(val) * 1000) / 1000;
      setDisplay(res.toString());
      setIsNewNumber(true);
    } else {
      setDisplay('Erro');
      setIsNewNumber(true);
    }
  };

  const handleOp = (op: string) => {
    sound.playSelect();
    const current = parseFloat(display);
    if (prevValue !== null && operation && !isNewNumber) {
      calculate(current);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setIsNewNumber(true);
  };

  const calculate = (currentVal?: number) => {
    const current = currentVal !== undefined ? currentVal : parseFloat(display);
    if (prevValue === null || !operation) return;

    let result = 0;
    switch (operation) {
      case '+':
        result = prevValue + current;
        break;
      case '-':
        result = prevValue - current;
        break;
      case '×':
        result = prevValue * current;
        break;
      case '÷':
        result = current !== 0 ? prevValue / current : 0;
        break;
      default:
        return;
    }

    result = Math.round(result * 10000) / 10000;
    setDisplay(result.toString());
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const handleEquals = () => {
    sound.playConfirm();
    calculate();
  };

  return (
    <div className={`w-full max-w-[280px] bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl shadow-[4px_4px_0_#122b1e] p-2.5 flex flex-col justify-between select-none text-[#163323] transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[#2d5a42]/30 pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <Calculator size={15} className="text-emerald-700" />
          <span className="font-pixel text-[10px] font-black uppercase text-[#143021]">
            CALCULADORA
          </span>
        </div>

        <div className="flex items-center gap-1">
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
          {/* LCD Display */}
          <div className="bg-[#e8f5e9] border-2 border-[#1b3b2b] rounded-lg p-2 mb-2 text-right shadow-inner flex flex-col justify-between min-h-[50px]">
            <div className="text-[10px] font-mono text-emerald-800 font-bold h-4">
              {prevValue !== null && `${prevValue} ${operation || ''}`}
            </div>
            <div className="text-xl font-mono font-black text-emerald-950 truncate tracking-wider">
              {display}
            </div>
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-1 font-mono font-black text-xs">
            {/* Row 1: C, x², √, ÷ */}
            <button
              onClick={handleClear}
              className="bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-400 rounded py-1.5 cursor-pointer font-bold active:scale-95"
            >
              C
            </button>
            <button
              onClick={handleSquare}
              className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded py-1.5 cursor-pointer active:scale-95"
            >
              x²
            </button>
            <button
              onClick={handleSqrt}
              className="bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 rounded py-1.5 cursor-pointer active:scale-95"
            >
              √
            </button>
            <button
              onClick={() => handleOp('÷')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 rounded py-1.5 cursor-pointer text-sm active:scale-95"
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, * */}
            <button
              onClick={() => handleDigit('7')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              9
            </button>
            <button
              onClick={() => handleOp('×')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 rounded py-1.5 cursor-pointer text-sm active:scale-95"
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              onClick={() => handleDigit('4')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              6
            </button>
            <button
              onClick={() => handleOp('-')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 rounded py-1.5 cursor-pointer text-sm active:scale-95"
            >
              -
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              onClick={() => handleDigit('1')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              3
            </button>
            <button
              onClick={() => handleOp('+')}
              className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 rounded py-1.5 cursor-pointer text-sm active:scale-95"
            >
              +
            </button>

            {/* Row 5: ±, 0, ., = */}
            <button
              onClick={handleToggleSign}
              className="bg-slate-100 hover:bg-slate-200 text-[#1b3b2b] border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="bg-white hover:bg-emerald-50 border border-[#1b3b2b] rounded py-1.5 cursor-pointer active:scale-95 shadow-xs"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="gba-btn-primary rounded py-1.5 cursor-pointer font-black active:scale-95 shadow-xs text-white"
            >
              =
            </button>
          </div>
        </>
      )}
    </div>
  );
};
