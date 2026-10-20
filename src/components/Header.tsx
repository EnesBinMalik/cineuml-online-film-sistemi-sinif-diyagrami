import React from 'react';
import { Film, UserCheck, ShieldCheck } from 'lucide-react';
import { SIGNATURE_METADATA } from '../data/umlData';

interface HeaderProps {
  activeTab: 'diagram' | 'simulator' | 'docs';
  setActiveTab: (tab: 'diagram' | 'simulator' | 'docs') => void;
  currentUserRole: 'ABONE' | 'STANDART';
  currentUserName: string;
  creditBalance: number;
  onOpenCreditModal: () => void;
  onToggleUser: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUserRole,
  currentUserName,
  creditBalance,
  onOpenCreditModal,
  onToggleUser
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Zone - Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            CineSystem <span className="text-sky-400 font-medium">UML</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'diagram'
                ? 'text-sky-400 border-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            UML Sınıf Diyagramı
          </button>
          
          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-sky-400 border-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Canlı Sistem Simülatörü
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`whitespace-nowrap transition-colors pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'docs'
                ? 'text-sky-400 border-sky-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Mimari Analiz & İlkeler
          </button>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pl-2 border-l border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tasarım:</span>
            <span className="font-semibold text-slate-200">{SIGNATURE_METADATA.author}</span>
          </div>
        </nav>

        {/* Zone 3: Primary Action Zone */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Active User Pill Button */}
          <button
            onClick={onToggleUser}
            title="Kullanıcı Değiştir (Standart / Abone)"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <UserCheck className={`w-3.5 h-3.5 ${currentUserRole === 'ABONE' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="font-medium truncate max-w-[110px]">{currentUserName}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
              currentUserRole === 'ABONE'
                ? 'bg-amber-500/20 text-amber-300'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {currentUserRole === 'ABONE' ? 'Abone' : 'Standart'}
            </span>
          </button>

          {/* Credit Display & Fast Action */}
          {currentUserRole === 'ABONE' ? (
            <button
              onClick={onOpenCreditModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{creditBalance} Kredi</span>
              <span className="text-amber-500 font-normal">+ Yükle</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Platformu Keşfet
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
