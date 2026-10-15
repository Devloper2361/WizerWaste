import React, { useState } from 'react';
import { calculateUrgencyScore, calculateProximityScore, calculateStorageScore } from '../utils/prioritization';
import { StorageCondition } from '../types/foodRescue';
import { X, Sliders } from 'lucide-react';
import { Button } from './common/Button';

interface AlgorithmExplainerProps {
  isOpen?: boolean;
  onClose?: () => void;
  isModal?: boolean;
}

export const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({
  isOpen = true,
  onClose,
  isModal = false
}) => {
  const [simHours, setSimHours] = useState<number>(2.5);
  const [simDistance, setSimDistance] = useState<number>(1.8);
  const [simStorage, setSimStorage] = useState<StorageCondition>('chilled');

  const simUrgencyScore = calculateUrgencyScore(simHours);
  const simProximityScore = calculateProximityScore(simDistance);
  const simStorageScore = calculateStorageScore(simStorage);
  const simTotalScore = Math.min(100, Math.max(0, simUrgencyScore + simProximityScore + simStorageScore));

  const getTier = (score: number, hours: number) => {
    if (score >= 75 || hours <= 2.5) return { name: 'Urgent Dispatch (Critical)', color: 'text-amber-900 font-semibold' };
    if (score >= 50 || hours <= 6) return { name: 'High Priority', color: 'text-amber-800 font-semibold' };
    return { name: 'Standard Window', color: 'text-stone-700' };
  };

  const simTier = getTier(simTotalScore, simHours);

  const content = (
    <div className="space-y-6 text-xs text-stone-700">
      {/* Intro Box */}
      <div className="bg-[#fbfbfa] p-4 sm:p-5 rounded-lg border border-stone-200">
        <h3 className="text-sm font-bold text-stone-900 mb-1.5">
          Transparent Rule-Based Prioritization Architecture
        </h3>
        <p className="text-stone-600 leading-relaxed text-xs">
          WizerWaste uses transparent rule-based scoring in food rescue operations.
          Every surplus posting is dynamically evaluated based on safe food consumption windows, transit distance, and temperature holding constraints.
        </p>

        {/* Formula Display */}
        <div className="mt-3.5 p-3 bg-white rounded-md border border-stone-200 text-center text-xs shadow-2xs">
          <strong className="text-emerald-900">RescueScore (0–100)</strong> ={' '}
          <span className="text-amber-900 font-medium">Urgency (0–60)</span> +{' '}
          <span className="text-stone-700 font-medium">Proximity (0–30)</span> +{' '}
          <span className="text-stone-700 font-medium">Perishability (0–10)</span>
        </div>
      </div>

      {/* 3 Pillars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pillar 1: Urgency */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">1. Expiry Urgency</span>
            <span className="text-amber-900 font-medium">Max 60 pts</span>
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            Prioritizes short shelf-life windows before safe consumption expires:
          </p>
          <ul className="space-y-1 text-[11px] text-stone-600 pt-1">
            <li className="flex justify-between">
              <span>&lt; 1.5 hours:</span> <strong className="text-stone-900">60 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>1.5 – 3.0 hours:</span> <strong className="text-stone-900">52 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>3.0 – 6.0 hours:</span> <strong className="text-stone-900">42 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>6.0 – 12.0 hours:</span> <strong className="text-stone-900">30 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>12.0 – 24.0 hours:</span> <strong className="text-stone-900">18 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>&gt; 24.0 hours:</span> <span className="text-stone-400">4 pts</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2: Proximity */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">2. Proximity</span>
            <span className="text-stone-700 font-medium">Max 30 pts</span>
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            Evaluates travel friction from recipient community hubs:
          </p>
          <ul className="space-y-1 text-[11px] text-stone-600 pt-1">
            <li className="flex justify-between">
              <span>&le; 1.0 km (Walkable/Cargo bike):</span> <strong className="text-stone-900">30 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>1.1 – 2.5 km (Rapid transit):</span> <strong className="text-stone-900">25 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>2.6 – 5.0 km (Metro radius):</span> <strong className="text-stone-900">18 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>5.1 – 8.0 km (Suburban):</span> <strong className="text-stone-900">11 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>8.1 – 12.0 km:</span> <strong className="text-stone-900">5 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>&gt; 12.0 km:</span> <span className="text-stone-400">2 pts</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3: Perishability */}
        <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">3. Perishability Modifier</span>
            <span className="text-emerald-900 font-medium">Max 10 pts</span>
          </div>
          <p className="text-stone-500 text-[11px] leading-relaxed">
            Temperature-controlled holding requires priority transport:
          </p>
          <ul className="space-y-1 text-[11px] text-stone-600 pt-1">
            <li className="flex justify-between">
              <span>Hot Holding (&gt;60°C):</span> <strong className="text-stone-900">+10 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>Chilled Cold-Chain (2–4°C):</span> <strong className="text-stone-900">+7 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>Fresh Produce / Bakery:</span> <strong className="text-stone-900">+3 pts</strong>
            </li>
            <li className="flex justify-between">
              <span>Frozen / Shelf-Stable:</span> <span className="text-stone-500">+1 pt</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Simulator Sandbox */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-800" />
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Interactive Scoring Simulator
            </h4>
          </div>
          <span className="text-[11px] text-stone-400">Test formula behavior in real-time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-700 font-medium">Hours to Expiry:</span>
              <strong className="text-amber-900">{simHours} hours</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="24"
              step="0.5"
              value={simHours}
              onChange={(e) => setSimHours(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>30 mins</span>
              <span>24 hours</span>
            </div>
            <div className="mt-1.5 text-[11px] text-stone-500">
              Urgency: <strong className="text-stone-800">{simUrgencyScore}</strong>/60 pts
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-700 font-medium">Simulated Distance:</span>
              <strong className="text-stone-900">{simDistance} km</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={simDistance}
              onChange={(e) => setSimDistance(Number(e.target.value))}
              className="w-full accent-emerald-800 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>0.5 km</span>
              <span>15 km</span>
            </div>
            <div className="mt-1.5 text-[11px] text-stone-500">
              Proximity: <strong className="text-stone-800">{simProximityScore}</strong>/30 pts
            </div>
          </div>

          <div>
            <span className="block text-stone-700 font-medium mb-1">Storage Condition:</span>
            <select
              value={simStorage}
              onChange={(e) => setSimStorage(e.target.value as any)}
              className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-2.5 py-1.5 focus:outline-none"
            >
              <option value="hot_holding">Hot Holding (+10 pts)</option>
              <option value="chilled">Chilled Cold-Chain (+7 pts)</option>
              <option value="ambient">Ambient Bakery/Produce (+3 pts)</option>
              <option value="frozen">Frozen Storage (+1 pt)</option>
            </select>
            <div className="mt-3 text-[11px] text-stone-500">
              Perishability: <strong className="text-stone-800">+{simStorageScore}</strong>/10 pts
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fbfbfa] p-3.5 rounded-md border border-stone-200">
          <div>
            <span className="text-[11px] text-stone-500 block">Calculated RescueScore:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-950 font-mono tabular-nums">
                {simTotalScore} / 100
              </span>
              <span className={`text-xs ${simTier.color}`}>
                ({simTier.name})
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-500 max-w-sm sm:text-right">
            {simTotalScore >= 75
              ? 'Triggers immediate priority badge on recipient relief center feeds.'
              : simTotalScore >= 50
              ? 'Scheduled for high-priority dispatch in current window.'
              : 'Standard pickup queue window.'}
          </p>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white border border-stone-200 rounded-xl w-full max-w-3xl my-8 overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0 bg-white">
            <div>
              <h2 className="text-base font-bold text-stone-900">RescueScore Rule Transparency</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Mathematical rules governing food rescue prioritization
              </p>
            </div>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-6 overflow-y-auto">{content}</div>
          <div className="px-6 py-3 border-t border-stone-200 flex justify-end shrink-0 bg-white">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <div>{content}</div>;
};
