import React from 'react';
import { FoodDonation, RecipientHub } from '../types/foodRescue';
import { computeDonationPriority, formatTimeRemaining } from '../utils/prioritization';
import { MapPin, Clock, ArrowRight, CheckCircle, Info } from 'lucide-react';

interface DonationCardProps {
  donation: FoodDonation;
  selectedHub: RecipientHub;
  onClaim: (donation: FoodDonation) => void;
  onViewDetails: (donation: FoodDonation) => void;
  onOpenAlgorithm: () => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  donation,
  selectedHub,
  onClaim,
  onViewDetails,
  onOpenAlgorithm
}) => {
  const breakdown = computeDonationPriority(donation, selectedHub);
  const isAvailable = donation.status === 'available';
  const isClaimed = donation.status === 'claimed';
  const isPickedUp = donation.status === 'picked_up';
  const isDelivered = donation.status === 'delivered';
  const isExpired = new Date(donation.expiryAt).getTime() <= Date.now();

  const categoryLabels: Record<string, string> = {
    cooked_meals: 'Cooked Meals',
    bakery: 'Bakery & Bread',
    produce: 'Fresh Produce',
    dairy: 'Dairy & Eggs',
    packaged_groceries: 'Packaged Groceries',
    beverages: 'Beverages'
  };

  const storageLabels: Record<string, string> = {
    hot_holding: 'Hot Holding (>60°C)',
    chilled: 'Chilled (2–4°C)',
    ambient: 'Ambient',
    frozen: 'Frozen'
  };

  const getTierColorClass = (tier: string) => {
    switch (tier) {
      case 'urgent':
        return 'text-amber-950 bg-amber-50 border-amber-200';
      case 'high':
        return 'text-amber-900 bg-amber-50/70 border-amber-200/60';
      default:
        return 'text-stone-700 bg-stone-100 border-stone-200';
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 hover:border-stone-300 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        {/* Kicker row: Score & status */}
        <div className="flex items-center justify-between gap-2 text-xs mb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2 py-0.5 rounded border text-[11px] font-medium ${getTierColorClass(
                breakdown.priorityTier
              )}`}
            >
              RescueScore: {breakdown.totalScore}/100
            </span>
            <button
              type="button"
              onClick={onOpenAlgorithm}
              title="Click to view scoring rule breakdown"
              className="cursor-pointer text-stone-400 hover:text-stone-700 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            {donation.isSampleData ? (
              <span className="text-stone-400">Sample Item</span>
            ) : (
              <span className="text-emerald-800 font-medium">Verified Posting</span>
            )}
            <span aria-hidden="true">·</span>
            <span className="capitalize font-medium text-stone-600">
              {donation.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(donation)}
          className="text-sm font-semibold text-stone-900 hover:text-emerald-900 transition-colors cursor-pointer line-clamp-1 mb-1"
        >
          {donation.title}
        </h3>

        {/* Unboxed Metadata: Quantity, Category, Storage */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-600 mb-2.5">
          <span className="font-semibold text-stone-800">
            {donation.quantity.amount} {donation.quantity.unit}
          </span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span>{categoryLabels[donation.category] || donation.category}</span>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className={donation.storageCondition === 'hot_holding' ? 'text-amber-800 font-medium' : ''}>
            {storageLabels[donation.storageCondition] || donation.storageCondition}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-stone-500 line-clamp-2 mb-3.5 leading-relaxed">
          {donation.description}
        </p>

        {/* Dietary and Allergens */}
        {(donation.dietaryTags.length > 0 || donation.allergens.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 mb-3.5 pb-2.5 border-b border-stone-100">
            {donation.dietaryTags.length > 0 && (
              <span className="text-emerald-900 font-medium">
                {donation.dietaryTags.map(t => t.replace('_', '-')).join(', ')}
              </span>
            )}
            {donation.dietaryTags.length > 0 && donation.allergens.length > 0 && (
              <span aria-hidden="true" className="text-stone-300">·</span>
            )}
            {donation.allergens.length > 0 && (
              <span className="text-stone-500">
                Allergens: {donation.allergens.join(', ')}
              </span>
            )}
          </div>
        )}

        {/* Proximity & Expiry Grid */}
        <div className="bg-[#fbfbfa] rounded-md p-2.5 border border-stone-200 mb-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              <span>Must Pickup:</span>
            </div>
            <span
              className={`font-medium ${
                breakdown.hoursRemaining <= 3 ? 'text-amber-900 font-semibold' : 'text-stone-800'
              }`}
            >
              {formatTimeRemaining(donation.expiryAt)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Distance:</span>
            </div>
            <span className="text-stone-800">
              {breakdown.simulatedDistanceKm} km{' '}
              <span className="text-[11px] text-stone-400">from hub</span>
            </span>
          </div>

          <div className="pt-1.5 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="truncate max-w-[170px] text-stone-700 font-medium">{donation.provider.name}</span>
            <span>{donation.provider.neighborhood}</span>
          </div>
        </div>
      </div>

      {/* Card Action footer */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(donation)}
          className="cursor-pointer text-xs text-stone-600 hover:text-stone-900 transition-colors font-medium"
        >
          View Details
        </button>

        {isAvailable && (
          isExpired ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 px-2 py-1 rounded font-medium">
              Expired (Past Safety Window)
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onClaim(donation)}
              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded-md transition-colors shadow-2xs whitespace-nowrap"
            >
              <span>Claim Donation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )
        )}

        {isClaimed && (
          <button
            type="button"
            onClick={() => onViewDetails(donation)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-100 text-stone-800 border border-stone-200 text-xs rounded-md hover:bg-stone-200 transition-colors whitespace-nowrap"
          >
            <span>Claimed: Update</span>
          </button>
        )}

        {isPickedUp && (
          <button
            type="button"
            onClick={() => onViewDetails(donation)}
            className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-200 text-xs rounded-md hover:bg-amber-100 transition-colors whitespace-nowrap"
          >
            <span>In Transit: Confirm</span>
          </button>
        )}

        {isDelivered && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Delivered</span>
          </span>
        )}
      </div>
    </div>
  );
};
