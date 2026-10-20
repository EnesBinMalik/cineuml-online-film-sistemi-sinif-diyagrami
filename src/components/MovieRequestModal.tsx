import React, { useState, useEffect } from 'react';
import { Send, Film, HelpCircle, CheckCircle2 } from 'lucide-react';
import { Film as FilmType, FilmTalebiKaydi, KullaniciProfili } from '../types/cinema';
import confetti from 'canvas-confetti';

interface MovieRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: KullaniciProfili;
  preselectedMovie?: FilmType | null;
  onSubmitRequest: (request: Omit<FilmTalebiKaydi, 'id' | 'talepTarihi' | 'durum'>) => void;
}

export const MovieRequestModal: React.FC<MovieRequestModalProps> = ({
  isOpen,
  onClose,
  user,
  preselectedMovie,
  onSubmitRequest
}) => {
  const [filmBasligi, setFilmBasligi] = useState<string>('');
  const [yonetmen, setYonetmen] = useState<string>('');
  const [yil, setYil] = useState<string>('');
  const [aciklama, setAciklama] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (preselectedMovie) {
      setFilmBasligi(preselectedMovie.baslik);
      setYonetmen(preselectedMovie.yonetmen);
      setYil(preselectedMovie.cikisYili.toString());
      setAciklama('Bu yapımın katalogda aktif hale getirilmesini talep ediyorum.');
    } else {
      setFilmBasligi('');
      setYonetmen('');
      setYil('2025');
      setAciklama('');
    }
    setIsSuccess(false);
  }, [preselectedMovie, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filmBasligi.trim()) return;

    onSubmitRequest({
      kullaniciId: user.id,
      kullaniciAdi: user.adSoyad,
      filmBasligi: filmBasligi.trim(),
      yonetmen: yonetmen.trim() || 'Belirtilmedi',
      yil: yil ? parseInt(yil) : undefined,
      aciklama: aciklama.trim() || 'Kullanıcı film talebi iletildi.'
    });

    setIsSuccess(true);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Mevcut Olmayan Film Talebi
              </h3>
              <p className="text-xs text-slate-400">
                Katalogda bulamadığınız filmleri platforma eklenmesi için talep edin
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Talebiniz Başarıyla Alındı!</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Film talebiniz lisanslama ekibimize iletilmiştir. Durumunu Kullanıcı Profilinizdeki "Taleplerim" sekmesinden takip edebilirsiniz.
              </p>
            </div>
          ) : (
            <>
              {/* Business Rule info banner */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-slate-300 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>İş Kuralı:</strong> Sistemde mevcut olmayan filmler için tüm kayıtlı kullanıcılar (<code className="text-purple-300">FilmTalebi</code>) oluşturabilir. Talep onaylandığında film kataloğa dahil edilir.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Film Adı / Orijinal Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={filmBasligi}
                  onChange={(e) => setFilmBasligi(e.target.value)}
                  placeholder="Örn: Dune: Part Three, The Dark Knight..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Yönetmen (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={yonetmen}
                    onChange={(e) => setYonetmen(e.target.value)}
                    placeholder="Örn: Christopher Nolan"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Çıkış Yılı (Opsiyonel)
                  </label>
                  <input
                    type="number"
                    value={yil}
                    onChange={(e) => setYil(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Açıklama / Ek Notlar
                </label>
                <textarea
                  rows={3}
                  value={aciklama}
                  onChange={(e) => setAciklama(e.target.value)}
                  placeholder="Örn: 4K HDR versiyonu varsa harika olur, arşivimiz için bekliyoruz..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-lg shadow-purple-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Talebi İlet</span>
                </button>
              </div>
            </>
          )}

        </form>

      </div>
    </div>
  );
};
