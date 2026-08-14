import React from 'react';
import {
  Zap, Flame, Orbit, Crosshair, Shield, MapPin, Ruler, Bomb,
  FlaskConical, Gem, BookOpen,
  Gamepad2, Cloud, Map, Lock, Crown, Swords, TrendingUp, Skull,
  PartyPopper, Star, X, Sparkles, AlertTriangle, Lightbulb,
  BarChart2, Search, SlidersHorizontal, Timer, Trophy,
  Sprout, Mountain, Castle, Coins, Target, Sword,
  type LucideIcon
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  // Skills
  Zap, Flame, Orbit, Crosshair, Shield, MapPin, Ruler, Bomb,
  // Items
  FlaskConical, Gem, BookOpen,
  // UI / Battle
  Gamepad2, Cloud, Map, Lock, Crown, Swords, TrendingUp, Skull,
  PartyPopper, Star, X, Sparkles, AlertTriangle, Lightbulb,
  BarChart2, Search, SlidersHorizontal, Timer, Trophy,
  // Regions
  Sprout, Mountain, Castle, Coins, Target, Sword,
};

interface GameIconProps {
  name: string;
  size?: number;
  className?: string;
}

/**
 * Renders a Lucide icon by name string.
 * Used to render icons stored as strings in data files (skills, items, regions).
 */
export const GameIcon: React.FC<GameIconProps> = ({ name, size = 16, className }) => {
  const Icon = ICON_MAP[name];
  if (!Icon) {
    // Fallback: render as text (handles any remaining edge cases)
    return <span className={className} style={{ fontSize: size * 0.7 }}>{name}</span>;
  }
  return <Icon size={size} className={className} />;
};
