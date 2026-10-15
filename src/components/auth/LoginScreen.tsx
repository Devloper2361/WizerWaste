import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_DEFINITIONS, UserRole } from '../../types/auth';
import { Utensils, ArrowRight, Lock, Mail, AlertCircle, Shield } from 'lucide-react';
import { Button } from '../common/Button';

export const LoginScreen: React.FC = () => {
  const { loginAsRole, loginWithEmail } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setAuthError('Please enter an email address or select a preset role below.');
      return;
    }
    setAuthError('');
    loginWithEmail(customEmail.trim(), selectedRole);
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    loginAsRole(role);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between text-stone-900">
      {/* Top Header */}
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-emerald-800 flex items-center justify-center text-white shadow-xs">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-stone-900 text-base tracking-tight">WizerWaste</span>
              <span className="hidden sm:inline-block text-xs text-stone-500 ml-2">
                Hyperlocal Surplus Food Rescue &amp; Redistribution
              </span>
            </div>
          </div>
          <span className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded border border-stone-200 font-medium">
            Prototype Demo
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-6">
          {/* Headline */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
              <Utensils className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Sign In to WizerWaste
            </h1>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Food rescue operations connecting surplus kitchens with verified community dining centers and couriers.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@organization.org (or select a role below)"
                  className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={customPassword}
                  onChange={(e) => setCustomPassword(e.target.value)}
                  placeholder="•••••••••••• (any demo input)"
                  className="w-full bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 text-xs placeholder:text-stone-400 focus:outline-none focus:border-emerald-700 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </form>

          {/* Clean Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-stone-400 font-medium uppercase tracking-wider whitespace-nowrap">
              Or 1-Click Role Testing
            </span>
          </div>

          {/* Role Cards */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-800 block mb-1">
              Select Stakeholder Dashboard to Launch:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {ROLE_DEFINITIONS.map((def) => (
                <div
                  key={def.role}
                  onClick={() => handleQuickRoleSelect(def.role)}
                  className="group p-2.5 rounded-lg border border-stone-200 hover:border-emerald-700 hover:bg-stone-50 transition-all cursor-pointer flex items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900 text-xs group-hover:text-emerald-900">
                        {def.title}
                      </span>
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded font-normal">
                        {def.scope}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {def.demoUser.name} · {def.demoUser.organization}
                    </p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-800 shrink-0 group-hover:translate-x-0.5 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-3.5 px-6 text-center text-xs text-stone-500">
        <p>
          WizerWaste Operations Prototype · Client-Side Role Simulation Mode
        </p>
      </footer>
    </div>
  );
};
