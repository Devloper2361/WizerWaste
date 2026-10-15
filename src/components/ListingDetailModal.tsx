import React, { useState } from 'react';
import { FoodDonation, RecipientHub } from '../types/foodRescue';
import { computeDonationPriority, formatTimeRemaining } from '../utils/prioritization';
import {
  X,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Info,
  CheckCircle
} from 'lucide-react';
import { Button } from './common/Button';
import { Badge } from './common/Badge';

interface ListingDetailModalProps {
  donation: FoodDonation | null;
  selectedHub: RecipientHub;
  isOpen: boolean;
  onClose: () => void;
  onClaim: (donation: FoodDonation) => void;
  onMarkPickedUp: (donationId: string, actor: string, note?: string) => void;
  onConfirmDelivery: (donationId: string, actor: string, deliveryNotes?: string) => void;
  onOpenAlgorithm: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  donation,
  selectedHub,
  isOpen,
  onClose,
  onClaim,
  onMarkPickedUp,
  onConfirmDelivery,
  onOpenAlgorithm
}) => {
  const [transitionNote, setTransitionNote] = useState('');
  const [actorName, setActorName] = useState('Logistics Coordinator');

  if (!isOpen || !donation) return null;

  const breakdown = computeDonationPriority(donation, selectedHub);

  const steps = [
    { key: 'available', label: '1. Available', desc: 'Surplus food logged by donor' },
    { key: 'claimed', label: '2. Claimed', desc: 'Assigned to recipient NGO' },
    { key: 'picked_up', label: '3. Picked Up', desc: 'In transit with courier' },
    { key: 'delivered', label: '4. Delivered', desc: 'Meals served / distributed' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === donation.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl w-full max-w-3xl my-8 overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded border text-xs font-medium ${
                breakdown.priorityTier === 'urgent'
                  ? 'text-amber-950 bg-amber-50 border-amber-200'
                  : breakdown.priorityTier === 'high'
                  ? 'text-amber-900 bg-amber-50/70 border-amber-200/60'
                  : 'text-stone-700 bg-stone-100 border-stone-200'
              }`}
            >
              RescueScore: {breakdown.totalScore}/100
            </span>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              {donation.isSampleData ? (
                <span className="text-stone-400">Sample Item</span>
              ) : (
                <span className="text-emerald-800 font-medium">Verified Operational Item</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* Title & Quantity */}
          <div>
            <h1 className="text-lg font-bold text-stone-900 mb-1">{donation.title}</h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-stone-600 text-xs">
              <span className="font-semibold text-emerald-950">
                {donation.quantity.amount} {donation.quantity.unit}
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="text-stone-800 font-medium">
                ~{donation.quantity.estimatedServings} servings ({donation.quantity.estimatedKg} kg)
              </span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="capitalize">{donation.category.replace('_', ' ')}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span className="capitalize">{donation.storageCondition.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider block mb-2.5">
              Rescue Custody Pipeline
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {steps.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={step.key}
                    className={`p-2.5 rounded-md border text-left transition-colors ${
                      isCurrent
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-medium'
                        : isPassed
                        ? 'border-stone-200 bg-white text-stone-700'
                        : 'border-stone-200/60 bg-stone-50 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-medium mb-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0" />
                      )}
                      <span className="truncate">{step.label}</span>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-1">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column Split: Specs & Provider */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#fbfbfa] p-4 rounded-lg border border-stone-200 space-y-2.5">
              <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                Food Specifications
              </span>
              <p className="text-stone-600 leading-relaxed">{donation.description}</p>

              <div className="pt-2 border-t border-stone-200 space-y-1.5 text-stone-600">
                <div className="flex justify-between">
                  <span className="text-stone-500">Packaging:</span>
                  <span className="text-stone-800">{donation.packaging}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Prepared Time:</span>
                  <span className="text-stone-800">
                    {new Date(donation.preparedAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Must Pickup By:</span>
                  <span className="text-amber-900 font-medium">
                    {new Date(donation.expiryAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}{' '}
                    ({formatTimeRemaining(donation.expiryAt)})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Dietary:</span>
                  <span className="text-stone-800">
                    {donation.dietaryTags.length > 0
                      ? donation.dietaryTags.map(t => t.replace('_', '-')).join(', ')
                      : 'None specified'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Allergens:</span>
                  <span className="text-stone-800">
                    {donation.allergens.length > 0 ? donation.allergens.join(', ') : 'None reported'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#fbfbfa] p-4 rounded-lg border border-stone-200 space-y-2.5">
              <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
                Provider &amp; Collection Details
              </span>
              <div>
                <h4 className="font-semibold text-stone-900 text-sm">{donation.provider.name}</h4>
                <p className="text-stone-500 capitalize">
                  {donation.provider.type.replace('_', ' ')} · {donation.provider.neighborhood}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-200 space-y-2 text-stone-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-stone-900 font-medium">{donation.provider.address}</span>
                    <span className="text-[11px] text-stone-500">
                      Distance: {breakdown.simulatedDistanceKm} km from {selectedHub.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>
                    {donation.provider.contactPerson} · {donation.provider.phone}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="text-stone-500">{donation.provider.email}</span>
                </div>

                {donation.provider.pickupInstructions && (
                  <div className="p-2.5 bg-white rounded border border-stone-200 text-[11px] text-stone-600">
                    <span className="text-stone-500 font-medium block mb-0.5">Loading Bay:</span>
                    {donation.provider.pickupInstructions}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RescueScore Rule Breakdown */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                RescueScore Calculation Breakdown
              </span>
              <button
                type="button"
                onClick={onOpenAlgorithm}
                className="cursor-pointer text-emerald-800 hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
              >
                <Info className="w-3 h-3" />
                <span>View Formula</span>
              </button>
            </div>
            <p className="text-stone-600 mb-2.5">{breakdown.explanation}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Expiry Urgency</span>
                <span className="text-stone-900 font-semibold">
                  {breakdown.urgencyScore} / 60 pts
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  ({breakdown.hoursRemaining}h left)
                </span>
              </div>
              <div className="bg-white p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Proximity</span>
                <span className="text-stone-900 font-semibold">
                  {breakdown.proximityScore} / 30 pts
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5">
                  ({breakdown.simulatedDistanceKm} km away)
                </span>
              </div>
              <div className="bg-white p-2 rounded border border-stone-200">
                <span className="text-[10px] text-stone-500 block">Storage Modifier</span>
                <span className="text-stone-900 font-semibold">
                  {breakdown.storageScore} / 10 pts
                </span>
                <span className="text-[10px] text-stone-400 block mt-0.5 capitalize">
                  {donation.storageCondition.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Recipient Details & Active Claim Log */}
          {donation.claimDetails && (
            <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                Recipient Organization Claim Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                <div>
                  <span className="text-stone-500 block">Claimed By:</span>
                  <span className="text-stone-900 font-medium">
                    {donation.claimDetails.recipientOrg} ({donation.claimDetails.recipientType})
                  </span>
                  <span className="text-stone-500 block">
                    {donation.claimDetails.claimedBy} · {donation.claimDetails.contactPhone}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Logistics ETA &amp; Transport:</span>
                  <span className="text-stone-900 font-medium">
                    {donation.claimDetails.estimatedPickupTime}
                  </span>
                  <span className="text-stone-500 block capitalize">
                    {donation.claimDetails.transportMode?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              {donation.claimDetails.notes && (
                <div className="mt-2 text-stone-600 text-[11px]">
                  <span className="text-stone-500 font-medium">Notes: </span>
                  {donation.claimDetails.notes}
                </div>
              )}
            </div>
          )}

          {/* Workflow Status Actions */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200 space-y-2.5">
            <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block">
              Workflow Status Actions
            </span>

            {donation.status === 'available' && (
              new Date(donation.expiryAt).getTime() <= Date.now() ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-md">
                  <span className="font-semibold text-rose-950 block">Donation Expired</span>
                  <p className="text-rose-700 text-[11px] mt-0.5">
                    This surplus food item has passed its safe distribution window and cannot be claimed.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md">
                  <div>
                    <span className="font-semibold text-emerald-950 block">Donation is Available</span>
                    <p className="text-stone-600 text-[11px]">
                      Assign this food to your recipient NGO pantry or dining program.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      onClose();
                      onClaim(donation);
                    }}
                  >
                    Claim Donation
                  </Button>
                </div>
              )
            )}

            {donation.status === 'claimed' && (
              <div className="space-y-2.5 p-3 bg-stone-50 border border-stone-200 rounded-md">
                <div>
                  <span className="font-semibold text-stone-900 block">Status: Claimed (Awaiting Pickup)</span>
                  <p className="text-stone-500 text-[11px]">
                    Once courier collects food at the donor dock, confirm Picked Up.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    placeholder="Handover notes (e.g. Temperature checked at 65°C; 5 pans secured)"
                    className="flex-1 bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-900 text-xs focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onMarkPickedUp(donation.id, actorName, transitionNote);
                      setTransitionNote('');
                    }}
                  >
                    Mark as Picked Up
                  </Button>
                </div>
              </div>
            )}

            {donation.status === 'picked_up' && (
              <div className="space-y-2.5 p-3 bg-amber-50/70 border border-amber-200 rounded-md">
                <div>
                  <span className="font-semibold text-amber-950 block">Status: In Transit</span>
                  <p className="text-stone-600 text-[11px]">
                    Confirm receipt at recipient kitchen to complete the rescue mission and log impact credits.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={transitionNote}
                    onChange={(e) => setTransitionNote(e.target.value)}
                    placeholder="Delivery notes (e.g. Verified intact; distributed for evening dinner)"
                    className="flex-1 bg-white border border-stone-200 rounded-md px-3 py-1.5 text-stone-900 text-xs focus:outline-none"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onConfirmDelivery(donation.id, actorName, transitionNote);
                      setTransitionNote('');
                    }}
                  >
                    Confirm Delivery
                  </Button>
                </div>
              </div>
            )}

            {donation.status === 'delivered' && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-950 block">
                    Rescue Completed &amp; Verified
                  </span>
                  <p className="text-stone-600 text-[11px]">
                    Impact credited: +{donation.quantity.estimatedServings} portions, +{donation.quantity.estimatedKg} kg waste prevented.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Full Audit Workflow History */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block mb-2">
              Chain of Custody &amp; Handover Log
            </span>
            <div className="space-y-1.5">
              {donation.workflowHistory.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 p-2 bg-white rounded border border-stone-200 text-[11px]"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium text-emerald-900">
                        {event.status.replace('_', ' ')}
                      </span>
                      <span className="text-stone-400">by {event.actor}</span>
                    </div>
                    {event.note && <p className="text-stone-600 mt-0.5">{event.note}</p>}
                  </div>
                  <span className="text-stone-400 shrink-0 text-[10px]">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-200 flex items-center justify-end shrink-0 bg-white">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
