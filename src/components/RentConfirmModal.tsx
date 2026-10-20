import React, { useState } from 'react';
import { Film as FilmIcon, Clock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Film, KullaniciProfili } from '../types/cinema';
import confetti from 'canvas-confetti';

interface RentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  film: Film | null;
  user: KullaniciProfili;
  onConfirmRental: (film: Film) => void;
  onOpenCreditModal: () => void;
  onOpenSubscribeModal: () => void;
}

export const RentConfirmModal: React.FC<RentConfirmModalProps> = ({
  isOpen,
  onClose,
  film,
  user,
  onConfirmRental,
  onOpenCreditModal,
  onOpenSubscribeModal
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen || !film) return null;

  const isSubscribed = user.tip === 'ABONE';
  const hasEnoughCredits = user.krediBakiyesi >= film.kiralamaKrediBedeli;
  const remainingCreditsAfter = user.krediBakiyesi - film.kiralamaKrediBedeli;

  const handleConfirm = () => {
    if (!isSubscribed || !hasEnoughCredits) return;

    setIsProcessing(true);
    setTimeout(() => {
      onConfirmRental(film);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
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
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Film Kiralama (48 Saat)
              </h3>
              <p className="text-xs text-slate-400">
                Kredi ile dijital süreli kiralama
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
              <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-400 font-semibold font-mono">
                <span>Bedel: {film.kiralamaKrediBedeli} Kredi</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-normal">Süre: 48 Saat</span>
              </div>
            </div>
          </div>

          {/* Business Rule Case 1: NOT SUBSCRIBED */}
          {!isSubscribed ? (
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-600/30 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Kural Uyarısı: Sadece Aboneler Kiralayabilir!</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Sistem kuralına göre: <strong>"Sadece abone olan kullanıcılar, kredileri ile film kiralayabilir."</strong> Standart kullanıcılar doğrudan film satın alabilir veya abone olup krediyle kiralama yapabilir.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenSubscribeModal();
                }}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Şimdi Abone Ol</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : !hasEnoughCredits ? (
            /* Business Rule Case 2: INSUFFICIENT CREDITS */
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/30 text-xs space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Yetersiz Kredi Bakiyesi</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Bu filmi kiralamak için <strong>{film.kiralamaKrediBedeli} Kredi</strong> gereklidir. Mevcut bakiyeniz: <strong>{user.krediBakiyesi} Kredi</strong>. Eksik: {film.kiralamaKrediBedeli - user.krediBakiyesi} Kredi.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenCreditModal();
                }}
                className="w-full mt-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>Kredi Satın Al</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Business Rule Case 3: SUBSCRIBED & HAS ENOUGH CREDITS -> CALCULATION BREAKDOWN */
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Mevcut Kredi Bakiyeniz:</span>
                <span className="font-mono font-semibold text-white">{user.krediBakiyesi} Kredi</span>
              </div>
              <div className="flex items-center justify-between text-rose-400">
                <span>Düşülecek Kiralama Bedeli:</span>
                <span className="font-mono font-semibold">-{film.kiralamaKrediBedeli} Kredi</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-emerald-400 font-semibold">
                <span>Kiralama Sonrası Bakiye:</span>
                <span className="font-mono">{remainingCreditsAfter} Kredi</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          
          {isSubscribed && hasEnoughCredits && (
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Kredi Düşülüyor...' : `${film.kiralamaKrediBedeli} Kredi ile Kirala`}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
