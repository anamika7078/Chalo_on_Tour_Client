'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { Calendar, Bell, DollarSign, ArrowRight, Clock, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

const getTodayDateString = () => new Date().toISOString().slice(0, 10);

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const [followupReminders, setFollowupReminders] = useState([]);
  const [paymentReminders, setPaymentReminders] = useState([]);
  const [tripReminders, setTripReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('trip'); // 'trip' | 'payment' | 'advance'
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [search, setSearch] = useState('');
  const [showSetReminderModal, setShowSetReminderModal] = useState(false);
  const [leadOptions, setLeadOptions] = useState([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [loadingLeadOptions, setLoadingLeadOptions] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    leadId: '',
    date: getTodayDateString(),
    note: '',
  });

  const todayDate = getTodayDateString();

  const loadReminders = () => {
    if (!user || authLoading) return;
    setLoading(true);
    api
      .get('/leads/reminders', { params: { days } })
      .then((r) => {
        setFollowupReminders(r.data.followupReminders || []);
        setPaymentReminders(r.data.paymentReminders || []);
        setTripReminders(r.data.tripReminders || []);
      })
      .catch(() => {
        toast.error('Failed to load reminders');
        setFollowupReminders([]);
        setPaymentReminders([]);
        setTripReminders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReminders();
  }, [user, authLoading, days]);

  useEffect(() => {
    if (!showSetReminderModal || !user || authLoading) return;
    setLoadingLeadOptions(true);
    api
      .get('/leads', { params: { limit: 500, recent: 1 } })
      .then((r) => setLeadOptions(r.data.leads || []))
      .catch(() => {
        toast.error('Failed to load leads');
        setLeadOptions([]);
      })
      .finally(() => setLoadingLeadOptions(false));
  }, [showSetReminderModal, user, authLoading]);

  if (authLoading || !user) return null;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatCurrency = (n) => (n != null && !Number.isNaN(Number(n)) ? `₹${Number(n).toLocaleString('en-IN')}` : '–');

  const matchesSearch = (item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const fields = [
      item.leadName,
      item.leadCode,
      item.destination,
      item.note,
      item.payment_status
    ];
    return fields.some((f) => f && String(f).toLowerCase().includes(q));
  };

  const filteredFollowups = followupReminders.filter(matchesSearch);
  const filteredTrips = tripReminders.filter(matchesSearch);
  const filteredPayments = paymentReminders.filter(matchesSearch);
  const filteredLeadOptions = !leadSearch.trim()
    ? leadOptions
    : leadOptions.filter((lead) => {
        const query = leadSearch.trim().toLowerCase();
        const fields = [lead.name, lead.leadId, lead.destination, lead.email, lead.phone];
        return fields.some((field) => field && String(field).toLowerCase().includes(query));
      });
  const selectedLead = leadOptions.find((lead) => lead._id === reminderForm.leadId) || null;

  const resetReminderForm = () => {
    setReminderForm({
      leadId: '',
      date: getTodayDateString(),
      note: '',
    });
    setLeadSearch('');
  };

  const openSetReminderModal = (prefill = {}) => {
    setReminderForm({
      leadId: prefill.leadId || '',
      date: getTodayDateString(),
      note: prefill.note || '',
    });
    setLeadSearch('');
    setShowSetReminderModal(true);
  };

  const closeSetReminderModal = () => {
    if (savingReminder) return;
    setShowSetReminderModal(false);
    resetReminderForm();
  };

  const handleReminderFieldChange = (field, value) => {
    setReminderForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetReminder = async (e) => {
    e.preventDefault();
    if (!reminderForm.leadId) {
      toast.error('Please select a lead');
      return;
    }
    if (!reminderForm.date) {
      toast.error('Please select a reminder date');
      return;
    }
    if (reminderForm.date < todayDate) {
      toast.error('Previous dates are not allowed');
      return;
    }

    setSavingReminder(true);
    try {
      const leadResponse = await api.get(`/leads/${reminderForm.leadId}`);
      const existingFollowups = Array.isArray(leadResponse.data?.lead?.followups) ? leadResponse.data.lead.followups : [];
      const nextFollowups = [
        ...existingFollowups,
        {
          date: reminderForm.date,
          note: reminderForm.note.trim() || 'Reminder',
        },
      ].sort((a, b) => new Date(a.date) - new Date(b.date));

      await api.put(`/leads/${reminderForm.leadId}`, { followups: nextFollowups });
      toast.success('Reminder set successfully');
      setShowSetReminderModal(false);
      resetReminderForm();
      loadReminders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set reminder');
    } finally {
      setSavingReminder(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-primary-900">Reminders</h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openSetReminderModal()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Set Reminder
            </button>
            <label className="text-sm text-gray-600">Next</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-6">
            {/* Follow-up reminders (calendar) */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
              <div className="flex-shrink-0 px-4 py-2.5 border-b border-gray-100 bg-gradient-to-r from-primary-50/80 to-transparent space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-primary-900">Upcoming follow-ups</h2>
                    <p className="text-xs text-gray-500">By date</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search follow-ups by name, lead ID, destination..."
                  className="w-full rounded-lg border border-primary-100 px-3 py-1.5 text-xs text-gray-700 bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div className="p-4">
                {filteredFollowups.length > 0 && (
                  <ul className="space-y-3">
                    {filteredFollowups.map((r, i) => (
                      <li key={`${r.leadId}-${r.date}-${i}`} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50">
                        <Clock className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-primary-900">{formatDate(r.date)}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{r.note || 'Follow-up'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {r.leadName}
                            {r.leadCode && ` (${r.leadCode})`}
                            {r.destination && ` · ${r.destination}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => openSetReminderModal({ leadId: r.leadId, note: r.note || 'Follow-up' })}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            Set Reminder
                          </button>
                          <Link
                            href={`/admin/leads/${r.leadId}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                          >
                            Open <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Tabs for trip / payment / advance reminders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-card overflow-hidden">
              <div className="flex-shrink-0 px-4 pt-3 border-b border-gray-100 bg-gray-50/60">
                <div className="inline-flex rounded-full bg-white border border-gray-200 p-0.5 text-xs font-medium text-gray-600">
                  <button
                    type="button"
                    onClick={() => setActiveTab('trip')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                      activeTab === 'trip' ? 'bg-primary-600 text-white shadow-sm' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Tour reminders
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('payment')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                      activeTab === 'payment' ? 'bg-accent-600 text-white shadow-sm' : 'hover:bg-gray-50'
                    }`}
                  >
                    <DollarSign className="h-3.5 w-3.5" />
                    Payment reminders
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('advance')}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${
                      activeTab === 'advance' ? 'bg-indigo-600 text-white shadow-sm' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                    Advance reminders
                  </button>
                </div>
              </div>

              {/* Tab content */}
              <div className="p-4 space-y-4">
                {activeTab === 'trip' && (
                  <div>
                    <h2 className="text-sm font-semibold text-primary-900 mb-1">Trip reminders</h2>
                    <p className="text-xs text-gray-500 mb-3">Upcoming tours (2 days before trip date)</p>
                    {filteredTrips.length === 0 ? (
                      <p className="text-gray-500 text-sm">No upcoming trip reminders in the next {days} days.</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredTrips.map((r, i) => (
                          <li
                            key={`${r.leadId}-${r.date}-${i}`}
                            className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50"
                          >
                            <Calendar className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-primary-900">
                                Reminder: {formatDate(r.date)}
                                {r.tripDate && ` · Trip: ${formatDate(r.tripDate)}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {r.leadName}
                                {r.leadCode && ` (${r.leadCode})`}
                                {r.destination && ` · ${r.destination}`}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Advance: {formatCurrency(r.advance_amount)} · Remaining:{' '}
                                {formatCurrency(r.remaining_amount)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => openSetReminderModal({ leadId: r.leadId, note: 'Trip follow-up' })}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                              >
                                Set Reminder
                              </button>
                              <Link
                                href={`/admin/leads/${r.leadId}`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                              >
                                Open <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-sm font-semibold text-primary-900 mb-1">Payment reminders</h2>
                    <p className="text-xs text-gray-500 mb-3">Advance / balance pending payments</p>
                    {filteredPayments.length === 0 ? (
                      <p className="text-gray-500 text-sm">No payment pending leads.</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredPayments.map((r) => (
                          <li
                            key={r.leadId}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50"
                          >
                            <DollarSign className="h-4 w-4 text-accent-600 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-primary-900">
                                {r.leadName} {r.leadCode && `(${r.leadCode})`}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Total: {formatCurrency(r.total_amount)} · Advance:{' '}
                                {formatCurrency(r.advance_amount)} · Remaining:{' '}
                                {formatCurrency(r.remaining_amount)} · {r.payment_status}
                              </p>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => openSetReminderModal({ leadId: r.leadId, note: 'Payment follow-up' })}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700"
                              >
                                Set Reminder
                              </button>
                              <Link
                                href={`/admin/leads/${r.leadId}`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                              >
                                Open <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeTab === 'advance' && (
                  <div>
                    <h2 className="text-sm font-semibold text-primary-900 mb-1">Advance reminders</h2>
                    <p className="text-xs text-gray-500 mb-3">Leads with advance amount recorded</p>
                    {filteredPayments.filter((r) => Number(r.advance_amount) > 0).length === 0 ? (
                      <p className="text-gray-500 text-sm">No leads with advance payments recorded.</p>
                    ) : (
                      <ul className="space-y-3">
                        {filteredPayments
                          .filter((r) => Number(r.advance_amount) > 0)
                          .map((r) => (
                            <li
                              key={r.leadId}
                              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50/50"
                            >
                              <Bell className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-primary-900">
                                  {r.leadName} {r.leadCode && `(${r.leadCode})`}
                                </p>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  Advance: {formatCurrency(r.advance_amount)} · Remaining:{' '}
                                  {formatCurrency(r.remaining_amount)} · {r.payment_status}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => openSetReminderModal({ leadId: r.leadId, note: 'Advance payment follow-up' })}
                                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                  Set Reminder
                                </button>
                                <Link
                                  href={`/admin/leads/${r.leadId}`}
                                  className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                                >
                                  Open <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {showSetReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-primary-900">Set Reminder</h2>
                <p className="text-sm text-gray-500">Choose a lead and reminder date.</p>
              </div>
              <button
                type="button"
                onClick={closeSetReminderModal}
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSetReminder} className="space-y-4 px-6 py-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Search Lead</label>
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search by name, lead ID, destination, phone..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Lead</label>
                <select
                  value={reminderForm.leadId}
                  onChange={(e) => handleReminderFieldChange('leadId', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  disabled={loadingLeadOptions}
                >
                  <option value="">{loadingLeadOptions ? 'Loading leads...' : 'Select a lead'}</option>
                  {filteredLeadOptions.map((lead) => (
                    <option key={lead._id} value={lead._id}>
                      {lead.name}
                      {lead.leadId ? ` (${lead.leadId})` : ''}
                      {lead.destination ? ` - ${lead.destination}` : ''}
                    </option>
                  ))}
                </select>
                {!loadingLeadOptions && leadSearch && filteredLeadOptions.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500">No leads found for this search.</p>
                )}
              </div>
              {selectedLead && (
                <div className="rounded-lg border border-primary-100 bg-primary-50/60 px-3 py-2 text-sm text-primary-900">
                  {selectedLead.name}
                  {selectedLead.leadId && ` (${selectedLead.leadId})`}
                  {selectedLead.destination && ` · ${selectedLead.destination}`}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Reminder Date</label>
                <input
                  type="date"
                  min={todayDate}
                  value={reminderForm.date}
                  onChange={(e) => handleReminderFieldChange('date', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                <textarea
                  value={reminderForm.note}
                  onChange={(e) => handleReminderFieldChange('note', e.target.value)}
                  rows={3}
                  placeholder="Add a short reminder note"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={closeSetReminderModal}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReminder}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
                >
                  {savingReminder ? 'Saving...' : 'Save Reminder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
