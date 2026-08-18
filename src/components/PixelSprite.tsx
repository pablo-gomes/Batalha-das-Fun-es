import React, { useState, useEffect } from 'react';
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
  const [fallbackIndex, setFallbackIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { element, stage = 1, spriteColor, customPixelated = true } = creature;

  // Determine active form
  const currentForm = creature.forms?.[stage - 1] || creature.forms?.find(f => f.stage === stage) || creature.forms?.[0];
  const primaryFront = currentForm?.imageUrl || creature.imageUrl;
  const primaryBack = currentForm?.backImageUrl || creature.backImageUrl || primaryFront;
  const baseChosen = isPlayerBackView ? primaryBack : primaryFront;

  // Extract numeric pokemon ID from URL if present (e.g. ".../1.gif" => 1)
  const extractId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/\/(\d+)\.(gif|png)$/);
    return match ? match[1] : null;
  };

  const pokeId = extractId(baseChosen);

  // Multi-tier fallback URLs list:
  // 1: Primary Showdown GIF
  // 2: Gen 5 Black/White Animated GIF (Fast CDN)
  // 3: Official Static Pixel PNG (Loads instantly, 2KB)
  // 4: Official Artwork PNG
  const fallbackList = React.useMemo(() => {
    const urls: string[] = [];
    if (baseChosen) urls.push(baseChosen);

    if (pokeId) {
      if (isPlayerBackView) {
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${pokeId}.gif`);
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokeId}.png`);
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`);
      } else {
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokeId}.gif`);
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`);
        urls.push(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`);
      }
    }

    return Array.from(new Set(urls.filter(Boolean)));
  }, [baseChosen, pokeId, isPlayerBackView]);

  const activeSrc = fallbackList[fallbackIndex] || fallbackList[0];

  // Reset fallback index and loading state when creature or view changes
  useEffect(() => {
    setFallbackIndex(0);
    setIsLoading(true);
  }, [creature.id, creature.stage, isPlayerBackView, baseChosen]);

  const handleImageError = () => {
    if (fallbackIndex < fallbackList.length - 1) {
      setFallbackIndex(prev => prev + 1);
    } else {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div 
      className={`relative select-none flex items-center justify-center transition-transform duration-300
        ${isAttacking ? (isPlayerBackView ? 'translate-x-8 -translate-y-3 scale-110' : '-translate-x-8 translate-y-3 scale-110') : ''}
        ${isHit ? 'animate-shake opacity-70 filter brightness-150' : ''}
        ${isDefending ? 'ring-4 ring-cyan-400 rounded-full' : ''}
      `}
      style={{ width: size, height: size }}
    >
      {/* Platform Shadow / Battle Circle */}
      <div 
        className={`absolute bottom-0 w-3/4 h-6 sm:h-7 rounded-[100%] ${
          isPlayerBackView 
            ? 'bg-emerald-950/60 border-2 border-emerald-700/40' 
            : 'bg-slate-800/80 border-2 border-slate-600/50'
        } blur-[1px] shadow-inner`}
      />

      {/* Stage Aura for higher levels */}
      {stage > 1 && (
        <div 
          className="absolute inset-2 rounded-full blur-md opacity-25 animate-pulse pointer-events-none"
          style={{ backgroundColor: creature.elementColor || '#10b981' }}
        />
      )}

      {/* Loading Skeleton/Silhouette */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
          <div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full animate-pulse border-2 border-dashed border-black/40 flex items-center justify-center"
            style={{ backgroundColor: `${creature.elementColor || '#10b981'}20` }}
          >
            <span className="font-pixel text-[8px] text-slate-700 font-bold">...</span>
          </div>
        </div>
      )}

      {/* Active Image */}
      {activeSrc ? (
        <div className="relative z-10 w-full h-full flex items-center justify-center p-1.5">
          <img
            key={activeSrc}
            src={activeSrc}
            alt={creature.name}
            referrerPolicy="no-referrer"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`max-w-full max-h-full object-contain filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.5)] transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${customPixelated ? 'image-render-pixel' : ''} ${
              isPlayerBackView && !primaryBack ? 'scale-x-[-1]' : ''
            }`}
            style={{
              imageRendering: customPixelated ? 'pixelated' : 'auto'
            }}
          />
        </div>
      ) : (
        /* Minimalist Retro Monogram Badge if no URL is provided */
        <div 
          className="relative z-10 w-24 h-24 border-3 border-black bg-white flex flex-col items-center justify-center p-2 shadow-[2px_2px_0_#000]"
          style={{ borderColor: creature.elementColor || '#000' }}
        >
          <span className="font-pixel text-xs font-black text-black">{creature.name.slice(0, 3).toUpperCase()}</span>
          <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">{element}</span>
        </div>
      )}

      {/* Shield effect when defending */}
      {isDefending && (
        <div className="absolute inset-0 z-20 border-4 border-cyan-400/80 rounded-full animate-ping opacity-50 pointer-events-none" />
      )}
    </div>
  );
};


