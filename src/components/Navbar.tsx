import React from 'react';
import { Utensils, Plus, ShieldCheck, Truck, BarChart3, HelpCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: 'marketplace' | 'pickups' | 'impact' | 'algorithm';
  setActiveTab: (tab: 'marketplace' | 'pickups' | 'impact' | 'algorithm') => void;
  onOpenDonateModal: () => void;
  activePickupsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDonateModal,
  activePickupsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              WizerWaste
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400 ml-2">
              Food Rescue Network
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed hover style) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'marketplace'
                ? 'text-white border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Marketplace
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pickups')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'pickups'
                ? 'text-white border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <span>Active Pickups</span>
            {activePickupsCount > 0 && (
              <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-xs font-mono font-medium rounded">
                {activePickupsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('impact')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'impact'
                ? 'text-white border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Impact & Audit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('algorithm')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 ${
              activeTab === 'algorithm'
                ? 'text-white border-emerald-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            Scoring Formula
          </button>
        </nav>

        {/* Zone 3: Primary Action CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenDonateModal}
            className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap shrink-0 font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Donate Surplus Food</span>
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-800/80 bg-slate-950 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`px-2 py-1 ${activeTab === 'marketplace' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Marketplace
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pickups')}
          className={`px-2 py-1 flex items-center gap-1 ${activeTab === 'pickups' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          <span>Pickups</span>
          {activePickupsCount > 0 && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded">
              {activePickupsCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('impact')}
          className={`px-2 py-1 ${activeTab === 'impact' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Impact
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('algorithm')}
          className={`px-2 py-1 ${activeTab === 'algorithm' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}`}
        >
          Algorithm
        </button>
      </div>
    </header>
  );
};
