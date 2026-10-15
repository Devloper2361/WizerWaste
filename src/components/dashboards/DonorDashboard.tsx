import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Plus, ShieldCheck, Star, Utensils, DollarSign, ArrowRight, LifeBuoy } from 'lucide-react';

interface DonorDashboardProps {
  onOpenDonateModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  onOpenDonateModal,
  onNavigateToTab
}) => {
  const { currentUser } = useAuth();

  const profile = {
    rating: currentUser?.rating || 4.9,
    completedRescues: currentUser?.completedRescuesCount || 48,
    totalKgDiverted: 820,
    totalServingsProvided: 2050,
    estimatedFoodCostDiverted: '$6,450.00',
    packagingCostClaimed: '$285.00'
  };

  return (
    <div className="space-y-6">
      {/* Donor Profile & Action Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium">
              Food Donor Profile
            </span>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3 h-3 text-emerald-800" />
              <span>Verified Commercial Kitchen</span>
            </Badge>
            <span className="text-xs text-stone-500">· {currentUser?.region}</span>
          </div>

          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            {currentUser?.organization}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Coordinator: {currentUser?.name} · Verified Food Safety Compliance Active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('support')}
            icon={<LifeBuoy className="w-3.5 h-3.5" />}
          >
            Help &amp; Support
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('marketplace')}
          >
            Live Marketplace
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Plus className="w-4 h-4" />}
            onClick={onOpenDonateModal}
          >
            Broadcast Food Surplus
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Community Trust Rating</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {profile.rating} <span className="text-sm font-normal text-stone-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Based on 48 recipient ratings</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Completed Rescues</span>
            <Utensils className="w-3.5 h-3.5 text-emerald-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {profile.completedRescues}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">~{profile.totalServingsProvided} portions rescued</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Biomass Diverted</span>
            <span className="text-xs text-stone-400">Landfill Aversion</span>
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {profile.totalKgDiverted} <span className="text-sm font-normal text-stone-400">kg</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">~2,066 kg CO₂e avoided</p>
        </Card>

        <Card padding="sm">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
            <span>Charitable Value Diverted</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-800" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
            {profile.estimatedFoodCostDiverted}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Tax-deduction documentation</p>
        </Card>
      </div>

      {/* 2-Column Split: Active Surplus Management & Expense Ledger Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Donations Queue */}
        <Card
          title="Active Surplus Broadcasts"
          subtitle="Real-time status of your recently posted surplus batches"
          headerAction={
            <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('logistics')}>
              <span>View Logistics</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          }
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900">
                    65 Portions Vegetable Biryani &amp; Chana Masala
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Hot Holding Warmers · 5 Catering Hotel Pans
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  Available (2.5h Left)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                <span>Pickup: Back alley loading ramp</span>
                <span className="font-medium text-emerald-900">RescueScore: 92/100</span>
              </div>
            </div>

            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900">
                    50 Hot Gourmet Flatbreads &amp; Minestrone Soup Pots
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Hot Holding · 2 Cambro Soup Barrels
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  Available (3.0h Left)
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                <span>Pickup: Kitchen courtyard entrance</span>
                <span className="font-medium text-emerald-900">RescueScore: 88/100</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Expense Ledger Preview (Module 11) */}
        <Card
          title="Donation-Related Expense Ledger"
          subtitle="Non-custodial accounting for packaging & preparation tax documentation"
          headerAction={
            <span className="text-[11px] text-stone-500">
              Module 11
            </span>
          }
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-900">Preparation &amp; Ingredient Cost Basis</span>
                <span className="font-mono text-stone-900 font-semibold">{profile.estimatedFoodCostDiverted}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Calculated at wholesale cost basis for non-profit charitable contribution receipts.
              </p>
            </div>

            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-medium text-stone-900">Packaging &amp; Cold-Chain Consumables</span>
                <span className="font-mono text-emerald-900 font-semibold">{profile.packagingCostClaimed}</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Foil pans, thermal seals, and safety labels logged per donation batch.
              </p>
            </div>

            <div className="p-2 bg-stone-100 rounded text-[11px] text-stone-600">
              Note: WizerWaste operates non-custodially and does not hold or transfer funds.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
