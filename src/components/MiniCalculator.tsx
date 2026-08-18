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
      case '*':
        result = prevValue * current;
        break;
      case '÷':
      case '/':
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
    <div className={`w-full max-w-[280px] bg-white border-3 sm:border-4 border-black shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] p-2.5 flex flex-col justify-between select-none text-black transition-all ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-1.5">
        <div className="flex items-center gap-1.5">
          <Calculator size={14} />
          <span className="font-pixel text-[10px] font-black uppercase">
            CALCULADORA
          </span>
        </div>

        <div className="flex items-center gap-1">
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
          {/* Calculator Screen */}
          <div className="bg-slate-100 border-2 border-black p-2 text-right mb-2 shadow-inner">
            <div className="text-[9px] font-mono text-slate-500 font-bold h-3 truncate">
              {prevValue !== null ? `${prevValue} ${operation}` : ''}
            </div>
            <div className="font-mono text-base sm:text-lg font-black text-black truncate tracking-wider">
              {display}
            </div>
          </div>

          {/* Keypad Grid (4x5) */}
          <div className="grid grid-cols-4 gap-1 font-mono font-black text-xs">
            {/* Row 1: Special Operations */}
            <button
              onClick={handleClear}
              className="bg-black text-white hover:bg-slate-800 border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              C
            </button>
            <button
              onClick={handleSqrt}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              √
            </button>
            <button
              onClick={handleSquare}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              x²
            </button>
            <button
              onClick={() => handleOp('÷')}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer text-sm active:scale-95"
            >
              ÷
            </button>

            {/* Row 2: 7, 8, 9, * */}
            <button
              onClick={() => handleDigit('7')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              7
            </button>
            <button
              onClick={() => handleDigit('8')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              8
            </button>
            <button
              onClick={() => handleDigit('9')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              9
            </button>
            <button
              onClick={() => handleOp('×')}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer text-sm active:scale-95"
            >
              ×
            </button>

            {/* Row 3: 4, 5, 6, - */}
            <button
              onClick={() => handleDigit('4')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              4
            </button>
            <button
              onClick={() => handleDigit('5')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              5
            </button>
            <button
              onClick={() => handleDigit('6')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              6
            </button>
            <button
              onClick={() => handleOp('-')}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer text-sm active:scale-95"
            >
              -
            </button>

            {/* Row 4: 1, 2, 3, + */}
            <button
              onClick={() => handleDigit('1')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              1
            </button>
            <button
              onClick={() => handleDigit('2')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              2
            </button>
            <button
              onClick={() => handleDigit('3')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              3
            </button>
            <button
              onClick={() => handleOp('+')}
              className="bg-slate-100 hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer text-sm active:scale-95"
            >
              +
            </button>

            {/* Row 5: ±, 0, ., = */}
            <button
              onClick={handleToggleSign}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              ±
            </button>
            <button
              onClick={() => handleDigit('0')}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              0
            </button>
            <button
              onClick={handleDecimal}
              className="bg-white hover:bg-black hover:text-white border-2 border-black py-1.5 cursor-pointer active:scale-95"
            >
              .
            </button>
            <button
              onClick={handleEquals}
              className="bg-black text-white hover:bg-slate-800 border-2 border-black py-1.5 cursor-pointer font-bold active:scale-95"
            >
              =
            </button>
          </div>
        </>
      )}
    </div>
  );
};

