import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Shield, Users, Building, Activity, LifeBuoy } from 'lucide-react';
import { loadAuditLogs } from '../../utils/supportStorage';

interface SuperAdminDashboardProps {
  onNavigateToTab: (tab: string) => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onNavigateToTab }) => {
  const { currentUser } = useAuth();
  const recentAuditLogs = loadAuditLogs().slice(0, 5);

  const platformStats = [
    { label: 'Active Federations', value: '14', desc: 'Regional chapters across metro zones', icon: <Building className="w-4 h-4 text-emerald-800" /> },
    { label: 'Accredited Donors', value: '186', desc: 'Commercial kitchens & grocers', icon: <Users className="w-4 h-4 text-stone-600" /> },
    { label: 'Registered NGOs', value: '94', desc: 'Emergency pantries & shelters', icon: <Shield className="w-4 h-4 text-stone-600" /> },
    { label: 'Volunteer Couriers', value: '312', desc: 'Certified food runners on call', icon: <Activity className="w-4 h-4 text-stone-600" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Role Header Banner */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
              Super Admin Control Plane
            </span>
            <span className="text-xs text-stone-500">· Scope: Global Multi-Federation Oversight</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Platform Overview — {currentUser?.name}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            System governance, federation network status, security audit logs, and global policy controls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('support')}
            icon={<LifeBuoy className="w-3.5 h-3.5" />}
          >
            Support Queue
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateToTab('impact')}
          >
            Global Impact
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateToTab('marketplace')}
          >
            View Active Rescue Feed
          </Button>
        </div>
      </div>

      {/* Platform Health Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, i) => (
          <Card key={i} padding="sm">
            <div className="flex items-center justify-between text-stone-500 text-xs mb-1 font-medium">
              <span>{stat.label}</span>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
              {stat.value}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">{stat.desc}</p>
          </Card>
        ))}
      </div>

      {/* 2-Column Split: Federation Chapters & Security Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Federation Chapters */}
        <Card
          title="Regional Federation Chapters"
          subtitle="Autonomous regional chapters coordinating hyperlocal food rescue"
          headerAction={<Badge variant="success">14 Chapters</Badge>}
        >
          <div className="space-y-2 text-xs">
            {[
              { name: 'Metro Bay Rescue Federation', region: 'Northern Sector', admin: 'Marcus Sterling', activeRescues: 18, status: 'Nominal' },
              { name: 'Eastside Food Sovereignty Network', region: 'East District', admin: 'Devon Powell', activeRescues: 12, status: 'Nominal' },
              { name: 'Valley Community Dining Alliance', region: 'South Suburbs', admin: 'Elena Gomez', activeRescues: 9, status: 'High Demand' },
              { name: 'Harbor & Docklands Mutual Aid', region: 'Waterfront Zone', admin: 'Tariq Al-Mansoor', activeRescues: 6, status: 'Nominal' }
            ].map((fed, idx) => (
              <div
                key={idx}
                className="p-3 bg-stone-50/70 rounded-md border border-stone-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-semibold text-stone-900">{fed.name}</h4>
                  <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                    <span>{fed.region}</span>
                    <span aria-hidden="true">·</span>
                    <span>Admin: {fed.admin}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-emerald-900 font-semibold block text-xs">
                    {fed.activeRescues} active
                  </span>
                  <Badge variant={fed.status === 'Nominal' ? 'neutral' : 'warning'} size="sm">
                    {fed.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Structured Security Audit Log Preview */}
        <Card
          title="Platform Security Audit Log"
          subtitle="Simulated client ledger for prototype testing (production systems require tamper-proof remote append-only logs)"
          headerAction={
            <span className="text-[11px] text-stone-500">
              Module 10
            </span>
          }
        >
          <div className="space-y-2 text-xs">
            {recentAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 bg-stone-50/70 rounded-md border border-stone-200 flex items-start justify-between gap-3 text-[11px]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-stone-800">
                      {log.event}
                    </span>
                    <Badge variant="success" size="sm">
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-stone-500 truncate mt-0.5">
                    Actor: <span className="text-stone-700">{log.actor}</span> · Target: <span className="text-stone-700">{log.target}</span>
                  </p>
                </div>
                <span className="text-stone-400 whitespace-nowrap shrink-0 text-[10px] font-mono">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
