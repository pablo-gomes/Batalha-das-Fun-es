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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="bg-[#0b1120] border-4 border-amber-500 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/50 p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="font-pixel text-sm sm:text-base text-amber-300">
                Grimório das Funções do 2º Grau
              </h2>
              <p className="text-[10px] font-mono text-amber-200/70">
                O manual sagrado dos Mestres da Parábola e Álgebra
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('codex');
                }}
                className={`text-[10px] font-pixel px-3 py-1 rounded transition-colors ${
                  activeTab === 'codex' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fórmulas
              </button>
              <button
                onClick={() => {
                  sound.playSelect();
                  setActiveTab('sandbox');
                }}
                className={`text-[10px] font-pixel px-3 py-1 rounded transition-colors ${
                  activeTab === 'sandbox' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Laboratório Live
              </button>
            </div>

            <button
              onClick={() => {
                sound.playCancel();
                onClose();
              }}
              className="bg-rose-950 hover:bg-rose-900 text-rose-300 font-pixel text-xs px-3 py-1.5 rounded border border-rose-600 transition-colors"
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 text-slate-200">
          {activeTab === 'codex' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Forma Geral */}
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-pixel text-xs text-amber-300">📐 Forma Geral Quadrática</h3>
                  <span className="text-[10px] font-mono text-cyan-400">a ≠ 0</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-center text-lg text-cyan-300 font-bold mb-2">
                  f(x) = ax² + bx + c
                </div>
                <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                  <li>• <strong>a (coeficiente quadrático):</strong> define abertura e concavidade.</li>
                  <li>• <strong>b (coeficiente linear):</strong> inclinação ao cruzar o eixo Y.</li>
                  <li>• <strong>c (termo independente):</strong> ponto exato onde cruza o eixo Y: <code>(0, c)</code>.</li>
                </ul>
              </div>

              {/* Card 2: Discriminante Delta */}
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-pixel text-xs text-rose-300">🔥 O Discriminante (Δ)</h3>
                  <span className="text-[10px] font-mono text-amber-400">Número de Raízes</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-center text-lg text-rose-400 font-bold mb-2">
                  Δ = b² - 4·a·c
                </div>
                <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                  <li>• <strong>Δ &gt; 0:</strong> Corta o eixo X em <span className="text-emerald-400 font-bold">2 raízes reais distintas</span> (x₁ ≠ x₂).</li>
                  <li>• <strong>Δ = 0:</strong> Toca o eixo X em <span className="text-amber-400 font-bold">1 única raiz real dupla</span> (x₁ = x₂ = Vértice).</li>
                  <li>• <strong>Δ &lt; 0:</strong> <span className="text-rose-400 font-bold">Não possui raízes reais</span> (não toca o eixo X).</li>
                </ul>
              </div>

              {/* Card 3: Fórmula de Bhaskara */}
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-pixel text-xs text-emerald-300">⚡ Fórmula de Bhaskara</h3>
                  <span className="text-[10px] font-mono text-emerald-400">Raízes f(x)=0</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-center text-lg text-emerald-300 font-bold mb-2">
                  x = (-b ± √Δ) / 2a
                </div>
                <p className="text-[11px] font-mono text-slate-300">
                  Soma das raízes: <code className="text-amber-300">S = -b/a</code> | Produto: <code className="text-amber-300">P = c/a</code>
                </p>
              </div>

              {/* Card 4: Coordenadas do Vértice */}
              <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3.5 shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-pixel text-xs text-blue-300">🌀 Vértice da Parábola V(Xᵥ, Yᵥ)</h3>
                  <span className="text-[10px] font-mono text-blue-400">Ponto Extremo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center font-mono font-bold text-cyan-300 text-sm">
                    Xᵥ = -b / 2a
                  </div>
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-center font-mono font-bold text-cyan-300 text-sm">
                    Yᵥ = -Δ / 4a = f(Xᵥ)
                  </div>
                </div>
                <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                  <li>• <strong>a &gt; 0:</strong> Vértice é ponto de <span className="text-emerald-400 font-bold">MÍNIMO</span>.</li>
                  <li>• <strong>a &lt; 0:</strong> Vértice é ponto de <span className="text-rose-400 font-bold">MÁXIMO</span>.</li>
                  <li>• <strong>Eixo de Simetria:</strong> reta vertical <code>x = Xᵥ</code>.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Tab: Interactive Live Sandbox */
            <div className="flex flex-col md:flex-row gap-5 items-center">
              {/* Sliders Control */}
              <div className="w-full md:w-1/2 bg-slate-900 p-4 rounded-xl border-2 border-slate-700 space-y-4">
                <h3 className="font-pixel text-xs text-amber-300 mb-2">🎛️ Manipular Coeficientes da Função:</h3>

                {/* Slider A */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-cyan-300 font-bold">Coeficiente a: {sliderA}</span>
                    <span className="text-slate-400">{sliderA > 0 ? '∪ Concavidade Cima' : '∩ Concavidade Baixo'}</span>
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
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Slider B */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-emerald-300 font-bold">Coeficiente b: {sliderB}</span>
                    <span className="text-slate-400">Xᵥ = {xv.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderB}
                    onChange={(e) => setSliderB(parseInt(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>

                {/* Slider C */}
                <div>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-pink-300 font-bold">Coeficiente c: {sliderC}</span>
                    <span className="text-slate-400">Corte Y em (0, {sliderC})</span>
                  </div>
                  <input
                    type="range"
                    min="-8"
                    max="8"
                    step="1"
                    value={sliderC}
                    onChange={(e) => setSliderC(parseInt(e.target.value))}
                    className="w-full accent-pink-400 cursor-pointer"
                  />
                </div>

                {/* Live Stats */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
                  <div className="text-amber-300 font-bold">
                    Δ = ({sliderB})² - 4·({sliderA})·({sliderC}) = {delta}
                  </div>
                  <div className="text-blue-300">
                    Vértice V = ({xv.toFixed(1)}, {yv.toFixed(1)})
                  </div>
                  <div className="text-slate-400">
                    {delta > 0 ? '✓ 2 Raízes reais distintas' : delta === 0 ? '✓ 1 Raiz real dupla' : '✗ Nenhuma raiz real'}
                  </div>
                </div>
              </div>

              {/* Real-time Rendered Parabola */}
              <div className="w-full md:w-1/2 flex justify-center">
                <ParabolaGraph 
                  a={sliderA} 
                  b={sliderB} 
                  c={sliderC} 
                  width={340} 
                  height={240} 
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
