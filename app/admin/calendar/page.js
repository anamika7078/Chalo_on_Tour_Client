'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { Calendar, Bell, DollarSign, ArrowRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const [followupReminders, setFollowupReminders] = useState([]);
  const [paymentReminders, setPaymentReminders] = useState([]);
  const [tripReminders, setTripReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('trip'); // 'trip' | 'payment' | 'advance'
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [search, setSearch] = useState('');

  useEffect(() => {
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
  }, [user, authLoading, days]);

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

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-primary-900">Reminders</h1>
          <div className="flex items-center gap-2">
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
                        <Link
                          href={`/admin/leads/${r.leadId}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 flex-shrink-0"
                        >
                          Open <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
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
                            <Link
                              href={`/admin/leads/${r.leadId}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 flex-shrink-0"
                            >
                              Open <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
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
                            <Link
                              href={`/admin/leads/${r.leadId}`}
                              className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 flex-shrink-0"
                            >
                              Open <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
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
                              <Link
                                href={`/admin/leads/${r.leadId}`}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 flex-shrink-0"
                              >
                                Open <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
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
    </DashboardLayout>
  );
}
