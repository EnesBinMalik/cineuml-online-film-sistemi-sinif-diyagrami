import React, { useState } from 'react';
import { Coins, Check, CreditCard, AlertCircle } from 'lucide-react';
import { CREDIT_PACKAGES } from '../data/mockCinemaData';
import { KrediPaketi, KullaniciProfili } from '../types/cinema';
import confetti from 'canvas-confetti';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: KullaniciProfili;
  onPurchaseCredits: (pkg: KrediPaketi) => void;
  onPromptSubscribe: () => void;
}

export const CreditModal: React.FC<CreditModalProps> = ({
  isOpen,
  onClose,
  user,
  onPurchaseCredits,
  onPromptSubscribe
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string>(CREDIT_PACKAGES[1].id);
  const [cardNumber, setCardNumber] = useState<string>('4543 •••• •••• 9012');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const isSubscribed = user.tip === 'ABONE';
  const selectedPkg = CREDIT_PACKAGES.find(p => p.id === selectedPackageId) || CREDIT_PACKAGES[0];

  const handleConfirm = () => {
    if (!isSubscribed) {
      onPromptSubscribe();
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      onPurchaseCredits(selectedPkg);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not loaded
      }
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Film Kredisi Satın Al
              </h3>
              <p className="text-xs text-slate-400">
                Mevcut Bakiye: <span className="font-semibold text-amber-300 font-mono">{user.krediBakiyesi} Kredi</span>
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

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          
          {/* Subscription Requirement Notice if user is not subscribed */}
          {!isSubscribed && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/30 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Abonelik Gereklidir</p>
                <p className="text-slate-300 text-[11px] mt-0.5 leading-relaxed">
                  Sistem kuralları gereğince kullanıcılar abonelik kapsamında kredi satın alabilir ve film kiralayabilir. Önce hesabınızı aboneliğe yükseltiniz.
                </p>
                <button
                  onClick={onPromptSubscribe}
                  className="mt-2 text-xs font-semibold text-amber-400 underline hover:text-amber-300 cursor-pointer"
                >
                  Hemen Abone Olun →
                </button>
              </div>
            </div>
          )}

          {/* Package Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Kredi Paketi Seçin
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {CREDIT_PACKAGES.map(pkg => {
                const isSelected = selectedPackageId === pkg.id;
                const totalCredits = pkg.krediMiktari + pkg.bonusKredi;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pkg.populer && (
                      <span className="absolute -top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-slate-950 rounded uppercase">
                        Popüler
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {totalCredits} Kredi
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>
                    {pkg.bonusKredi > 0 && (
                      <p className="text-[10px] text-amber-400 mt-0.5">
                        +{pkg.bonusKredi} Bonus Hediye
                      </p>
                    )}
                    <p className="text-xs font-semibold text-slate-300 mt-2 font-mono tabular-nums">
                      {pkg.fiyatTL.toFixed(2)} TL
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mock Payment Method (Strategy Pattern: OdemeYontemi) */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-semibold flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                Ödeme Yöntemi: Kredi Kartı
              </span>
              <span className="text-[11px] text-emerald-400">Güvenli 256-bit SSL</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
                placeholder="Kart Numarası"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              İşlem sonucunda {selectedPkg.krediMiktari + selectedPkg.bonusKredi} kredi hesabınıza anında yüklenecektir.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-400">Toplam Tutar: </span>
            <span className="font-bold text-white text-sm font-mono tabular-nums">
              {selectedPkg.fiyatTL.toFixed(2)} TL
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              İptal
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'İşleniyor...' : isSubscribed ? 'Satın Al & Yükle' : 'Abone Ol & Satın Al'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
