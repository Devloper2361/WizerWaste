import { UserRole } from './auth';

export type SupportCategory =
  | 'Food Safety'
  | 'Suspicious User'
  | 'Pickup Issue'
  | 'Account Verification'
  | 'Expense Issue'
  | 'Other';

export type TicketPriority = 'Normal' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export interface SupportChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isStaffReply?: boolean;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: SupportCategory;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  description: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    organization: string;
    region: string;
  };
  federationRegion: string;
  createdAt: string;
  updatedAt: string;
  messages: SupportChatMessage[];
  resolvedAt?: string;
  assignedAdmin?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  actorId?: string;
  target: string;
  status: 'verified' | 'success' | 'published' | 'investigating' | 'resolved';
  details?: string;
}
