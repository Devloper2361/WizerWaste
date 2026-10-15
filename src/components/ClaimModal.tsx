import React, { useState, useEffect } from 'react';
import { ClaimDetails, FoodDonation, RecipientHub } from '../types/foodRescue';
import { X, AlertCircle } from 'lucide-react';
import { computeDonationPriority } from '../utils/prioritization';
import { Button } from './common/Button';
import { useAuth } from '../context/AuthContext';

interface ClaimModalProps {
  donation: FoodDonation | null;
  selectedHub: RecipientHub;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClaim: (donationId: string, claim: ClaimDetails, actorName: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  donation,
  selectedHub,
  isOpen,
  onClose,
  onConfirmClaim
}) => {
  const { currentUser } = useAuth();

  const [recipientOrg, setRecipientOrg] = useState(currentUser?.organization || selectedHub.name);
  const [recipientType, setRecipientType] = useState<'food_bank' | 'shelter' | 'community_kitchen' | 'youth_center' | 'elder_care'>('shelter');
  const [claimedBy, setClaimedBy] = useState(currentUser?.name || 'Pantry Coordinator');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || selectedHub.contact);
  const [estimatedPickupTime, setEstimatedPickupTime] = useState('Within 45 minutes');
  const [transportMode, setTransportMode] = useState<'insulated_van' | 'standard_van' | 'volunteer_car' | 'cargo_bike' | 'on_foot'>('insulated_van');
  const [notes, setNotes] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      if (currentUser.organization) setRecipientOrg(currentUser.organization);
      if (currentUser.name) setClaimedBy(currentUser.name);
      if (currentUser.phone) setContactPhone(currentUser.phone);
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !donation) return null;

  const breakdown = computeDonationPriority(donation, selectedHub);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientOrg.trim()) {
      setError('Recipient organization is required.');
      return;
    }
    if (!claimedBy.trim() || !contactPhone.trim()) {
      setError('Contact person and phone are required for driver coordination.');
      return;
    }
    if (!agreementChecked) {
      setError('Please acknowledge safe food handling and prompt collection commitment.');
      return;
    }

    onConfirmClaim(
      donation.id,
      {
        recipientOrg: recipientOrg.trim(),
        recipientType,
        claimedBy: claimedBy.trim(),
        contactPhone: contactPhone.trim(),
        claimedAt: new Date().toISOString(),
        estimatedPickupTime,
        transportMode,
        notes: notes.trim() || 'Claimed via WizerWaste dispatch.'
      },
      `${claimedBy.trim()} (${recipientOrg.trim()})`
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl w-full max-w-lg my-8 overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-stone-900">Claim Surplus Food Donation</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Confirm recipient organization collection commitment
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
          {/* Target Food summary card */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200">
            <span className="text-[11px] text-stone-500 block mb-1">Target Donation</span>
            <h4 className="font-semibold text-stone-900 text-sm line-clamp-1">{donation.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-stone-600">
              <strong className="text-emerald-900">
                {donation.quantity.amount} {donation.quantity.unit} ({donation.quantity.estimatedServings} meals)
              </strong>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{donation.provider.name}</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{breakdown.simulatedDistanceKm} km away</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form fields */}
          <div>
            <label className="block text-stone-700 font-medium mb-1">
              Recipient Organization Name *
            </label>
            <input
              type="text"
              value={recipientOrg}
              onChange={(e) => setRecipientOrg(e.target.value)}
              placeholder="e.g. Downtown Hope Shelter / St. Vincent Pantry"
              className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Organization Type</label>
              <select
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value as any)}
                className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
              >
                <option value="shelter">Emergency Shelter</option>
                <option value="community_kitchen">Community Kitchen / Dining</option>
                <option value="food_bank">Food Bank Warehouse</option>
                <option value="youth_center">Youth / Student Pantry</option>
                <option value="elder_care">Elder Care Meal Service</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Estimated Pickup Arrival *
              </label>
              <select
                value={estimatedPickupTime}
                onChange={(e) => setEstimatedPickupTime(e.target.value)}
                className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
              >
                <option value="Within 30 minutes">Immediate (Within 30 mins)</option>
                <option value="Within 45 minutes">Within 45 minutes</option>
                <option value="Within 90 minutes">Within 90 minutes</option>
                <option value="Today before 17:00">Today before 17:00</option>
                <option value="Evening route (19:00 - 21:00)">Evening Route (19:00 - 21:00)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Dispatcher / Courier Name *
              </label>
              <input
                type="text"
                value={claimedBy}
                onChange={(e) => setClaimedBy(e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Transport Vehicle Mode</label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value as any)}
              className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
            >
              <option value="insulated_van">Temperature-Controlled / Insulated Van</option>
              <option value="standard_van">Standard Cargo Van</option>
              <option value="volunteer_car">Volunteer Vehicle (with thermal bags)</option>
              <option value="cargo_bike">Cargo E-Bike / Trailer</option>
              <option value="on_foot">Hand Cart (Walkable radius)</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Notes for Food Provider</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Courier will arrive with thermal carriers; call dispatch phone upon arrival."
              className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-stone-600 select-none">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-emerald-800 focus:ring-0 focus:outline-none"
              />
              <span className="leading-tight text-[11px] text-stone-500">
                I confirm our organization will uphold safe food handling, maintain required holding temperature ({donation.storageCondition.replace('_', ' ')}), and collect before the expiry deadline.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Rescue Claim
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
