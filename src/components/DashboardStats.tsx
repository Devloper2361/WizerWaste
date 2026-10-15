import React from 'react';
import { FoodDonation } from '../types/foodRescue';
import { Package, UtensilsCrossed, Truck, Leaf } from 'lucide-react';
import { IMPACT_FACTORS } from '../utils/prioritization';

interface DashboardStatsProps {
  donations: FoodDonation[];
  onNavigateTab: (tab: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ donations, onNavigateTab }) => {
  const now = Date.now();
  const availableCount = donations.filter(
    d => d.status === 'available' && new Date(d.expiryAt).getTime() > now
  ).length;
  const pendingPickupsCount = donations.filter(
    d => d.status === 'claimed' || d.status === 'picked_up'
  ).length;

  const seenDelivered = new Set<string>();
  const deliveredDonations = donations.filter(d => {
    if (d.status !== 'delivered' || seenDelivered.has(d.id)) return false;
    seenDelivered.add(d.id);
    return true;
  });

  const totalMealsRescued = deliveredDonations.reduce(
    (sum, d) => sum + d.quantity.estimatedServings,
    0
  );

  const totalKgRescued = deliveredDonations.reduce(
    (sum, d) => sum + d.quantity.estimatedKg,
    0
  );

  const totalCo2eAvoidedKg = Math.round(totalKgRescued * IMPACT_FACTORS.CO2E_PER_KG);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Available food listings */}
      <div
        onClick={() => onNavigateTab('marketplace')}
        className="cursor-pointer bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5 font-medium">
          <span>Available for Rescue</span>
          <Package className="w-4 h-4 text-emerald-800" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
            {availableCount}
          </span>
          <span className="text-xs text-stone-500">active listings</span>
        </div>
        <p className="mt-1 text-[11px] text-stone-400">
          Ranked by expiry urgency and proximity
        </p>
      </div>

      {/* Metric 2: Meals Rescued */}
      <div
        onClick={() => onNavigateTab('impact')}
        className="cursor-pointer bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5 font-medium">
          <span>Meals Rescued</span>
          <UtensilsCrossed className="w-4 h-4 text-stone-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
            {totalMealsRescued.toLocaleString()}
          </span>
          <span className="text-xs text-stone-500">portions delivered</span>
        </div>
        <p className="mt-1 text-[11px] text-stone-400">
          From {deliveredDonations.length} completed dispatches
        </p>
      </div>

      {/* Metric 3: Active pickups in pipeline */}
      <div
        onClick={() => onNavigateTab('logistics')}
        className="cursor-pointer bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5 font-medium">
          <span>Active Pickup Queue</span>
          <Truck className="w-4 h-4 text-stone-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
            {pendingPickupsCount}
          </span>
          <span className="text-xs text-stone-500">claimed &amp; in transit</span>
        </div>
        <p className="mt-1 text-[11px] text-stone-400">
          Courier custody status tracking
        </p>
      </div>

      {/* Metric 4: Waste Prevented */}
      <div
        onClick={() => onNavigateTab('impact')}
        className="cursor-pointer bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
      >
        <div className="flex items-center justify-between text-stone-500 text-xs mb-1.5 font-medium">
          <span>Waste Diverted</span>
          <Leaf className="w-4 h-4 text-emerald-800" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-stone-900 font-mono tabular-nums">
            {totalKgRescued} <span className="text-sm font-normal text-stone-500">kg</span>
          </span>
          <span className="text-xs text-stone-500">
            · <span className="font-mono text-emerald-800 font-medium">{totalCo2eAvoidedKg}</span> kg CO₂e
          </span>
        </div>
        <p className="mt-1 text-[11px] text-stone-400">
          UNEP 2.52 kg CO₂e factor applied
        </p>
      </div>
    </div>
  );
};
