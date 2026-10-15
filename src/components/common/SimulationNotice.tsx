import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

interface SimulationNoticeProps {
  compact?: boolean;
}

export const SimulationNotice: React.FC<SimulationNoticeProps> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-stone-100 border-b border-stone-200 px-4 py-1.5 text-[11px] text-stone-600 flex items-center justify-between gap-3">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>
            <strong className="text-stone-800 font-medium">Evaluation Prototype:</strong> Stakeholder roles, authentication sessions, and audit records are simulated client-side via localStorage for workflow demonstration. Production deployment requires server-side identity provider (IdP), OAuth/JWT verification, and tamper-proof immutable audit infrastructure.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-stone-700 cursor-pointer p-0.5 ml-2"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
