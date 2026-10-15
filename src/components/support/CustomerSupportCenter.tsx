import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  SupportTicket,
  SupportCategory,
  TicketPriority,
  TicketStatus
} from '../../types/support';
import {
  loadSupportTickets,
  createSupportTicket,
  addMessageToTicket,
  updateTicketStatus
} from '../../utils/supportStorage';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  LifeBuoy,
  ShieldAlert,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  CheckCircle2,
  Filter,
  User,
  Building,
  Info,
  Check,
  Search
} from 'lucide-react';

export const CustomerSupportCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Filter state for admins
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [adminCategoryFilter, setAdminCategoryFilter] = useState<string>('all');
  const [adminRegionFilter, setAdminRegionFilter] = useState<string>('all');

  // New ticket form state
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [category, setCategory] = useState<SupportCategory>('Food Safety');
  const [priority, setPriority] = useState<TicketPriority>('Normal');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Chat message input
  const [replyText, setReplyText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'federation_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isFedAdmin = currentUser?.role === 'federation_admin';

  useEffect(() => {
    const loaded = loadSupportTickets();
    setTickets(loaded);
    if (loaded.length > 0 && !selectedTicketId) {
      setSelectedTicketId(loaded[0].id);
    }
  }, []);

  const refreshTickets = (selectedId?: string) => {
    const fresh = loadSupportTickets();
    setTickets(fresh);
    if (selectedId) {
      setSelectedTicketId(selectedId);
    }
  };

  // Scoped tickets calculation based on authorization:
  // - Super Admin: access to all tickets across all federations
  // - Federation Admin: access ONLY to tickets in their regional federation
  // - Regular users (Donor, NGO, Volunteer): access to tickets created by their user or organization
  const visibleTickets = tickets.filter(t => {
    if (isSuperAdmin) {
      if (adminRegionFilter !== 'all' && t.federationRegion !== adminRegionFilter) return false;
      if (adminStatusFilter !== 'all' && t.status !== adminStatusFilter) return false;
      if (adminCategoryFilter !== 'all' && t.category !== adminCategoryFilter) return false;
      return true;
    }
    if (isFedAdmin) {
      // Scoped strictly to Federation Admin's authorized region
      const fedRegion = currentUser?.region || 'Metro Bay District (Northern Sector)';
      const isAuthorizedRegion = t.federationRegion.toLowerCase().includes('metro bay') ||
                                 t.federationRegion.toLowerCase() === fedRegion.toLowerCase();
      if (!isAuthorizedRegion) return false;

      if (adminStatusFilter !== 'all' && t.status !== adminStatusFilter) return false;
      if (adminCategoryFilter !== 'all' && t.category !== adminCategoryFilter) return false;
      return true;
    }
    // Standard user (Donor, NGO, Volunteer): view strictly their own tickets or tickets from their own organization
    return (
      t.createdBy.id === currentUser?.id ||
      (!!currentUser?.organization && t.createdBy.organization?.toLowerCase() === currentUser.organization.toLowerCase())
    );
  });

  const selectedTicket = visibleTickets.find(t => t.id === selectedTicketId) || visibleTickets[0] || null;

  // Scroll chat to bottom when selected ticket messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages?.length, selectedTicketId]);

  // Handle ticket creation
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Please enter a clear subject for your ticket.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide details regarding the issue or assistance needed.');
      return;
    }
    if (!currentUser) return;

    try {
      setFormError('');
      const newTicket = createSupportTicket(
        category,
        priority,
        subject.trim(),
        description.trim(),
        currentUser
      );

      refreshTickets(newTicket.id);
      setSubject('');
      setDescription('');
      setShowNewTicketForm(false);
      setFormSuccess(`Support ticket #${newTicket.ticketNumber} created successfully. Our dispatch desk will review your inquiry.`);
      setTimeout(() => setFormSuccess(''), 5000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to create ticket.');
    }
  };

  // Handle sending reply in chat
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket || !currentUser) return;

    try {
      setFormError('');
      const isStaff = isAdmin;
      const updated = addMessageToTicket(selectedTicket.id, replyText.trim(), currentUser, isStaff);
      if (updated) {
        setReplyText('');
        refreshTickets(updated.id);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to post message to ticket.');
    }
  };

  // Handle status update (Admins only)
  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket || !currentUser) return;
    try {
      setFormError('');
      const updated = updateTicketStatus(selectedTicket.id, newStatus, currentUser);
      if (updated) {
        refreshTickets(updated.id);
        setFormSuccess(`Ticket #${updated.ticketNumber} marked as ${newStatus}.`);
        setTimeout(() => setFormSuccess(''), 4000);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to update ticket status.');
    }
  };

  const getPriorityBadgeVariant = (p: TicketPriority) => {
    switch (p) {
      case 'Urgent':
        return 'danger';
      case 'High':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  const getStatusBadgeVariant = (s: TicketStatus) => {
    switch (s) {
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Emergency Safety Box — Strictly separated from ordinary customer support */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-semibold text-amber-950 text-xs">
              Emergency &amp; Food Safety Escalation Notice
            </h4>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              If you observe active food safety hazards, spoilage, or physical safety risks at a collection dock, do not serve the items.
              For critical health hazards, contact municipal health inspection or emergency response (911). WizerWaste Customer Support handles operational coordination, platform disputes, and account verification inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Simulation Disclosure & Scope */}
      <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-stone-800 block text-xs">
            Demonstration Support Center Notice
          </span>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            This customer support module operates on browser local storage persistence. Chat conversations and ticket histories are simulated for prototype demonstration and are not connected to a live customer service team or 24/7 emergency dispatchers.
          </p>
        </div>
      </div>

      {/* 3. Top Header */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 font-medium inline-flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-emerald-800" />
              <span>Customer Support Center</span>
            </span>
            {isAdmin ? (
              <span className="text-xs font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {isSuperAdmin ? 'Admin Dispatch Desk (Global View)' : 'Federation Chapter Desk (Scoped)'}
              </span>
            ) : (
              <span className="text-xs text-stone-500">
                Logged in as {currentUser?.name} ({currentUser?.organization})
              </span>
            )}
          </div>

          <h1 className="text-lg font-bold text-stone-900 tracking-tight">
            {isAdmin ? 'Administrative Support & Incident Desk' : 'Help & Operational Assistance'}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Submit inquiry tickets, track resolution status, and communicate with regional federation dispatchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isAdmin && (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setShowNewTicketForm(!showNewTicketForm);
                setFormSuccess('');
              }}
            >
              {showNewTicketForm ? 'View My Tickets' : 'Open Support Ticket'}
            </Button>
          )}
          {isAdmin && (
            <div className="text-right text-xs text-stone-500">
              <span className="block font-medium text-stone-800">
                {visibleTickets.length} Tickets in Scope
              </span>
              <span className="text-[11px] text-stone-400">
                {isSuperAdmin ? 'All Chapters' : currentUser?.region}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback alerts */}
      {formSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* 3. New Ticket Creation Form (Collapsible / Modal) */}
      {showNewTicketForm && !isAdmin && (
        <Card
          title="Submit a Support Request or Incident Report"
          subtitle="All inquiries are routed to your local federation administrator for review"
        >
          <form onSubmit={handleCreateTicket} className="space-y-4 text-xs text-stone-700">
            {formError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Inquiry Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportCategory)}
                  className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none focus:border-stone-400"
                >
                  <option value="Food Safety">Food Safety (Temperature / Quality / Labeling)</option>
                  <option value="Suspicious User">Suspicious User (Unverified Vehicle / Bad Faith)</option>
                  <option value="Pickup Issue">Pickup Issue (Locked Gate / No-Show / Delay)</option>
                  <option value="Account Verification">Account Verification (Permit / Registration)</option>
                  <option value="Expense Issue">Expense Issue (Packaging / Deductions)</option>
                  <option value="Other">Other General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Priority Urgency *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TicketPriority)}
                  className="w-full bg-white border border-stone-200 text-stone-900 rounded-md px-3 py-2 focus:outline-none focus:border-stone-400"
                >
                  <option value="Normal">Normal — Standard operational inquiry</option>
                  <option value="High">High — Pickup or donor access blocker today</option>
                  <option value="Urgent">Urgent — Immediate holding safety or suspicious attempt</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Subject Summary *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the inquiry or issue..."
                className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-400"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">
                Detailed Description &amp; Context *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include batch ID, timing, location, addresses, and relevant temperature checks if applicable..."
                className="w-full bg-white border border-stone-200 rounded-md px-3 py-2 text-stone-900 text-xs focus:outline-none focus:border-stone-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowNewTicketForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Support Request
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 4. Support Workspace: Master-Detail List & Conversation Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Tickets Queue (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Admin filters */}
          {isAdmin && (
            <div className="bg-white border border-stone-200 rounded-lg p-3 space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-800 text-xs flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-stone-500" />
                  <span>Queue Scope Filters</span>
                </span>
                {isFedAdmin && (
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-mono">
                    Scoped: Metro Bay Only
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-500 text-[10px] uppercase font-medium mb-0.5">Status:</label>
                  <select
                    value={adminStatusFilter}
                    onChange={(e) => setAdminStatusFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded px-2 py-1 text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-500 text-[10px] uppercase font-medium mb-0.5">Category:</label>
                  <select
                    value={adminCategoryFilter}
                    onChange={(e) => setAdminCategoryFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded px-2 py-1 text-xs"
                  >
                    <option value="all">All Categories</option>
                    <option value="Food Safety">Food Safety</option>
                    <option value="Suspicious User">Suspicious User</option>
                    <option value="Pickup Issue">Pickup Issue</option>
                    <option value="Account Verification">Account Verification</option>
                    <option value="Expense Issue">Expense Issue</option>
                  </select>
                </div>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-stone-500 text-[10px] uppercase font-medium mb-0.5">Federation Region:</label>
                  <select
                    value={adminRegionFilter}
                    onChange={(e) => setAdminRegionFilter(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded px-2 py-1 text-xs"
                  >
                    <option value="all">All Regional Federations (Global)</option>
                    <option value="Metro Bay District (Northern Sector)">Metro Bay District (Northern Sector)</option>
                    <option value="Eastside District (Eastern Sector)">Eastside District (Eastern Sector)</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Ticket items list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>{isAdmin ? 'Tickets Requiring Review' : 'My Support Inquiries'}</span>
              <span>{visibleTickets.length} total</span>
            </div>

            {visibleTickets.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-lg p-6 text-center text-xs text-stone-400">
                No tickets matching current filters.
              </div>
            ) : (
              visibleTickets.map((ticket) => {
                const isSelected = ticket.id === selectedTicket?.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer text-xs space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-stone-500 font-medium text-[11px]">
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-stone-300">·</span>
                        <span className="font-semibold text-stone-800 text-xs">
                          {ticket.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant={getPriorityBadgeVariant(ticket.priority)} size="sm">
                          {ticket.priority}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(ticket.status)} size="sm">
                          {ticket.status}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="font-medium text-stone-900 line-clamp-1 text-xs">
                      {ticket.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                      <span className="truncate max-w-[200px]">
                        {ticket.createdBy.name} · {ticket.createdBy.organization}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400 shrink-0">
                        {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Ticket Conversation & Resolution Controls (7 cols on desktop) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white border border-stone-200 rounded-lg shadow-xs flex flex-col min-h-[580px]">
              {/* Ticket details header */}
              <div className="p-4 sm:p-5 border-b border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                      {selectedTicket.ticketNumber}
                    </span>
                    <Badge variant={getPriorityBadgeVariant(selectedTicket.priority)} size="md">
                      {selectedTicket.priority} Priority
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(selectedTicket.status)} size="md">
                      {selectedTicket.status}
                    </Badge>
                  </div>

                  {/* Status changer for authorized admins */}
                  {isAdmin && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-stone-500 font-medium">Update Status:</span>
                      <select
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                        className="bg-stone-50 border border-stone-200 text-stone-900 text-xs rounded px-2 py-1 font-medium focus:outline-none"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-stone-900">
                    {selectedTicket.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 mt-1">
                    <span>Category: <strong className="text-stone-700">{selectedTicket.category}</strong></span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>Region: <strong className="text-stone-700">{selectedTicket.federationRegion}</strong></span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span>Created: {new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Creator card */}
                <div className="bg-[#fbfbfa] p-2.5 rounded-md border border-stone-200 text-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-medium block">Initiated By:</span>
                    <strong className="text-stone-900">{selectedTicket.createdBy.name}</strong>{' '}
                    <span className="text-stone-500">({selectedTicket.createdBy.organization})</span>
                  </div>
                  <span className="text-stone-500 text-[11px]">{selectedTicket.createdBy.email}</span>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 max-h-[380px] bg-[#faf9f6]/40">
                {selectedTicket.messages.map((msg) => {
                  const isCurrentAuthor = msg.senderId === currentUser?.id;
                  const isStaff = msg.isStaffReply;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCurrentAuthor ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-1 px-1">
                        <span className="font-medium text-stone-700">{msg.senderName}</span>
                        {isStaff && (
                          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-1 py-0.2 rounded font-semibold text-[9px]">
                            Staff
                          </span>
                        )}
                        <span>·</span>
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-md p-3 rounded-lg text-xs leading-relaxed ${
                          isStaff
                            ? 'bg-emerald-900 text-white shadow-2xs'
                            : isCurrentAuthor
                            ? 'bg-stone-800 text-white shadow-2xs'
                            : 'bg-white border border-stone-200 text-stone-800 shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Reply Input Form */}
              <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-stone-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={
                      isAdmin
                        ? 'Write official administrative dispatch reply...'
                        : 'Send a message or reply to this ticket...'
                    }
                    className="flex-1 bg-[#fbfbfa] border border-stone-200 rounded-md px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-stone-400"
                  />
                  <Button type="submit" variant="primary" size="md" icon={<Send className="w-3.5 h-3.5" />}>
                    <span>Send</span>
                  </Button>
                </div>
                <p className="text-[10px] text-stone-400 mt-1.5 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>Prototype chat messages persist in browser local storage and are timestamped automatically.</span>
                </p>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-lg p-12 text-center text-xs text-stone-400 shadow-xs">
              Select a support ticket from the list to view the conversation history and resolution actions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
