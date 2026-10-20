import React, { useState } from 'react';
import { Film as FilmIcon, ShoppingBag, CreditCard, Check, Sparkles } from 'lucide-react';
import { Film, KullaniciProfili } from '../types/cinema';
import confetti from 'canvas-confetti';

interface BuyConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  film: Film | null;
  user: KullaniciProfili;
  onConfirmPurchase: (film: Film) => void;
}

export const BuyConfirmModal: React.FC<BuyConfirmModalProps> = ({
  isOpen,
  onClose,
  film,
  user,
  onConfirmPurchase
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cardNumber, setCardNumber] = useState<string>('5400 •••• •••• 8821');

  if (!isOpen || !film) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmPurchase(film);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (e) {
        // ignore
      }
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Film Satın Al (Kalıcı Kütüphane)
              </h3>
              <p className="text-xs text-slate-400">
                Tüm kullanıcılar (Standart & Abone) satın alabilir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Film Mini Card */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
            <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${film.afisRenk} flex items-center justify-center text-slate-400 shrink-0 border border-slate-800`}>
              <FilmIcon className="w-6 h-6 text-slate-300 opacity-60" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">{film.baslik}</h4>
              <p className="text-xs text-slate-400">{film.yonetmen} · {film.cikisYili}</p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-emerald-400 font-semibold font-mono">
                <span>Fiyat: {film.satinAlmaFiyatiTL.toFixed(2)} TL</span>
                <span className="text-slate-500">·</span>
                <span className="text-sky-400 font-normal">Ömür Boyu Erişim</span>
              </div>
            </div>
          </div>

          {/* Rule note */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Satın Alma Kuralı:</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Mimarimiz gereği filmler, hem normal hem de abone kullanıcılar tarafından satın alınabilir. Satın alınan içerikler hesabınızın kalıcı dijital arşivine eklenir ve süre sınırı bulunmaz.
            </p>
          </div>

          {/* Payment input */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                Ödeme Yöntemi: Kredi Kartı
              </span>
              <span className="text-[11px] text-slate-400">Tek Çekim</span>
            </div>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-400">Ödenecek Tutar: </span>
            <span className="font-bold text-white text-base font-mono tabular-nums">
              {film.satinAlmaFiyatiTL.toFixed(2)} TL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Ödeme Alınıyor...' : 'Satın Almayı Tamamla'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
