import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Code2, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Copy, 
  Check,
  Award
} from 'lucide-react';
import { SIGNATURE_METADATA } from '../data/umlData';

export const ArchitectureDocs: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sampleTypeScriptCode = `// Online Film Sistemi Nesne Yönelimli Tasarım
// Tasarım & Modelleme: Enes Öztürk

export abstract class Kullanici {
  protected id: string;
  protected adSoyad: string;
  protected email: string;
  private sifreHash: string;
  protected kayitTarihi: Date;
  protected satinAlinanlar: SatinAlma[] = [];

  constructor(id: string, adSoyad: string, email: string) {
    this.id = id;
    this.adSoyad = adSoyad;
    this.email = email;
    this.kayitTarihi = new Date();
  }

  // Kural: Normal kullanıcılar ve aboneler film satın alabilirler
  public filmSatinAl(film: Film, odeme: OdemeYontemi): SatinAlma {
    if (!film.satinAlinabilirMi()) {
      throw new Error("Bu film şu anda satın alınabilir durumda değil.");
    }
    const basarili = odeme.odemeYap(film.satinAlmaFiyatiTL);
    if (!basarili) throw new Error("Ödeme işlemi başarısız.");

    const satinAlma = new SatinAlma(this.id, film.filmId, film.satinAlmaFiyatiTL);
    this.satinAlinanlar.push(satinAlma);
    return satinAlma;
  }

  // Kural: Eğer film mevcut değil ise talep edilebilir
  public filmTalepEt(filmBasligi: string, yonetmen: string, aciklama: string): FilmTalebi {
    return new FilmTalebi(this.id, filmBasligi, yonetmen, aciklama);
  }
}

export class StandartKullanici extends Kullanici {
  public aboneOl(paketTipi: PaketTipi, odeme: OdemeYontemi): AboneKullanici {
    // Abonelik başlatılır ve kullanıcı AboneKullanici nesnesine terfi eder
    return new AboneKullanici(this.id, this.adSoyad, this.email, paketTipi);
  }
}

export class AboneKullanici extends Kullanici {
  private krediBakiyesi: number = 0;
  private aktifAbonelik: Abonelik;
  private kiralananlar: Kiralama[] = [];

  constructor(id: string, adSoyad: string, email: string, paketTipi: PaketTipi) {
    super(id, adSoyad, email);
    this.aktifAbonelik = new Abonelik(paketTipi);
  }

  // Kural: Kullanıcılar abonelik için sistem üzerinden kredi satın alır
  public krediSatinAl(paket: KrediPaketi, odeme: OdemeYontemi): boolean {
    const basarili = odeme.odemeYap(paket.fiyatTL);
    if (basarili) {
      this.krediBakiyesi += paket.toplamKredi();
      return true;
    }
    return false;
  }

  // Kural: SADECE ABONE olan kullanıcılar kredileri ile film kiralayabilir
  // ve kiraladığı filmin kredi bedeli kadar hesabından düşülür.
  public filmKirala(film: Film): Kiralama {
    if (!this.aktifAbonelik.aktifMi()) {
      throw new Error("Aboneliğiniz aktif değildir.");
    }
    if (!film.kiralanabilirMi()) {
      throw new Error("Film kiralama için mevcut değildir. Lütfen talep ediniz.");
    }
    if (this.krediBakiyesi < film.kiralamaKrediBedeli) {
      throw new Error("Yetersiz kredi bakiyesi. Gereken: " + film.kiralamaKrediBedeli);
    }

    // Kredi bedeli kadar hesaptan düşülür
    this.krediBakiyesi -= film.kiralamaKrediBedeli;
    const kiralama = new Kiralama(this.id, film.filmId, film.kiralamaKrediBedeli);
    this.kiralananlar.push(kiralama);
    return kiralama;
  }

  public getKrediBakiyesi(): number {
    return this.krediBakiyesi;
  }
}`;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Document Header & Signature Badge */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-sky-400 font-semibold tracking-wider uppercase">
                Yazılım Mühendisliği & Sistem Mimarisi Tasarım Raporu
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Online Film Satış, Kiralama ve Abonelik Sistemi
              </h1>
            </div>

            {/* Official Signature Seal Box */}
            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-sky-500/40 text-right space-y-1">
              <div className="flex items-center justify-end gap-1.5 text-xs text-sky-400 font-semibold">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Sistem Tasarımı & Modelleme</span>
              </div>
              <p className="text-base font-black text-white tracking-wide">
                ★ {SIGNATURE_METADATA.author} ★
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {SIGNATURE_METADATA.version} · {SIGNATURE_METADATA.date}
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed pt-2 border-t border-slate-800">
            Bu belge ve ilişkili UML Sınıf Diyagramı; online film platformunda kullanıcı abonelikleri, kredi altyapısı, süreli film kiralama, kalıcı film satışı ve mevcut olmayan filmlerin talep mekanizmasını nesne yönelimli programlama (OOP) prensiplerine göre modellemektedir.
          </p>
        </div>

        {/* Business Rules & Requirements Matrix */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">1. İş Kuralları ve OOP Karşılıkları</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-300 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3.5">İş Kuralı (Gereksinim)</th>
                  <th className="p-3.5">Sınıf & Metot Tasarımı</th>
                  <th className="p-3.5">Uygulanan OOP Prensibi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    Filmler listelenebilir ve sıralanabilir
                  </td>
                  <td className="p-3.5 font-mono text-sky-400">
                    FilmKatalogu.filmleriListele()<br />
                    FilmKatalogu.filmleriSirala(kriter, yon)
                  </td>
                  <td className="p-3.5 text-slate-400">
                    Bileşim (Composition), Strategy Deseni
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    Kullanıcılar uygulamaya abone olabilir
                  </td>
                  <td className="p-3.5 font-mono text-sky-400">
                    StandartKullanici.aboneOl()<br />
                    Abonelik (süre, paket, durum)
                  </td>
                  <td className="p-3.5 text-slate-400">
                    Kalıtım (Inheritance) & Durum (State)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    Kullanıcılar abonelik için sistem üzerinden kredi satın alır
                  </td>
                  <td className="p-3.5 font-mono text-sky-400">
                    AboneKullanici.krediSatinAl(paket, odeme)<br />
                    KrediPaketi, KrediIslemi
                  </td>
                  <td className="p-3.5 text-slate-400">
                    Kapsülleme (Encapsulation), Bağımlılık (Dependency)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors bg-sky-950/10">
                  <td className="p-3.5 font-medium text-amber-300">
                    Sadece abone olanlar kredi ile film kiralayabilir ve bedel kadar hesaptan düşülür
                  </td>
                  <td className="p-3.5 font-mono text-amber-300">
                    AboneKullanici.filmKirala(film)<br />
                    krediBakiyesi -= film.kiralamaKrediBedeli
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">
                    Çok Biçimlilik & Tip Güvenliği (Sadece AboneKullanici sınıfında kiralama metodu bulunur)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    Normal kullanıcılar ve aboneler film satın alabilirler
                  </td>
                  <td className="p-3.5 font-mono text-sky-400">
                    Kullanici.filmSatinAl(film, odeme)<br />
                    SatinAlma extends Islem
                  </td>
                  <td className="p-3.5 text-slate-400">
                    Genelleştirme (Generalization - Üst sınıfta tanımlı)
                  </td>
                </tr>
                <tr className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-medium text-white">
                    Eğer film mevcut değil ise talep edilebilir
                  </td>
                  <td className="p-3.5 font-mono text-purple-300">
                    Kullanici.filmTalepEt()<br />
                    FilmTalebi (durum: BEKLEMEDE vb.)
                  </td>
                  <td className="p-3.5 text-slate-400">
                    Birliktelik (Association: 1 Kullanici &rarr; 0..* FilmTalebi)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* UML Architecture Breakdown */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">2. Sınıf Hiyerarşisi ve İlişki Notasyonu</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="text-sky-400">◆</span> Kullanıcı Modülü (Kalıtım / Generalization)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Temel <code className="text-sky-300">Kullanici</code> soyut (abstract) sınıfından <code className="text-sky-300">StandartKullanici</code> ve <code className="text-sky-300">AboneKullanici</code> türetilmiştir.
              </p>
              <p className="text-slate-400">
                Bu sayede film satın alma ve film talep etme gibi tüm kullanıcılara açık yetenekler üst sınıfta kapsüllenirken, kredi bakiyesi yönetimi ve film kiralama operasyonları sadece <code className="text-amber-300">AboneKullanici</code> sınıfına özgü kılınarak tip düzeyinde güvenlik sağlanmıştır.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="text-sky-400">◆</span> İşlem Modülü (Transaction Hierarchy)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                <code className="text-sky-300">Islem</code> soyut sınıfından <code className="text-sky-300">Kiralama</code> ve <code className="text-sky-300">SatinAlma</code> sınıfları türer.
              </p>
              <p className="text-slate-400">
                <code className="text-amber-300">Kiralama</code> nesnesi harcanan krediyi ve 48 saatlik erişim süresini tutarken; <code className="text-emerald-300">SatinAlma</code> nesnesi TL tutarını, fatura seri numarasını ve ömür boyu kalıcı lisansı modeller.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="text-sky-400">◆</span> Katalog ve Sıralama (Film & FilmKatalogu)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                <code className="text-sky-300">FilmKatalogu</code> sınıfı, birden çok <code className="text-sky-300">Film</code> nesnesini barındırır (Aggregation: 1 to 0..*).
              </p>
              <p className="text-slate-400">
                Katalog üzerinden IMDb puanına, çıkış yılına, satın alma fiyatına (TL), kiralama bedeline (Kredi) ve başlığa göre çok kriterli sıralama (<code className="text-sky-300">filmleriSirala</code>) gerçekleştirilir.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="text-sky-400">◆</span> Film Talebi Mekanizması (FilmTalebi)
              </h3>
              <p className="text-slate-300 leading-relaxed">
                Her filmin <code className="text-sky-300">mevcutMu: boolean</code> niteliği vardır.
              </p>
              <p className="text-slate-400">
                Mevcut olmayan veya platformda henüz yer almayan yapımlar için kullanıcılar <code className="text-purple-300">FilmTalebi</code> oluşturabilir. Talep durumları (Beklemede, İnceleniyor, Temin Edildi) şeffaf olarak takip edilir.
              </p>
            </div>

          </div>
        </section>

        {/* Code Sample Implementation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-bold text-white">3. Temel OOP Sınıf Kod Örneği</h2>
            </div>
            <button
              onClick={() => copyCode(sampleTypeScriptCode, 'ts')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
            >
              {copiedCode === 'ts' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'ts' ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed max-h-96">
              {sampleTypeScriptCode}
            </pre>
          </div>
        </section>

        {/* Formal Signature Declaration Box */}
        <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">
            Tasarım ve Modelleme Onay Beyanı
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
            Bu online film kiralama ve satış sistemi; abonelik koşulları, kredi tabanlı kiralama mekanizması, ömür boyu satın alma kuralları ve film talep akışını eksiksiz biçimde modelleyecek şekilde <strong>Enes Öztürk</strong> tarafından UML 2.5 standartlarında tasarlanmış ve onaylanmıştır.
          </p>
          <div className="pt-2 text-xs font-mono text-sky-400 font-semibold">
            İmza: Enes Öztürk
          </div>
        </section>

      </div>
    </div>
  );
};
