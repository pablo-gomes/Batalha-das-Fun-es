import React, { useState } from 'react';

interface ParabolaGraphProps {
  a: number;
  b: number;
  c: number;
  highlightRoots?: boolean;
  highlightVertex?: boolean;
  highlightYIntercept?: boolean;
  highlightSymmetry?: boolean;
  interactive?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export const ParabolaGraph: React.FC<ParabolaGraphProps> = ({
  a,
  b,
  c,
  highlightRoots = true,
  highlightVertex = true,
  highlightYIntercept = true,
  highlightSymmetry = true,
  interactive = true,
  className = '',
  width = 300,
  height = 200
}) => {
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Calculate key points
  const delta = b * b - 4 * a * c;
  const xv = -b / (2 * a);
  const yv = -delta / (4 * a);

  let root1: number | null = null;
  let root2: number | null = null;
  if (delta >= 0) {
    root1 = (-b - Math.sqrt(delta)) / (2 * a);
    root2 = (-b + Math.sqrt(delta)) / (2 * a);
  }

  // Determine viewport range based on roots and vertex
  const xRadius = Math.max(
    Math.abs(xv) + 3,
    root1 !== null ? Math.max(Math.abs(root1), Math.abs(root2!)) + 2 : 4,
    4
  );
  const minX = -Math.ceil(xRadius);
  const maxX = Math.ceil(xRadius);

  const yVals = [yv, c, a * minX * minX + b * minX + c, a * maxX * maxX + b * maxX + c];
  const minY = Math.min(-4, Math.floor(Math.min(...yVals)) - 2);
  const maxY = Math.max(6, Math.ceil(Math.max(...yVals)) + 2);

  // Coordinate conversion functions
  const padding = 28;
  const graphW = width - padding * 2;
  const graphH = height - padding * 2;

  const toSvgX = (x: number) => padding + ((x - minX) / (maxX - minX)) * graphW;
  const toSvgY = (y: number) => padding + ((maxY - y) / (maxY - minY)) * graphH;

  // Generate SVG path for the parabola
  const step = (maxX - minX) / 60;
  let pathD = '';
  for (let x = minX; x <= maxX; x += step) {
    const y = a * x * x + b * x + c;
    // clamp for drawing outside viewport
    const clampedY = Math.max(minY - 20, Math.min(maxY + 20, y));
    const sx = toSvgX(x);
    const sy = toSvgY(clampedY);
    if (!pathD) {
      pathD = `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
    } else {
      pathD += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
    }
  }

  // Calculate hover y
  const hoverY = hoverX !== null ? a * hoverX * hoverX + b * hoverX + c : null;

  return (
    <div className={`relative bg-slate-950 border-2 border-slate-700 rounded p-2 select-none ${className}`}>
      {/* Mini Title & Function representation */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-[11px] font-mono font-bold text-amber-400">
          f(x) = {a === 1 ? '' : a === -1 ? '-' : a}x² {b !== 0 ? (b > 0 ? `+ ${b === 1 ? '' : b}x` : `- ${Math.abs(b) === 1 ? '' : Math.abs(b)}x`) : ''} {c !== 0 ? (c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`) : ''}
        </span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${a > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
          a {a > 0 ? '> 0 (∪ Mín)' : '< 0 (∩ Máx)'}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseMove={(e) => {
          if (!interactive) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = ((e.clientX - rect.left) / rect.width) * width;
          const mathX = minX + ((clickX - padding) / graphW) * (maxX - minX);
          setHoverX(Math.round(mathX * 2) / 2);
        }}
        onMouseLeave={() => setHoverX(null)}
      >
        {/* Background Grid */}
        {Array.from({ length: maxX - minX + 1 }).map((_, i) => {
          const x = minX + i;
          const sx = toSvgX(x);
          return (
            <line
              key={`grid_x_${x}`}
              x1={sx}
              y1={padding}
              x2={sx}
              y2={height - padding}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray={x === 0 ? undefined : '2,2'}
            />
          );
        })}

        {Array.from({ length: maxY - minY + 1 }).map((_, i) => {
          const y = minY + i;
          if (y % 2 !== 0 && maxY - minY > 12) return null;
          const sy = toSvgY(y);
          return (
            <line
              key={`grid_y_${y}`}
              x1={padding}
              y1={sy}
              x2={width - padding}
              y2={sy}
              stroke="#1e293b"
              strokeWidth="1"
              strokeDasharray={y === 0 ? undefined : '2,2'}
            />
          );
        })}

        {/* X and Y Axes */}
        <line
          x1={padding}
          y1={toSvgY(0)}
          x2={width - padding}
          y2={toSvgY(0)}
          stroke="#94a3b8"
          strokeWidth="2"
        />
        <line
          x1={toSvgX(0)}
          y1={padding}
          x2={toSvgX(0)}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Axis Labels */}
        <text x={width - padding + 8} y={toSvgY(0) + 4} fill="#cbd5e1" fontSize="10" fontFamily="monospace">x</text>
        <text x={toSvgX(0) - 4} y={padding - 6} fill="#cbd5e1" fontSize="10" fontFamily="monospace">y</text>

        {/* Axis of Symmetry */}
        {highlightSymmetry && (
          <line
            x1={toSvgX(xv)}
            y1={padding}
            x2={toSvgX(xv)}
            y2={height - padding}
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            opacity="0.8"
          />
        )}

        {/* Parabola Curve */}
        <path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]"
        />

        {/* Vertex Point V(Xv, Yv) */}
        {highlightVertex && (
          <g>
            <circle
              cx={toSvgX(xv)}
              cy={toSvgY(yv)}
              r="5"
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(xv) + 6}
              y={toSvgY(yv) - 6}
              fill="#fef08a"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              V({xv.toFixed(1)}, {yv.toFixed(1)})
            </text>
          </g>
        )}

        {/* Roots Points */}
        {highlightRoots && root1 !== null && root2 !== null && (
          <g>
            <circle
              cx={toSvgX(root1)}
              cy={toSvgY(0)}
              r="4.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <circle
              cx={toSvgX(root2)}
              cy={toSvgY(0)}
              r="4.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
            <text
              x={toSvgX(root1) - 4}
              y={toSvgY(0) + 14}
              fill="#6ee7b7"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              x₁={root1.toFixed(1)}
            </text>
            <text
              x={toSvgX(root2) - 4}
              y={toSvgY(0) + 14}
              fill="#6ee7b7"
              fontSize="9"
              fontWeight="bold"
              fontFamily="monospace"
            >
              x₂={root2.toFixed(1)}
            </text>
          </g>
        )}

        {/* Y Intercept (0, c) */}
        {highlightYIntercept && (
          <circle
            cx={toSvgX(0)}
            cy={toSvgY(c)}
            r="3.5"
            fill="#ec4899"
            stroke="#ffffff"
            strokeWidth="1"
          />
        )}

        {/* Interactive Hover Probe */}
        {hoverX !== null && hoverY !== null && (
          <g>
            <circle
              cx={toSvgX(hoverX)}
              cy={toSvgY(hoverY)}
              r="4"
              fill="#e2e8f0"
              stroke="#0284c7"
              strokeWidth="2"
            />
            <rect
              x={toSvgX(hoverX) - 35}
              y={toSvgY(hoverY) - 22}
              width="70"
              height="16"
              fill="#0f172a"
              stroke="#38bdf8"
              strokeWidth="1"
              rx="3"
            />
            <text
              x={toSvgX(hoverX)}
              y={toSvgY(hoverY) - 11}
              fill="#38bdf8"
              fontSize="9"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="monospace"
            >
              ({hoverX}, {hoverY.toFixed(1)})
            </text>
          </g>
        )}
      </svg>

      {/* Legend footer */}
      <div className="flex flex-wrap items-center justify-between gap-1 mt-1 text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Raízes (f(x)=0)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Vértice (Xᵥ, Yᵥ)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-pink-400 inline-block" /> Corte Y (0, {c})
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-1 bg-purple-400 inline-block" /> Eixo Simetria (x={xv.toFixed(1)})
        </span>
      </div>
    </div>
  );
};
