import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from './Navbar';
import { SimulationNotice } from '../common/SimulationNotice';
import { SampleDataBanner } from '../SampleDataBanner';
import { LoginScreen } from '../auth/LoginScreen';

// Dashboards
import { SuperAdminDashboard } from '../dashboards/SuperAdminDashboard';
import { FederationAdminDashboard } from '../dashboards/FederationAdminDashboard';
import { DonorDashboard } from '../dashboards/DonorDashboard';
import { NgoDashboard } from '../dashboards/NgoDashboard';
import { VolunteerDashboard } from '../dashboards/VolunteerDashboard';

// Shared operational views
import { Marketplace } from '../Marketplace';
import { PickupTracker } from '../PickupTracker';
import { ImpactDashboard } from '../ImpactDashboard';
import { AlgorithmExplainer } from '../AlgorithmExplainerModal';
import { CustomerSupportCenter } from '../support/CustomerSupportCenter';

// Modals
import { DonationModal } from '../DonationModal';
import { ClaimModal } from '../ClaimModal';
import { ListingDetailModal } from '../ListingDetailModal';

// Types & Utils
import { FoodDonation, RecipientHub, ClaimDetails } from '../../types/foodRescue';
import {
  loadDonations,
  loadSelectedHub,
  saveSelectedHubId,
  createNewDonation,
  claimDonation,
  markAsPickedUp,
  confirmDelivery,
  resetToDemoData
} from '../../utils/storage';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const AppShell: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [donations, setDonations] = useState<FoodDonation[]>(loadDonations);
  const [selectedHub, setSelectedHub] = useState<RecipientHub>(loadSelectedHub);
  const [filterUserOnly, setFilterUserOnly] = useState<boolean>(false);

  // Modals state
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimTargetDonation, setClaimTargetDonation] = useState<FoodDonation | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailTargetDonation, setDetailTargetDonation] = useState<FoodDonation | null>(null);

  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  if (!isAuthenticated || !currentUser) {
    return <LoginScreen />;
  }

  const handleSelectHub = (hub: RecipientHub) => {
    setSelectedHub(hub);
    saveSelectedHubId(hub.id);
    showToast(`Simulated recipient hub switched to "${hub.name}". Distances updated.`, 'info');
  };

  const handleResetDemo = () => {
    const fresh = resetToDemoData();
    setDonations(fresh);
    setFilterUserOnly(false);
    showToast('Reset to default demonstration scenarios.', 'info');
  };

  const handleCreateDonation = (
    data: Omit<FoodDonation, 'id' | 'createdAt' | 'status' | 'workflowHistory' | 'isSampleData'>
  ) => {
    if (currentUser.role !== 'donor' && currentUser.role !== 'super_admin') {
      showToast('Permission Denied: Only registered food donors can broadcast surplus food.', 'error');
      return;
    }
    try {
      const created = createNewDonation(data);
      const updated = loadDonations();
      setDonations(updated);
      showToast(`Surplus food "${created.title}" broadcast successfully!`, 'success');
      setCurrentTab('marketplace');
    } catch (err: any) {
      showToast(err.message || 'Failed to post donation', 'error');
    }
  };

  const handleOpenClaim = (donation: FoodDonation) => {
    if (currentUser.role !== 'ngo_recipient' && currentUser.role !== 'super_admin') {
      showToast('Claiming is reserved for verified recipient organizations (NGOs).', 'info');
      return;
    }
    setClaimTargetDonation(donation);
    setIsClaimModalOpen(true);
  };

  const handleConfirmClaim = (donationId: string, claim: ClaimDetails, actorName: string) => {
    if (currentUser.role !== 'ngo_recipient' && currentUser.role !== 'super_admin') {
      showToast('Permission Denied: Only verified recipient organizations (NGOs) are authorized to claim surplus food.', 'error');
      return;
    }
    try {
      const updated = claimDonation(donationId, claim, actorName);
      if (updated) {
        setDonations(loadDonations());
        if (detailTargetDonation?.id === donationId) {
          setDetailTargetDonation(updated);
        }
        showToast(`Donation claimed for ${claim.recipientOrg}. Assigned to active dispatch queue.`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to claim donation', 'error');
    }
  };

  const handleMarkPickedUp = (donationId: string, actorName: string, note?: string) => {
    if (
      currentUser.role !== 'volunteer' &&
      currentUser.role !== 'ngo_recipient' &&
      currentUser.role !== 'super_admin'
    ) {
      showToast('Permission Denied: Only courier runners, recipient agencies, or admins can update pickup status.', 'error');
      return;
    }
    try {
      const updated = markAsPickedUp(donationId, actorName, note);
      if (updated) {
        setDonations(loadDonations());
        if (detailTargetDonation?.id === donationId) {
          setDetailTargetDonation(updated);
        }
        showToast('Status updated to In Transit (Picked Up).', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update pickup status', 'error');
    }
  };

  const handleConfirmDelivery = (donationId: string, actorName: string, note?: string) => {
    if (
      currentUser.role !== 'volunteer' &&
      currentUser.role !== 'ngo_recipient' &&
      currentUser.role !== 'super_admin'
    ) {
      showToast('Permission Denied: Only authorized couriers, recipient agencies, or admins can confirm delivery.', 'error');
      return;
    }
    try {
      const updated = confirmDelivery(donationId, actorName, note);
      if (updated) {
        setDonations(loadDonations());
        if (detailTargetDonation?.id === donationId) {
          setDetailTargetDonation(updated);
        }
        showToast(
          `Delivery confirmed! +${updated.quantity.estimatedServings} portions added to Impact Dashboard.`,
          'success'
        );
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to confirm delivery', 'error');
    }
  };

  const handleViewDetails = (donation: FoodDonation) => {
    const current = donations.find(d => d.id === donation.id) || donation;
    setDetailTargetDonation(current);
    setIsDetailModalOpen(true);
  };

  const userCreatedCount = donations.filter(d => !d.isSampleData).length;

  const renderRoleDashboard = () => {
    switch (currentUser.role) {
      case 'super_admin':
        return <SuperAdminDashboard onNavigateToTab={setCurrentTab} />;
      case 'federation_admin':
        return <FederationAdminDashboard onNavigateToTab={setCurrentTab} />;
      case 'donor':
        return (
          <DonorDashboard
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
            onNavigateToTab={setCurrentTab}
          />
        );
      case 'ngo_recipient':
        return <NgoDashboard onNavigateToTab={setCurrentTab} />;
      case 'volunteer':
        return <VolunteerDashboard onNavigateToTab={setCurrentTab} />;
      default:
        return (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 text-center max-w-md mx-auto my-12">
            <h3 className="text-sm font-semibold text-rose-900 mb-1">Access Restricted: Unknown Role</h3>
            <p className="text-xs text-rose-700 mb-4">
              Your session contains an unrecognized stakeholder role. Please sign in with an accredited account.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-rose-800 text-white text-xs font-medium rounded-md hover:bg-rose-900"
            >
              Reset Session
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 flex flex-col font-sans">
      {/* Single Discreet Simulation Disclosure */}
      <SimulationNotice compact={true} />

      {/* Main Top Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Recipient Hub Toolbar */}
      <SampleDataBanner
        selectedHub={selectedHub}
        onSelectHub={handleSelectHub}
        onResetDemo={handleResetDemo}
        filterUserOnly={filterUserOnly}
        onToggleUserOnly={setFilterUserOnly}
        userCreatedCount={userCreatedCount}
      />

      {/* Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && renderRoleDashboard()}

        {currentTab === 'marketplace' && (
          <Marketplace
            donations={donations}
            selectedHub={selectedHub}
            onClaim={handleOpenClaim}
            onViewDetails={handleViewDetails}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
            onOpenAlgorithm={() => setIsAlgorithmModalOpen(true)}
            filterUserOnly={filterUserOnly}
            onNavigateTab={setCurrentTab}
          />
        )}

        {currentTab === 'logistics' && (
          <PickupTracker
            donations={donations}
            selectedHub={selectedHub}
            onViewDetails={handleViewDetails}
            onMarkPickedUp={handleMarkPickedUp}
            onConfirmDelivery={handleConfirmDelivery}
          />
        )}

        {currentTab === 'impact' && (
          <ImpactDashboard
            donations={donations}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentTab === 'support' && (
          <CustomerSupportCenter />
        )}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-stone-200 bg-white text-xs text-stone-500 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-semibold text-stone-700">WizerWaste</span>
            <span className="mx-2 text-stone-300">·</span>
            <span>Food Rescue &amp; Redistribution Operations</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span>Role-Based Prototype</span>
            <span className="text-stone-300">·</span>
            <span>Local Storage Persistence</span>
            <span className="text-stone-300">·</span>
            <span>UNEP &amp; FAO Standards</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DonationModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        onSubmit={handleCreateDonation}
      />

      <ClaimModal
        donation={claimTargetDonation}
        selectedHub={selectedHub}
        isOpen={isClaimModalOpen}
        onClose={() => {
          setIsClaimModalOpen(false);
          setClaimTargetDonation(null);
        }}
        onConfirmClaim={handleConfirmClaim}
      />

      <ListingDetailModal
        donation={detailTargetDonation}
        selectedHub={selectedHub}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailTargetDonation(null);
        }}
        onClaim={handleOpenClaim}
        onMarkPickedUp={handleMarkPickedUp}
        onConfirmDelivery={handleConfirmDelivery}
        onOpenAlgorithm={() => setIsAlgorithmModalOpen(true)}
      />

      <AlgorithmExplainer
        isOpen={isAlgorithmModalOpen}
        onClose={() => setIsAlgorithmModalOpen(false)}
        isModal={true}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-white border border-stone-200 text-xs text-stone-800 shadow-lg">
          {toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          )}
          <span className="font-medium">{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};
