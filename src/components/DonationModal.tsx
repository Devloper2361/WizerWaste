import React, { useState, useEffect } from 'react';
import { DietaryTag, FoodCategory, FoodDonation, ProviderType, StorageCondition } from '../types/foodRescue';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './common/Button';
import { useAuth } from '../context/AuthContext';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donation: Omit<FoodDonation, 'id' | 'createdAt' | 'status' | 'workflowHistory' | 'isSampleData'>) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('cooked_meals');
  const [quantityAmount, setQuantityAmount] = useState<number>(30);
  const [quantityUnit, setQuantityUnit] = useState<'servings' | 'kg' | 'boxes' | 'crates' | 'trays'>('servings');
  const [storageCondition, setStorageCondition] = useState<StorageCondition>('chilled');
  const [packaging, setPackaging] = useState('Covered aluminum catering pans');
  
  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [preparedAt, setPreparedAt] = useState<string>(defaultPrep);
  const [expiryAt, setExpiryAt] = useState<string>(defaultExpiry);

  const [providerName, setProviderName] = useState(currentUser?.organization || '');
  const [providerType, setProviderType] = useState<ProviderType>('restaurant');
  const [contactPerson, setContactPerson] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 782-9012');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('540 Harrison Street');
  const [neighborhood, setNeighborhood] = useState(currentUser?.region || 'Downtown / Central');
  const [pickupInstructions, setPickupInstructions] = useState('');

  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(['vegetarian']);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && currentUser) {
      if (!providerName && currentUser.organization) setProviderName(currentUser.organization);
      if (!contactPerson && currentUser.name) setContactPerson(currentUser.name);
      if (!email && currentUser.email) setEmail(currentUser.email);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.region) setNeighborhood(currentUser.region);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const setExpiryInHours = (hours: number) => {
    const future = new Date(Date.now() + hours * 60 * 60 * 1000);
    setExpiryAt(future.toISOString().slice(0, 16));
  };

  const setExpiryTonight = () => {
    const tonight = new Date();
    tonight.setHours(21, 0, 0, 0);
    if (tonight.getTime() <= Date.now()) {
      tonight.setDate(tonight.getDate() + 1);
    }
    setExpiryAt(tonight.toISOString().slice(0, 16));
  };

  const toggleDietaryTag = (tag: DietaryTag) => {
    setDietaryTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleAllergen = (allergen: string) => {
    setAllergens(prev =>
      prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen]
    );
  };

  const estimatedKg =
    quantityUnit === 'kg'
      ? quantityAmount
      : quantityUnit === 'servings'
      ? Math.round(quantityAmount * 0.4 * 10) / 10
      : Math.round(quantityAmount * 4 * 10) / 10;

  const estimatedServings =
    quantityUnit === 'servings'
      ? quantityAmount
      : Math.round(estimatedKg / 0.4);

  const expiryTimeMs = new Date(expiryAt).getTime();
  const hoursLeft = Math.max(0, Math.round(((expiryTimeMs - Date.now()) / (1000 * 3600)) * 10) / 10);
  const urgencyEst = hoursLeft <= 2 ? 60 : hoursLeft <= 4 ? 50 : hoursLeft <= 8 ? 38 : 20;
  const storageEst = storageCondition === 'hot_holding' ? 10 : storageCondition === 'chilled' ? 7 : 3;
  const initialEstScore = Math.min(100, urgencyEst + 25 + storageEst);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = 'Food title is required';
    if (!providerName.trim()) newErrors.providerName = 'Organization/establishment name is required';
    if (!contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required for dispatch coordination';
    if (!address.trim()) newErrors.address = 'Pickup address is required';
    if (quantityAmount <= 0) newErrors.quantityAmount = 'Quantity must be greater than zero';

    const expiryMs = new Date(expiryAt).getTime();
    if (isNaN(expiryMs) || expiryMs <= Date.now()) {
      newErrors.expiryAt = 'Expiry deadline must be set in the future';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const randomLatOffset = (Math.random() - 0.5) * 0.04;
    const randomLngOffset = (Math.random() - 0.5) * 0.04;

    onSubmit({
      title: title.trim(),
      description: description.trim() || `${title} prepared by ${providerName}.`,
      category,
      quantity: {
        amount: Number(quantityAmount),
        unit: quantityUnit,
        estimatedKg,
        estimatedServings
      },
      storageCondition,
      dietaryTags,
      allergens,
      packaging,
      preparedAt: new Date(preparedAt).toISOString(),
      expiryAt: new Date(expiryAt).toISOString(),
      provider: {
        name: providerName.trim(),
        type: providerType,
        contactPerson: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim() || 'contact@provider.org',
        address: address.trim(),
        neighborhood: neighborhood.trim() || 'Metro Area',
        lat: 37.7749 + randomLatOffset,
        lng: -122.4194 + randomLngOffset,
        pickupInstructions: pickupInstructions.trim() || 'Please check in at main reception or loading dock.'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-stone-200 rounded-xl w-full max-w-2xl my-8 overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-stone-900">Post Surplus Food Donation</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Broadcast surplus meals to local shelters and community food distribution centers
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

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          {/* RescueScore Preview Card */}
          <div className="bg-[#fbfbfa] p-3.5 rounded-lg border border-stone-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-stone-500 text-[11px] block">Projected RescueScore:</span>
              <span className="font-semibold text-stone-900 text-sm">
                ~{initialEstScore}/100 Priority Rating
              </span>
              <p className="text-[11px] text-stone-500">
                {hoursLeft <= 2.5
                  ? 'Urgent: flag prioritized for immediate community collection.'
                  : `Estimated ${hoursLeft}h operational collection window.`}
              </p>
            </div>
            <div className="text-right text-emerald-900 font-semibold text-sm">
              {estimatedServings} portions <span className="text-stone-500 text-xs font-normal">({estimatedKg} kg)</span>
            </div>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
              1. Food Details &amp; Quantity
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Food Listing Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 50 Portions Grilled Herb Chicken & Roasted Vegetables"
                  className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400 ${
                    errors.title ? 'border-rose-400' : 'border-stone-200'
                  }`}
                />
                {errors.title && (
                  <p className="text-rose-700 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.title}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
                  >
                    <option value="cooked_meals">Cooked Meals</option>
                    <option value="bakery">Bakery &amp; Bread</option>
                    <option value="produce">Fresh Produce</option>
                    <option value="dairy">Dairy &amp; Eggs</option>
                    <option value="packaged_groceries">Packaged Groceries</option>
                    <option value="beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Quantity Amount *</label>
                  <input
                    type="number"
                    min="1"
                    value={quantityAmount}
                    onChange={(e) => setQuantityAmount(Number(e.target.value))}
                    className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Unit</label>
                  <select
                    value={quantityUnit}
                    onChange={(e) => setQuantityUnit(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
                  >
                    <option value="servings">Servings (Individual Portions)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="trays">Catering Trays</option>
                    <option value="crates">Crates</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description &amp; Menu Details</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes on preparation, state of food, sides, and recommended reheating or serving advice."
                  className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:border-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
              2. Temperature &amp; Expiry Deadline
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Storage Condition</label>
                  <select
                    value={storageCondition}
                    onChange={(e) => setStorageCondition(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
                  >
                    <option value="hot_holding">Hot Holding Warmer (&gt;60°C)</option>
                    <option value="chilled">Refrigerated / Chilled (2–4°C)</option>
                    <option value="ambient">Ambient / Room Temp</option>
                    <option value="frozen">Frozen (&lt;-18°C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Packaging Type</label>
                  <input
                    type="text"
                    value={packaging}
                    onChange={(e) => setPackaging(e.target.value)}
                    placeholder="e.g. Covered aluminum trays, clamshells, boxes"
                    className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Preparation Time</label>
                  <input
                    type="datetime-local"
                    value={preparedAt}
                    onChange={(e) => setPreparedAt(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Must-Pickup Expiry Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    value={expiryAt}
                    onChange={(e) => setExpiryAt(e.target.value)}
                    className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none ${
                      errors.expiryAt ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {errors.expiryAt && (
                    <p className="text-rose-700 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.expiryAt}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-stone-500 text-[11px]">Quick Deadline:</span>
                <button
                  type="button"
                  onClick={() => setExpiryInHours(2)}
                  className="cursor-pointer px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 text-[11px]"
                >
                  +2 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryInHours(4)}
                  className="cursor-pointer px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 text-[11px]"
                >
                  +4 Hours
                </button>
                <button
                  type="button"
                  onClick={() => setExpiryInHours(8)}
                  className="cursor-pointer px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 text-[11px]"
                >
                  +8 Hours
                </button>
                <button
                  type="button"
                  onClick={setExpiryTonight}
                  className="cursor-pointer px-2 py-0.5 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 text-[11px]"
                >
                  Tonight by 9 PM
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Dietary & Allergens */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2">
              3. Dietary Tags &amp; Allergens
            </h3>
            <div className="space-y-2.5">
              <div>
                <span className="block text-stone-600 mb-1">Dietary Suitability:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(['vegetarian', 'vegan', 'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free'] as DietaryTag[]).map((tag) => {
                    const isChecked = dietaryTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietaryTag(tag)}
                        className={`cursor-pointer px-2.5 py-1 rounded border text-[11px] capitalize transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {tag.replace('_', '-')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-stone-600 mb-1">Contains Allergens:</span>
                <div className="flex flex-wrap gap-1.5">
                  {['Gluten', 'Dairy', 'Eggs', 'Tree Nuts', 'Peanuts', 'Soy', 'Shellfish'].map((allergen) => {
                    const isChecked = allergens.includes(allergen);
                    return (
                      <button
                        key={allergen}
                        type="button"
                        onClick={() => toggleAllergen(allergen)}
                        className={`cursor-pointer px-2.5 py-1 rounded border text-[11px] transition-colors ${
                          isChecked
                            ? 'bg-rose-50 text-rose-800 border-rose-300 font-medium'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {allergen}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Provider & Pickup Logistics */}
          <div>
            <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
              4. Food Provider &amp; Pickup Location
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">
                    Establishment Name *
                  </label>
                  <input
                    type="text"
                    value={providerName}
                    onChange={(e) => setProviderName(e.target.value)}
                    placeholder="e.g. City Bistro, Hilton Catering, St. John Cafeteria"
                    className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none ${
                      errors.providerName ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {errors.providerName && (
                    <p className="text-rose-700 text-[11px] mt-1">{errors.providerName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Establishment Type</label>
                  <select
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value as any)}
                    className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="caterer">Event Caterer</option>
                    <option value="bakery">Artisan Bakery</option>
                    <option value="supermarket">Supermarket / Grocery</option>
                    <option value="hotel">Hotel Banquet</option>
                    <option value="corporate_cafeteria">Corporate Cafeteria</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Contact Coordinator *</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Chef Maria / John"
                    className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none ${
                      errors.contactPerson ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {errors.contactPerson && (
                    <p className="text-rose-700 text-[11px] mt-1">{errors.contactPerson}</p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none ${
                      errors.phone ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-700 text-[11px] mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kitchen@establishment.com"
                    className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-medium mb-1">
                    Pickup Street Address *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 782 Market Street"
                    className={`w-full bg-white border rounded-md px-3 py-2 text-stone-900 focus:outline-none ${
                      errors.address ? 'border-rose-400' : 'border-stone-200'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-rose-700 text-[11px] mt-1">{errors.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Neighborhood</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="e.g. Downtown / SOMA"
                    className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Loading Bay / Access Instructions
                </label>
                <input
                  type="text"
                  value={pickupInstructions}
                  onChange={(e) => setPickupInstructions(e.target.value)}
                  placeholder="e.g. Loading bay entrance behind building; ring kitchen buzzer"
                  className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5 shrink-0">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Food Surplus
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
