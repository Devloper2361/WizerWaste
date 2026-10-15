import { FoodDonation, PriorityScoreBreakdown, PriorityTier, RecipientHub, StorageCondition } from '../types/foodRescue';

/**
 * Recipient NGO hub presets for simulated distance and logistics calculations
 */
export const PRESET_RECIPIENT_HUBS: RecipientHub[] = [
  {
    id: 'hub_downtown_shelter',
    name: 'Downtown Hope Center & Shelter',
    type: 'Emergency Shelter & Soup Kitchen',
    address: '420 Metro Ave, Central District',
    lat: 37.7749,
    lng: -122.4194,
    contact: '+1 (555) 234-8901'
  },
  {
    id: 'hub_eastside_foodbank',
    name: 'Eastside Community Food Bank',
    type: 'Regional Food Bank Warehouse',
    address: '1288 Commerce Way, East Industrial',
    lat: 37.7885,
    lng: -122.3920,
    contact: '+1 (555) 876-5432'
  },
  {
    id: 'hub_south_kitchen',
    name: 'South District Family Table',
    type: 'Community Dining & Youth Pantry',
    address: '745 Mission Plaza, Mission South',
    lat: 37.7599,
    lng: -122.4148,
    contact: '+1 (555) 345-6789'
  },
  {
    id: 'hub_west_pantry',
    name: 'West End Mutual Aid Pantry',
    type: 'Neighborhood Distribution Station',
    address: '210 Sunset Blvd, West Park',
    lat: 37.7610,
    lng: -122.4650,
    contact: '+1 (555) 901-2345'
  }
];

/**
 * Calculates distance in kilometers between two geo-coordinates using the Haversine formula.
 */
export function calculateSimulatedDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  // Return rounded to 1 decimal place, minimum 0.3 km
  return Math.max(0.3, Math.round(d * 10) / 10);
}

/**
 * Calculates Urgency Score (0 to 60 points) based on remaining hours until expiry deadline.
 */
export function calculateUrgencyScore(hoursRemaining: number): number {
  if (hoursRemaining <= 0) return 60; // Expired or imminent
  if (hoursRemaining <= 1.5) return 60;
  if (hoursRemaining <= 3) return 52;
  if (hoursRemaining <= 6) return 42;
  if (hoursRemaining <= 12) return 30;
  if (hoursRemaining <= 24) return 18;
  if (hoursRemaining <= 48) return 10;
  return 4;
}

/**
 * Calculates Proximity Score (0 to 30 points) based on simulated distance to recipient hub.
 */
export function calculateProximityScore(distanceKm: number): number {
  if (distanceKm <= 1.0) return 30;
  if (distanceKm <= 2.5) return 25;
  if (distanceKm <= 5.0) return 18;
  if (distanceKm <= 8.0) return 11;
  if (distanceKm <= 12.0) return 5;
  return 2;
}

/**
 * Calculates Storage / Perishability Modifier (0 to 10 points).
 * Hot foods and delicate chilled items require immediate temperature-controlled transit.
 */
export function calculateStorageScore(storageCondition: StorageCondition): number {
  switch (storageCondition) {
    case 'hot_holding':
      return 10; // Highly time-critical food safety window
    case 'chilled':
      return 7; // Cold-chain critical
    case 'ambient':
      return 3; // Baked goods / produce
    case 'frozen':
      return 1; // More flexible transit window
    default:
      return 3;
  }
}

/**
 * Comprehensive evaluation of dynamic priority for a food donation.
 */
export function computeDonationPriority(
  donation: FoodDonation,
  selectedHub: RecipientHub,
  currentTimeMs: number = Date.now()
): PriorityScoreBreakdown {
  const expiryTimeMs = new Date(donation.expiryAt).getTime();
  const diffMs = expiryTimeMs - currentTimeMs;
  const hoursRemaining = Math.max(0, Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10);
  const isExpired = diffMs <= 0;

  const distanceKm = calculateSimulatedDistanceKm(
    donation.provider.lat,
    donation.provider.lng,
    selectedHub.lat,
    selectedHub.lng
  );

  const urgencyScore = calculateUrgencyScore(hoursRemaining);
  const proximityScore = calculateProximityScore(distanceKm);
  const storageScore = calculateStorageScore(donation.storageCondition);

  const totalScore = Math.min(100, Math.max(0, urgencyScore + proximityScore + storageScore));

  let priorityTier: PriorityTier = 'standard';
  if (totalScore >= 75 || hoursRemaining <= 2.5) {
    priorityTier = 'urgent';
  } else if (totalScore >= 50 || hoursRemaining <= 6) {
    priorityTier = 'high';
  }

  let explanation = '';
  if (isExpired) {
    explanation = 'Deadline passed. Item requires immediate verification.';
  } else if (priorityTier === 'urgent') {
    explanation = `Critical urgency (${hoursRemaining}h left) & high proximity (${distanceKm} km from ${selectedHub.name}). Immediate claim recommended.`;
  } else if (priorityTier === 'high') {
    explanation = `Elevated priority (${hoursRemaining}h left, ${distanceKm} km away). Recommended for next pickup dispatch batch.`;
  } else {
    explanation = `Standard operational window (${hoursRemaining}h remaining, ${distanceKm} km away).`;
  }

  return {
    totalScore,
    priorityTier,
    urgencyScore,
    proximityScore,
    storageScore,
    hoursRemaining,
    simulatedDistanceKm: distanceKm,
    isExpired,
    explanation
  };
}

/**
 * Impact calculations based on UNEP & FAO food waste conversion factors
 */
export const IMPACT_FACTORS = {
  // 1 kg food waste prevented = ~2.52 kg CO2 equivalent greenhouse gases avoided
  CO2E_PER_KG: 2.52,
  // 1 kg food waste prevented = ~840 Liters of agricultural and processing water conserved
  WATER_LITERS_PER_KG: 840,
  // Average portion meal mass ~0.4 kg
  KG_PER_MEAL: 0.4
};

export function formatTimeRemaining(expiryIso: string, nowMs: number = Date.now()): string {
  const target = new Date(expiryIso).getTime();
  const diffMs = target - nowMs;

  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  if (hours === 0) {
    return `${minutes}m remaining`;
  }
  if (hours < 24) {
    return `${hours}h ${minutes}m left`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours}h left`;
}
