export type FilmTuru = 
  | 'Aksiyon' 
  | 'Bilim Kurgu' 
  | 'Dram' 
  | 'Gerilim' 
  | 'Komedi' 
  | 'Animasyon' 
  | 'Belgesel';

export type SiralamaKriteri = 
  | 'imdb' 
  | 'yil' 
  | 'fiyat' 
  | 'kredi' 
  | 'baslik';

export type SiralamaYonu = 'asc' | 'desc';

export interface Film {
  id: string;
  baslik: string;
  yonetmen: string;
  tur: FilmTuru;
  cikisYili: number;
  sureDakika: number;
  imdbPuani: number;
  satinAlmaFiyatiTL: number;
  kiralamaKrediBedeli: number;
  mevcutMu: boolean;
  afisRenk: string; // fallback stylized color palette
  ozet: string;
  fragmanSuresi?: string;
  oyuncular: string[];
}

export type KullaniciTipi = 'STANDART' | 'ABONE';

export type AbonelikPaketi = 'AYLIK_TEMEL' | 'YILLIK_PREMIUM';

export interface AbonelikBilgisi {
  id: string;
  paket: AbonelikPaketi;
  baslangicTarihi: string;
  bitisTarihi: string;
  aktif: boolean;
  aylikUcretTL: number;
}

export interface KiralamaKaydi {
  id: string;
  filmId: string;
  filmBaslik: string;
  harcananKredi: number;
  kiralamaTarihi: string;
  bitisTarihi: string;
  kalanSaat: number;
}

export interface SatinAlmaKaydi {
  id: string;
  filmId: string;
  filmBaslik: string;
  odenenTutarTL: number;
  satinAlmaTarihi: string;
  faturaNo: string;
}

export type TalepDurumu = 'BEKLEMEDE' | 'INCELENIYOR' | 'TEMIN_EDILDI' | 'REDDEDILDI';

export interface FilmTalebiKaydi {
  id: string;
  kullaniciId: string;
  kullaniciAdi: string;
  filmBasligi: string;
  yonetmen: string;
  yil?: number;
  talepTarihi: string;
  aciklama: string;
  durum: TalepDurumu;
}

export interface KrediPaketi {
  id: string;
  ad: string;
  krediMiktari: number;
  bonusKredi: number;
  fiyatTL: number;
  populer?: boolean;
}

export interface KrediIslemiKaydi {
  id: string;
  miktar: number;
  tip: 'YUKLEME' | 'KIRALAMA_HARCAMA';
  tarih: string;
  aciklama: string;
  kalanBakiye: number;
}

export interface KullaniciProfili {
  id: string;
  adSoyad: string;
  email: string;
  tip: KullaniciTipi;
  kayitTarihi: string;
  krediBakiyesi: number; // Sadece abone kullanıcılar için aktif
  abonelik?: AbonelikBilgisi;
  kiralananFilmler: KiralamaKaydi[];
  satinAlinanFilmler: SatinAlmaKaydi[];
  talepler: FilmTalebiKaydi[];
  krediGecmisi: KrediIslemiKaydi[];
}
