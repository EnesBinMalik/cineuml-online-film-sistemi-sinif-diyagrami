import { Film, KrediPaketi, KullaniciProfili } from '../types/cinema';

export const INITIAL_MOVIES: Film[] = [
  {
    id: 'm1',
    baslik: 'Yıldızlararası Ufuk (Interstellar Odyssey)',
    yonetmen: 'Christopher Nolan',
    tur: 'Bilim Kurgu',
    cikisYili: 2024,
    sureDakika: 169,
    imdbPuani: 8.9,
    satinAlmaFiyatiTL: 89.90,
    kiralamaKrediBedeli: 12,
    mevcutMu: true,
    afisRenk: 'from-blue-900 via-indigo-950 to-slate-950',
    ozet: 'İnsanlığın geleceğini kurtarmak için solucan deliğinden geçen bir grup astronotun zaman ve uzam mücadelesi.',
    fragmanSuresi: '2:45',
    oyuncular: ['Matthew M.', 'Anne H.', 'Jessica C.']
  },
  {
    id: 'm2',
    baslik: 'Gölge Şehir: Sessiz Adalet',
    yonetmen: 'Denis Villeneuve',
    tur: 'Aksiyon',
    cikisYili: 2023,
    sureDakika: 142,
    imdbPuani: 8.6,
    satinAlmaFiyatiTL: 79.50,
    kiralamaKrediBedeli: 10,
    mevcutMu: true,
    afisRenk: 'from-amber-950 via-zinc-900 to-slate-950',
    ozet: 'Neon ışıklar altındaki metropolde yeraltı şebekesini çökertmeye kararlı dedektifin soluk kesen takibi.',
    fragmanSuresi: '2:15',
    oyuncular: ['Ryan G.', 'Harrison F.', 'Ana de A.']
  },
  {
    id: 'm3',
    baslik: 'Zamanın Kıyısında (Edge of Chronos)',
    yonetmen: 'Alfonso Cuarón',
    tur: 'Bilim Kurgu',
    cikisYili: 2025,
    sureDakika: 130,
    imdbPuani: 8.4,
    satinAlmaFiyatiTL: 94.00,
    kiralamaKrediBedeli: 14,
    mevcutMu: true,
    afisRenk: 'from-cyan-950 via-slate-900 to-neutral-950',
    ozet: 'Zaman döngüsünü kırmaya çalışan kuantum fizikçisinin paralel evrenlerdeki varoluş savaşı.',
    fragmanSuresi: '2:30',
    oyuncular: ['Cillian M.', 'Emily B.', 'Robert D.']
  },
  {
    id: 'm4',
    baslik: 'Bozkırın Ruhu (Anatolian Echoes)',
    yonetmen: 'Nuri Bilge Ceylan',
    tur: 'Dram',
    cikisYili: 2022,
    sureDakika: 195,
    imdbPuani: 8.7,
    satinAlmaFiyatiTL: 59.90,
    kiralamaKrediBedeli: 8,
    mevcutMu: true,
    afisRenk: 'from-stone-900 via-yellow-950 to-neutral-950',
    ozet: 'Kış mevsiminde Anadolu taşrasında insan doğasının derinliklerine inen çarpıcı ve şiirsel bir yolculuk.',
    fragmanSuresi: '1:50',
    oyuncular: ['Haluk B.', 'Demet A.', 'Merve D.']
  },
  {
    id: 'm5',
    baslik: 'Gülümsemenin Bedeli',
    yonetmen: 'Taika Waititi',
    tur: 'Komedi',
    cikisYili: 2023,
    sureDakika: 108,
    imdbPuani: 7.8,
    satinAlmaFiyatiTL: 49.90,
    kiralamaKrediBedeli: 7,
    mevcutMu: true,
    afisRenk: 'from-rose-950 via-slate-900 to-slate-950',
    ozet: 'Bir banka soygununa istemeden karışan sakar bir muhasebecinin kahkaha dolu kaçış serüveni.',
    fragmanSuresi: '2:05',
    oyuncular: ['Sam R.', 'Rose B.', 'Steve C.']
  },
  {
    id: 'm6',
    baslik: 'Sonsuzluk Okyanusu (Blue Abyss)',
    yonetmen: 'James Cameron',
    tur: 'Belgesel',
    cikisYili: 2024,
    sureDakika: 115,
    imdbPuani: 9.0,
    satinAlmaFiyatiTL: 69.00,
    kiralamaKrediBedeli: 9,
    mevcutMu: true,
    afisRenk: 'from-teal-950 via-blue-950 to-slate-950',
    ozet: 'Mariana Çukuru derinliklerindeki bilinmeyen biyolüminesans canlıların 4K IMAX kayıtları.',
    fragmanSuresi: '3:00',
    oyuncular: ['David A. (Seslendirme)']
  },
  {
    id: 'm7',
    baslik: 'Ejderha Süvarisi: Yeniden Doğuş',
    yonetmen: 'Hayao Miyazaki',
    tur: 'Animasyon',
    cikisYili: 2024,
    sureDakika: 124,
    imdbPuani: 8.8,
    satinAlmaFiyatiTL: 75.00,
    kiralamaKrediBedeli: 10,
    mevcutMu: true,
    afisRenk: 'from-emerald-950 via-slate-900 to-neutral-950',
    ozet: 'Gökyüzü krallığında barışı sağlamak için kadim ejderha ile bağ kuran cesur bir gencin hikayesi.',
    fragmanSuresi: '2:20',
    oyuncular: ['Soma S.', 'Aoi M.']
  },
  // MEVCUT OLMAYAN FİLMLER (Kullanıcı Talebi İçin)
  {
    id: 'm8',
    baslik: 'Karanlık Madde Paradoksu (Dark Matter)',
    yonetmen: 'David Fincher',
    tur: 'Gerilim',
    cikisYili: 2026,
    sureDakika: 148,
    imdbPuani: 9.1,
    satinAlmaFiyatiTL: 120.00,
    kiralamaKrediBedeli: 18,
    mevcutMu: false, // MEVCUT DEĞİL - TALEP EDİLEBİLİR
    afisRenk: 'from-purple-950 via-neutral-900 to-black',
    ozet: 'Dijital telif ve lisans anlaşmaları henüz tamamlanmamış yeni yapım. Kullanıcılar tarafından talep edilebilir!',
    fragmanSuresi: '1:45',
    oyuncular: ['Jake G.', 'Rooney M.']
  },
  {
    id: 'm9',
    baslik: 'Cyber Matrix 2099',
    yonetmen: 'Wachowski Kardeşler',
    tur: 'Bilim Kurgu',
    cikisYili: 2025,
    sureDakika: 155,
    imdbPuani: 8.5,
    satinAlmaFiyatiTL: 99.00,
    kiralamaKrediBedeli: 15,
    mevcutMu: false, // MEVCUT DEĞİL - TALEP EDİLEBİLİR
    afisRenk: 'from-emerald-950 via-slate-950 to-black',
    ozet: 'Arşiv restorasyonunda olan kült yapım. Henüz genel yayına açık değildir, talep formuyla lisans talep edebilirsiniz.',
    fragmanSuresi: '2:10',
    oyuncular: ['Keanu R.', 'Carrie-Anne M.']
  }
];

export const CREDIT_PACKAGES: KrediPaketi[] = [
  {
    id: 'cp1',
    ad: 'Başlangıç Paketi',
    krediMiktari: 10,
    bonusKredi: 0,
    fiyatTL: 59.00
  },
  {
    id: 'cp2',
    ad: 'Popüler Sinema Paketi',
    krediMiktari: 25,
    bonusKredi: 5,
    fiyatTL: 129.00,
    populer: true
  },
  {
    id: 'cp3',
    ad: 'Mega Sinema Tutkunu',
    krediMiktari: 60,
    bonusKredi: 15,
    fiyatTL: 269.00
  },
  {
    id: 'cp4',
    ad: 'VIP Sinemasever',
    krediMiktari: 120,
    bonusKredi: 40,
    fiyatTL: 479.00
  }
];

export const DEMO_USERS: Record<string, KullaniciProfili> = {
  enes: {
    id: 'u_enes',
    adSoyad: 'Enes Öztürk',
    email: 'enes.ozturk@cinesystem.com',
    tip: 'ABONE',
    kayitTarihi: '2025-01-10',
    krediBakiyesi: 38,
    abonelik: {
      id: 'sub_001',
      paket: 'YILLIK_PREMIUM',
      baslangicTarihi: '2026-01-01',
      bitisTarihi: '2027-01-01',
      aktif: true,
      aylikUcretTL: 79.90
    },
    kiralananFilmler: [
      {
        id: 'rent_1',
        filmId: 'm1',
        filmBaslik: 'Yıldızlararası Ufuk (Interstellar Odyssey)',
        harcananKredi: 12,
        kiralamaTarihi: '2026-10-19 14:30',
        bitisTarihi: '2026-10-21 14:30',
        kalanSaat: 39
      }
    ],
    satinAlinanFilmler: [
      {
        id: 'buy_1',
        filmId: 'm4',
        filmBaslik: 'Bozkırın Ruhu (Anatolian Echoes)',
        odenenTutarTL: 59.90,
        satinAlmaTarihi: '2026-08-14',
        faturaNo: 'FAT-2026-9812'
      }
    ],
    talepler: [
      {
        id: 'req_1',
        kullaniciId: 'u_enes',
        kullaniciAdi: 'Enes Öztürk',
        filmBasligi: 'Karanlık Madde Paradoksu (Dark Matter)',
        yonetmen: 'David Fincher',
        yil: 2026,
        talepTarihi: '2026-10-18',
        aciklama: 'Kütüphanede görmek istediğimiz başyapıt.',
        durum: 'INCELENIYOR'
      }
    ],
    krediGecmisi: [
      {
        id: 'k1',
        miktar: 50,
        tip: 'YUKLEME',
        tarih: '2026-10-15',
        aciklama: 'Popüler Sinema Paketi Alımı (+25 Kredi + 5 Bonus)',
        kalanBakiye: 50
      },
      {
        id: 'k2',
        miktar: 12,
        tip: 'KIRALAMA_HARCAMA',
        tarih: '2026-10-19',
        aciklama: 'Yıldızlararası Ufuk Kiralama (-12 Kredi)',
        kalanBakiye: 38
      }
    ]
  },
  ahmet: {
    id: 'u_ahmet',
    adSoyad: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    tip: 'STANDART',
    kayitTarihi: '2026-03-22',
    krediBakiyesi: 0,
    kiralananFilmler: [],
    satinAlinanFilmler: [
      {
        id: 'buy_2',
        filmId: 'm2',
        filmBaslik: 'Gölge Şehir: Sessiz Adalet',
        odenenTutarTL: 79.50,
        satinAlmaTarihi: '2026-09-02',
        faturaNo: 'FAT-2026-4410'
      }
    ],
    talepler: [],
    krediGecmisi: []
  }
};
