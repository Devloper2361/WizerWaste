import React from 'react';
import { RecipientHub } from '../types/foodRescue';
import { PRESET_RECIPIENT_HUBS } from '../utils/prioritization';
import { RotateCcw, MapPin } from 'lucide-react';

interface SampleDataBannerProps {
  selectedHub: RecipientHub;
  onSelectHub: (hub: RecipientHub) => void;
  onResetDemo: () => void;
  filterUserOnly: boolean;
  onToggleUserOnly: (val: boolean) => void;
  userCreatedCount: number;
}

export const SampleDataBanner: React.FC<SampleDataBannerProps> = ({
  selectedHub,
  onSelectHub,
  onResetDemo,
  filterUserOnly,
  onToggleUserOnly,
  userCreatedCount
}) => {
  return (
    <div className="bg-[#f6f5f2] border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-2 text-xs text-stone-600">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        {/* Hub selector & simulated baseline context */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="text-stone-600 text-xs">Simulated Recipient Hub:</span>
          <select
            value={selectedHub.id}
            onChange={(e) => {
              const found = PRESET_RECIPIENT_HUBS.find(h => h.id === e.target.value);
              if (found) onSelectHub(found);
            }}
            className="bg-white border border-stone-200 text-stone-900 rounded px-2 py-0.5 text-xs font-medium focus:outline-none focus:border-stone-400 cursor-pointer shadow-2xs"
          >
            {PRESET_RECIPIENT_HUBS.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name} ({hub.type})
              </option>
            ))}
          </select>
        </div>

        {/* Operational controls */}
        <div className="flex items-center gap-2.5">
          {userCreatedCount > 0 && (
            <button
              type="button"
              onClick={() => onToggleUserOnly(!filterUserOnly)}
              className={`cursor-pointer px-2.5 py-1 rounded border text-[11px] font-medium transition-colors ${
                filterUserOnly
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              {filterUserOnly ? `Showing ${userCreatedCount} Custom Postings` : `Only My Postings (${userCreatedCount})`}
            </button>
          )}

          <button
            type="button"
            onClick={onResetDemo}
            className="cursor-pointer inline-flex items-center gap-1 text-stone-500 hover:text-stone-800 transition-colors text-[11px]"
            title="Reset demonstration data to initial scenarios"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
