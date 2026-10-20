import React, { useState } from 'react';
import { Header } from './components/Header';
import { UmlDiagramViewer } from './components/UmlDiagramViewer';
import { CinemaSimulator } from './components/CinemaSimulator';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { CreditModal } from './components/CreditModal';
import { SubscribeModal } from './components/SubscribeModal';
import { DEMO_USERS, INITIAL_MOVIES } from './data/mockCinemaData';
import { KullaniciProfili, Film, KrediPaketi, AbonelikPaketi } from './types/cinema';
import { SIGNATURE_METADATA } from './data/umlData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'diagram' | 'simulator' | 'docs'>('diagram');
  const [currentUserId, setCurrentUserId] = useState<'enes' | 'ahmet'>('enes');
  const [usersState, setUsersState] = useState<Record<string, KullaniciProfili>>(DEMO_USERS);
  const [moviesState, setMoviesState] = useState<Film[]>(INITIAL_MOVIES);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState<boolean>(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState<boolean>(false);

  const currentUser = usersState[currentUserId];

  const handleUpdateUser = (updatedUser: KullaniciProfili) => {
    setUsersState(prev => ({
      ...prev,
      [currentUserId]: updatedUser
    }));
  };

  const handleToggleUser = () => {
    const nextId = currentUserId === 'enes' ? 'ahmet' : 'enes';
    setCurrentUserId(nextId);
  };

  const handlePurchaseCredits = (pkg: KrediPaketi) => {
    const totalAdded = pkg.krediMiktari + pkg.bonusKredi;
    const newCredits = currentUser.krediBakiyesi + totalAdded;
    const newCreditHistory = [
      {
        id: `c_${Date.now()}`,
        miktar: totalAdded,
        tip: 'YUKLEME' as const,
        tarih: new Date().toISOString().substring(0, 10),
        aciklama: `${pkg.ad} Alımı (+${totalAdded} Kredi)`,
        kalanBakiye: newCredits
      },
      ...currentUser.krediGecmisi
    ];

    handleUpdateUser({
      ...currentUser,
      krediBakiyesi: newCredits,
      krediGecmisi: newCreditHistory
    });
  };

  const handleSubscribe = (paket: AbonelikPaketi) => {
    const bonusInitialCredits = paket === 'YILLIK_PREMIUM' ? 25 : 10;
    const newCredits = currentUser.krediBakiyesi + bonusInitialCredits;

    handleUpdateUser({
      ...currentUser,
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
        ...currentUser.krediGecmisi
      ]
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Top Navigation Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUserRole={currentUser.tip}
        currentUserName={currentUser.adSoyad}
        creditBalance={currentUser.krediBakiyesi}
        onOpenCreditModal={() => setIsCreditModalOpen(true)}
        onToggleUser={handleToggleUser}
      />

      {/* Main Active Tab Content */}
      <div className="flex-1">
        {activeTab === 'diagram' && (
          <UmlDiagramViewer />
        )}

        {activeTab === 'simulator' && (
          <CinemaSimulator
            movies={moviesState}
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onSwitchUser={handleToggleUser}
          />
        )}

        {activeTab === 'docs' && (
          <ArchitectureDocs />
        )}
      </div>

      {/* Footer (Anti-slop compliant: clean unboxed copyright & author) */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-4 px-4 sm:px-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">CineSystem Architecture</span>
            <span aria-hidden="true">·</span>
            <span>UML 2.5 Standart Sınıf Modellemesi</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Sistem Tasarımı & Modelleme:</span>
            <span className="font-bold text-sky-400">{SIGNATURE_METADATA.author}</span>
          </div>
        </div>
      </footer>

      {/* Credit Purchase Modal */}
      <CreditModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
        user={currentUser}
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
        user={currentUser}
        onSubscribe={handleSubscribe}
      />

    </div>
  );
}
