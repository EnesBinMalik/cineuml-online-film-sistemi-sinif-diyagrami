import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Film as FilmIcon, 
  Star, 
  Clock, 
  Coins, 
  ShoppingBag, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Calendar, 
  Play, 
  FileText,
  Crown,
  Sparkles
} from 'lucide-react';
import { 
  Film, 
  FilmTuru, 
  SiralamaKriteri, 
  SiralamaYonu, 
  KullaniciProfili, 
  KrediPaketi, 
  AbonelikPaketi, 
  FilmTalebiKaydi 
} from '../types/cinema';
import { RentConfirmModal } from './RentConfirmModal';
import { BuyConfirmModal } from './BuyConfirmModal';
import { MovieRequestModal } from './MovieRequestModal';
import { CreditModal } from './CreditModal';
import { SubscribeModal } from './SubscribeModal';
import { SIGNATURE_METADATA } from '../data/umlData';

interface CinemaSimulatorProps {
  movies: Film[];
  user: KullaniciProfili;
  onUpdateUser: (updatedUser: KullaniciProfili) => void;
  onSwitchUser: () => void;
}

export const CinemaSimulator: React.FC<CinemaSimulatorProps> = ({
  movies,
  user,
  onUpdateUser,
  onSwitchUser
}) => {
  // State for Catalog
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<FilmTuru | 'ALL'>('ALL');
  const [sortCriterion, setSortCriterion] = useState<SiralamaKriteri>('imdb');
  const [sortDirection, setSortDirection] = useState<SiralamaYonu>('desc');
  const [availabilityFilter, setAvailabilityFilter] = useState<'ALL' | 'AVAILABLE' | 'UNAVAILABLE'>('ALL');

  // Modals state
  const [rentingMovie, setRentingMovie] = useState<Film | null>(null);
  const [buyingMovie, setBuyingMovie] = useState<Film | null>(null);
  const [requestingMovie, setRequestingMovie] = useState<Film | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState<boolean>(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState<boolean>(false);
  const [userTab, setUserTab] = useState<'rentals' | 'purchases' | 'requests' | 'credits'>('rentals');

  // Filter and sort movies according to criteria
  const processedMovies = useMemo(() => {
    let result = [...movies];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.baslik.toLowerCase().includes(q) || 
        m.yonetmen.toLowerCase().includes(q)
      );
    }

    // Genre filter
    if (selectedGenre !== 'ALL') {
      result = result.filter(m => m.tur === selectedGenre);
    }

    // Availability filter
    if (availabilityFilter === 'AVAILABLE') {
      result = result.filter(m => m.mevcutMu);
    } else if (availabilityFilter === 'UNAVAILABLE') {
      result = result.filter(m => !m.mevcutMu);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortCriterion) {
        case 'imdb':
          comparison = a.imdbPuani - b.imdbPuani;
          break;
        case 'yil':
          comparison = a.cikisYili - b.cikisYili;
          break;
        case 'fiyat':
          comparison = a.satinAlmaFiyatiTL - b.satinAlmaFiyatiTL;
          break;
        case 'kredi':
          comparison = a.kiralamaKrediBedeli - b.kiralamaKrediBedeli;
          break;
        case 'baslik':
          comparison = a.baslik.localeCompare(b.baslik, 'tr');
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [movies, searchQuery, selectedGenre, sortCriterion, sortDirection, availabilityFilter]);

  // Handlers
  const handleRentalSuccess = (film: Film) => {
    const newRentals = [
      {
        id: `rent_${Date.now()}`,
        filmId: film.id,
        filmBaslik: film.baslik,
        harcananKredi: film.kiralamaKrediBedeli,
        kiralamaTarihi: new Date().toISOString().replace('T', ' ').substring(0, 16),
        bitisTarihi: new Date(Date.now() + 48 * 3600 * 1000).toISOString().replace('T', ' ').substring(0, 16),
        kalanSaat: 48
      },
      ...user.kiralananFilmler
    ];

    const newCredits = user.krediBakiyesi - film.kiralamaKrediBedeli;
    const newCreditHistory = [
      {
        id: `c_${Date.now()}`,
        miktar: film.kiralamaKrediBedeli,
        tip: 'KIRALAMA_HARCAMA' as const,
        tarih: new Date().toISOString().substring(0, 10),
        aciklama: `${film.baslik} Kiralama (-${film.kiralamaKrediBedeli} Kredi)`,
        kalanBakiye: newCredits
      },
      ...user.krediGecmisi
    ];

    onUpdateUser({
      ...user,
      krediBakiyesi: newCredits,
      kiralananFilmler: newRentals,
      krediGecmisi: newCreditHistory
    });
  };

  const handlePurchaseSuccess = (film: Film) => {
    const newPurchases = [
      {
        id: `buy_${Date.now()}`,
        filmId: film.id,
        filmBaslik: film.baslik,
        odenenTutarTL: film.satinAlmaFiyatiTL,
        satinAlmaTarihi: new Date().toISOString().substring(0, 10),
        faturaNo: `FAT-2026-${Math.floor(1000 + Math.random() * 9000)}`
      },
      ...user.satinAlinanFilmler
    ];

    onUpdateUser({
      ...user,
      satinAlinanFilmler: newPurchases
    });
  };

  const handlePurchaseCredits = (pkg: KrediPaketi) => {
    const totalAdded = pkg.krediMiktari + pkg.bonusKredi;
    const newCredits = user.krediBakiyesi + totalAdded;
    const newCreditHistory = [
      {
        id: `c_${Date.now()}`,
        miktar: totalAdded,
        tip: 'YUKLEME' as const,
        tarih: new Date().toISOString().substring(0, 10),
        aciklama: `${pkg.ad} Alımı (+${totalAdded} Kredi)`,
        kalanBakiye: newCredits
      },
      ...user.krediGecmisi
    ];

    onUpdateUser({
      ...user,
      krediBakiyesi: newCredits,
      krediGecmisi: newCreditHistory
    });
  };

  const handleSubscribe = (paket: AbonelikPaketi) => {
    const bonusInitialCredits = paket === 'YILLIK_PREMIUM' ? 25 : 10;
    const newCredits = user.krediBakiyesi + bonusInitialCredits;

    onUpdateUser({
      ...user,
      tip: 'ABONE',
      krediBakiyesi: newCredits,
      abonelik: {
        id: `sub_${Date.now()}`,
        paket,
        baslangicTarihi: new Date().toISOString().substring(0, 10),
        bitisTarihi: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().substring(0, 10),
        aktif: true,
        aylikUcretTL: paket === 'YILLIK_PREMIUM' ? 79.90 : 99.90
      },
      krediGecmisi: [
        {
          id: `c_${Date.now()}`,
          miktar: bonusInitialCredits,
          tip: 'YUKLEME',
          tarih: new Date().toISOString().substring(0, 10),
          aciklama: `Abonelik Hoşgeldin Hediyesi (+${bonusInitialCredits} Kredi)`,
          kalanBakiye: newCredits
        },
        ...user.krediGecmisi
      ]
    });
  };

  const handleMovieRequest = (reqData: Omit<FilmTalebiKaydi, 'id' | 'talepTarihi' | 'durum'>) => {
    const newRequest: FilmTalebiKaydi = {
      ...reqData,
      id: `req_${Date.now()}`,
      talepTarihi: new Date().toISOString().substring(0, 10),
      durum: 'BEKLEMEDE'
    };

    onUpdateUser({
      ...user,
      talepler: [newRequest, ...user.talepler]
    });
  };

  const isAlreadyRented = (filmId: string) => {
    return user.kiralananFilmler.some(r => r.filmId === filmId);
  };

  const isAlreadyPurchased = (filmId: string) => {
    return user.satinAlinanFilmler.some(p => p.filmId === filmId);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Platform Dashboard & Rules Banner */}
      <section className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: User Status Banner */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-900/30">
                <User className="w-7 h-7" />
              </div>
              {user.tip === 'ABONE' && (
                <span className="absolute -top-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-full shadow" title="Abone Kullanıcı">
                  <Crown className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{user.adSoyad}</h2>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  user.tip === 'ABONE'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {user.tip === 'ABONE' ? 'ABONE KULLANICI' : 'STANDART KULLANICI'}
                </span>
              </div>
              
              {/* Unboxed Metadata with · separator */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{user.email}</span>
                <span aria-hidden="true">·</span>
                <span>Kayıt: {user.kayitTarihi}</span>
                {user.abonelik && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-medium">Abonelik Aktif</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Balances & Account Actions */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Credit Pill */}
            {user.tip === 'ABONE' ? (
              <div className="flex items-center gap-3 px-3.5 py-2 bg-slate-950 rounded-xl border border-amber-500/30">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Kredi Bakiyesi:</span>
                  <span className="font-bold text-sm font-mono tabular-nums">{user.krediBakiyesi} Kredi</span>
                </div>
                <button
                  onClick={() => setIsCreditModalOpen(true)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
                >
                  + Yükle
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-950 rounded-xl border border-slate-800">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300">Film kiralamak için abone olun</span>
                <button
                  onClick={() => setIsSubscribeModalOpen(true)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer"
                >
                  Abone Ol
                </button>
              </div>
            )}

            {/* Profile Drawer Button */}
            <button
              onClick={() => setIsUserDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Kütüphanem & Talepler ({user.kiralananFilmler.length + user.satinAlinanFilmler.length})</span>
            </button>

            {/* Switch user demo */}
            <button
              onClick={onSwitchUser}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Kullanıcı değiştirerek kuralları test edin"
            >
              Kullanıcı Değiştir
            </button>

          </div>

        </div>
      </section>

      {/* Catalog Search & Filter Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Film adı veya yönetmen ara..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Sort & Availability Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Availability Filter Segment */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setAvailabilityFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  availabilityFilter === 'ALL' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setAvailabilityFilter('AVAILABLE')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  availabilityFilter === 'AVAILABLE' ? 'bg-emerald-950/60 text-emerald-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mevcut Filmler
              </button>
              <button
                onClick={() => setAvailabilityFilter('UNAVAILABLE')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  availabilityFilter === 'UNAVAILABLE' ? 'bg-purple-950/60 text-purple-300 font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mevcut Değil (Talep)
              </button>
            </div>

            {/* Sort Criterion Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-500">Sırala:</span>
              <select
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value as SiralamaKriteri)}
                className="bg-transparent border-none text-white text-xs focus:outline-none cursor-pointer"
              >
                <option value="imdb" className="bg-slate-900">IMDb Puanı</option>
                <option value="yil" className="bg-slate-900">Çıkış Yılı</option>
                <option value="fiyat" className="bg-slate-900">Satın Alma Fiyatı (TL)</option>
                <option value="kredi" className="bg-slate-900">Kiralama Bedeli (Kredi)</option>
                <option value="baslik" className="bg-slate-900">Film Adı (A-Z)</option>
              </select>
            </div>

            {/* Sort Direction Toggle */}
            <button
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors cursor-pointer"
              title="Sıralama yönünü değiştir"
            >
              {sortDirection === 'desc' ? 'Azalan ↓' : 'Artan ↑'}
            </button>

            {/* Request Any Movie Button */}
            <button
              onClick={() => setRequestingMovie({} as any)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Yeni Film Talep Et</span>
            </button>

          </div>

        </div>

        {/* Genre Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {(['ALL', 'Aksiyon', 'Bilim Kurgu', 'Dram', 'Gerilim', 'Komedi', 'Belgesel', 'Animasyon'] as const).map(genre => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {genre === 'ALL' ? 'Tüm Türler' : genre}
              </button>
            );
          })}
        </div>

      </section>

      {/* Movie Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 pb-16 flex-1 w-full">
        
        {processedMovies.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
            <FilmIcon className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Aradığınız kriterde film bulunamadı</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Katalogda olmayan filmleri sisteme dahil edilmek üzere anında talep edebilirsiniz.
            </p>
            <button
              onClick={() => setRequestingMovie({} as any)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>"{searchQuery}" Filmini Talep Et</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processedMovies.map(film => {
              const rented = isAlreadyRented(film.id);
              const purchased = isAlreadyPurchased(film.id);

              return (
                <div
                  key={film.id}
                  className="group bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col hover:border-slate-700 transition-all duration-200"
                >
                  {/* Poster Graphic Area */}
                  <div className={`relative h-56 bg-gradient-to-br ${film.afisRenk} p-4 flex flex-col justify-between overflow-hidden`}>
                    
                    {/* Top status info */}
                    <div className="flex items-center justify-between z-10">
                      {/* Availability badge */}
                      {film.mevcutMu ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                          Mevcut
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                          Mevcut Değil (Talep Et)
                        </span>
                      )}

                      {/* IMDb Score */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 text-amber-400 text-xs font-bold font-mono backdrop-blur-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{film.imdbPuani.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Center Cinema Vector Icon & Title */}
                    <div className="z-10 my-auto text-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mx-auto mb-2 group-hover:scale-105 transition-transform">
                        <FilmIcon className="w-6 h-6 text-slate-200" />
                      </div>
                      <h4 className="text-base font-extrabold text-white leading-tight drop-shadow-md px-2">
                        {film.baslik}
                      </h4>
                    </div>

                    {/* Bottom Metadata bar on poster */}
                    <div className="z-10 flex items-center justify-between text-[11px] text-slate-300 font-medium backdrop-blur-sm bg-black/40 px-2.5 py-1 rounded-lg">
                      <span>{film.tur}</span>
                      <span>{film.cikisYili}</span>
                      <span>{film.sureDakika} dk</span>
                    </div>

                    {/* Radial subtle glow */}
                    <div className="absolute inset-0 bg-radial from-transparent to-black/60 pointer-events-none" />
                  </div>

                  {/* Film Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Yönetmen: <span className="text-slate-200">{film.yonetmen}</span>
                      </p>
                      <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                        {film.ozet}
                      </p>
                    </div>

                    {/* Pricing / Credits Row */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Kiralama</span>
                        <span className="font-bold text-amber-400 font-mono text-sm">
                          {film.kiralamaKrediBedeli} Kredi
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Satın Alma</span>
                        <span className="font-bold text-emerald-400 font-mono text-sm">
                          {film.satinAlmaFiyatiTL.toFixed(2)} TL
                        </span>
                      </div>
                    </div>

                    {/* Actions Depending on Availability */}
                    <div className="pt-1">
                      {film.mevcutMu ? (
                        <div className="grid grid-cols-2 gap-2">
                          
                          {/* Rent with Credits Button */}
                          {rented ? (
                            <button
                              disabled
                              className="col-span-1 py-2 px-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1 opacity-90 cursor-default"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Kiralandı</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setRentingMovie(film)}
                              className="col-span-1 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-amber-500/10"
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>Kirala</span>
                            </button>
                          )}

                          {/* Buy Permanently Button */}
                          {purchased ? (
                            <button
                              disabled
                              className="col-span-1 py-2 px-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1 opacity-90 cursor-default"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Arşivde</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setBuyingMovie(film)}
                              className="col-span-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Satın Al</span>
                            </button>
                          )}

                        </div>
                      ) : (
                        /* Movie Not Available: Request button */
                        <button
                          onClick={() => setRequestingMovie(film)}
                          className="w-full py-2.5 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-purple-400" />
                          <span>Bu Filmi Talep Et</span>
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* User Library & History Slide-over Drawer */}
      {isUserDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-base font-bold text-white">Kullanıcı Hesabı & Kütüphane</h3>
                <p className="text-xs text-slate-400">{user.adSoyad} ({user.tip})</p>
              </div>
              <button
                onClick={() => setIsUserDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Tab navigation inside drawer */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 text-xs">
              <button
                onClick={() => setUserTab('rentals')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  userTab === 'rentals' ? 'border-amber-400 text-amber-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Kiralananlar ({user.kiralananFilmler.length})
              </button>
              <button
                onClick={() => setUserTab('purchases')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  userTab === 'purchases' ? 'border-emerald-400 text-emerald-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Satın Alınanlar ({user.satinAlinanFilmler.length})
              </button>
              <button
                onClick={() => setUserTab('requests')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  userTab === 'requests' ? 'border-purple-400 text-purple-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Taleplerim ({user.talepler.length})
              </button>
              <button
                onClick={() => setUserTab('credits')}
                className={`flex-1 py-3 text-center font-medium border-b-2 transition-colors cursor-pointer ${
                  userTab === 'credits' ? 'border-sky-400 text-sky-300 font-semibold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                Kredi Geçmişi
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Rentals tab */}
              {userTab === 'rentals' && (
                <div className="space-y-3">
                  {user.kiralananFilmler.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Aktif kiralanan film bulunmamaktadır.
                    </div>
                  ) : (
                    user.kiralananFilmler.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{item.filmBaslik}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                            {item.kalanSaat} Saat Kaldı
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Harcanan: {item.harcananKredi} Kredi</span>
                          <span>Bitiş: {item.bitisTarihi}</span>
                        </div>
                        <button
                          onClick={() => alert(`"${item.filmBaslik}" oynatıcısı başlatıldı. Keyifli seyirler!`)}
                          className="w-full mt-1 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-amber-300" />
                          <span>Şimdi İzle</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Purchases tab */}
              {userTab === 'purchases' && (
                <div className="space-y-3">
                  {user.satinAlinanFilmler.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Henüz satın alınmış kalıcı film bulunmamaktadır.
                    </div>
                  ) : (
                    user.satinAlinanFilmler.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px]">{item.filmBaslik}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                            Ömür Boyu
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Tutar: {item.odenenTutarTL.toFixed(2)} TL</span>
                          <span>Fatura: {item.faturaNo}</span>
                        </div>
                        <button
                          onClick={() => alert(`"${item.filmBaslik}" 4K Ultra HD oynatıcısı başlatıldı. Arşivinizden sınırsız izleyebilirsiniz.`)}
                          className="w-full mt-1 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-emerald-300" />
                          <span>Arşivden Oynat</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Requests tab */}
              {userTab === 'requests' && (
                <div className="space-y-3">
                  {user.talepler.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      İlettiğiniz film talebi bulunmamaktadır.
                    </div>
                  ) : (
                    user.talepler.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white">{item.filmBasligi}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                            item.durum === 'TEMIN_EDILDI' ? 'bg-emerald-500/20 text-emerald-300' :
                            item.durum === 'INCELENIYOR' ? 'bg-sky-500/20 text-sky-300' :
                            'bg-purple-500/20 text-purple-300'
                          }`}>
                            {item.durum}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Yönetmen: {item.yonetmen} · Tarih: {item.talepTarihi}
                        </p>
                        {item.aciklama && (
                          <p className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                            "{item.aciklama}"
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Credits history tab */}
              {userTab === 'credits' && (
                <div className="space-y-3">
                  {user.krediGecmisi.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      Kredi hareket geçmişi bulunmamaktadır.
                    </div>
                  ) : (
                    user.krediGecmisi.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-slate-200 font-medium">{item.aciklama}</p>
                          <p className="text-[10px] text-slate-500">{item.tarih}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold ${item.tip === 'YUKLEME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {item.tip === 'YUKLEME' ? `+${item.miktar}` : `-${item.miktar}`}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">Bakiye: {item.kalanBakiye}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-center">
              <span className="text-[11px] text-slate-500">
                Sistem Mimarisi Modellemesi: {SIGNATURE_METADATA.author}
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Rent Confirm Modal */}
      <RentConfirmModal
        isOpen={!!rentingMovie}
        onClose={() => setRentingMovie(null)}
        film={rentingMovie}
        user={user}
        onConfirmRental={handleRentalSuccess}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
        onOpenSubscribeModal={() => setIsSubscribeModalOpen(true)}
      />

      {/* Buy Confirm Modal */}
      <BuyConfirmModal
        isOpen={!!buyingMovie}
        onClose={() => setBuyingMovie(null)}
        film={buyingMovie}
        user={user}
        onConfirmPurchase={handlePurchaseSuccess}
      />

      {/* Movie Request Modal */}
      <MovieRequestModal
        isOpen={!!requestingMovie}
        onClose={() => setRequestingMovie(null)}
        user={user}
        preselectedMovie={requestingMovie?.id ? requestingMovie : null}
        onSubmitRequest={handleMovieRequest}
      />

      {/* Credit Purchase Modal */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        user={user}
        onPurchaseCredits={handlePurchaseCredits}
        onPromptSubscribe={() => {
          setIsCreditModalOpen(false);
          setIsSubscribeModalOpen(true);
        }}
      />

      {/* Subscription Upgrade Modal */}
      <SubscribeModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        user={user}
        onSubscribe={handleSubscribe}
      />

    </div>
  );
};
