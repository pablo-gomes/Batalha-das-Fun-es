import React, { useState } from 'react';
import { ParabolaGraph } from './ParabolaGraph';
import { sound } from '../utils/audio';

interface CodexGrimoireProps {
  onClose: () => void;
}

export const CodexGrimoire: React.FC<CodexGrimoireProps> = ({ onClose }) => {
  const [sliderA, setSliderA] = useState<number>(1);
  const [sliderB, setSliderB] = useState<number>(-4);
  const [sliderC, setSliderC] = useState<number>(3);
  const [activeTab, setActiveTab] = useState<'codex' | 'sandbox'>('codex');

  const delta = sliderB * sliderB - 4 * sliderA * sliderC;
  const xv = -sliderB / (2 * sliderA);
  const yv = -delta / (4 * sliderA);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 select-none">
      <div className="bg-white border-3 sm:border-4 border-black rounded-lg sm:rounded-xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-[4px_4px_0px_#000000] sm:shadow-[6px_6px_0px_#000000] overflow-hidden text-black">
        {/* Header */}
        <div className="bg-white border-b-2 border-black p-2.5 sm:p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📖</span>
            <div>
              <h2 className="font-pixel text-[11px] sm:text-sm text-black font-black uppercase">
                Grimório das Funções
              </h2>
              <p className="text-[9px] sm:text-[10px] font-mono text-slate-700 font-bold">
                Guia de consulta rápida e laboratório
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex border-2 border-black gap-0.5 p-0.5">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('codex');
                }}
                className={`text-[9px] sm:text-[10px] font-pixel px-2 sm:px-3 py-1 transition-colors cursor-pointer ${
                  activeTab === 'codex' ? 'bg-black text-white font-bold' : 'text-black hover:bg-slate-100'
                }`}
              >
                FÓRMULAS
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('sandbox');
                }}
                className={`text-[9px] sm:text-[10px] font-pixel px-2 sm:px-3 py-1 transition-colors cursor-pointer ${
                  activeTab === 'sandbox' ? 'bg-black text-white font-bold' : 'text-black hover:bg-slate-100'
                }`}
              >
                LAB
              </button>
            </div>

            <button
              onClick={() => {
                sound.playCancel();
                onClose();
              }}
              className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 border-2 border-black transition-colors cursor-pointer font-bold"
            >
              ✕ FECHAR
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-4 overflow-y-auto flex-1 text-black custom-scrollbar">
          {activeTab === 'codex' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5">
              {/* Card 1: Forma Geral */}
              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 shadow-[2px_2px_0_#000] space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">📐 Forma Geral</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-black px-1.5 sm:px-2 py-0.5 font-bold">a ≠ 0</span>
                </div>
                <div className="bg-white p-2 sm:p-2.5 border-2 border-black font-mono text-center text-sm sm:text-base text-black font-black">
                  f(x) = ax² + bx + c
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-black font-bold">
                  <li>• <strong>a:</strong> concavidade (a &gt; 0 cima ∪, a &lt; 0 baixo ∩).</li>
                  <li>• <strong>b:</strong> inclinação ao cruzar o eixo Y.</li>
                  <li>• <strong>c:</strong> corte exato em Y: <code>(0, c)</code>.</li>
                </ul>
              </div>

              {/* Card 2: Discriminante Delta */}
              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 shadow-[2px_2px_0_#000] space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">🔥 Discriminante (Δ)</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-black px-1.5 sm:px-2 py-0.5 font-bold">Raízes</span>
                </div>
                <div className="bg-white p-2 sm:p-2.5 border-2 border-black font-mono text-center text-sm sm:text-base text-black font-black">
                  Δ = b² - 4·a·c
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-black font-bold">
                  <li>• <strong>Δ &gt; 0:</strong> 2 raízes reais distintas (x₁ ≠ x₂).</li>
                  <li>• <strong>Δ = 0:</strong> 1 raiz real dupla (x₁ = x₂).</li>
                  <li>• <strong>Δ &lt; 0:</strong> sem raízes reais (não toca X).</li>
                </ul>
              </div>

              {/* Card 3: Fórmula de Bhaskara */}
              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 shadow-[2px_2px_0_#000] space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">⚡ Bhaskara</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-black px-1.5 sm:px-2 py-0.5 font-bold">f(x) = 0</span>
                </div>
                <div className="bg-white p-2 sm:p-2.5 border-2 border-black font-mono text-center text-sm sm:text-base text-black font-black">
                  x = (-b ± √Δ) / 2a
                </div>
                <p className="text-[11px] sm:text-xs font-mono text-black font-bold">
                  Soma: <code>S = -b/a</code> | Produto: <code>P = c/a</code>
                </p>
              </div>

              {/* Card 4: Coordenadas do Vértice */}
              <div className="bg-slate-50 border-2 border-black p-2.5 sm:p-3.5 shadow-[2px_2px_0_#000] space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase">🌀 Vértice V(Xᵥ, Yᵥ)</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-black px-1.5 sm:px-2 py-0.5 font-bold">Extremo</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                  <div className="bg-white p-1.5 sm:p-2 border-2 border-black text-center font-mono font-black text-black text-[11px] sm:text-xs">
                    Xᵥ = -b / 2a
                  </div>
                  <div className="bg-white p-1.5 sm:p-2 border-2 border-black text-center font-mono font-black text-black text-[11px] sm:text-xs">
                    Yᵥ = -Δ / 4a
                  </div>
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-black font-bold">
                  <li>• <strong>a &gt; 0:</strong> Ponto de MÍNIMO.</li>
                  <li>• <strong>a &lt; 0:</strong> Ponto de MÁXIMO.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Tab: Interactive Live Sandbox */
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
              {/* Sliders Control */}
              <div className="w-full md:w-1/2 bg-slate-50 p-3 sm:p-4 border-2 border-black space-y-2.5 sm:space-y-3.5 shadow-[2px_2px_0_#000]">
                <h3 className="font-pixel text-[10px] sm:text-xs text-black font-black uppercase mb-1">🎛️ Ajustar Coeficientes:</h3>

                {/* Slider A */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>a = {sliderA}</span>
                    <span className="text-slate-600">{sliderA > 0 ? '∪ Cima' : '∩ Baixo'}</span>
                  </div>
                  <input
                    type="range"
                    min="-3"
                    max="3"
                    step="1"
                    value={sliderA}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSliderA(val === 0 ? 1 : val);
                    }}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                {/* Slider B */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>b = {sliderB}</span>
                    <span className="text-slate-600">Xᵥ = {xv.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderB}
                    onChange={(e) => setSliderB(parseInt(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                {/* Slider C */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>c = {sliderC}</span>
                    <span className="text-slate-600">Corte Y: (0, {sliderC})</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderC}
                    onChange={(e) => setSliderC(parseInt(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                {/* Live Stats */}
                <div className="bg-white p-2.5 sm:p-3 border-2 border-black font-mono text-xs space-y-1 font-bold">
                  <div>
                    Δ = ({sliderB})² - 4·({sliderA})·({sliderC}) = {delta}
                  </div>
                  <div>
                    Vértice V = ({xv.toFixed(1)}, {yv.toFixed(1)})
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {delta > 0 ? '✓ 2 Raízes reais' : delta === 0 ? '✓ 1 Raiz dupla' : '✗ Nenhuma raiz real'}
                  </div>
                </div>
              </div>

              {/* Real-time Rendered Parabola */}
              <div className="w-full md:w-1/2 flex justify-center bg-white p-2 sm:p-3 border-2 border-black shadow-[2px_2px_0_#000] gb-sprite-mono">
                <ParabolaGraph 
                  a={sliderA} 
                  b={sliderB} 
                  c={sliderC} 
                  width={300} 
                  height={200} 
                  className="w-full max-w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

