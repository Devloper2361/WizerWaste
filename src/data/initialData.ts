import { FoodDonation } from '../types/foodRescue';

/**
 * Generates initial realistic demonstration data with relative timestamps
 * so deadlines and time counters are always dynamic and fresh.
 */
export function getInitialSampleDonations(): FoodDonation[] {
  const now = Date.now();
  const hour = 3600 * 1000;

  return [
    {
      id: 'demo-don-001',
      isSampleData: true,
      title: '65 Portions Vegetable Biryani & Chana Masala',
      description: 'Hot catered luncheon surplus prepared in commercial kitchen trays. Kept in certified electric hot holding warmers. Includes raita and fresh roti.',
      category: 'cooked_meals',
      quantity: {
        amount: 65,
        unit: 'servings',
        estimatedKg: 26,
        estimatedServings: 65
      },
      storageCondition: 'hot_holding',
      dietaryTags: ['vegetarian', 'halal'],
      allergens: ['Dairy'],
      packaging: '5 deep aluminum foil catering hotel pans with sealed lids',
      preparedAt: new Date(now - 2 * hour).toISOString(),
      expiryAt: new Date(now + 2.5 * hour).toISOString(), // Critical urgency!
      createdAt: new Date(now - 2 * hour).toISOString(),
      provider: {
        name: 'The Grand Lotus Banquet Hall',
        type: 'caterer',
        contactPerson: 'Arun Patel (Kitchen Director)',
        phone: '+1 (555) 782-9012',
        email: 'catering@grandlotus.com',
        address: '540 Harrison Street',
        neighborhood: 'SOMA / Downtown',
        lat: 37.7842,
        lng: -122.3965,
        pickupInstructions: 'Enter through back alley loading ramp off Hawthorne St. Ring buzzer labeled Banquet Kitchen.'
      },
      status: 'available',
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 2 * hour).toISOString(),
          actor: 'Arun Patel (Provider)',
          note: 'Surplus buffet banquet trays logged for emergency rescue.'
        }
      ]
    },
    {
      id: 'demo-don-002',
      isSampleData: true,
      title: '40 Loaves Sourdough & 80 Assorted Croissants',
      description: 'Fresh morning bake surplus from artisan bakery. High quality, crisp crusts, un-sliced sourdough boules, butter croissants, and pain au chocolat.',
      category: 'bakery',
      quantity: {
        amount: 120,
        unit: 'servings',
        estimatedKg: 35,
        estimatedServings: 120
      },
      storageCondition: 'ambient',
      dietaryTags: ['vegetarian'],
      allergens: ['Gluten', 'Dairy'],
      packaging: '4 vented food-grade cardboard bread crates with wax paper liners',
      preparedAt: new Date(now - 5 * hour).toISOString(),
      expiryAt: new Date(now + 8 * hour).toISOString(),
      createdAt: new Date(now - 4.5 * hour).toISOString(),
      provider: {
        name: 'Rustic Hearth Artisan Bakery',
        type: 'bakery',
        contactPerson: 'Claire Moreau (Head Baker)',
        phone: '+1 (555) 321-4567',
        email: 'orders@rustichearthbakes.com',
        address: '892 Valencia Street',
        neighborhood: 'Mission District',
        lat: 37.7592,
        lng: -122.4216,
        pickupInstructions: 'Front counter staff has crates ready. Mention WizerWaste ID #002.'
      },
      status: 'available',
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 4.5 * hour).toISOString(),
          actor: 'Claire Moreau (Provider)',
          note: 'Morning bake excess boxed for community shelter distribution.'
        }
      ]
    },
    {
      id: 'demo-don-003',
      isSampleData: true,
      title: '12 Crates Organic Crisp Apples, Carrots & Greens',
      description: 'Supermarket daily rotation surplus. Crisp gala apples, bunched organic rainbow carrots, and fresh spinach. Fully inspected, clean and ready for meal prep.',
      category: 'produce',
      quantity: {
        amount: 12,
        unit: 'crates',
        estimatedKg: 78,
        estimatedServings: 195
      },
      storageCondition: 'ambient',
      dietaryTags: ['vegetarian', 'vegan', 'gluten_free', 'kosher', 'halal'],
      allergens: [],
      packaging: 'Stackable plastic produce crates (exchange upon pickup or return next day)',
      preparedAt: new Date(now - 8 * hour).toISOString(),
      expiryAt: new Date(now + 18 * hour).toISOString(),
      createdAt: new Date(now - 7 * hour).toISOString(),
      provider: {
        name: 'Verdant Harvest Co-op Market',
        type: 'supermarket',
        contactPerson: 'Marcus Vance (Produce Lead)',
        phone: '+1 (555) 654-7890',
        email: 'produce@verdantharvest.org',
        address: '1420 Folsom Street',
        neighborhood: 'West SOMA',
        lat: 37.7725,
        lng: -122.4112,
        pickupInstructions: 'Produce receiving dock on 10th St. Hand truck available on site.'
      },
      status: 'claimed',
      claimDetails: {
        recipientOrg: 'Downtown Hope Center & Shelter',
        recipientType: 'shelter',
        claimedBy: 'Sarah Jenkins (Pantry Coordinator)',
        contactPhone: '+1 (555) 234-8901',
        claimedAt: new Date(now - 1.2 * hour).toISOString(),
        estimatedPickupTime: 'In 30 minutes',
        transportMode: 'cargo_bike',
        notes: 'Volunteer courier dispatched with trailer for evening dinner prep.'
      },
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 7 * hour).toISOString(),
          actor: 'Marcus Vance (Provider)',
          note: 'Produce inventory rotation crates logged.'
        },
        {
          status: 'claimed',
          timestamp: new Date(now - 1.2 * hour).toISOString(),
          actor: 'Sarah Jenkins (Downtown Hope Center)',
          note: 'Claimed for tonight family shelter produce baskets.'
        }
      ]
    },
    {
      id: 'demo-don-004',
      isSampleData: true,
      title: '85 Chilled Roasted Turkey Wraps & Quinoa Bowls',
      description: 'Pre-packaged individual executive cafeteria grab-and-go boxes. Labeled with exact ingredients. Chilled in walk-in cooler at 3°C.',
      category: 'cooked_meals',
      quantity: {
        amount: 85,
        unit: 'servings',
        estimatedKg: 34,
        estimatedServings: 85
      },
      storageCondition: 'chilled',
      dietaryTags: ['halal', 'dairy_free'],
      allergens: ['Gluten'],
      packaging: 'Individually boxed compostable meal clamshells in 4 master boxes',
      preparedAt: new Date(now - 6 * hour).toISOString(),
      expiryAt: new Date(now + 4 * hour).toISOString(),
      createdAt: new Date(now - 3 * hour).toISOString(),
      provider: {
        name: 'Apex Tech HQ Cafeteria',
        type: 'corporate_cafeteria',
        contactPerson: 'Chef Elena Rostova',
        phone: '+1 (555) 432-1098',
        email: 'foodservices@apextech.corp',
        address: '350 Mission Street, Floor 4',
        neighborhood: 'Financial District',
        lat: 37.7915,
        lng: -122.3985,
        pickupInstructions: 'Check in with security badge desk with ID. Elena will escort downstairs.'
      },
      status: 'picked_up',
      claimDetails: {
        recipientOrg: 'South District Family Table',
        recipientType: 'community_kitchen',
        claimedBy: 'Mateo Morales',
        contactPhone: '+1 (555) 345-6789',
        claimedAt: new Date(now - 2 * hour).toISOString(),
        estimatedPickupTime: 'Completed at 14:15',
        transportMode: 'insulated_van',
        notes: 'Insulated cold boxes with temperature logger.',
        pickedUpAt: new Date(now - 0.5 * hour).toISOString()
      },
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 3 * hour).toISOString(),
          actor: 'Chef Elena (Provider)',
          note: 'Surplus lunch cafeteria prepared meals.'
        },
        {
          status: 'claimed',
          timestamp: new Date(now - 2 * hour).toISOString(),
          actor: 'Mateo Morales (South District)',
          note: 'Allocated for youth after-school program dinners.'
        },
        {
          status: 'picked_up',
          timestamp: new Date(now - 0.5 * hour).toISOString(),
          actor: 'Mateo Morales (Driver)',
          note: 'Picked up from loading dock. Temp verified at 3.4°C.'
        }
      ]
    },
    {
      id: 'demo-don-005',
      isSampleData: true,
      title: '30 Liters Organic Whole Milk & 15 kg Cheddar Cheese Blocks',
      description: 'Cold-chain certified pasteurized milk gallons and vacuum-sealed sharp cheddar blocks. Perfect refrigerated condition.',
      category: 'dairy',
      quantity: {
        amount: 45,
        unit: 'kg',
        estimatedKg: 45,
        estimatedServings: 110
      },
      storageCondition: 'chilled',
      dietaryTags: ['vegetarian', 'kosher'],
      allergens: ['Dairy'],
      packaging: 'Heavy-duty insulated chilled tote bags',
      preparedAt: new Date(now - 24 * hour).toISOString(),
      expiryAt: new Date(now - 2 * hour).toISOString(),
      createdAt: new Date(now - 14 * hour).toISOString(),
      provider: {
        name: 'Bayview Dairy Provisions',
        type: 'supermarket',
        contactPerson: 'David Chen',
        phone: '+1 (555) 890-1234',
        email: 'dchen@bayviewprovisions.com',
        address: '1600 Evans Ave',
        neighborhood: 'Bayview',
        lat: 37.7410,
        lng: -122.3890,
        pickupInstructions: 'Side warehouse door #2. Call David upon arrival.'
      },
      status: 'delivered',
      claimDetails: {
        recipientOrg: 'Eastside Community Food Bank',
        recipientType: 'food_bank',
        claimedBy: 'Hannah Lee',
        contactPhone: '+1 (555) 876-5432',
        claimedAt: new Date(now - 10 * hour).toISOString(),
        estimatedPickupTime: 'Morning route',
        transportMode: 'insulated_van',
        notes: 'Chilled delivery to warehouse refrigeration unit.',
        pickedUpAt: new Date(now - 5 * hour).toISOString(),
        deliveredAt: new Date(now - 3 * hour).toISOString(),
        deliveryNotes: 'Successfully stocked in walk-in cold storage. Reached 60 local families.'
      },
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 14 * hour).toISOString(),
          actor: 'David Chen (Provider)',
          note: 'Surplus milk and cheese stock.'
        },
        {
          status: 'claimed',
          timestamp: new Date(now - 10 * hour).toISOString(),
          actor: 'Hannah Lee (Eastside Food Bank)',
          note: 'Scheduled for morning refrigerated route.'
        },
        {
          status: 'picked_up',
          timestamp: new Date(now - 5 * hour).toISOString(),
          actor: 'Driver Sam (Logistics)',
          note: 'Handed over and secured in van.'
        },
        {
          status: 'delivered',
          timestamp: new Date(now - 3 * hour).toISOString(),
          actor: 'Hannah Lee (Eastside Food Bank)',
          note: 'Verified temperature compliant and distributed to pantry shelf.'
        }
      ]
    },
    {
      id: 'demo-don-006',
      isSampleData: true,
      title: '50 Hot Gourmet Flatbreads & Minestrone Soup Pots',
      description: 'Hot vegetarian minestrone soup in 2 thermal cambro carriers plus 50 warm rosemary focaccia and roasted vegetable flatbreads.',
      category: 'cooked_meals',
      quantity: {
        amount: 70,
        unit: 'servings',
        estimatedKg: 30,
        estimatedServings: 70
      },
      storageCondition: 'hot_holding',
      dietaryTags: ['vegetarian', 'vegan'],
      allergens: ['Gluten'],
      packaging: '2 insulated food service thermal soup barrels and covered sheet pans',
      preparedAt: new Date(now - 1 * hour).toISOString(),
      expiryAt: new Date(now + 3 * hour).toISOString(), // Highly urgent!
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      provider: {
        name: 'Trattoria Bella Notte',
        type: 'restaurant',
        contactPerson: 'Chef Marco Bellini',
        phone: '+1 (555) 777-8899',
        email: 'bellanotte@ristorante.com',
        address: '580 Columbus Ave',
        neighborhood: 'North Beach',
        lat: 37.8005,
        lng: -122.4098,
        pickupInstructions: 'Kitchen entrance at rear courtyard. Staff ready to load.'
      },
      status: 'available',
      workflowHistory: [
        {
          status: 'available',
          timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
          actor: 'Marco Bellini (Owner/Chef)',
          note: 'Excess event catering hot food available for prompt rescue.'
        }
      ]
    }
  ];
}
