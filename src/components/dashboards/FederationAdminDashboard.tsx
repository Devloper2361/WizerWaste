import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CheckCircle2, Check, X, LifeBuoy, AlertCircle, Info } from 'lucide-react';
import { addAuditLogEntry } from '../../utils/supportStorage';

interface FederationAdminDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

interface PendingDonor {
  id: string;
  name: string;
  type: string;
  address: string;
  permit: string;
  submittedAt: string;
  status: string;
}

const STORAGE_KEY_FED_DONORS = 'wizerwaste_fed_pending_donors_v1';
const STORAGE_KEY_FED_COUNT = 'wizerwaste_fed_verified_count_v1';

const INITIAL_PENDING_DONORS: PendingDonor[] = [
  {
    id: 'vd-01',
    name: 'Artisan Bagel Factory & Cafe',
    type: 'Bakery / Commercial Cafe',
    address: '410 Castro Street, Mission Sector',
    permit: 'Health Permit #SF-8849-B',
    submittedAt: 'Today, 08:30',
    status: 'pending_review'
  },
  {
    id: 'vd-02',
    name: 'Pacific Catch Seafood & Chowder',
    type: 'Full-Service Restaurant',
    address: '220 Embarcadero Pier 14',
    permit: 'Food Safety Cert #CA-9021',
    submittedAt: 'Yesterday, 16:45',
    status: 'pending_review'
  }
];

export const FederationAdminDashboard: React.FC<FederationAdminDashboardProps> = ({ onNavigateToTab }) => {
  const { currentUser } = useAuth();

  const [pendingDonors, setPendingDonors] = useState<PendingDonor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FED_DONORS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse fed pending donors');
    }
    return INITIAL_PENDING_DONORS;
  });

  const [verifiedCount, setVerifiedCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FED_COUNT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse fed count');
    }
    return 42;
  });

  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FED_DONORS, JSON.stringify(pendingDonors));
    } catch (e) {
      console.error(e);
    }
  }, [pendingDonors]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FED_COUNT, JSON.stringify(verifiedCount));
    } catch (e) {
      console.error(e);
    }
  }, [verifiedCount]);

  const handleApprove = (donor: PendingDonor) => {
    if (!currentUser || (currentUser.role !== 'federation_admin' && currentUser.role !== 'super_admin')) {
      setFeedback('Permission Denied: Only authorized Federation or Super Admins can accredit donors.');
      setTimeout(() => setFeedback(''), 4500);
      return;
    }

    setPendingDonors((prev) => prev.filter((d) => d.id !== donor.id));
    setVerifiedCount((prev: number) => prev + 1);

    addAuditLogEntry(
      'DONOR_ACCREDITATION_APPROVED',
      `${currentUser.name} (${currentUser.organization})`,
      donor.name,
      'verified',
      `Commercial health permit ${donor.permit} audited and accredited for surplus broadcast.`,
      currentUser.id
    );
    setFeedback(`Accredited "${donor.name}". Security audit log record generated.`);
    setTimeout(() => setFeedback(''), 4500);
  };

  const handleReject = (donor: PendingDonor) => {
    if (!currentUser || (currentUser.role !== 'federation_admin' && currentUser.role !== 'super_admin')) {
      setFeedback('Permission Denied: Only authorized Federation or Super Admins can reject donor accreditation.');
      setTimeout(() => setFeedback(''), 4500);
      return;
    }

    setPendingDonors((prev) => prev.filter((d) => d.id !== donor.id));

    addAuditLogEntry(
      'DONOR_ACCREDITATION_REJECTED',
      `${currentUser.name} (${currentUser.organization})`,
      donor.name,
      'investigating',
      `Health permit inspection ${donor.permit} flagged for additional safety audit and resubmission.`,
      currentUser.id
    );
    setFeedback(`Flagged "${donor.name}" for permit resubmission. Audit entry logged.`);
    setTimeout(() => setFeedback(''), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium">
              Federation Chapter Admin
            </span>
            <span className="text-xs text-stone-500">· {currentUser?.organization}</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Regional Operations Desk: {currentUser?.region}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Donor accreditation review, local relief center distribution capacity, and chapter announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('support')}
            icon={<LifeBuoy className="w-3.5 h-3.5" />}
          >
            Support Desk
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('logistics')}
          >
            Regional Logistics
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToTab('marketplace')}
          >
            Review Surplus Feed
          </Button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Regional KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Accredited Donors</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            {verifiedCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Verified commercial kitchens</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Pending Verifications</span>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
            {pendingDonors.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting permit audit</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Affiliated Pantries</span>
          <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
            18
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Active receiving centers</p>
        </Card>

        <Card padding="sm">
          <span className="text-xs text-stone-500 block mb-1 font-medium">Couriers on Duty</span>
          <div className="text-2xl font-bold font-mono text-emerald-800 tabular-nums">
            29
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Ready for dispatch</p>
        </Card>
      </div>

      {/* 2-Column Split: Donor Verification Queue & Chapter Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donor Verification Queue */}
        <Card
          title="Donor Verification Queue"
          subtitle="Review commercial food permits before granting surplus broadcast access"
          headerAction={
            <Badge variant={pendingDonors.length > 0 ? 'warning' : 'neutral'}>
              {pendingDonors.length} Pending
            </Badge>
          }
        >
          {pendingDonors.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-800 mx-auto mb-2" />
              <span>All regional donor applications are currently reviewed and up to date.</span>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {pendingDonors.map((donor) => (
                <div
                  key={donor.id}
                  className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-stone-900">{donor.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        {donor.type} · {donor.address}
                      </p>
                    </div>
                    <Badge variant="warning" size="sm">
                      Audit Required
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/80">
                    <span className="font-mono text-stone-700">{donor.permit}</span>
                    <span>Submitted {donor.submittedAt}</span>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReject(donor)}
                    >
                      <X className="w-3 h-3 mr-1 text-stone-400" />
                      <span>Flag for Re-Audit</span>
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(donor)}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      <span>Approve Accreditation</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Chapter Announcements */}
        <Card
          title="Regional Federation Announcements"
          subtitle="Broadcast guidance and cold-chain safety policies to chapter members"
          headerAction={
            <span className="text-[11px] text-stone-500">
              Module 8
            </span>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  High Heat Operational Protocol: Chilled Holding Rule
                </span>
                <Badge variant="warning" size="sm">
                  Active Notice
                </Badge>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                With afternoon temperatures reaching 31°C, all volunteer couriers must use insulated thermal bags with cold ice blankets for prepared dairy and cooked protein items.
              </p>
              <div className="text-[10px] text-stone-400 pt-1">
                Issued by Marcus Sterling · Effective Metro-Wide
              </div>
            </div>

            <div className="p-3 bg-stone-50/70 rounded-md border border-stone-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900">
                  Weekend Relief Center Capacity Advisory
                </span>
                <Badge variant="info" size="sm">
                  Logistics Update
                </Badge>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                St. Vincent Community Dining has expanded dinner service capacity to 250 meals tonight. Prioritize routing large banquet trays to Mission District distribution.
              </p>
              <div className="text-[10px] text-stone-400 pt-1">
                Issued 3 hours ago · Food Dispatch Desk
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
