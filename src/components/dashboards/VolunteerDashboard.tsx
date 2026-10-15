import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShieldCheck, Thermometer, LifeBuoy } from 'lucide-react';

interface VolunteerDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ onNavigateToTab }) => {
  const { currentUser } = useAuth();
  const [isOnDuty, setIsOnDuty] = useState(true);

  const volunteerStats = {
    completedMissions: currentUser?.completedRescuesCount || 34,
    hoursVolunteered: 62,
    totalKgDelivered: 1280,
    rating: currentUser?.rating || 4.95
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium">
              Field Courier &amp; Logistics Runner
            </span>
            <Badge variant="success" size="sm">
              <ShieldCheck className="w-3 h-3 text-emerald-800" />
              <span>Certified Cold-Chain Handler</span>
            </Badge>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Courier Ops: {currentUser?.name}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Vehicle Mode: Cargo E-Bike &amp; Insulated Carriers · Service Sector: {currentUser?.region}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* On Duty Toggle */}
          <button
            type="button"
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`cursor-pointer px-3 py-1.5 rounded-md border text-xs font-medium transition-colors flex items-center gap-2 ${
              isOnDuty
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-stone-100 text-stone-600 border-stone-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isOnDuty ? 'bg-emerald-800' : 'bg-stone-400'
              }`}
            />
            <span>{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('support')}
            icon={<LifeBuoy className="w-3.5 h-3.5" />}
          >
            Help &amp; Support
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToTab('logistics')}
          >
            View Dispatch Queue
          </Button>
        </div>
      </div>

      {/* Volunteer KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Completed Deliveries</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {volunteerStats.completedMissions}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Verified rescue drop-offs</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Volunteered Service</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
            {volunteerStats.hoursVolunteered} hrs
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Community logistics contribution</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Food Biomass Handled</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {volunteerStats.totalKgDelivered} kg
          </div>
          <p className="text-[11px] text-stone-500 mt-1">~3,200 portions transported</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Logistics Reliability</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {volunteerStats.rating} / 5.0
          </div>
          <p className="text-[11px] text-stone-500 mt-1">100% on-time temperature compliance</p>
        </Card>
      </div>

      {/* 2-Column Split: Active Mission & Food Safety Protocol Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Dispatch Mission */}
        <Card
          title="Current Assigned Dispatch Mission"
          subtitle="Route from food provider loading dock to receiving community center"
          headerAction={
            <Badge variant="warning">Pickup Scheduled</Badge>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900 text-sm">
                    12 Crates Organic Apples, Carrots &amp; Greens
                  </h4>
                  <span className="text-[11px] text-stone-600">
                    78 kg · 195 estimated meals
                  </span>
                </div>
                <Badge variant="info" size="sm">
                  In Transit
                </Badge>
              </div>

              {/* Waypoints */}
              <div className="space-y-2 text-stone-700 text-[11px] pt-2 border-t border-stone-200/80">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    A
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-medium">Origin:</span>
                    <strong className="text-stone-900">Verdant Harvest Co-op Market</strong>
                    <span className="block text-stone-500">1420 Folsom St (10th St Loading Dock)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                    B
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-medium">Destination:</span>
                    <strong className="text-stone-900">Downtown Hope Center &amp; Shelter</strong>
                    <span className="block text-stone-500">420 Metro Ave, Central District</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                <span className="text-[11px] text-stone-500">
                  Simulated Distance: 2.1 km
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigateToTab('logistics')}
                >
                  Confirm Delivery Actions
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Food Safety & Cold-Chain Checklist */}
        <Card
          title="Food Safety & Temperature Standards"
          subtitle="Mandatory transport verification guidelines for safe community nutrition"
          headerAction={
            <span className="text-[11px] text-stone-500">
              Module 12
            </span>
          }
        >
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="p-2.5 bg-stone-50/70 rounded-md border border-stone-200 flex items-start gap-2.5">
              <Thermometer className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Hot Prepared Foods (&gt;60°C / 140°F)</strong>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  Keep in insulated thermal Cambro carriers. Target transit time is under 45 minutes from provider collection to recipient holding.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-stone-50/70 rounded-md border border-stone-200 flex items-start gap-2.5">
              <Thermometer className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Cold-Chain Perishables (2°C – 4°C / 36°F – 40°F)</strong>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  Dairy, fresh poultry, seafood wraps, and cut produce require pre-chilled cooler bags and non-toxic frozen ice gel blankets.
                </p>
              </div>
            </div>

            <div className="p-2.5 bg-stone-50/70 rounded-md border border-stone-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block">Tamper &amp; Allergen Inspection</strong>
                <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                  Ensure catering foil trays are securely crimped, lids are taped, and major allergens (nuts, gluten, dairy) remain legibly labeled.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
