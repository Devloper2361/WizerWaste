import React, { useState } from 'react';
import { FoodDonation, RecipientHub } from '../types/foodRescue';
import { computeDonationPriority, formatTimeRemaining } from '../utils/prioritization';
import { Truck, CheckCircle2, MapPin, ChevronRight } from 'lucide-react';
import { Button } from './common/Button';

interface PickupTrackerProps {
  donations: FoodDonation[];
  selectedHub: RecipientHub;
  onViewDetails: (donation: FoodDonation) => void;
  onMarkPickedUp: (donationId: string, actor: string, note?: string) => void;
  onConfirmDelivery: (donationId: string, actor: string, deliveryNotes?: string) => void;
}

export const PickupTracker: React.FC<PickupTrackerProps> = ({
  donations,
  selectedHub,
  onViewDetails,
  onMarkPickedUp,
  onConfirmDelivery
}) => {
  const claimedList = donations.filter(d => d.status === 'claimed');
  const inTransitList = donations.filter(d => d.status === 'picked_up');
  const deliveredList = donations.filter(d => d.status === 'delivered');

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  return (
    <div className="space-y-6">
      {/* Top Banner & Pipeline Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Rescue Logistics &amp; Pickup Pipeline</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Custody handovers across commercial kitchens, volunteer runners, and receiving pantries
            </p>
          </div>

          {/* Segmented active vs history tab */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-md text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'active'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Active Operations ({claimedList.length + inTransitList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              className={`cursor-pointer px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Delivered Ledger ({deliveredList.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'active' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Claimed (Awaiting Pickup) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  1. Awaiting Pickup at Provider Dock
                </h3>
              </div>
              <span className="text-xs text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                {claimedList.length} items
              </span>
            </div>

            {claimedList.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-200 rounded-lg p-8 text-center text-xs text-stone-400">
                No items currently awaiting pickup. Items claimed in the Marketplace appear here.
              </div>
            ) : (
              claimedList.map(donation => {
                const breakdown = computeDonationPriority(donation, selectedHub);
                return (
                  <div
                    key={donation.id}
                    className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all space-y-2.5 text-xs shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4
                          onClick={() => onViewDetails(donation)}
                          className="font-semibold text-stone-900 hover:text-emerald-900 cursor-pointer line-clamp-1"
                        >
                          {donation.title}
                        </h4>
                        <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                          <span className="font-semibold text-stone-800">
                            {donation.quantity.amount} {donation.quantity.unit} (~{donation.quantity.estimatedServings} meals)
                          </span>
                          <span aria-hidden="true" className="text-stone-300">·</span>
                          <span className="capitalize">{donation.storageCondition.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <span className="text-amber-900 font-medium text-[11px] shrink-0">
                        {formatTimeRemaining(donation.expiryAt)}
                      </span>
                    </div>

                    {/* Address & Contact */}
                    <div className="bg-[#fbfbfa] rounded p-2.5 border border-stone-200 space-y-1 text-[11px]">
                      <div className="flex items-start gap-1.5 text-stone-700">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-stone-900">{donation.provider.name}</strong>
                          <span className="block text-stone-500">{donation.provider.address}</span>
                          <span className="text-stone-400 text-[10px]">
                            {breakdown.simulatedDistanceKm} km from {selectedHub.name}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-stone-200/60 flex justify-between text-stone-500">
                        <span>Contact: {donation.provider.contactPerson}</span>
                        <span>{donation.provider.phone}</span>
                      </div>
                    </div>

                    {/* Claim info */}
                    {donation.claimDetails && (
                      <div className="text-[11px] text-stone-700 bg-stone-50 p-2 rounded border border-stone-200">
                        <span className="font-medium">Claimed by {donation.claimDetails.recipientOrg}</span>
                        <div className="text-stone-500 flex justify-between mt-0.5">
                          <span>Driver: {donation.claimDetails.claimedBy}</span>
                          <span>ETA: {donation.claimDetails.estimatedPickupTime}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => onViewDetails(donation)}
                        className="cursor-pointer text-stone-500 hover:text-stone-800 font-medium"
                      >
                        Details
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          onMarkPickedUp(
                            donation.id,
                            donation.claimDetails?.claimedBy || 'Volunteer Courier',
                            'Collected from donor kitchen facility.'
                          )
                        }
                      >
                        <Truck className="w-3.5 h-3.5 mr-1" />
                        <span>Confirm Picked Up</span>
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Column 2: In Transit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-700" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  2. In Transit to Community Recipient
                </h3>
              </div>
              <span className="text-xs text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                {inTransitList.length} items
              </span>
            </div>

            {inTransitList.length === 0 ? (
              <div className="bg-white border border-dashed border-stone-200 rounded-lg p-8 text-center text-xs text-stone-400">
                No items currently in transit. Items move here when confirmed picked up.
              </div>
            ) : (
              inTransitList.map(donation => (
                <div
                  key={donation.id}
                  className="bg-white border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition-all space-y-2.5 text-xs shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4
                        onClick={() => onViewDetails(donation)}
                        className="font-semibold text-stone-900 hover:text-emerald-900 cursor-pointer line-clamp-1"
                      >
                        {donation.title}
                      </h4>
                      <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                        <span className="font-semibold text-stone-800">
                          {donation.quantity.amount} {donation.quantity.unit} (~{donation.quantity.estimatedServings} meals)
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="capitalize">{donation.storageCondition.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 text-[10px] font-medium">
                      En Route
                    </span>
                  </div>

                  {/* Courier details */}
                  <div className="bg-[#fbfbfa] rounded p-2.5 border border-stone-200 space-y-1 text-[11px]">
                    <div className="flex justify-between text-stone-700">
                      <span className="text-stone-500">Destination:</span>
                      <strong className="text-stone-900">
                        {donation.claimDetails?.recipientOrg || selectedHub.name}
                      </strong>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Transport:</span>
                      <span className="capitalize">
                        {donation.claimDetails?.transportMode?.replace('_', ' ') || 'Courier Van'}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>Picked up at:</span>
                      <span>
                        {donation.claimDetails?.pickedUpAt
                          ? new Date(donation.claimDetails.pickedUpAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Recent'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onViewDetails(donation)}
                      className="cursor-pointer text-stone-500 hover:text-stone-800 font-medium"
                    >
                      Details
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        onConfirmDelivery(
                          donation.id,
                          donation.claimDetails?.recipientOrg || 'Receiving Staff',
                          'Verified intact, temperature compliant, and accepted for immediate dinner distribution.'
                        )
                      }
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      <span>Confirm Delivery</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Completed Delivered Log */
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="font-semibold text-stone-900 text-sm">Completed Rescue Deliveries</h3>
            <span className="text-xs text-stone-500">
              {deliveredList.length} verified handovers
            </span>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {deliveredList.map((donation) => (
              <div
                key={donation.id}
                onClick={() => onViewDetails(donation)}
                className="p-3.5 hover:bg-stone-50 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-semibold text-stone-900">{donation.title}</h4>
                  <div className="flex items-center gap-2 text-stone-500 text-[11px] mt-0.5">
                    <span>From: {donation.provider.name}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>To: {donation.claimDetails?.recipientOrg || 'Partner Food Bank'}</span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="font-semibold text-emerald-900">
                      +{donation.quantity.estimatedServings} portions ({donation.quantity.estimatedKg} kg)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-stone-500 text-[11px]">
                    {donation.claimDetails?.deliveredAt
                      ? new Date(donation.claimDetails.deliveredAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'Delivered'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
