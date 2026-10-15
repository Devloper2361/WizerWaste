export type UserRole =
  | 'super_admin'
  | 'federation_admin'
  | 'donor'
  | 'ngo_recipient'
  | 'volunteer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  organizationType?: string;
  region: string;
  avatarInitials: string;
  isVerified: boolean;
  rating?: number;
  completedRescuesCount?: number;
  phone?: string;
}

export interface RoleDefinition {
  role: UserRole;
  title: string;
  shortLabel: string;
  description: string;
  scope: string;
  demoUser: UserProfile;
}

export const PRESET_USERS: Record<UserRole, UserProfile> = {
  super_admin: {
    id: 'usr_super_01',
    name: 'Alexandra Wright',
    email: 'superadmin@wizerwaste.network',
    role: 'super_admin',
    organization: 'WizerWaste Global Secretariat',
    region: 'All Regions (Global Platform)',
    avatarInitials: 'AW',
    isVerified: true,
    phone: '+1 (555) 019-2831'
  },
  federation_admin: {
    id: 'usr_fed_01',
    name: 'Marcus Sterling',
    email: 'm.sterling@metro-rescue-fed.org',
    role: 'federation_admin',
    organization: 'Metro Bay Food Rescue Federation',
    region: 'Metro Bay District (Northern Sector)',
    avatarInitials: 'MS',
    isVerified: true,
    phone: '+1 (555) 018-9922'
  },
  donor: {
    id: 'usr_donor_01',
    name: 'Chef Elena Rostova',
    email: 'elena@grandharborhotel.com',
    role: 'donor',
    organization: 'Grand Harbor Hotel & Catering',
    organizationType: 'Commercial Hospitality & Banquets',
    region: 'Downtown Waterfront',
    avatarInitials: 'ER',
    isVerified: true,
    rating: 4.9,
    completedRescuesCount: 48,
    phone: '+1 (555) 014-3829'
  },
  ngo_recipient: {
    id: 'usr_ngo_01',
    name: 'Rev. Jonathan Rivera',
    email: 'jonathan@stvincentdining.org',
    role: 'ngo_recipient',
    organization: "St. Vincent Community Dining Room",
    organizationType: 'Community Dining & Emergency Pantry',
    region: 'Central Mission District',
    avatarInitials: 'JR',
    isVerified: true,
    rating: 5.0,
    completedRescuesCount: 112,
    phone: '+1 (555) 017-7741'
  },
  volunteer: {
    id: 'usr_vol_01',
    name: 'Maya Chen',
    email: 'maya.chen@rescuevolunteers.net',
    role: 'volunteer',
    organization: 'Wizer Community Couriers & Logistics',
    organizationType: 'Certified Cold-Chain Food Runner',
    region: 'Metro Central & South',
    avatarInitials: 'MC',
    isVerified: true,
    rating: 4.95,
    completedRescuesCount: 34,
    phone: '+1 (555) 012-4490'
  }
};

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    role: 'super_admin',
    title: 'Super Admin',
    shortLabel: 'Super Admin',
    description: 'System-wide governance, global policy settings, federation provisioning, and platform security audit logs.',
    scope: 'Global System Oversight',
    demoUser: PRESET_USERS.super_admin
  },
  {
    role: 'federation_admin',
    title: 'Federation Admin',
    shortLabel: 'Fed Admin',
    description: 'Regional food rescue federation coordination, donor verification queues, announcements, and dispute mediation.',
    scope: 'Regional Chapter Governance',
    demoUser: PRESET_USERS.federation_admin
  },
  {
    role: 'donor',
    title: 'Food Donor',
    shortLabel: 'Donor',
    description: 'Surplus food broadcast, pickup window coordination, verification profile, ratings, and food expense tracking.',
    scope: 'Establishment / Kitchen Operations',
    demoUser: PRESET_USERS.donor
  },
  {
    role: 'ngo_recipient',
    title: 'NGO / Recipient',
    shortLabel: 'NGO Recipient',
    description: 'Surplus discovery with Wizer RescueScore, capacity declaration, claim authorization, and impact reporting.',
    scope: 'Relief Center / Food Bank Distribution',
    demoUser: PRESET_USERS.ngo_recipient
  },
  {
    role: 'volunteer',
    title: 'Volunteer Runner',
    shortLabel: 'Volunteer',
    description: 'Hyperlocal transport dispatch, custody handover confirmation, food safety temperature checks, and delivery sign-offs.',
    scope: 'Field Logistics & Transportation',
    demoUser: PRESET_USERS.volunteer
  }
];
