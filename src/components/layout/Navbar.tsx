import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFINITIONS, UserRole } from '../../types/auth';
import { Utensils, ChevronDown, LogOut, Check, LifeBuoy } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser, switchRole, logout } = useAuth();
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  if (!currentUser) return null;

  const currentRoleDef = ROLE_DEFINITIONS.find(r => r.role === currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark & Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-md bg-emerald-800 flex items-center justify-center text-white shadow-xs">
            <Utensils className="w-4 h-4" />
          </div>
          <div className="flex items-baseline">
            <span className="text-base font-bold tracking-tight text-stone-900 whitespace-nowrap">
              WizerWaste
            </span>
            <span className="hidden md:inline-block text-xs text-stone-500 ml-2 font-normal">
              Food Rescue Network
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Including clearly visible Help & Support) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 py-5 border-b-2 ${
              currentTab === 'dashboard'
                ? 'text-emerald-900 font-semibold border-emerald-800'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            Role Dashboard
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('marketplace')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 py-5 border-b-2 ${
              currentTab === 'marketplace'
                ? 'text-emerald-900 font-semibold border-emerald-800'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            Surplus Marketplace
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('logistics')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 py-5 border-b-2 ${
              currentTab === 'logistics'
                ? 'text-emerald-900 font-semibold border-emerald-800'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            Rescue Logistics
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('impact')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 py-5 border-b-2 ${
              currentTab === 'impact'
                ? 'text-emerald-900 font-semibold border-emerald-800'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            Impact &amp; Food Safety
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('support')}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 py-5 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'support'
                ? 'text-emerald-900 font-semibold border-emerald-800'
                : 'text-stone-600 hover:text-stone-900 border-transparent'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5 text-stone-500" />
            <span>Help &amp; Support</span>
          </button>
        </nav>

        {/* Zone 3: Quick Role Switcher & User Account */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg text-xs transition-colors"
              title="Switch role for prototype evaluation"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium">
                  Active Role: <strong className="text-emerald-900 font-semibold">{currentRoleDef?.shortLabel}</strong>
                </span>
                <span className="text-stone-800 text-xs font-medium max-w-[140px] truncate">
                  {currentUser.organization}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
            </button>

            {/* Role dropdown menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white border border-stone-200 rounded-lg shadow-lg p-1.5 z-50 text-xs">
                <div className="px-2.5 py-1.5 border-b border-stone-100 mb-1">
                  <span className="font-semibold text-stone-900 block">Switch Active Perspective</span>
                  <p className="text-[11px] text-stone-500">
                    Preview dashboard as another stakeholder
                  </p>
                </div>

                <div className="space-y-0.5">
                  {ROLE_DEFINITIONS.map((def) => {
                    const isSelected = def.role === currentUser.role;
                    return (
                      <button
                        key={def.role}
                        type="button"
                        onClick={() => {
                          switchRole(def.role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full cursor-pointer flex items-start justify-between p-2 rounded-md text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-950 font-medium'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-900">{def.title}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-emerald-800" />}
                          </div>
                          <span className="text-[11px] text-stone-500 block truncate">
                            {def.demoUser.name} · {def.demoUser.organization}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer text-stone-500 hover:text-stone-800 p-2 rounded-lg hover:bg-stone-100 transition-colors"
            title="Sign out of prototype session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200 bg-white text-xs text-stone-600">
        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`px-2 py-1 ${currentTab === 'dashboard' ? 'text-emerald-900 font-semibold' : ''}`}
        >
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('marketplace')}
          className={`px-2 py-1 ${currentTab === 'marketplace' ? 'text-emerald-900 font-semibold' : ''}`}
        >
          Marketplace
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('logistics')}
          className={`px-2 py-1 ${currentTab === 'logistics' ? 'text-emerald-900 font-semibold' : ''}`}
        >
          Logistics
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('impact')}
          className={`px-2 py-1 ${currentTab === 'impact' ? 'text-emerald-900 font-semibold' : ''}`}
        >
          Impact
        </button>
        <button
          type="button"
          onClick={() => onSelectTab('support')}
          className={`px-2 py-1 flex items-center gap-1 ${currentTab === 'support' ? 'text-emerald-900 font-semibold' : ''}`}
        >
          <LifeBuoy className="w-3 h-3 text-stone-500" />
          <span>Support</span>
        </button>
      </div>
    </header>
  );
};
