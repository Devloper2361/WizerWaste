import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Search, ArrowRight, CheckCircle2, LifeBuoy } from 'lucide-react';

interface NgoDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({ onNavigateToTab }) => {
  const { currentUser } = useAuth();

  const [currentMealsPrepared, setCurrentMealsPrepared] = useState(180);
  const [maxCapacity, setMaxCapacity] = useState(250);

  const capacityPercent = Math.round((currentMealsPrepared / maxCapacity) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium">
              NGO / Recipient Agency Portal
            </span>
            <Badge variant="success" size="sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-800" />
              <span>Accredited Community Food Bank</span>
            </Badge>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            {currentUser?.organization}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Coordinator: {currentUser?.name} · {currentUser?.region}
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
            onClick={() => onNavigateToTab('logistics')}
          >
            Active Pickups
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Search className="w-4 h-4" />}
            onClick={() => onNavigateToTab('marketplace')}
          >
            Claim Surplus Food
          </Button>
        </div>
      </div>

      {/* Recipient Center Capacity & Readiness Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Tonight Dining Capacity</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {currentMealsPrepared}{' '}
            <span className="text-sm font-normal text-stone-500">/ {maxCapacity} meals</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-emerald-800 h-full rounded-full transition-all"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">
            Accepting <strong className="text-emerald-900 font-semibold">{maxCapacity - currentMealsPrepared}</strong> more portions
          </p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Incoming Dispatches</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            2 Batches
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Claimed &amp; en route with couriers</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Meals Served (This Month)</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            3,420
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Across 18 dinner services</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Food Waste Prevented</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
            1,368 kg
          </div>
          <p className="text-[11px] text-stone-500 mt-1">~3,447 kg CO₂e greenhouse gas avoided</p>
        </Card>
      </div>

      {/* 2-Column Split: High Wizer RescueScore Opportunities & Incoming Shipments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Surplus Discovery with RescueScore */}
        <Card
          title="Top Priority RescueScore Opportunities"
          subtitle="Time-critical surplus food ranked by proximity and remaining safe window"
          headerAction={
            <Button variant="ghost" size="sm" onClick={() => onNavigateToTab('marketplace')}>
              <span>View All</span>
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
                    Grand Lotus Banquet Hall · 1.8 km away · Hot Holding
                  </p>
                </div>
                <Badge variant="warning" size="sm">
                  RescueScore: 92/100
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                <span className="text-amber-900 font-medium">Expires in 2.5 hours</span>
                <Button variant="primary" size="sm" onClick={() => onNavigateToTab('marketplace')}>
                  Claim Now
                </Button>
              </div>
            </div>

            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-stone-900">
                    40 Loaves Sourdough &amp; 80 Croissants
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Rustic Hearth Artisan Bakery · 0.9 km away · Ambient
                  </p>
                </div>
                <Badge variant="neutral" size="sm">
                  RescueScore: 78/100
                </Badge>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                <span>8.0 hours remaining</span>
                <Button variant="primary" size="sm" onClick={() => onNavigateToTab('marketplace')}>
                  Claim Now
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Incoming Dispatches */}
        <Card
          title="Incoming Claimed Dispatches"
          subtitle="Volunteer couriers currently in transit to your distribution center"
          headerAction={
            <Badge variant="info">2 En Route</Badge>
          }
        >
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  12 Crates Organic Apples &amp; Greens
                </span>
                <Badge variant="info" size="sm">
                  In Transit
                </Badge>
              </div>
              <p className="text-[11px] text-stone-600">
                Driver: Sarah Jenkins (Cargo E-Bike) · ETA: 25 mins
              </p>
              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/80">
                Origin: Verdant Harvest Co-op Market (10th St Receiving Dock)
              </div>
            </div>

            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  85 Roasted Turkey Wraps &amp; Quinoa Bowls
                </span>
                <Badge variant="success" size="sm">
                  Temp Verified 3.4°C
                </Badge>
              </div>
              <p className="text-[11px] text-stone-600">
                Driver: Mateo Morales (Insulated Van) · ETA: 40 mins
              </p>
              <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-200/80">
                Origin: Apex Tech HQ Cafeteria (Financial District)
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
