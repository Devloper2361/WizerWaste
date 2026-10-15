import React, { useState, useMemo } from 'react';
import { FoodCategory, FoodDonation, RecipientHub, StorageCondition } from '../types/foodRescue';
import { DonationCard } from './DonationCard';
import { DashboardStats } from './DashboardStats';
import { computeDonationPriority } from '../utils/prioritization';
import { Search, Filter, X, PlusCircle } from 'lucide-react';
import { Button } from './common/Button';

interface MarketplaceProps {
  donations: FoodDonation[];
  selectedHub: RecipientHub;
  onClaim: (donation: FoodDonation) => void;
  onViewDetails: (donation: FoodDonation) => void;
  onOpenDonateModal: () => void;
  onOpenAlgorithm: () => void;
  filterUserOnly: boolean;
  onNavigateTab?: (tab: string) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  donations,
  selectedHub,
  onClaim,
  onViewDetails,
  onOpenDonateModal,
  onOpenAlgorithm,
  filterUserOnly,
  onNavigateTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('available');
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(15);
  const [sortBy, setSortBy] = useState<'priority' | 'expiry' | 'distance' | 'quantity'>('priority');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'cooked_meals', label: 'Cooked Meals' },
    { id: 'bakery', label: 'Bakery' },
    { id: 'produce', label: 'Produce' },
    { id: 'dairy', label: 'Dairy & Eggs' },
    { id: 'packaged_groceries', label: 'Groceries' }
  ];

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'halal', label: 'Halal' },
    { id: 'gluten_free', label: 'Gluten-Free' }
  ];

  const toggleDietary = (tag: string) => {
    setSelectedDietary(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      if (filterUserOnly && donation.isSampleData) {
        return false;
      }
      if (selectedStatus === 'available') {
        const isExpired = new Date(donation.expiryAt).getTime() <= Date.now();
        if (isExpired || donation.status !== 'available') {
          return false;
        }
      } else if (selectedStatus !== 'all' && donation.status !== selectedStatus) {
        return false;
      }
      if (selectedCategory !== 'all' && donation.category !== selectedCategory) {
        return false;
      }
      if (selectedStorage !== 'all' && donation.storageCondition !== selectedStorage) {
        return false;
      }
      if (selectedDietary.length > 0) {
        const matchesAllDietary = selectedDietary.every(tag =>
          donation.dietaryTags.includes(tag as any)
        );
        if (!matchesAllDietary) return false;
      }

      const breakdown = computeDonationPriority(donation, selectedHub);
      if (breakdown.simulatedDistanceKm > maxDistanceKm) {
        return false;
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = donation.title.toLowerCase().includes(query);
        const matchesDesc = donation.description.toLowerCase().includes(query);
        const matchesProvider = donation.provider.name.toLowerCase().includes(query);
        const matchesLocation = donation.provider.address.toLowerCase().includes(query) ||
                                donation.provider.neighborhood.toLowerCase().includes(query);
        const matchesAllergens = donation.allergens.some(a => a.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesProvider && !matchesLocation && !matchesAllergens) {
          return false;
        }
      }

      return true;
    });
  }, [
    donations,
    filterUserOnly,
    selectedStatus,
    selectedCategory,
    selectedStorage,
    selectedDietary,
    maxDistanceKm,
    searchQuery,
    selectedHub
  ]);

  const sortedDonations = useMemo(() => {
    const list = [...filteredDonations];
    return list.sort((a, b) => {
      const breakdownA = computeDonationPriority(a, selectedHub);
      const breakdownB = computeDonationPriority(b, selectedHub);

      if (sortBy === 'priority') {
        return breakdownB.totalScore - breakdownA.totalScore;
      }
      if (sortBy === 'expiry') {
        return breakdownA.hoursRemaining - breakdownB.hoursRemaining;
      }
      if (sortBy === 'distance') {
        return breakdownA.simulatedDistanceKm - breakdownB.simulatedDistanceKm;
      }
      if (sortBy === 'quantity') {
        return b.quantity.estimatedServings - a.quantity.estimatedServings;
      }
      return 0;
    });
  }, [filteredDonations, sortBy, selectedHub]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedStatus !== 'available' ||
    selectedDietary.length > 0 ||
    selectedStorage !== 'all' ||
    maxDistanceKm < 15 ||
    searchQuery !== '';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedStatus('available');
    setSelectedDietary([]);
    setSelectedStorage('all');
    setMaxDistanceKm(15);
    setSearchQuery('');
  };

  return (
    <section>
      {/* Real-time KPI Stats Strip */}
      <DashboardStats
        donations={donations}
        onNavigateTab={onNavigateTab || (() => {})}
      />

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search surplus meals, bakery, groceries, provider name, or allergens..."
              className="w-full bg-[#fbfbfa] border border-stone-200 rounded-md pl-9 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick status selector & Filter toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-md text-xs">
              <button
                type="button"
                onClick={() => setSelectedStatus('available')}
                className={`cursor-pointer px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedStatus === 'available'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Available
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`cursor-pointer px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedStatus === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Statuses
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                showAdvancedFilters || hasActiveFilters
                  ? 'bg-stone-100 text-stone-900 border-stone-300'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-stone-500" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
              )}
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="cursor-pointer bg-white border border-stone-200 text-stone-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-stone-400"
            >
              <option value="priority">Sort: RescueScore (Priority)</option>
              <option value="expiry">Sort: Expiry (Soonest first)</option>
              <option value="distance">Sort: Distance (Nearest first)</option>
              <option value="quantity">Sort: Quantity (Highest first)</option>
            </select>
          </div>
        </div>

        {/* Category Tab Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 border-t border-stone-100 mt-3 text-xs scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer px-3 py-1 rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white font-medium shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="pt-3.5 mt-3 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="block text-stone-700 font-medium mb-1.5">Dietary Certification:</span>
              <div className="flex flex-wrap gap-1.5">
                {dietaryOptions.map((opt) => {
                  const isChecked = selectedDietary.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleDietary(opt.id)}
                      className={`cursor-pointer px-2.5 py-1 rounded border text-[11px] transition-colors ${
                        isChecked
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-stone-700 font-medium mb-1.5">Storage Condition:</span>
              <select
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="w-full bg-white border border-stone-200 text-stone-800 rounded-md px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">All Storage Conditions</option>
                <option value="hot_holding">Hot Holding Warmers (&gt;60°C)</option>
                <option value="chilled">Refrigerated / Chilled (2–4°C)</option>
                <option value="ambient">Ambient / Room Temp</option>
                <option value="frozen">Frozen</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-stone-700 mb-1">
                <span className="font-medium">Max Simulated Radius:</span>
                <span className="font-medium text-emerald-800">{maxDistanceKm} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={maxDistanceKm}
                onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>1 km</span>
                <span>25 km radius</span>
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters helper strip */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-stone-100 text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-900 font-semibold">{sortedDonations.length}</strong> listings
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer text-emerald-800 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <X className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Listings */}
      {sortedDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDonations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              selectedHub={selectedHub}
              onClaim={onClaim}
              onViewDetails={onViewDetails}
              onOpenAlgorithm={onOpenAlgorithm}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-stone-200 rounded-lg p-10 text-center max-w-md mx-auto shadow-xs">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-900 mb-1">No surplus food listings found</h3>
          <p className="text-xs text-stone-500 mb-5 leading-relaxed">
            Try adjusting your search query, increasing distance radius, or switching status to All.
          </p>
          <div className="flex items-center justify-center gap-2.5">
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                Clear Filters
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={onOpenDonateModal}>
              <PlusCircle className="w-3.5 h-3.5 mr-1" />
              <span>Post New Donation</span>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
