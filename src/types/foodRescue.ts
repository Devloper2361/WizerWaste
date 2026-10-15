export type FoodCategory =
  | 'cooked_meals'
  | 'bakery'
  | 'produce'
  | 'dairy'
  | 'packaged_groceries'
  | 'beverages';

export type StorageCondition =
  | 'hot_holding'
  | 'chilled'
  | 'ambient'
  | 'frozen';

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'kosher'
  | 'gluten_free'
  | 'dairy_free'
  | 'nut_free';

export type DonationStatus =
  | 'available'
  | 'claimed'
  | 'picked_up'
  | 'delivered'
  | 'cancelled';

export type ProviderType =
  | 'restaurant'
  | 'supermarket'
  | 'bakery'
  | 'hotel'
  | 'caterer'
  | 'corporate_cafeteria';

export type PriorityTier = 'urgent' | 'high' | 'standard';

export interface ProviderInfo {
  name: string;
  type: ProviderType;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
  pickupInstructions?: string;
}

export interface ClaimDetails {
  recipientOrg: string;
  recipientType: 'food_bank' | 'shelter' | 'community_kitchen' | 'youth_center' | 'elder_care';
  claimedBy: string;
  contactPhone: string;
  claimedAt: string;
  estimatedPickupTime: string;
  transportMode?: 'insulated_van' | 'standard_van' | 'volunteer_car' | 'cargo_bike' | 'on_foot';
  notes?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  deliveryNotes?: string;
}

export interface WorkflowEvent {
  status: DonationStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface FoodDonation {
  id: string;
  isSampleData: boolean;
  title: string;
  description: string;
  category: FoodCategory;
  quantity: {
    amount: number;
    unit: 'servings' | 'kg' | 'boxes' | 'crates' | 'trays';
    estimatedKg: number;
    estimatedServings: number;
  };
  storageCondition: StorageCondition;
  dietaryTags: DietaryTag[];
  allergens: string[];
  packaging: string;
  preparedAt: string;
  expiryAt: string;
  createdAt: string;
  provider: ProviderInfo;
  status: DonationStatus;
  claimDetails?: ClaimDetails;
  workflowHistory: WorkflowEvent[];
}

export interface RecipientHub {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  contact: string;
}

export interface PriorityScoreBreakdown {
  totalScore: number;
  priorityTier: PriorityTier;
  urgencyScore: number;
  proximityScore: number;
  storageScore: number;
  hoursRemaining: number;
  simulatedDistanceKm: number;
  isExpired: boolean;
  explanation: string;
}

export interface ImpactStats {
  totalMealsRescued: number;
  totalKgRescued: number;
  co2eAvoidedKg: number;
  waterSavedLiters: number;
  activeRescuesCount: number;
  deliveredRescuesCount: number;
  deliveries: FoodDonation[];
}
