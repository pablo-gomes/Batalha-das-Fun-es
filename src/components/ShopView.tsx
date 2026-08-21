import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { sound } from '../utils/audio';
import { 
  FlaskConical, 
  Zap, 
  Gem, 
  Shield, 
  Flame, 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface ShopViewProps {
  coins: number;
  items: InventoryItem[];
  onBuyItem: (itemId: string, quantity: number, totalCost: number) => void;
  onBack: () => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  coins,
  items,
  onBuyItem,
  onBack
}) => {
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6 text-black" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-black" />;
      case 'Gem':
        return <Gem className="w-6 h-6 text-black" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-black" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-black" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-black" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-black" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-black" />;
    }
  };

  const handleBuy = (item: InventoryItem, qty: number = 1) => {
    const totalCost = item.cost * qty;

    if (coins < totalCost) {
      sound.playWrong();
      setFeedback({
        text: `Moedas insuficientes! Você precisa de 🪙 ${totalCost} moedas.`,
        type: 'error'
      });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    sound.playConfirm();
    onBuyItem(item.id, qty, totalCost);
    setFeedback({
      text: `Você comprou +${qty} ${item.name} por 🪙 ${totalCost} moedas!`,
      type: 'success'
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-4 select-none space-y-3 sm:space-y-4 text-black">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-white border-3 sm:border-4 border-black p-2.5 sm:p-3.5 shadow-[3px_3px_0_#000] sm:shadow-[4px_4px_0_#000] gap-2">
        <button
          onClick={() => {
            sound.playCancel();
            onBack();
          }}
          className="bg-white hover:bg-black hover:text-white text-black font-pixel text-[9px] sm:text-xs px-2.5 sm:px-3 py-1.5 border-2 border-black transition-colors cursor-pointer font-bold flex items-center gap-1"
        >
          <ArrowLeft size={14} /> VOLTAR
        </button>

        <h1 className="font-pixel text-xs sm:text-base text-black font-black flex items-center gap-2 uppercase">
          <ShoppingBag size={18} className="inline" /> LOJA DE COMPRAS
        </h1>

        <div className="flex items-center gap-1.5 bg-black text-white font-pixel text-[10px] sm:text-xs px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000] font-black">
          <Coins size={15} className="text-yellow-400" />
          <span>SALDO: 🪙{coins}</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-2.5 sm:p-3 border-3 border-black font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0_#000] animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-100 text-emerald-950 border-emerald-950' : 'bg-red-100 text-red-950 border-red-950'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-700" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Subtitle description */}
      <div className="bg-slate-100 border-2 sm:border-3 border-black p-2.5 sm:p-3 font-mono text-xs sm:text-sm text-slate-800 font-bold shadow-[2px_2px_0_#000]">
        🪙 <strong>Adquira itens de apoio</strong> utilizando as moedas conquistadas em suas vitórias matemáticas!
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const canAfford = coins >= item.cost;
          const canAfford5x = coins >= item.cost * 5;

          return (
            <div 
              key={item.id}
              className="bg-white border-3 sm:border-4 border-black p-3.5 flex flex-col justify-between space-y-3 shadow-[3px_3px_0_#000] hover:translate-y-[-2px] transition-transform"
            >
              {/* Top info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 border-b-2 border-black pb-2">
                  <div className="p-2 bg-slate-100 border-2 border-black shrink-0">
                    {getItemIcon(item.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-[11px] sm:text-xs text-black font-black leading-tight uppercase truncate">
                      {item.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-slate-700 block mt-0.5">
                      No inventário: <strong className="text-black">{item.amount}</strong>
                    </span>
                  </div>
                </div>

                <p className="font-mono text-[11px] sm:text-xs text-slate-700 leading-relaxed font-bold min-h-[40px]">
                  {item.description}
                </p>
              </div>

              {/* Price & Buy Actions */}
              <div className="pt-2 border-t-2 border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs font-black">
                  <span className="text-slate-600">PREÇO:</span>
                  <span className="text-black bg-yellow-100 border border-black px-2 py-0.5">
                    🪙 {item.cost} moedas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleBuy(item, 1)}
                    disabled={!canAfford}
                    className={`font-pixel text-[9px] sm:text-[10px] py-2 px-2 border-2 border-black font-black uppercase transition-all cursor-pointer shadow-[2px_2px_0_#000] ${
                      canAfford
                        ? 'bg-black text-white hover:bg-slate-800 active:translate-y-0.5'
                        : 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    COMPRAR (1x)
                  </button>

                  <button
                    onClick={() => handleBuy(item, 5)}
                    disabled={!canAfford5x}
                    className={`font-pixel text-[9px] sm:text-[10px] py-2 px-2 border-2 border-black font-black uppercase transition-all cursor-pointer shadow-[2px_2px_0_#000] ${
                      canAfford5x
                        ? 'bg-amber-400 text-black hover:bg-amber-300 active:translate-y-0.5'
                        : 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    5x (🪙{item.cost * 5})
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
