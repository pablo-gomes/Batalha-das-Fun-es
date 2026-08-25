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
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 select-none">
      <div className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-2xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-[6px_6px_0px_#122b1e] overflow-hidden text-[#163323]">
        {/* Header */}
        <div className="bg-[#f0f7f2] border-b-2 border-[#1b3b2b] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="font-pixel text-[11px] sm:text-sm text-[#143021] font-black uppercase">
                Grimório das Funções
              </h2>
              <p className="text-[9px] sm:text-[10px] font-mono text-emerald-800 font-bold">
                Guia de consulta rápida e laboratório interativo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border-2 border-[#1b3b2b] rounded-lg gap-0.5 p-0.5 bg-white">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('codex');
                }}
                className={`text-[9px] sm:text-[10px] font-pixel px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'codex' ? 'gba-btn-primary shadow-xs' : 'text-[#1b3b2b] hover:bg-[#edf7f1]'
                }`}
              >
                FÓRMULAS
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('sandbox');
                }}
                className={`text-[9px] sm:text-[10px] font-pixel px-3 py-1 rounded transition-colors cursor-pointer ${
                  activeTab === 'sandbox' ? 'gba-btn-blue shadow-xs' : 'text-[#1b3b2b] hover:bg-[#edf7f1]'
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
              className="bg-white hover:bg-rose-50 text-rose-800 font-pixel text-[10px] sm:text-xs px-3 py-1.5 border-2 border-rose-800 rounded-lg transition-colors cursor-pointer font-bold shadow-xs"
            >
              ✕ FECHAR
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 text-[#163323] custom-scrollbar">
          {activeTab === 'codex' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Card 1: Forma Geral */}
              <div className="bg-[#f0f9ff] border-2 border-[#0284c7] rounded-xl p-3 sm:p-4 shadow-[2px_2px_0_#0369a1] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-sky-950 font-black uppercase">📐 Forma Geral</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-sky-700 px-2 py-0.5 rounded font-bold">a ≠ 0</span>
                </div>
                <div className="bg-white p-2.5 border-2 border-sky-300 rounded-lg font-mono text-center text-sm sm:text-base text-sky-950 font-black shadow-xs">
                  f(x) = ax² + bx + c
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-sky-900 font-bold">
                  <li>• <strong>a:</strong> concavidade (a &gt; 0 cima ∪, a &lt; 0 baixo ∩).</li>
                  <li>• <strong>b:</strong> inclinação ao cruzar o eixo vertical Y.</li>
                  <li>• <strong>c:</strong> corte exato no eixo Y: <code>(0, c)</code>.</li>
                </ul>
              </div>

              {/* Card 2: Discriminante Delta */}
              <div className="bg-[#fff7ed] border-2 border-[#ea580c] rounded-xl p-3 sm:p-4 shadow-[2px_2px_0_#c2410c] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-orange-950 font-black uppercase">🔥 Discriminante (Δ)</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-orange-700 px-2 py-0.5 rounded font-bold">Raízes</span>
                </div>
                <div className="bg-white p-2.5 border-2 border-orange-300 rounded-lg font-mono text-center text-sm sm:text-base text-orange-950 font-black shadow-xs">
                  Δ = b² - 4·a·c
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-orange-900 font-bold">
                  <li>• <strong>Δ &gt; 0:</strong> 2 raízes reais distintas (x₁ ≠ x₂).</li>
                  <li>• <strong>Δ = 0:</strong> 1 raiz real dupla (x₁ = x₂).</li>
                  <li>• <strong>Δ &lt; 0:</strong> sem raízes reais (não toca o eixo X).</li>
                </ul>
              </div>

              {/* Card 3: Fórmula de Bhaskara */}
              <div className="bg-[#f0fdf4] border-2 border-[#16a34a] rounded-xl p-3 sm:p-4 shadow-[2px_2px_0_#15803d] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-emerald-950 font-black uppercase">⚡ Bhaskara</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-emerald-700 px-2 py-0.5 rounded font-bold">f(x) = 0</span>
                </div>
                <div className="bg-white p-2.5 border-2 border-emerald-300 rounded-lg font-mono text-center text-sm sm:text-base text-emerald-950 font-black shadow-xs">
                  x = (-b ± √Δ) / 2a
                </div>
                <p className="text-[11px] sm:text-xs font-mono text-emerald-900 font-bold">
                  Soma: <code>S = -b/a</code> | Produto: <code>P = c/a</code>
                </p>
              </div>

              {/* Card 4: Coordenadas do Vértice */}
              <div className="bg-[#faf5ff] border-2 border-[#9333ea] rounded-xl p-3 sm:p-4 shadow-[2px_2px_0_#7e22ce] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-pixel text-[10px] sm:text-xs text-purple-950 font-black uppercase">🌀 Vértice V(Xᵥ, Yᵥ)</h3>
                  <span className="text-[9px] sm:text-[10px] font-mono text-white bg-purple-700 px-2 py-0.5 rounded font-bold">Extremo</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 border-2 border-purple-300 rounded-lg text-center font-mono font-black text-purple-950 text-[11px] sm:text-xs shadow-xs">
                    Xᵥ = -b / 2a
                  </div>
                  <div className="bg-white p-2 border-2 border-purple-300 rounded-lg text-center font-mono font-black text-purple-950 text-[11px] sm:text-xs shadow-xs">
                    Yᵥ = -Δ / 4a
                  </div>
                </div>
                <ul className="text-[11px] sm:text-xs font-mono space-y-1 text-purple-900 font-bold">
                  <li>• <strong>a &gt; 0:</strong> Ponto de MÍNIMO global.</li>
                  <li>• <strong>a &lt; 0:</strong> Ponto de MÁXIMO global.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Tab: Interactive Live Sandbox */
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center">
              {/* Sliders Control */}
              <div className="w-full md:w-1/2 bg-[#f0f7f2] p-3.5 sm:p-4 border-2 border-[#1b3b2b] rounded-xl space-y-3 shadow-sm">
                <h3 className="font-pixel text-[10px] sm:text-xs text-emerald-950 font-black uppercase mb-1">🎛️ Ajustar Coeficientes:</h3>

                {/* Slider A */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>a = {sliderA}</span>
                    <span className="text-emerald-700">{sliderA > 0 ? '∪ Cima' : '∩ Baixo'}</span>
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
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Slider B */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>b = {sliderB}</span>
                    <span className="text-sky-700">Xᵥ = {xv.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderB}
                    onChange={(e) => setSliderB(parseInt(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />
                </div>

                {/* Slider C */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1 font-bold">
                    <span>c = {sliderC}</span>
                    <span className="text-amber-700">Corte Y: (0, {sliderC})</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderC}
                    onChange={(e) => setSliderC(parseInt(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>

                {/* Live Stats */}
                <div className="bg-white p-3 border-2 border-[#1b3b2b] rounded-lg font-mono text-xs space-y-1 font-bold shadow-xs">
                  <div className="text-emerald-950">
                    Δ = ({sliderB})² - 4·({sliderA})·({sliderC}) = <strong className="text-orange-600">{delta}</strong>
                  </div>
                  <div className="text-sky-950">
                    Vértice V = ({xv.toFixed(1)}, {yv.toFixed(1)})
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    {delta > 0 ? '✓ 2 Raízes reais' : delta === 0 ? '✓ 1 Raiz dupla' : '✗ Nenhuma raiz real'}
                  </div>
                </div>
              </div>

              {/* Real-time Rendered Parabola */}
              <div className="w-full md:w-1/2 flex justify-center bg-white p-3 border-2 border-[#1b3b2b] rounded-xl shadow-[3px_3px_0_#122b1e] gba-sprite">
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
