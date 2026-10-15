import { SupportTicket, SupportCategory, TicketPriority, TicketStatus, SupportChatMessage, AuditLogEntry } from '../types/support';
import { UserProfile, UserRole } from '../types/auth';

const STORAGE_KEY_TICKETS = 'wizerwaste_support_tickets_v2';
const STORAGE_KEY_AUDIT = 'wizerwaste_audit_logs_v2';

function getInitialTickets(): SupportTicket[] {
  const now = Date.now();
  const hour = 3600 * 1000;

  return [
    {
      id: 'tkt-001',
      ticketNumber: 'WW-8491',
      category: 'Food Safety',
      priority: 'Urgent',
      status: 'In Progress',
      subject: 'Temperature concern during hot holding collection from banquet caterer',
      description: 'Hot vegetarian trays were measured at 57°C upon courier arrival, just below the 60°C threshold. Re-heating unit was deployed immediately. Need verification guidance before dinner distribution.',
      createdBy: {
        id: 'usr_donor_01',
        name: 'Chef Elena Rostova',
        email: 'elena@grandharborhotel.com',
        role: 'donor',
        organization: 'Grand Harbor Hotel & Catering',
        region: 'Metro Bay District (Northern Sector)'
      },
      federationRegion: 'Metro Bay District (Northern Sector)',
      createdAt: new Date(now - 3 * hour).toISOString(),
      updatedAt: new Date(now - 1 * hour).toISOString(),
      assignedAdmin: 'Marcus Sterling (Fed Admin)',
      messages: [
        {
          id: 'msg-01',
          senderId: 'usr_donor_01',
          senderName: 'Chef Elena Rostova',
          senderRole: 'donor',
          text: 'We noticed the temperature log dipped to 57°C for approx 15 minutes before pickup. The cambro hot boxes were re-heated to 72°C. Does the chapter require written re-temp clearance before service?',
          timestamp: new Date(now - 3 * hour).toISOString(),
          isStaffReply: false
        },
        {
          id: 'msg-02',
          senderId: 'usr_fed_01',
          senderName: 'Marcus Sterling (Fed Admin)',
          senderRole: 'federation_admin',
          text: 'Hello Elena. Under Metro Bay Chapter Rule 4.2, if corrective re-heating exceeded 74°C within 30 minutes, it is compliant for same-evening service. Please attach digital probe reading timestamp.',
          timestamp: new Date(now - 1 * hour).toISOString(),
          isStaffReply: true
        }
      ]
    },
    {
      id: 'tkt-002',
      ticketNumber: 'WW-8492',
      category: 'Pickup Issue',
      priority: 'High',
      status: 'Open',
      subject: 'Courier arrival gate locked at 1420 Folsom dock',
      description: 'Volunteer courier arrived with trailer at Verdant Harvest rear alley. Buzzer is unanswered and security roll gate is down. Driver is parked in loading zone.',
      createdBy: {
        id: 'usr_ngo_01',
        name: 'Rev. Jonathan Rivera',
        email: 'jonathan@stvincentdining.org',
        role: 'ngo_recipient',
        organization: "St. Vincent Community Dining Room",
        region: 'Metro Bay District (Northern Sector)'
      },
      federationRegion: 'Metro Bay District (Northern Sector)',
      createdAt: new Date(now - 45 * 60 * 1000).toISOString(),
      updatedAt: new Date(now - 45 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-03',
          senderId: 'usr_ngo_01',
          senderName: 'Rev. Jonathan Rivera',
          senderRole: 'ngo_recipient',
          text: 'Our volunteer courier Maya is waiting at Bay 2. Can dispatch alert the shift manager on duty?',
          timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
          isStaffReply: false
        }
      ]
    },
    {
      id: 'tkt-003',
      ticketNumber: 'WW-8490',
      category: 'Account Verification',
      priority: 'Normal',
      status: 'Resolved',
      subject: 'Annual food safety permit renewal certification uploaded',
      description: 'Updated City Health Inspector certificate #SF-8849-B valid through 2027.',
      createdBy: {
        id: 'usr_donor_02',
        name: 'Claire Moreau',
        email: 'orders@rustichearthbakes.com',
        role: 'donor',
        organization: 'Rustic Hearth Artisan Bakery',
        region: 'Metro Bay District (Northern Sector)'
      },
      federationRegion: 'Metro Bay District (Northern Sector)',
      createdAt: new Date(now - 24 * hour).toISOString(),
      updatedAt: new Date(now - 6 * hour).toISOString(),
      resolvedAt: new Date(now - 6 * hour).toISOString(),
      assignedAdmin: 'Marcus Sterling (Fed Admin)',
      messages: [
        {
          id: 'msg-04',
          senderId: 'usr_donor_02',
          senderName: 'Claire Moreau',
          senderRole: 'donor',
          text: 'Uploaded our updated bakery health permit certificate. Please verify our badge.',
          timestamp: new Date(now - 24 * hour).toISOString(),
          isStaffReply: false
        },
        {
          id: 'msg-05',
          senderId: 'usr_fed_01',
          senderName: 'Marcus Sterling (Fed Admin)',
          senderRole: 'federation_admin',
          text: 'Permit verified against municipal health registry. Badge renewed through October 2027.',
          timestamp: new Date(now - 6 * hour).toISOString(),
          isStaffReply: true
        }
      ]
    },
    {
      id: 'tkt-004',
      ticketNumber: 'WW-8488',
      category: 'Suspicious User',
      priority: 'Urgent',
      status: 'Open',
      subject: 'Unverified vehicle claiming surplus under Eastside Mutual Aid credentials',
      description: 'An unidentified private unmarked pickup truck attempted to collect 4 crates of produce without standard WizerWaste digital QR claim pass in Eastside District.',
      createdBy: {
        id: 'usr_donor_east',
        name: 'David Chen',
        email: 'dchen@bayviewprovisions.com',
        role: 'donor',
        organization: 'Bayview Provisions',
        region: 'Eastside District (Eastern Sector)'
      },
      federationRegion: 'Eastside District (Eastern Sector)',
      createdAt: new Date(now - 2 * hour).toISOString(),
      updatedAt: new Date(now - 2 * hour).toISOString(),
      messages: [
        {
          id: 'msg-06',
          senderId: 'usr_donor_east',
          senderName: 'David Chen',
          senderRole: 'donor',
          text: 'Vehicle license plate noted as 7XYZ99. Provider staff turned them away until verified.',
          timestamp: new Date(now - 2 * hour).toISOString(),
          isStaffReply: false
        }
      ]
    }
  ];
}

function getInitialAuditLogs(): AuditLogEntry[] {
  const now = Date.now();
  const hour = 3600 * 1000;

  return [
    {
      id: 'aud-001',
      timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
      event: 'DONOR_ACCREDITATION_APPROVED',
      actor: 'Marcus Sterling (Fed Admin)',
      target: 'The Grand Lotus Banquet Hall',
      status: 'verified',
      details: 'Annual health inspection permit SF-8849-B verified against city database.'
    },
    {
      id: 'aud-002',
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      event: 'SUPPORT_TICKET_CREATED',
      actor: 'Rev. Jonathan Rivera (NGO)',
      target: 'Ticket #WW-8492 (Pickup Issue)',
      status: 'investigating',
      details: 'Gate access delay at 1420 Folsom dock reported to regional dispatch.'
    },
    {
      id: 'aud-003',
      timestamp: new Date(now - 1 * hour).toISOString(),
      event: 'SUPPORT_TICKET_STAFF_RESPONSE',
      actor: 'Marcus Sterling (Fed Admin)',
      target: 'Ticket #WW-8491 (Food Safety)',
      status: 'success',
      details: 'Official temperature guidance issued under Chapter Rule 4.2.'
    },
    {
      id: 'aud-004',
      timestamp: new Date(now - 2 * hour).toISOString(),
      event: 'SECURITY_FLAG_RAISED',
      actor: 'David Chen (Bayview Provisions)',
      target: 'Ticket #WW-8488 (Suspicious User)',
      status: 'investigating',
      details: 'Unverified pickup attempt reported in Eastside District.'
    },
    {
      id: 'aud-005',
      timestamp: new Date(now - 6 * hour).toISOString(),
      event: 'SUPPORT_TICKET_RESOLVED',
      actor: 'Marcus Sterling (Fed Admin)',
      target: 'Ticket #WW-8490 (Account Verification)',
      status: 'resolved',
      details: 'Bakery commercial permit approved and accredited.'
    }
  ];
}

function deduplicateTickets(items: SupportTicket[]): SupportTicket[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function deduplicateAuditLogs(items: AuditLogEntry[]): AuditLogEntry[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (!item || !item.id || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function loadSupportTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TICKETS);
    if (!raw) {
      const initial = deduplicateTickets(getInitialTickets());
      saveSupportTickets(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return deduplicateTickets(parsed);
    }
    const initial = deduplicateTickets(getInitialTickets());
    saveSupportTickets(initial);
    return initial;
  } catch (err) {
    console.error('Failed to load support tickets:', err);
    const initial = deduplicateTickets(getInitialTickets());
    saveSupportTickets(initial);
    return initial;
  }
}

export function saveSupportTickets(tickets: SupportTicket[]): void {
  try {
    const deduplicated = deduplicateTickets(tickets);
    localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(deduplicated));
  } catch (err) {
    console.error('Failed to save support tickets:', err);
  }
}

export function loadAuditLogs(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
    if (!raw) {
      const initial = deduplicateAuditLogs(getInitialAuditLogs());
      saveAuditLogs(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return deduplicateAuditLogs(parsed);
    }
    const initial = deduplicateAuditLogs(getInitialAuditLogs());
    saveAuditLogs(initial);
    return initial;
  } catch (err) {
    console.error('Failed to load audit logs:', err);
    const initial = deduplicateAuditLogs(getInitialAuditLogs());
    saveAuditLogs(initial);
    return initial;
  }
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  try {
    const deduplicated = deduplicateAuditLogs(logs);
    localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(deduplicated));
  } catch (err) {
    console.error('Failed to save audit logs:', err);
  }
}

export function addAuditLogEntry(
  event: string,
  actor: string,
  target: string,
  status: 'verified' | 'success' | 'published' | 'investigating' | 'resolved',
  details?: string,
  actorId?: string
): void {
  const current = loadAuditLogs();
  const newEntry: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    event,
    actor,
    actorId,
    target,
    status,
    details
  };
  saveAuditLogs([newEntry, ...current]);
}

export function createSupportTicket(
  category: SupportCategory,
  priority: TicketPriority,
  subject: string,
  description: string,
  user: UserProfile
): SupportTicket {
  if (!subject || !subject.trim()) {
    throw new Error('Ticket subject is required.');
  }
  if (!description || !description.trim()) {
    throw new Error('Ticket description is required.');
  }
  if (!user || !user.id) {
    throw new Error('Valid authenticated user profile is required to open a support ticket.');
  }

  const current = loadSupportTickets();
  const ticketNumber = `WW-${Math.floor(1000 + Math.random() * 9000)}`;
  const nowIso = new Date().toISOString();

  const newTicket: SupportTicket = {
    id: `tkt-${Date.now()}`,
    ticketNumber,
    category,
    priority,
    status: 'Open',
    subject: subject.trim(),
    description: description.trim(),
    createdBy: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      region: user.region
    },
    federationRegion: user.region && (user.region.includes('District') || user.region.includes('Sector'))
      ? user.region
      : 'Metro Bay District (Northern Sector)',
    createdAt: nowIso,
    updatedAt: nowIso,
    messages: [
      {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        text: description.trim(),
        timestamp: nowIso,
        isStaffReply: false
      }
    ]
  };

  saveSupportTickets([newTicket, ...current]);

  // Structured audit entry with actorId
  addAuditLogEntry(
    'SUPPORT_TICKET_CREATED',
    `${user.name} (${user.organization})`,
    `Ticket #${ticketNumber} (${category})`,
    'investigating',
    `Priority: ${priority} | Subject: ${subject}`,
    user.id
  );

  return newTicket;
}

export function addMessageToTicket(
  ticketId: string,
  text: string,
  user: UserProfile,
  isStaff: boolean
): SupportTicket | null {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error('Message text cannot be blank.');
  }

  const current = loadSupportTickets();
  const index = current.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  const target = current[index];

  // Role & Authorization Checks
  const isSuperAdmin = user.role === 'super_admin';
  const isFedAdmin = user.role === 'federation_admin';
  const isTicketOwner =
    target.createdBy.id === user.id ||
    (!!user.organization && target.createdBy.organization.toLowerCase() === user.organization.toLowerCase());

  if (isFedAdmin) {
    // Scoped strictly to Federation Admin's authorized regional chapter
    const userReg = user.region.toLowerCase();
    const targetReg = target.federationRegion.toLowerCase();
    const isRegionalMatch = userReg === targetReg || (userReg.includes('metro bay') && targetReg.includes('metro bay'));
    if (!isRegionalMatch) {
      throw new Error(`Unauthorized: Federation Admin (${user.name}) cannot participate in tickets outside their regional chapter.`);
    }
  } else if (!isSuperAdmin && !isTicketOwner) {
    throw new Error('Unauthorized: You cannot access or reply to another organization\'s support ticket.');
  }

  // Prevent client-side caller from falsifying staff status
  const actualIsStaff = (isSuperAdmin || isFedAdmin) && isStaff;

  const nowIso = new Date().toISOString();
  const newMessage: SupportChatMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    text: trimmed,
    timestamp: nowIso,
    isStaffReply: actualIsStaff
  };

  const updatedTicket: SupportTicket = {
    ...target,
    updatedAt: nowIso,
    status: actualIsStaff && target.status === 'Open' ? 'In Progress' : target.status,
    messages: [...target.messages, newMessage]
  };

  current[index] = updatedTicket;
  saveSupportTickets(current);

  // If staff response, record in audit trail
  if (actualIsStaff) {
    addAuditLogEntry(
      'SUPPORT_TICKET_STAFF_RESPONSE',
      `${user.name} (${user.role === 'super_admin' ? 'Super Admin' : 'Fed Admin'})`,
      `Ticket #${target.ticketNumber}`,
      'success',
      `Admin reply sent to ${target.createdBy.name}`,
      user.id
    );
  }

  return updatedTicket;
}

export function updateTicketStatus(
  ticketId: string,
  newStatus: TicketStatus,
  adminUser: UserProfile
): SupportTicket | null {
  // Enforce administrative role verification
  if (adminUser.role !== 'super_admin' && adminUser.role !== 'federation_admin') {
    throw new Error('Unauthorized: Only authorized administrators can update ticket status.');
  }

  const validStatuses: TicketStatus[] = ['Open', 'In Progress', 'Resolved'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error(`Invalid ticket status: "${newStatus}". Must be Open, In Progress, or Resolved.`);
  }

  const current = loadSupportTickets();
  const index = current.findIndex(t => t.id === ticketId);
  if (index === -1) return null;

  const target = current[index];

  // Enforce regional scope boundary for Federation Admins
  if (adminUser.role === 'federation_admin') {
    const adminReg = adminUser.region.toLowerCase();
    const targetReg = target.federationRegion.toLowerCase();
    const isAuthorized = adminReg === targetReg || (adminReg.includes('metro bay') && targetReg.includes('metro bay'));
    if (!isAuthorized) {
      throw new Error(`Unauthorized: Federation Admin cannot update tickets outside ${adminUser.region}. Ticket belongs to ${target.federationRegion}.`);
    }
  }

  const nowIso = new Date().toISOString();
  const updatedTicket: SupportTicket = {
    ...target,
    status: newStatus,
    updatedAt: nowIso,
    assignedAdmin: `${adminUser.name} (${adminUser.role === 'super_admin' ? 'Super Admin' : 'Fed Admin'})`,
    resolvedAt: newStatus === 'Resolved' ? nowIso : target.resolvedAt
  };

  current[index] = updatedTicket;
  saveSupportTickets(current);

  // Record status modification in structured audit trail
  addAuditLogEntry(
    newStatus === 'Resolved' ? 'SUPPORT_TICKET_RESOLVED' : 'SUPPORT_TICKET_STATUS_UPDATED',
    `${adminUser.name} (${adminUser.organization})`,
    `Ticket #${target.ticketNumber}`,
    newStatus === 'Resolved' ? 'resolved' : 'investigating',
    `Status updated from ${target.status} to ${newStatus}`,
    adminUser.id
  );

  return updatedTicket;
}

