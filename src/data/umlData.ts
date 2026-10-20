import { UmlClass, UmlRelationship } from '../types/uml';

export const SIGNATURE_METADATA = {
  author: 'Enes Öztürk',
  role: 'Yazılım Sistem Mimarı / Tasarımcı',
  projectName: 'Online Film Satış & Kiralama Sistemi (CineSystem)',
  version: '2.5.0 UML Standard',
  date: '2026-10-20',
  description: 'Online film platformu için nesne yönelimli analiz ve UML Sınıf Diyagramı tasarımı. Abonelik, kredi yönetimi, film kiralama/satın alma ve film talebi kurallarını modeller.'
};

export const UML_CLASSES: UmlClass[] = [
  {
    id: 'Kullanici',
    name: 'Kullanici',
    type: 'abstract',
    category: 'user',
    stereotype: '«abstract»',
    description: 'Sistemdeki tüm kullanıcıların (Standart ve Abone) türediği temel soyut sınıf. Ortak kimlik, iletişim ve satın alma/talep etme yeteneklerini barındırır.',
    attributes: [
      { name: 'id', type: 'String', visibility: '#', description: 'Benzersiz kullanıcı kimliği' },
      { name: 'adSoyad', type: 'String', visibility: '#', description: 'Kullanıcı adı ve soyadı' },
      { name: 'email', type: 'String', visibility: '#', description: 'Giriş ve iletişim e-posta adresi' },
      { name: 'sifreHash', type: 'String', visibility: '-', description: 'Güvenli şifrelenmiş parola özeti' },
      { name: 'kayitTarihi', type: 'Date', visibility: '#', description: 'Hesabın açılış tarihi' },
      { name: 'satinAlinanlar', type: 'List<SatinAlma>', visibility: '#', description: 'Kalıcı satın alınan filmler listesi' }
    ],
    methods: [
      {
        name: 'filmSatinAl',
        parameters: [{ name: 'film', type: 'Film' }, { name: 'odeme', type: 'OdemeYontemi' }],
        returnType: 'SatinAlma',
        visibility: '+',
        description: 'Tüm kullanıcılar (Normal & Abone) ücret ödeyerek film satın alabilir.'
      },
      {
        name: 'filmTalepEt',
        parameters: [{ name: 'filmBasligi', type: 'String' }, { name: 'yonetmen', type: 'String' }, { name: 'aciklama', type: 'String' }],
        returnType: 'FilmTalebi',
        visibility: '+',
        description: 'Sistemde mevcut olmayan filmler için talep oluşturur.'
      },
      {
        name: 'getSatinAlinanFilmler',
        parameters: [],
        returnType: 'List<Film>',
        visibility: '+',
        description: 'Kullanıcının satın aldığı filmleri döndürür.'
      }
    ],
    x: 480,
    y: 40,
    width: 290,
    height: 250
  },
  {
    id: 'StandartKullanici',
    name: 'StandartKullanici',
    type: 'class',
    category: 'user',
    description: 'Aboneliği bulunmayan normal kullanıcı. Film satın alabilir ve film talep edebilir; ancak krediyle film kiralayamaz.',
    attributes: [
      { name: 'denemeKuponuVarMi', type: 'boolean', visibility: '-', description: 'İlk kullanıcı promosyon hakkı' }
    ],
    methods: [
      {
        name: 'aboneOl',
        parameters: [{ name: 'paketTipi', type: 'PaketTipi' }, { name: 'odeme', type: 'OdemeYontemi' }],
        returnType: 'AboneKullanici',
        visibility: '+',
        description: 'Kullanıcıyı AboneKullanici sınıfına yükseltir ve aboneliği başlatır.'
      }
    ],
    x: 310,
    y: 350,
    width: 270,
    height: 150
  },
  {
    id: 'AboneKullanici',
    name: 'AboneKullanici',
    type: 'class',
    category: 'user',
    description: 'Sisteme abone olmuş imtiyazlı kullanıcı. Kredi satın alabilir ve kredisi ile süreli film kiralayabilir.',
    attributes: [
      { name: 'krediBakiyesi', type: 'int', visibility: '-', description: 'Kullanıcının mevcut harcanabilir kredi miktarı' },
      { name: 'aktifAbonelik', type: 'Abonelik', visibility: '-', description: 'Kullanıcının bağlı olduğu aktif abonelik sözleşmesi' },
      { name: 'kiralananlar', type: 'List<Kiralama>', visibility: '-', description: 'Aktif süreli kiralamalar listesi' }
    ],
    methods: [
      {
        name: 'krediSatinAl',
        parameters: [{ name: 'paket', type: 'KrediPaketi' }, { name: 'odeme', type: 'OdemeYontemi' }],
        returnType: 'boolean',
        visibility: '+',
        description: 'Sistem üzerinden kredi paketi satın alır ve bakiyesine ekler.'
      },
      {
        name: 'filmKirala',
        parameters: [{ name: 'film', type: 'Film' }],
        returnType: 'Kiralama',
        visibility: '+',
        description: 'Kredisi yettiğinde kiralama bedeli kadar kredisi düşülerek 48 saatlik kiralama başlatılır.'
      },
      {
        name: 'krediDus',
        parameters: [{ name: 'miktar', type: 'int' }],
        returnType: 'boolean',
        visibility: '#',
        description: 'Hesaptan kredi bedeli kadar düşüm yapar.'
      },
      {
        name: 'getKrediBakiyesi',
        parameters: [],
        returnType: 'int',
        visibility: '+',
        description: 'Mevcut kredi bakiyesini sorgular.'
      }
    ],
    x: 640,
    y: 350,
    width: 320,
    height: 250
  },
  {
    id: 'Abonelik',
    name: 'Abonelik',
    type: 'class',
    category: 'user',
    description: 'Kullanıcının sistem üyeliğini temsil eden sınıf. Süre, paket türü ve durum bilgilerini tutar.',
    attributes: [
      { name: 'abonelikId', type: 'String', visibility: '-', description: 'Sözleşme ID' },
      { name: 'baslangicTarihi', type: 'Date', visibility: '-', description: 'Abonelik başlangıcı' },
      { name: 'bitisTarihi', type: 'Date', visibility: '-', description: 'Abonelik geçerlilik bitişi' },
      { name: 'paketTipi', type: 'PaketTipi', visibility: '-', description: 'AYLIK_STANDART veya YILLIK_PREMIUM' },
      { name: 'aktif', type: 'boolean', visibility: '-', description: 'Abonelik aktiflik durumu' }
    ],
    methods: [
      { name: 'aktifMi', parameters: [], returnType: 'boolean', visibility: '+', description: 'Aboneliğin geçerliliğini kontrol eder' },
      { name: 'kalanGun', parameters: [], returnType: 'int', visibility: '+', description: 'Kalan gün sayısını hesaplar' },
      { name: 'iptalEt', parameters: [], returnType: 'void', visibility: '+', description: 'Aboneliği sonlandırır' }
    ],
    x: 1020,
    y: 350,
    width: 250,
    height: 220
  },
  {
    id: 'KrediPaketi',
    name: 'KrediPaketi',
    type: 'class',
    category: 'payment',
    description: 'Abonelerin satın alabileceği kredi paketlerini tanımlar (ör. 10 Kredi, 25 Kredi, 60 Kredi).',
    attributes: [
      { name: 'paketId', type: 'String', visibility: '-', description: 'Paket kimlik numarası' },
      { name: 'paketAdi', type: 'String', visibility: '+', description: 'Paket başlığı' },
      { name: 'krediMiktari', type: 'int', visibility: '+', description: 'Kazanılacak kredi adedi' },
      { name: 'bonusKredi', type: 'int', visibility: '+', description: 'Hediye ekstra kredi' },
      { name: 'fiyatTL', type: 'double', visibility: '+', description: 'Paket ücreti' }
    ],
    methods: [
      { name: 'toplamKredi', parameters: [], returnType: 'int', visibility: '+', description: 'Ana kredi + bonus toplamını verir' }
    ],
    x: 1020,
    y: 630,
    width: 250,
    height: 180
  },
  {
    id: 'Film',
    name: 'Film',
    type: 'class',
    category: 'catalog',
    description: 'Platformdaki filmlerin ana modeli. Satın alma fiyatı (TL), kiralama bedeli (Kredi) ve mevcudiyet durumunu barındırır.',
    attributes: [
      { name: 'filmId', type: 'String', visibility: '-', description: 'Film tekil ID' },
      { name: 'baslik', type: 'String', visibility: '+', description: 'Film adı' },
      { name: 'yonetmen', type: 'String', visibility: '+', description: 'Yönetmen' },
      { name: 'tur', type: 'FilmTuru', visibility: '+', description: 'Tür enum: Aksiyon, Dram, vb.' },
      { name: 'cikisYili', type: 'int', visibility: '+', description: 'Vizyon yılı' },
      { name: 'imdbPuani', type: 'double', visibility: '+', description: 'Puan (0.0 - 10.0)' },
      { name: 'satinAlmaFiyatiTL', type: 'double', visibility: '+', description: 'Satın alma bedeli (TL)' },
      { name: 'kiralamaKrediBedeli', type: 'int', visibility: '+', description: 'Kiralama bedeli (Kredi puanı)' },
      { name: 'mevcutMu', type: 'boolean', visibility: '+', description: 'Film katalogda izlenebilir/kiralanabilir durumda mı?' }
    ],
    methods: [
      { name: 'kiralanabilirMi', parameters: [], returnType: 'boolean', visibility: '+', description: 'mevcutMu == true ise kiralanabilir' },
      { name: 'satinAlinabilirMi', parameters: [], returnType: 'boolean', visibility: '+', description: 'mevcutMu == true ise satın alınabilir' },
      { name: 'getDetay', parameters: [], returnType: 'String', visibility: '+', description: 'Film künyesini formatlar' }
    ],
    x: 480,
    y: 680,
    width: 290,
    height: 270
  },
  {
    id: 'FilmKatalogu',
    name: 'FilmKatalogu',
    type: 'class',
    category: 'catalog',
    description: 'Filmleri listeleyen, arayan, sıralayan ve yöneten katalog servisi.',
    attributes: [
      { name: 'filmler', type: 'List<Film>', visibility: '-', description: 'Sistemdeki tüm filmler' }
    ],
    methods: [
      {
        name: 'filmleriListele',
        parameters: [{ name: 'filtreTur', type: 'FilmTuru' }],
        returnType: 'List<Film>',
        visibility: '+',
        description: 'Filmleri türe veya mevcudiyet durumuna göre listeler'
      },
      {
        name: 'filmleriSirala',
        parameters: [{ name: 'kriter', type: 'SiralamaKriteri' }, { name: 'yon', type: 'SiralamaYonu' }],
        returnType: 'List<Film>',
        visibility: '+',
        description: 'IMDb puanı, yıl, fiyat, kredi bedeli veya başlığa göre sıralar'
      },
      {
        name: 'filmAra',
        parameters: [{ name: 'kelime', type: 'String' }],
        returnType: 'List<Film>',
        visibility: '+',
        description: 'Başlık ve yönetmen adına göre arama yapar'
      },
      {
        name: 'filmEkle',
        parameters: [{ name: 'film', type: 'Film' }],
        returnType: 'void',
        visibility: '+',
        description: 'Kataloğa yeni film dahil eder'
      }
    ],
    x: 480,
    y: 1020,
    width: 290,
    height: 220
  },
  {
    id: 'Islem',
    name: 'Islem',
    type: 'abstract',
    category: 'transaction',
    stereotype: '«abstract»',
    description: 'Kullanıcıların gerçekleştirdiği finansal ve erişim işlemlerinin soyut temel sınıfı.',
    attributes: [
      { name: 'islemId', type: 'String', visibility: '#', description: 'İşlem takip kodu' },
      { name: 'kullaniciId', type: 'String', visibility: '#', description: 'İşlemi yapan kullanıcı' },
      { name: 'filmId', type: 'String', visibility: '#', description: 'İlgili film' },
      { name: 'islemTarihi', type: 'Date', visibility: '#', description: 'İşlem zaman damgası' }
    ],
    methods: [
      { name: 'makbuzOlustur', parameters: [], returnType: 'String', visibility: '+', description: 'İşlem özeti ve makbuz üretir' }
    ],
    x: 60,
    y: 350,
    width: 210,
    height: 170
  },
  {
    id: 'Kiralama',
    name: 'Kiralama',
    type: 'class',
    category: 'transaction',
    description: 'Sadece AboneKullanici tarafından kredi kullanılarak yapılan süreli erişim işlemi (ör. 48 saat).',
    attributes: [
      { name: 'harcananKredi', type: 'int', visibility: '-', description: 'Hesaptan düşülen kredi bedeli' },
      { name: 'kiralamaBaslangic', type: 'Date', visibility: '-', description: 'Başlangıç tarihi' },
      { name: 'kiralamaBitis', type: 'Date', visibility: '-', description: 'Süre sonu (48 saat sonrası)' }
    ],
    methods: [
      { name: 'aktifMi', parameters: [], returnType: 'boolean', visibility: '+', description: 'Kiralama süresi henüz dolmadı mı?' },
      { name: 'kalanSureSaat', parameters: [], returnType: 'int', visibility: '+', description: 'Kalan izleme saati' }
    ],
    x: 60,
    y: 590,
    width: 210,
    height: 180
  },
  {
    id: 'SatinAlma',
    name: 'SatinAlma',
    type: 'class',
    category: 'transaction',
    description: 'Normal veya abone kullanıcıların doğrudan para ödeyerek (TL) ömür boyu edindikleri dijital satın alma.',
    attributes: [
      { name: 'odenenTutarTL', type: 'double', visibility: '-', description: 'Ödenen para tutarı' },
      { name: 'faturaNo', type: 'String', visibility: '-', description: 'Resmi fatura seri no' },
      { name: 'omurBoyuErisim', type: 'boolean', visibility: '-', description: 'Kalıcı erişim izni' }
    ],
    methods: [
      { name: 'faturaGoster', parameters: [], returnType: 'String', visibility: '+', description: 'Fatura detayını getirir' }
    ],
    x: 60,
    y: 830,
    width: 210,
    height: 170
  },
  {
    id: 'FilmTalebi',
    name: 'FilmTalebi',
    type: 'class',
    category: 'request',
    description: 'Katalogda mevcut olmayan (mevcutMu == false veya listede bulunmayan) bir filmin kullanıcı tarafından tedarik edilmesi için oluşturulan talep nesnesi.',
    attributes: [
      { name: 'talepId', type: 'String', visibility: '-', description: 'Talep kayıt no' },
      { name: 'kullaniciId', type: 'String', visibility: '-', description: 'Talep eden kullanıcı ID' },
      { name: 'filmBasligi', type: 'String', visibility: '+', description: 'Talep edilen film adı' },
      { name: 'yonetmen', type: 'String', visibility: '+', description: 'Yönetmen (varsa)' },
      { name: 'talepTarihi', type: 'Date', visibility: '+', description: 'Talebin iletildiği tarih' },
      { name: 'durum', type: 'TalepDurumu', visibility: '+', description: 'BEKLEMEDE, INCELENIYOR, TEMIN_EDILDI, REDDEDILDI' }
    ],
    methods: [
      { name: 'durumGuncelle', parameters: [{ name: 'yeniDurum', type: 'TalepDurumu' }], returnType: 'void', visibility: '+', description: 'Admin incelemesiyle durumu değiştirir' },
      { name: 'kullaniciyaBildir', parameters: [], returnType: 'void', visibility: '+', description: 'Film temin edildiğinde kullanıcıya e-posta atar' }
    ],
    x: 880,
    y: 40,
    width: 280,
    height: 240
  },
  {
    id: 'OdemeYontemi',
    name: 'OdemeYontemi',
    type: 'interface',
    category: 'payment',
    stereotype: '«interface»',
    description: 'Kredi kartı, sanal cüzdan ve banka havalesi ödemeleri için Strategy tasarım deseni arayüzü.',
    attributes: [],
    methods: [
      { name: 'odemeYap', parameters: [{ name: 'tutarTL', type: 'double' }], returnType: 'boolean', visibility: '+', description: 'Ödeme tutarını tahsil eder' },
      { name: 'getMakbuzKodu', parameters: [], returnType: 'String', visibility: '+', description: 'Banka işlem referansını döner' }
    ],
    x: 1020,
    y: 870,
    width: 250,
    height: 150
  }
];

export const UML_RELATIONSHIPS: UmlRelationship[] = [
  // 1. Inheritance: StandartKullanici extends Kullanici
  {
    id: 'rel_user_standart',
    from: 'StandartKullanici',
    to: 'Kullanici',
    type: 'inheritance',
    label: 'is-a (Genelleştirme)',
    description: 'StandartKullanici, temel Kullanici sınıfından türer.'
  },
  // 2. Inheritance: AboneKullanici extends Kullanici
  {
    id: 'rel_user_abone',
    from: 'AboneKullanici',
    to: 'Kullanici',
    type: 'inheritance',
    label: 'is-a (Genelleştirme)',
    description: 'AboneKullanici, Kullanici sınıfının tüm özelliklerini miras alır ve kredi/kiralama kabiliyeti ekler.'
  },
  // 3. Inheritance: Kiralama extends Islem
  {
    id: 'rel_kiralama_islem',
    from: 'Kiralama',
    to: 'Islem',
    type: 'inheritance',
    label: 'is-a',
    description: 'Kiralama, temel Islem sınıfından türer.'
  },
  // 4. Inheritance: SatinAlma extends Islem
  {
    id: 'rel_satinalma_islem',
    from: 'SatinAlma',
    to: 'Islem',
    type: 'inheritance',
    label: 'is-a',
    description: 'SatinAlma, temel Islem sınıfından türer.'
  },
  // 5. Composition / Association: AboneKullanici - Abonelik
  {
    id: 'rel_abone_abonelik',
    from: 'AboneKullanici',
    to: 'Abonelik',
    type: 'association',
    label: 'sahiptir',
    fromMultiplicity: '1',
    toMultiplicity: '1',
    description: 'Bir AboneKullanici tam olarak bir aktif Abonelik nesnesine sahiptir.'
  },
  // 6. Association: AboneKullanici - Kiralama
  {
    id: 'rel_abone_kiralama',
    from: 'AboneKullanici',
    to: 'Kiralama',
    type: 'association',
    label: 'kiralar',
    fromMultiplicity: '1',
    toMultiplicity: '0..*',
    description: 'Sadece AboneKullanici kredi ile film kiralayabilir ve kiralamaları takip eder.'
  },
  // 7. Association: Kullanici - SatinAlma
  {
    id: 'rel_kullanici_satinalma',
    from: 'Kullanici',
    to: 'SatinAlma',
    type: 'association',
    label: 'satın alır',
    fromMultiplicity: '1',
    toMultiplicity: '0..*',
    description: 'Hem standart hem abone kullanıcılar doğrudan film satın alabilir.'
  },
  // 8. Association: Kullanici - FilmTalebi
  {
    id: 'rel_kullanici_talep',
    from: 'Kullanici',
    to: 'FilmTalebi',
    type: 'association',
    label: 'talep eder',
    fromMultiplicity: '1',
    toMultiplicity: '0..*',
    description: 'Mevcut olmayan filmler için tüm kullanıcılar FilmTalebi oluşturabilir.'
  },
  // 9. Association: Islem - Film
  {
    id: 'rel_islem_film',
    from: 'Islem',
    to: 'Film',
    type: 'association',
    label: 'içerir',
    fromMultiplicity: '0..*',
    toMultiplicity: '1',
    description: 'Her kiralama veya satın alma işlemi belirli bir filme aittir.'
  },
  // 10. Aggregation / Composition: FilmKatalogu - Film
  {
    id: 'rel_katalog_film',
    from: 'FilmKatalogu',
    to: 'Film',
    type: 'aggregation',
    label: 'barındırır',
    fromMultiplicity: '1',
    toMultiplicity: '0..*',
    description: 'FilmKatalogu bünyesinde birçok Film nesnesini barındırır ve sıralar.'
  },
  // 11. Dependency: AboneKullanici ..> KrediPaketi
  {
    id: 'rel_abone_kredipaketi',
    from: 'AboneKullanici',
    to: 'KrediPaketi',
    type: 'dependency',
    label: '«use»',
    description: 'AboneKullanici kredi satın alırken KrediPaketi nesnesini parametre olarak kullanır.'
  },
  // 12. Dependency: AboneKullanici ..> OdemeYontemi
  {
    id: 'rel_abone_odeme',
    from: 'AboneKullanici',
    to: 'OdemeYontemi',
    type: 'dependency',
    label: '«use»',
    description: 'Kredi veya abonelik ödemelerinde OdemeYontemi arayüzü kullanılır.'
  }
];

export const MERMAID_DIAGRAM_CODE = `classDiagram
    direction TB
    %% Sistem Tasarımı: Enes Öztürk
    %% Online Film Satış, Kiralama ve Abonelik Sistemi

    class Kullanici {
        <<abstract>>
        #String id
        #String adSoyad
        #String email
        -String sifreHash
        #Date kayitTarihi
        #List~SatinAlma~ satinAlinanlar
        +filmSatinAl(Film film, OdemeYontemi odeme) SatinAlma
        +filmTalepEt(String baslik, String yonetmen) FilmTalebi
        +getSatinAlinanFilmler() List~Film~
    }

    class StandartKullanici {
        -boolean denemeKuponuVarMi
        +aboneOl(PaketTipi paket, OdemeYontemi odeme) AboneKullanici
    }

    class AboneKullanici {
        -int krediBakiyesi
        -Abonelik aktifAbonelik
        -List~Kiralama~ kiralananlar
        +krediSatinAl(KrediPaketi paket, OdemeYontemi odeme) boolean
        +filmKirala(Film film) Kiralama
        #krediDus(int miktar) boolean
        +getKrediBakiyesi() int
    }

    class Abonelik {
        -String abonelikId
        -Date baslangicTarihi
        -Date bitisTarihi
        -PaketTipi paketTipi
        -boolean aktif
        +aktifMi() boolean
        +kalanGun() int
        +iptalEt() void
    }

    class KrediPaketi {
        -String paketId
        +String paketAdi
        +int krediMiktari
        +int bonusKredi
        +double fiyatTL
        +toplamKredi() int
    }

    class Film {
        -String filmId
        +String baslik
        +String yonetmen
        +FilmTuru tur
        +int cikisYili
        +double imdbPuani
        +double satinAlmaFiyatiTL
        +int kiralamaKrediBedeli
        +boolean mevcutMu
        +kiralanabilirMi() boolean
        +satinAlinabilirMi() boolean
        +getDetay() String
    }

    class FilmKatalogu {
        -List~Film~ filmler
        +filmleriListele(FilmTuru filtre) List~Film~
        +filmleriSirala(SiralamaKriteri kriter, SiralamaYonu yon) List~Film~
        +filmAra(String kelime) List~Film~
        +filmEkle(Film film) void
    }

    class Islem {
        <<abstract>>
        #String islemId
        #String kullaniciId
        #String filmId
        #Date islemTarihi
        +makbuzOlustur() String
    }

    class Kiralama {
        -int harcananKredi
        -Date kiralamaBaslangic
        -Date kiralamaBitis
        +aktifMi() boolean
        +kalanSureSaat() int
    }

    class SatinAlma {
        -double odenenTutarTL
        -String faturaNo
        -boolean omurBoyuErisim
        +faturaGoster() String
    }

    class FilmTalebi {
        -String talepId
        -String kullaniciId
        +String filmBasligi
        +String yonetmen
        +Date talepTarihi
        +TalepDurumu durum
        +durumGuncelle(TalepDurumu yeniDurum) void
        +kullaniciyaBildir() void
    }

    class OdemeYontemi {
        <<interface>>
        +odemeYap(double tutarTL) boolean
        +getMakbuzKodu() String
    }

    %% Kalıtım (Inheritance)
    Kullanici <|-- StandartKullanici : is-a
    Kullanici <|-- AboneKullanici : is-a
    Islem <|-- Kiralama : is-a
    Islem <|-- SatinAlma : is-a

    %% İlişkiler (Associations & Dependencies)
    AboneKullanici "1" *-- "1" Abonelik : sahiptir
    AboneKullanici "1" o-- "0..*" Kiralama : sadece aboneler kiralar
    Kullanici "1" o-- "0..*" SatinAlma : herkes satin alabilir
    Kullanici "1" --> "0..*" FilmTalebi : mevcut olmayan talep edilir
    FilmKatalogu "1" o-- "0..*" Film : barindirir ve siralar
    Islem --> "1" Film : iliskilidir
    AboneKullanici ..> KrediPaketi : kredi satın alır
    AboneKullanici ..> OdemeYontemi : ödeme yapar
`;

export const PLANTUML_CODE = `@startuml
title Online Film Satış & Kiralama Sistemi Sınıf Diyagramı\\nTasarım: Enes Öztürk

skinparam classAttributeIconSize 0
skinparam backgroundColor #0F172A
skinparam classBackgroundColor #1E293B
skinparam classBorderColor #38BDF8
skinparam classFontColor #F8FAFC
skinparam classHeaderBackgroundColor #0284C7
skinparam stereotypeFontColor #E2E8F0

abstract class Kullanici {
    # id: String
    # adSoyad: String
    # email: String
    - sifreHash: String
    # kayitTarihi: Date
    # satinAlinanlar: List<SatinAlma>
    + filmSatinAl(film: Film, odeme: OdemeYontemi): SatinAlma
    + filmTalepEt(baslik: String, yonetmen: String): FilmTalebi
    + getSatinAlinanFilmler(): List<Film>
}

class StandartKullanici {
    - denemeKuponuVarMi: boolean
    + aboneOl(paket: PaketTipi, odeme: OdemeYontemi): AboneKullanici
}

class AboneKullanici {
    - krediBakiyesi: int
    - aktifAbonelik: Abonelik
    - kiralananlar: List<Kiralama>
    + krediSatinAl(paket: KrediPaketi, odeme: OdemeYontemi): boolean
    + filmKirala(film: Film): Kiralama
    # krediDus(miktar: int): boolean
    + getKrediBakiyesi(): int
}

class Abonelik {
    - abonelikId: String
    - baslangicTarihi: Date
    - bitisTarihi: Date
    - paketTipi: PaketTipi
    - aktif: boolean
    + aktifMi(): boolean
    + kalanGun(): int
    + iptalEt(): void
}

class KrediPaketi {
    - paketId: String
    + paketAdi: String
    + krediMiktari: int
    + bonusKredi: int
    + fiyatTL: double
    + toplamKredi(): int
}

class Film {
    - filmId: String
    + baslik: String
    + yonetmen: String
    + tur: FilmTuru
    + cikisYili: int
    + imdbPuani: double
    + satinAlmaFiyatiTL: double
    + kiralamaKrediBedeli: int
    + mevcutMu: boolean
    + kiralanabilirMi(): boolean
    + satinAlinabilirMi(): boolean
    + getDetay(): String
}

class FilmKatalogu {
    - filmler: List<Film>
    + filmleriListele(filtre: FilmTuru): List<Film>
    + filmleriSirala(kriter: SiralamaKriteri, yon: SiralamaYonu): List<Film>
    + filmAra(kelime: String): List<Film>
    + filmEkle(film: Film): void
}

abstract class Islem {
    # islemId: String
    # kullaniciId: String
    # filmId: String
    # islemTarihi: Date
    + makbuzOlustur(): String
}

class Kiralama {
    - harcananKredi: int
    - kiralamaBaslangic: Date
    - kiralamaBitis: Date
    + aktifMi(): boolean
    + kalanSureSaat(): int
}

class SatinAlma {
    - odenenTutarTL: double
    - faturaNo: String
    - omurBoyuErisim: boolean
    + faturaGoster(): String
}

class FilmTalebi {
    - talepId: String
    - kullaniciId: String
    + filmBasligi: String
    + yonetmen: String
    + talepTarihi: Date
    + durum: TalepDurumu
    + durumGuncelle(yeniDurum: TalepDurumu): void
    + kullaniciyaBildir(): void
}

interface OdemeYontemi <<interface>> {
    + odemeYap(tutarTL: double): boolean
    + getMakbuzKodu(): String
}

Kullanici <|-- StandartKullanici
Kullanici <|-- AboneKullanici
Islem <|-- Kiralama
Islem <|-- SatinAlma

AboneKullanici "1" *-- "1" Abonelik
AboneKullanici "1" o-- "0..*" Kiralama : "sadece aboneler kiralar"
Kullanici "1" o-- "0..*" SatinAlma : "tüm kullanıcılar satın alabilir"
Kullanici "1" --> "0..*" FilmTalebi : "mevcut olmayan film talep edilir"
FilmKatalogu "1" o-- "0..*" Film : "barındırır ve sıralar"
Islem --> "1" Film
AboneKullanici ..> KrediPaketi : "kredi satın alır"
AboneKullanici ..> OdemeYontemi

note bottom of AboneKullanici
  Sisteme abone olan kullanıcılar kredi satın alır.
  Sadece abone olan kullanıcılar kredileriyle film kiralayabilir.
  Kiralama bedeli kadar kredi bakiyeden düşülür.
  -- Tasarım: Enes Öztürk --
end note

@enduml`;
