import React, { useState } from 'react';
import { Crown, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { AbonelikPaketi, KullaniciProfili } from '../types/cinema';
import confetti from 'canvas-confetti';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: KullaniciProfili;
  onSubscribe: (paket: AbonelikPaketi) => void;
}

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubscribe
}) => {
  const [selectedPlan, setSelectedPlan] = useState<AbonelikPaketi>('YILLIK_PREMIUM');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onSubscribe(selectedPlan);
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Platforma Abone Ol
              </h3>
              <p className="text-xs text-slate-400">
                Kredi satın alma ve süreli film kiralama ayrıcalığına erişin
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

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {/* Rules clarification */}
          <div className="p-3 rounded-xl bg-sky-950/30 border border-sky-800/40 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Abonelik Ayrıcalıkları:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
              <li>Sistem üzerinden avantajlı Kredi Paketi satın alma yetkisi</li>
              <li>Filmleri kredilerinizle 48 saatliğine kiralayabilme</li>
              <li>Tüm yeni film taleplerinde öncelikli değerlendirme</li>
            </ul>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Monthly Standard */}
            <button
              type="button"
              onClick={() => setSelectedPlan('AYLIK_TEMEL')}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPlan === 'AYLIK_TEMEL'
                  ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Aylık Standart
                </span>
                {selectedPlan === 'AYLIK_TEMEL' && <Check className="w-4 h-4 text-sky-400" />}
              </div>
              <p className="text-base font-extrabold text-white mt-2 font-mono">
                99.90 TL <span className="text-xs font-normal text-slate-400">/ay</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Aylık yenilenen temel üyelik + 10 hoşgeldin kredisi.
              </p>
            </button>

            {/* Annual Premium */}
            <button
              type="button"
              onClick={() => setSelectedPlan('YILLIK_PREMIUM')}
              className={`relative p-4 rounded-xl border text-left transition-all cursor-pointer ${
                selectedPlan === 'YILLIK_PREMIUM'
                  ? 'bg-sky-500/10 border-sky-500 ring-1 ring-sky-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="absolute -top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold bg-sky-500 text-slate-950 rounded uppercase">
                %25 Tasarruf
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Yıllık VIP
                </span>
                {selectedPlan === 'YILLIK_PREMIUM' && <Check className="w-4 h-4 text-sky-400" />}
              </div>
              <p className="text-base font-extrabold text-white mt-2 font-mono">
                79.90 TL <span className="text-xs font-normal text-slate-400">/ay</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Yıllık faturalandırma + 25 hediye film kredisi!
              </p>
            </button>

          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              İstediğiniz zaman iptal edebilirsiniz.
            </span>
            <span className="text-[11px] text-slate-500">Taahhütsüz</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Vazgeç
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? 'Abonelik Başlatılıyor...' : 'Aboneliği Başlat (+Kredi Kazan)'}
          </button>
        </div>

      </div>
    </div>
  );
};
