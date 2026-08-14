import React, { useState } from 'react';
import { Creature } from '../types';

interface PixelSpriteProps {
  creature: Creature;
  isPlayerBackView?: boolean;
  isAttacking?: boolean;
  isHit?: boolean;
  isDefending?: boolean;
  size?: number;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  creature,
  isPlayerBackView = false,
  isAttacking = false,
  isHit = false,
  isDefending = false,
  size = 180
}) => {
  const [imageLoadError, setImageLoadError] = useState(false);
  const { element, stage, spriteColor, backSpriteColor, customPixelated = true } = creature;
  const colors = isPlayerBackView && backSpriteColor ? backSpriteColor : spriteColor;

  // Determine if there is an image configured for the current stage or root creature
  const currentForm = creature.forms?.[stage - 1];
  const frontImage = currentForm?.imageUrl || currentForm?.customImageUrl || creature.imageUrl || creature.customImageUrl;
  const backImage = currentForm?.backImageUrl || currentForm?.customBackImageUrl || creature.backImageUrl || creature.customBackImageUrl || frontImage;
  
  const activeImage = isPlayerBackView ? backImage : frontImage;
  const hasImage = Boolean(activeImage) && !imageLoadError;

  // Render authentic pixel art SVG depending on element & form stage when no custom image or on error
  const renderCreatureArt = () => {
    if (element === 'Raízes') {
      if (isPlayerBackView) {
        // Back view of Root / Seedling / Tree Dragon
        return (
          <g transform="translate(10, 10)">
            {/* Back body */}
            <rect x="35" y="45" width="50" height="55" fill={colors.primary} rx="6" />
            <rect x="42" y="30" width="36" height="30" fill={colors.secondary} rx="8" />
            
            {/* Back shell / Leaf armor */}
            <path d="M 38 55 Q 60 40 82 55 Q 85 85 60 95 Q 35 85 38 55 Z" fill={colors.secondary} />
            <path d="M 46 60 Q 60 50 74 60 Q 76 80 60 88 Q 44 80 46 60 Z" fill={colors.accent} opacity="0.6" />
            
            {/* Sprouting roots / vines from back */}
            <path d="M 32 80 Q 20 85 10 95 Q 22 98 34 88 Z" fill="#047857" />
            <path d="M 88 80 Q 100 85 110 95 Q 98 98 86 88 Z" fill="#047857" />
            <path d="M 50 25 Q 40 10 30 5 Q 45 12 52 22 Z" fill="#34d399" />
            <path d="M 70 25 Q 80 10 90 5 Q 75 12 68 22 Z" fill="#34d399" />

            {/* Back tail root */}
            <path d="M 55 95 Q 60 115 50 125 Q 68 115 65 95 Z" fill="#059669" />
          </g>
        );
      } else {
        // Front view of Root creature
        return (
          <g transform="translate(10, 10)">
            {/* Aura for stage 2/3 */}
            {stage > 1 && (
              <circle cx="60" cy="65" r="52" fill={spriteColor.aura} className="animate-pulse" />
            )}

            {/* Body */}
            <rect x="35" y="40" width="50" height="55" fill={colors.primary} rx="8" />
            <circle cx="60" cy="38" r="24" fill={colors.primary} />
            
            {/* Belly */}
            <ellipse cx="60" cy="70" rx="16" ry="20" fill={colors.accent} />
            
            {/* Eyes pixelated */}
            <rect x="48" y="32" width="6" height="8" fill="#0f172a" />
            <rect x="49" y="33" width="2" height="3" fill="#ffffff" />
            <rect x="66" y="32" width="6" height="8" fill="#0f172a" />
            <rect x="67" y="33" width="2" height="3" fill="#ffffff" />

            {/* Cute mouth / Horns */}
            <path d="M 56 46 Q 60 50 64 46" stroke="#065f46" strokeWidth="2" fill="none" />
            
            {/* Leaves / Branches on head */}
            <path d="M 60 15 Q 40 -5 30 5 Q 50 5 58 18 Z" fill="#34d399" />
            <path d="M 60 15 Q 80 -5 90 5 Q 70 5 62 18 Z" fill="#34d399" />
            
            {/* Feet */}
            <rect x="38" y="90" width="16" height="10" fill={colors.secondary} rx="3" />
            <rect x="66" y="90" width="16" height="10" fill={colors.secondary} rx="3" />
            
            {/* Root whiskers */}
            <path d="M 36 65 Q 20 70 12 80" stroke="#047857" strokeWidth="4" fill="none" />
            <path d="M 84 65 Q 100 70 108 80" stroke="#047857" strokeWidth="4" fill="none" />
          </g>
        );
      }
    } else if (element === 'Delta') {
      if (isPlayerBackView) {
        // Back view of Fire/Delta dragon
        return (
          <g transform="translate(10, 10)">
            {/* Back body */}
            <rect x="38" y="45" width="44" height="52" fill={colors.primary} rx="8" />
            <circle cx="60" cy="35" r="20" fill={colors.secondary} />
            
            {/* Flame on tail */}
            <path d="M 78 85 Q 95 90 105 75 Q 115 60 100 50 Q 110 40 95 35 Q 85 55 80 75 Z" fill="#f59e0b" className="animate-pulse" />
            <path d="M 85 80 Q 95 75 100 65 Q 92 55 88 70 Z" fill="#ef4444" />
            <path d="M 88 75 Q 93 70 95 62 Q 90 60 88 68 Z" fill="#fef08a" />

            {/* Back spine / Delta ridges */}
            <polygon points="60,20 54,32 66,32" fill="#7f1d1d" />
            <polygon points="60,42 52,56 68,56" fill="#7f1d1d" />
            <polygon points="60,66 52,80 68,80" fill="#7f1d1d" />
          </g>
        );
      } else {
        // Front view of Fire/Delta Dragon
        return (
          <g transform="translate(10, 10)">
            {stage > 1 && (
              <circle cx="60" cy="60" r="50" fill={spriteColor.aura} className="animate-pulse" />
            )}
            {/* Head & Horns */}
            <circle cx="60" cy="38" r="22" fill={colors.primary} />
            <polygon points="45,22 35,5 50,18" fill="#991b1b" />
            <polygon points="75,22 85,5 70,18" fill="#991b1b" />

            {/* Body */}
            <rect x="40" y="48" width="40" height="48" fill={colors.primary} rx="8" />
            <ellipse cx="60" cy="72" rx="14" ry="18" fill="#fef08a" />

            {/* Eyes */}
            <polygon points="48,34 56,38 48,40" fill="#0f172a" />
            <rect x="50" y="35" width="2" height="2" fill="#ffffff" />
            <polygon points="72,34 64,38 72,40" fill="#0f172a" />
            <rect x="68" y="35" width="2" height="2" fill="#ffffff" />

            {/* Tail Flame */}
            <path d="M 80 82 Q 105 85 110 65 Q 115 45 98 40 Q 108 30 92 25 Q 82 45 80 72 Z" fill="#f59e0b" className="animate-pulse" />
            <path d="M 86 75 Q 98 70 102 55 Q 94 48 90 62 Z" fill="#ef4444" />
            
            {/* Feet */}
            <rect x="40" y="90" width="14" height="8" fill="#7f1d1d" rx="2" />
            <rect x="66" y="90" width="14" height="8" fill="#7f1d1d" rx="2" />
          </g>
        );
      }
    } else if (element === 'Vértice') {
      if (isPlayerBackView) {
        // Back view of Blue Water/Sky Vertex Golem
        return (
          <g transform="translate(10, 10)">
            <rect x="34" y="42" width="52" height="56" fill={colors.primary} rx="12" />
            <circle cx="60" cy="32" r="22" fill={colors.secondary} />
            
            {/* Vertex Halo / Crystal on Back */}
            <polygon points="60,10 70,30 60,40 50,30" fill="#60a5fa" className="animate-pulse" />
            <circle cx="60" cy="65" r="14" fill={colors.accent} opacity="0.8" />
            
            {/* Parabola Wings */}
            <path d="M 34 55 Q 10 40 5 60 Q 15 75 34 70 Z" fill="#1e3a8a" />
            <path d="M 86 55 Q 110 40 115 60 Q 105 75 86 70 Z" fill="#1e3a8a" />
          </g>
        );
      } else {
        // Front view of Vertex Titan
        return (
          <g transform="translate(10, 10)">
            {stage > 1 && (
              <circle cx="60" cy="60" r="52" fill={spriteColor.aura} className="animate-pulse" />
            )}
            {/* Floating Vertex Crown */}
            <polygon points="60,5 72,22 60,28 48,22" fill="#93c5fd" className="animate-bounce" />
            
            {/* Head */}
            <circle cx="60" cy="38" r="22" fill={colors.primary} />
            
            {/* Body */}
            <rect x="36" y="46" width="48" height="50" fill={colors.primary} rx="10" />
            <circle cx="60" cy="70" r="14" fill="#bfdbfe" />
            
            {/* Glowing Visor Eyes */}
            <rect x="46" y="34" width="28" height="6" fill="#0284c7" rx="3" />
            <rect x="52" y="35" width="6" height="4" fill="#ffffff" />
            <rect x="62" y="35" width="6" height="4" fill="#ffffff" />

            {/* Parabola Arms */}
            <path d="M 36 60 Q 15 50 10 70 Q 22 82 36 74 Z" fill={colors.secondary} />
            <path d="M 84 60 Q 105 50 110 70 Q 98 82 84 74 Z" fill={colors.secondary} />

            {/* Floating energy base */}
            <ellipse cx="60" cy="98" rx="20" ry="5" fill="#38bdf8" opacity="0.6" className="animate-pulse" />
          </g>
        );
      }
    } else {
      // Parábola / Geral / Boss
      return (
        <g transform="translate(10, 10)">
          <circle cx="60" cy="60" r="48" fill={spriteColor.aura} className="animate-pulse" />
          {/* Main geometric core */}
          <rect x="38" y="38" width="44" height="44" fill={colors.primary} rx="8" transform="rotate(45 60 60)" />
          <circle cx="60" cy="60" r="18" fill={colors.secondary} />
          <circle cx="60" cy="60" r="10" fill={colors.accent} />
          
          {/* Parabola orbiting arcs */}
          <path d="M 20 80 Q 60 20 100 80" stroke="#f59e0b" strokeWidth="4" fill="none" strokeDasharray="6,4" />
          <path d="M 20 40 Q 60 100 100 40" stroke="#38bdf8" strokeWidth="3" fill="none" strokeDasharray="4,4" />
          
          {/* Glowing Eyes */}
          <circle cx="54" cy="58" r="3" fill="#ffffff" />
          <circle cx="66" cy="58" r="3" fill="#ffffff" />
        </g>
      );
    }
  };

  return (
    <div 
      className={`relative select-none flex items-center justify-center transition-transform duration-300
        ${isAttacking ? (isPlayerBackView ? 'translate-x-10 -translate-y-4 scale-110' : '-translate-x-10 translate-y-4 scale-110') : ''}
        ${isHit ? 'animate-shake opacity-70 filter brightness-150' : ''}
        ${isDefending ? 'ring-4 ring-cyan-400 rounded-full' : ''}
      `}
      style={{ width: size, height: size }}
    >
      {/* Platform Shadow / Battle Circle */}
      <div 
        className={`absolute bottom-0 w-3/4 h-7 rounded-[100%] ${
          isPlayerBackView 
            ? 'bg-emerald-950/60 border-2 border-emerald-700/40' 
            : 'bg-slate-800/80 border-2 border-slate-600/50'
        } blur-[1px] shadow-inner`}
      />

      {/* Stage Aura for higher levels or status */}
      {stage > 1 && (
        <div 
          className="absolute inset-2 rounded-full blur-md opacity-30 animate-pulse pointer-events-none"
          style={{ backgroundColor: creature.elementColor }}
        />
      )}

      {hasImage ? (
        <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
          <img
            src={activeImage}
            alt={creature.name}
            referrerPolicy="no-referrer"
            onError={() => setImageLoadError(true)}
            className={`max-w-full max-h-full object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.65)] ${
              customPixelated ? 'image-render-pixel' : ''
            } ${isPlayerBackView && !backImage ? 'scale-x-[-1]' : ''}`}
            style={{
              imageRendering: customPixelated ? 'pixelated' : 'auto'
            }}
          />
        </div>
      ) : (
        <svg 
          viewBox="0 0 120 120" 
          className="w-full h-full relative z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] image-render-pixel"
        >
          {renderCreatureArt()}
        </svg>
      )}

      {/* Shield effect when defending */}
      {isDefending && (
        <div className="absolute inset-0 z-20 border-4 border-cyan-400/80 rounded-full animate-ping opacity-50 pointer-events-none" />
      )}
    </div>
  );
};

