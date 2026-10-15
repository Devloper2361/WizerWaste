import { FoodDonation, ClaimDetails, DonationStatus, RecipientHub } from '../types/foodRescue';
import { getInitialSampleDonations } from '../data/initialData';
import { PRESET_RECIPIENT_HUBS } from './prioritization';
import { addAuditLogEntry } from './supportStorage';

const STORAGE_KEY_DONATIONS = 'wizerwaste_donations_v2';
const STORAGE_KEY_HUB = 'wizerwaste_selected_hub_id';
const STORAGE_KEY_FILTER_PREF = 'wizerwaste_filter_pref';

function deduplicateDonations(items: FoodDonation[]): FoodDonation[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function loadDonations(): FoodDonation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DONATIONS);
    if (!raw) {
      const initial = deduplicateDonations(getInitialSampleDonations());
      saveDonations(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const deduplicated = deduplicateDonations(parsed);
      return deduplicated;
    }
    const initial = deduplicateDonations(getInitialSampleDonations());
    saveDonations(initial);
    return initial;
  } catch (err) {
    console.error('Failed to load donations from localStorage:', err);
    const initial = deduplicateDonations(getInitialSampleDonations());
    saveDonations(initial);
    return initial;
  }
}

export function saveDonations(donations: FoodDonation[]): void {
  try {
    const deduplicated = deduplicateDonations(donations);
    localStorage.setItem(STORAGE_KEY_DONATIONS, JSON.stringify(deduplicated));
  } catch (err) {
    console.error('Failed to save donations to localStorage:', err);
  }
}

export function resetToDemoData(): FoodDonation[] {
  const fresh = deduplicateDonations(getInitialSampleDonations());
  saveDonations(fresh);
  return fresh;
}

export function loadSelectedHub(): RecipientHub {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY_HUB);
    const found = PRESET_RECIPIENT_HUBS.find(h => h.id === savedId);
    return found || PRESET_RECIPIENT_HUBS[0];
  } catch {
    return PRESET_RECIPIENT_HUBS[0];
  }
}

export function saveSelectedHubId(hubId: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_HUB, hubId);
  } catch (err) {
    console.error('Failed to save hub id:', err);
  }
}

export function createNewDonation(newDonationData: Omit<FoodDonation, 'id' | 'createdAt' | 'status' | 'workflowHistory' | 'isSampleData'>): FoodDonation {
  // 1. Data Integrity Validations
  if (!newDonationData.title || !newDonationData.title.trim()) {
    throw new Error('Donation title is required.');
  }
  if (!newDonationData.provider?.name || !newDonationData.provider.name.trim()) {
    throw new Error('Donor provider organization is required.');
  }
  if (!newDonationData.quantity || newDonationData.quantity.amount <= 0) {
    throw new Error('Donation quantity must be greater than zero.');
  }
  const expiryTimeMs = new Date(newDonationData.expiryAt).getTime();
  if (isNaN(expiryTimeMs) || expiryTimeMs <= Date.now()) {
    throw new Error('Food safety expiry deadline must be set in the future.');
  }

  const current = loadDonations();
  const id = `don-op-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const nowIso = new Date().toISOString();

  const donation: FoodDonation = {
    ...newDonationData,
    id,
    isSampleData: false, // Explicitly marked as user-created operational data
    createdAt: nowIso,
    status: 'available',
    workflowHistory: [
      {
        status: 'available',
        timestamp: nowIso,
        actor: `${newDonationData.provider.contactPerson} (${newDonationData.provider.name})`,
        note: 'Food surplus donation posted to network.'
      }
    ]
  };

  const updated = [donation, ...current];
  saveDonations(updated);

  // Structured Audit Log entry
  addAuditLogEntry(
    'DONATION_BROADCAST',
    `${newDonationData.provider.contactPerson} (${newDonationData.provider.name})`,
    `Donation "${newDonationData.title}" (${newDonationData.quantity.amount} ${newDonationData.quantity.unit})`,
    'published',
    `Storage: ${newDonationData.storageCondition} | Category: ${newDonationData.category} | Expiry: ${new Date(newDonationData.expiryAt).toLocaleTimeString()}`
  );

  return donation;
}

export function claimDonation(
  donationId: string,
  claim: ClaimDetails,
  actorName: string
): FoodDonation | null {
  const current = loadDonations();
  const index = current.findIndex(d => d.id === donationId);
  if (index === -1) return null;

  const target = current[index];
  if (target.status !== 'available') {
    throw new Error('This donation is no longer available to claim.');
  }

  // Prevent claiming expired food donations
  const expiryMs = new Date(target.expiryAt).getTime();
  if (!isNaN(expiryMs) && expiryMs <= Date.now()) {
    throw new Error('This surplus food donation has expired past its safety window and cannot be claimed.');
  }

  // Validate required claim details
  if (!claim.recipientOrg || !claim.recipientOrg.trim()) {
    throw new Error('Recipient organization name is required to claim surplus food.');
  }
  if (!claim.claimedBy || !claim.claimedBy.trim()) {
    throw new Error('Claimant contact name is required.');
  }

  const nowIso = new Date().toISOString();
  const updatedDonation: FoodDonation = {
    ...target,
    status: 'claimed',
    claimDetails: {
      ...claim,
      claimedAt: nowIso
    },
    workflowHistory: [
      ...target.workflowHistory,
      {
        status: 'claimed',
        timestamp: nowIso,
        actor: actorName,
        note: `Claimed by ${claim.recipientOrg}. ETA: ${claim.estimatedPickupTime}. Mode: ${claim.transportMode || 'Standard'}.`
      }
    ]
  };

  current[index] = updatedDonation;
  saveDonations(current);

  // Structured Audit Log entry
  addAuditLogEntry(
    'DONATION_CLAIMED',
    actorName,
    `Donation "${target.title}"`,
    'success',
    `Claimed for ${claim.recipientOrg}. ETA: ${claim.estimatedPickupTime} | Transport: ${claim.transportMode || 'Standard'}`
  );

  return updatedDonation;
}

export function markAsPickedUp(
  donationId: string,
  actorName: string,
  note?: string
): FoodDonation | null {
  const current = loadDonations();
  const index = current.findIndex(d => d.id === donationId);
  if (index === -1) return null;

  const target = current[index];
  if (target.status !== 'claimed') {
    throw new Error('Donation must be claimed before marking as picked up.');
  }

  const nowIso = new Date().toISOString();
  const updatedDonation: FoodDonation = {
    ...target,
    status: 'picked_up',
    claimDetails: target.claimDetails
      ? { ...target.claimDetails, pickedUpAt: nowIso }
      : undefined,
    workflowHistory: [
      ...target.workflowHistory,
      {
        status: 'picked_up',
        timestamp: nowIso,
        actor: actorName,
        note: note || 'Food successfully transferred to recipient vehicle / courier.'
      }
    ]
  };

  current[index] = updatedDonation;
  saveDonations(current);

  // Structured Audit Log entry
  addAuditLogEntry(
    'DONATION_PICKED_UP',
    actorName,
    `Donation "${target.title}"`,
    'investigating',
    `Custody transferred to courier. Notes: ${note || 'Transferred at loading dock'}`
  );

  return updatedDonation;
}

export function confirmDelivery(
  donationId: string,
  actorName: string,
  deliveryNotes?: string
): FoodDonation | null {
  const current = loadDonations();
  const index = current.findIndex(d => d.id === donationId);
  if (index === -1) return null;

  const target = current[index];
  if (target.status !== 'picked_up') {
    throw new Error('Donation must be picked up before delivery can be confirmed.');
  }

  const nowIso = new Date().toISOString();
  const updatedDonation: FoodDonation = {
    ...target,
    status: 'delivered',
    claimDetails: target.claimDetails
      ? {
          ...target.claimDetails,
          deliveredAt: nowIso,
          deliveryNotes: deliveryNotes || 'Arrived at recipient distribution center.'
        }
      : undefined,
    workflowHistory: [
      ...target.workflowHistory,
      {
        status: 'delivered',
        timestamp: nowIso,
        actor: actorName,
        note: deliveryNotes || 'Food delivered and accepted for community distribution.'
      }
    ]
  };

  current[index] = updatedDonation;
  saveDonations(current);

  // Structured Audit Log entry
  addAuditLogEntry(
    'DONATION_DELIVERED',
    actorName,
    `Donation "${target.title}"`,
    'resolved',
    `Verified drop-off at community recipient. Credited +${target.quantity.estimatedServings} portions (+${target.quantity.estimatedKg} kg).`
  );

  return updatedDonation;
}

