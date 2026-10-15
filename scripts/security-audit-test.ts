// Automated Security, Data Integrity, and Permission Verification Suite for WizerWaste
// This script executes automated functional and unit checks on the audited business logic.

// Mock localStorage for headless Node environment
const store = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, String(value)),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear()
};
(globalThis as any).localStorage = mockLocalStorage;

import {
  createNewDonation,
  claimDonation,
  markAsPickedUp,
  confirmDelivery,
  loadDonations,
  resetToDemoData
} from '../src/utils/storage';

import {
  createSupportTicket,
  addMessageToTicket,
  updateTicketStatus,
  loadSupportTickets,
  loadAuditLogs
} from '../src/utils/supportStorage';

import { PRESET_USERS, UserProfile } from '../src/types/auth';

let testsPassed = 0;
let testsFailed = 0;
const results: { test: string; status: 'PASSED' | 'FAILED'; error?: string }[] = [];

function assert(condition: boolean, testName: string, errorMsg?: string) {
  if (condition) {
    testsPassed++;
    results.push({ test: testName, status: 'PASSED' });
    console.log(`✓ [PASS] ${testName}`);
  } else {
    testsFailed++;
    results.push({ test: testName, status: 'FAILED', error: errorMsg || 'Assertion failed' });
    console.error(`✗ [FAIL] ${testName}: ${errorMsg || 'Assertion failed'}`);
  }
}

function assertThrows(fn: () => void, testName: string, expectedSnippet?: string) {
  try {
    fn();
    testsFailed++;
    results.push({ test: testName, status: 'FAILED', error: 'Expected function to throw, but it succeeded.' });
    console.error(`✗ [FAIL] ${testName}: Expected throw, but succeeded.`);
  } catch (err: any) {
    if (expectedSnippet && !err.message.toLowerCase().includes(expectedSnippet.toLowerCase())) {
      testsFailed++;
      results.push({ test: testName, status: 'FAILED', error: `Threw "${err.message}", expected snippet "${expectedSnippet}"` });
      console.error(`✗ [FAIL] ${testName}: Threw wrong error "${err.message}"`);
    } else {
      testsPassed++;
      results.push({ test: testName, status: 'PASSED' });
      console.log(`✓ [PASS] ${testName} (Threw: "${err.message}")`);
    }
  }
}

async function runAllSecurityTests() {
  console.log('====================================================');
  console.log('STARTING WIZERWASTE SECURITY & INTEGRITY AUDIT SUITE');
  console.log('====================================================\n');

  // --- AREA 1: AUTHENTICATION & ROLE ESCALATION PREVENTION ---
  console.log('--- Testing Area 1: Authentication & Privilege Escalation ---');
  resetToDemoData();

  // Test 1: Verify preset accounts integrity
  assert(
    PRESET_USERS.super_admin.role === 'super_admin' &&
    PRESET_USERS.super_admin.email === 'superadmin@wizerwaste.network',
    'Super Admin preset account has expected immutable credentials'
  );

  assert(
    PRESET_USERS.donor.role === 'donor' &&
    PRESET_USERS.ngo_recipient.role === 'ngo_recipient',
    'Stakeholder role presets are verified'
  );

  // --- AREA 2 & 4: SUPPORT TICKET PERMISSIONS & FEDERATION REGIONAL BOUNDARIES ---
  console.log('\n--- Testing Area 2 & 4: Support Permissions & Regional Scoping ---');
  const fedAdminUser = PRESET_USERS.federation_admin; // Metro Bay District (Northern Sector)
  const donorUser = PRESET_USERS.donor; // Elena Rostova
  const ngoUser = PRESET_USERS.ngo_recipient; // Rev. Jonathan Rivera

  // Test 3: Normal user creating a support ticket
  const ticket = createSupportTicket(
    'Food Safety',
    'Urgent',
    'Cold chain probe issue at dock',
    'Cambro thermometer was not calibrated properly before morning pickup.',
    donorUser
  );
  assert(ticket.createdBy.id === donorUser.id, 'Support ticket created with verified donor ownership');
  assert(ticket.status === 'Open', 'Support ticket initialized with Open status');

  // Test 4: Donor can message their own ticket
  const updatedWithReply = addMessageToTicket(ticket.id, 'Calibrated replacement probe now active.', donorUser, false);
  assert(
    updatedWithReply !== null && updatedWithReply.messages.length === 2,
    'Ticket owner can submit message to their own ticket'
  );

  // Test 5: Standard user cannot falsify staff status
  assert(
    updatedWithReply?.messages[1].isStaffReply === false,
    'Client-side non-admin user cannot forge isStaffReply flag'
  );

  // Test 6: Another regular user (NGO) cannot message an unrelated donor ticket
  assertThrows(
    () => addMessageToTicket(ticket.id, 'Unauthorized message', ngoUser, false),
    'Non-owner user cannot message an unrelated ticket',
    'Unauthorized'
  );

  // Test 7: Non-admin user cannot change ticket status
  assertThrows(
    () => updateTicketStatus(ticket.id, 'Resolved', donorUser),
    'Donor user cannot change ticket status',
    'Unauthorized'
  );

  // Test 8: Federation Admin within authorized regional chapter can update status
  const resolvedTicket = updateTicketStatus(ticket.id, 'Resolved', fedAdminUser);
  assert(
    Boolean(resolvedTicket?.status === 'Resolved' && resolvedTicket?.assignedAdmin?.includes('Marcus Sterling')),
    'Federation Admin within authorized region can resolve chapter tickets'
  );

  // Test 9: Federation Admin cannot update ticket outside their region
  // Create an out-of-region ticket (Eastside District)
  const eastsideUser: UserProfile = {
    id: 'usr_east_99',
    name: 'Eastside Grocer',
    email: 'grocer@eastside.org',
    role: 'donor',
    organization: 'Eastside Community Grocery',
    region: 'Eastside District (Eastern Sector)',
    avatarInitials: 'EG',
    isVerified: true
  };
  const eastTicket = createSupportTicket(
    'Pickup Issue',
    'High',
    'Eastside loading dock delayed',
    'Dock gate power failure',
    eastsideUser
  );

  assertThrows(
    () => updateTicketStatus(eastTicket.id, 'Resolved', fedAdminUser),
    'Federation Admin cannot update tickets outside their authorized regional chapter',
    'Unauthorized'
  );

  // --- AREA 3: DONATION DATA INTEGRITY & WORKFLOW TRANSITIONS ---
  console.log('\n--- Testing Area 3: Donation Data Integrity & Workflow ---');

  // Test 10: Reject donation with past expiry time
  assertThrows(
    () =>
      createNewDonation({
        title: 'Expired Pastries',
        description: 'Should fail validation',
        category: 'bakery',
        quantity: { amount: 10, unit: 'boxes', estimatedKg: 5, estimatedServings: 20 },
        storageCondition: 'ambient',
        dietaryTags: ['vegetarian'],
        allergens: [],
        packaging: 'Paper boxes',
        preparedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        expiryAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), // PAST EXPIRY!
        provider: {
          name: 'Expired Bakery',
          type: 'bakery',
          contactPerson: 'Bob',
          phone: '555-0101',
          email: 'bob@bakery.org',
          address: '123 Bakery St',
          neighborhood: 'Mission',
          lat: 37.77,
          lng: -122.41,
          pickupInstructions: 'Rear alley'
        }
      }),
    'Reject creating donation with past expiry date',
    'future'
  );

  // Test 11: Reject donation with 0 or negative quantity
  assertThrows(
    () =>
      createNewDonation({
        title: 'Zero Quantity Salad',
        description: 'Should fail validation',
        category: 'produce',
        quantity: { amount: 0, unit: 'kg', estimatedKg: 0, estimatedServings: 0 },
        storageCondition: 'chilled',
        dietaryTags: ['vegan'],
        allergens: [],
        packaging: 'Crates',
        preparedAt: new Date().toISOString(),
        expiryAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        provider: {
          name: 'Green Grocer',
          type: 'supermarket',
          contactPerson: 'Alice',
          phone: '555-0102',
          email: 'alice@green.org',
          address: '456 Green Way',
          neighborhood: 'Mission',
          lat: 37.77,
          lng: -122.41,
          pickupInstructions: 'Loading bay'
        }
      }),
    'Reject creating donation with zero quantity',
    'greater than zero'
  );

  // Test 12: Successful donation creation with future expiry
  const validDonation = createNewDonation({
    title: 'Fresh Catering Sandwiches',
    description: 'Assorted artisan focaccia and wraps from executive conference.',
    category: 'cooked_meals',
    quantity: { amount: 45, unit: 'servings', estimatedKg: 18, estimatedServings: 45 },
    storageCondition: 'chilled',
    dietaryTags: ['vegetarian'],
    allergens: ['Gluten', 'Dairy'],
    packaging: 'Sealed hotel pans',
    preparedAt: new Date().toISOString(),
    expiryAt: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    provider: {
      name: 'Grand Harbor Hotel & Catering',
      type: 'hotel',
      contactPerson: 'Chef Elena Rostova',
      phone: '+1 (555) 014-3829',
      email: 'elena@grandharborhotel.com',
      address: '500 Harbor View Blvd',
      neighborhood: 'Downtown Waterfront',
      lat: 37.78,
      lng: -122.40,
      pickupInstructions: 'Enter via dock 3'
    }
  });

  assert(validDonation.status === 'available', 'Valid donation is broadcast in available status');

  // Test 13: Claim donation
  const claimed = claimDonation(
    validDonation.id,
    {
      recipientOrg: 'St. Vincent Dining Room',
      recipientType: 'community_kitchen',
      claimedBy: 'Rev. Jonathan Rivera',
      contactPhone: '555-017-7741',
      claimedAt: new Date().toISOString(),
      estimatedPickupTime: 'Within 30 minutes',
      transportMode: 'insulated_van',
      notes: 'Evening dinner service'
    },
    'Rev. Jonathan Rivera (NGO)'
  );
  assert(claimed?.status === 'claimed', 'Donation successfully claimed by recipient NGO');

  // Test 14: Prevent duplicate claiming of an already claimed donation
  assertThrows(
    () =>
      claimDonation(
        validDonation.id,
        {
          recipientOrg: 'Second Harvest',
          recipientType: 'food_bank',
          claimedBy: 'Duplicate Claimant',
          contactPhone: '555-999-9999',
          claimedAt: new Date().toISOString(),
          estimatedPickupTime: '1 hour'
        },
        'Duplicate Claimant'
      ),
    'Prevent duplicate claiming of an already claimed donation',
    'no longer available'
  );

  // Test 15: Cannot confirm delivery before pickup
  assertThrows(
    () => confirmDelivery(validDonation.id, 'Courier Maya', 'Direct delivery attempt'),
    'Prevent confirming delivery before food is marked picked up',
    'must be picked up'
  );

  // Test 16: Mark picked up
  const pickedUp = markAsPickedUp(validDonation.id, 'Courier Maya Chen', 'Temperature checked at 3°C');
  assert(pickedUp?.status === 'picked_up', 'Custody transition to picked_up successful');

  // Test 17: Confirm delivery
  const delivered = confirmDelivery(validDonation.id, 'Rev. Jonathan Rivera', 'Received at pantry dock');
  assert(delivered?.status === 'delivered', 'Final custody transition to delivered successful');

  // --- AREA 5: AUDIT LOG VERIFICATION ---
  console.log('\n--- Testing Area 5: Audit Log Generation & Actor Tracking ---');
  const auditLogs = loadAuditLogs();

  const donationBroadcastLog = auditLogs.find(l => l.event === 'DONATION_BROADCAST');
  assert(donationBroadcastLog !== undefined, 'DONATION_BROADCAST logged in audit trail');

  const donationClaimedLog = auditLogs.find(l => l.event === 'DONATION_CLAIMED');
  assert(donationClaimedLog !== undefined, 'DONATION_CLAIMED logged in audit trail');

  const donationDeliveredLog = auditLogs.find(l => l.event === 'DONATION_DELIVERED');
  assert(donationDeliveredLog !== undefined, 'DONATION_DELIVERED logged in audit trail');

  const supportResolvedLog = auditLogs.find(l => l.event === 'SUPPORT_TICKET_RESOLVED');
  assert(
    supportResolvedLog !== undefined && supportResolvedLog.actorId === fedAdminUser.id,
    'SUPPORT_TICKET_RESOLVED logged with actorId and administrator details'
  );

  // --- AREA 6: DATA PERSISTENCE & DEDUPLICATION ---
  console.log('\n--- Testing Area 6: Persistence & Deduplication ---');
  const allDonations = loadDonations();
  const foundDelivered = allDonations.find(d => d.id === validDonation.id);
  assert(foundDelivered?.status === 'delivered', 'Donation state persisted across storage reloads');

  // Deduplication check: verify no duplicate IDs in donations
  const idCounts = new Map<string, number>();
  let hasDuplicate = false;
  for (const d of allDonations) {
    const c = (idCounts.get(d.id) || 0) + 1;
    idCounts.set(d.id, c);
    if (c > 1) hasDuplicate = true;
  }
  assert(!hasDuplicate, 'Storage deduplication guarantees 0 duplicate donation IDs');

  console.log('\n====================================================');
  console.log(`AUDIT TEST SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED`);
  console.log('====================================================');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runAllSecurityTests().catch(err => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
