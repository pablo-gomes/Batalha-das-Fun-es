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
        return <FlaskConical className="w-6 h-6 text-rose-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-sky-600" />;
      case 'Gem':
        return <Gem className="w-6 h-6 text-emerald-600" />;
      case 'Shield':
        return <Shield className="w-6 h-6 text-amber-600" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-orange-600" />;
      case 'BookOpen':
        return <BookOpen className="w-6 h-6 text-indigo-600" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-purple-600" />;
      default:
        return <ShoppingBag className="w-6 h-6 text-teal-600" />;
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
    <div className="w-full max-w-4xl mx-auto p-1.5 sm:p-4 select-none space-y-3 sm:space-y-4 text-[#163323]">
      {/* Poké Mart Header Banner */}
      <div className="flex flex-wrap items-center justify-between bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl p-2.5 sm:p-3.5 shadow-[4px_4px_0_#122b1e] gap-2">
        <button
          onClick={() => {
            sound.playCancel();
            onBack();
          }}
          className="bg-white hover:bg-[#edf7f1] text-[#1b3b2b] font-pixel text-[9px] sm:text-xs px-3 py-1.5 border-2 border-[#1b3b2b] rounded-lg transition-colors cursor-pointer font-bold flex items-center gap-1 shadow-xs"
        >
          <ArrowLeft size={14} /> VOLTAR
        </button>

        <h1 className="font-pixel text-xs sm:text-base text-[#143021] font-black flex items-center gap-2 uppercase">
          <ShoppingBag size={18} className="text-rose-600 inline" /> POKÉ-LOJA MATEMÁTICA
        </h1>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-300 to-yellow-400 text-amber-950 font-pixel text-[10px] sm:text-xs px-3 py-1.5 border-2 border-amber-800 rounded-lg shadow-xs font-black">
          <Coins size={15} className="text-amber-800" />
          <span>SALDO: 🪙 {coins}</span>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-3 border-3 rounded-xl font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0_#122b1e] animate-in fade-in ${
          feedback.type === 'success' ? 'bg-emerald-100 text-emerald-950 border-emerald-800' : 'bg-rose-100 text-rose-950 border-rose-800'
        }`}>
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-700" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Subtitle description */}
      <div className="bg-[#edf7f1] border-2 sm:border-3 border-[#1b3b2b] rounded-xl p-2.5 sm:p-3 font-mono text-xs sm:text-sm text-emerald-900 font-bold shadow-xs">
        🪙 <strong>Itens de Apoio & Poções:</strong> Utilize suas moedas ganhas nas batalhas para recuperar HP, restaurar Energia e multiplicar seu poder!
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => {
          const canAfford = coins >= item.cost;
          const canAfford5x = coins >= item.cost * 5;

          return (
            <div 
              key={item.id}
              className="bg-[#fbfdfa] border-3 sm:border-4 border-[#1b3b2b] rounded-xl p-3.5 flex flex-col justify-between space-y-3 shadow-[3px_3px_0_#122b1e] hover:translate-y-[-2px] transition-transform"
            >
              {/* Top info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 border-b-2 border-[#2d5a42]/30 pb-2">
                  <div className="p-2 bg-[#f0f7f2] border-2 border-[#1b3b2b] rounded-lg shrink-0 shadow-xs">
                    {getItemIcon(item.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-[11px] sm:text-xs text-[#143021] font-black leading-tight uppercase truncate">
                      {item.name}
                    </h3>
                    <span className="font-mono text-[10px] font-bold text-slate-600 block mt-0.5">
                      Na mochila: <strong className="text-emerald-800 font-black">{item.amount}</strong>
                    </span>
                  </div>
                </div>

                <p className="font-mono text-[11px] sm:text-xs text-slate-700 leading-relaxed font-bold min-h-[40px]">
                  {item.description}
                </p>
              </div>

              {/* Price & Buy Actions */}
              <div className="pt-2 border-t-2 border-[#2d5a42]/20 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs font-black">
                  <span className="text-slate-600">PREÇO:</span>
                  <span className="text-amber-950 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded shadow-xs">
                    🪙 {item.cost} moedas
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBuy(item, 1)}
                    disabled={!canAfford}
                    className={`font-pixel text-[9px] sm:text-[10px] py-2 px-2 rounded-lg border-2 font-black uppercase transition-all cursor-pointer ${
                      canAfford
                        ? 'gba-btn-primary shadow-[2px_2px_0_#022c22]'
                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
                    }`}
                  >
                    1x (🪙{item.cost})
                  </button>

                  <button
                    onClick={() => handleBuy(item, 5)}
                    disabled={!canAfford5x}
                    className={`font-pixel text-[9px] sm:text-[10px] py-2 px-2 rounded-lg border-2 font-black uppercase transition-all cursor-pointer ${
                      canAfford5x
                        ? 'gba-btn-yellow shadow-[2px_2px_0_#451a03]'
                        : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
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
