'use client';

import React, { useState } from 'react';
import { Plus, Eye, Pencil, Download, Trash2 } from 'lucide-react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';

const dummyInvoices = [
  {
    id: 'INV-001',
    clientName: 'John Doe',
    amount: 25000,
    status: 'Paid',
    date: '2026-03-01',
  },
  {
    id: 'INV-002',
    clientName: 'Acme Travels',
    amount: 48000,
    status: 'Pending',
    date: '2026-03-03',
  },
];

export default function InvoicesPage() {
  const { user, loading: authLoading } = useAuth();
  const [invoices, setInvoices] = useState(dummyInvoices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'view' | 'edit'
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [formData, setFormData] = useState({
    clientName: '',
    amount: '',
    status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setIsFormOpen(false);
    setFormData({
      clientName: '',
      amount: '',
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
    });
    setActiveInvoice(null);
    setModalMode('create');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === 'edit' && activeInvoice) {
      const updated = {
        ...activeInvoice,
        clientName: formData.clientName || 'Untitled Client',
        amount: Number(formData.amount) || 0,
        status: formData.status || 'Pending',
        date: formData.date,
      };
      setInvoices((prev) => prev.map((inv) => (inv.id === activeInvoice.id ? updated : inv)));
      resetForm();
      return;
    }

    // Create mode
    const newInvoice = {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: formData.clientName || 'Untitled Client',
      amount: Number(formData.amount) || 0,
      status: formData.status || 'Pending',
      date: formData.date,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    resetForm();
  };

  const openModalForInvoice = (invoice, mode) => {
    setActiveInvoice(invoice);
    setFormData({
      clientName: invoice.clientName,
      amount: String(invoice.amount ?? ''),
      status: invoice.status || 'Pending',
      date: invoice.date || new Date().toISOString().slice(0, 10),
    });
    setModalMode(mode);
    setIsFormOpen(true);
  };

  const handleView = (invoice) => {
    openModalForInvoice(invoice, 'view');
  };

  const handleEdit = (invoice) => {
    openModalForInvoice(invoice, 'edit');
  };

  const handleDownload = (invoice, type) => {
    alert(`Download ${type.toUpperCase()} for ${invoice.id} (hook this to backend later)`);
  };

  const handleDelete = (invoice) => {
    if (!window.confirm(`Delete invoice ${invoice.id}?`)) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoice.id));
  };

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden px-4 py-4 md:px-6 md:py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage all your invoices. Create a new invoice using the button on the right.
            </p>
          </div>
          <button
            onClick={() => {
              setModalMode('create');
              setActiveInvoice(null);
              setFormData({
                clientName: '',
                amount: '',
                status: 'Pending',
                date: new Date().toISOString().slice(0, 10),
              });
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          >
            <Plus className="h-4 w-4" />
            Create Invoice
          </button>
        </div>

        <div className="flex-1 min-h-0">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Invoice #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Client
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No invoices yet. Click &quot;Create Invoice&quot; to add your first one.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50/60">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                        {invoice.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                        {invoice.clientName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {invoice.date}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-gray-900">
                        ₹{invoice.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={
                            'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                            (invoice.status === 'Paid'
                              ? 'bg-green-50 text-green-700 ring-1 ring-green-100'
                              : invoice.status === 'Overdue'
                              ? 'bg-red-50 text-red-700 ring-1 ring-red-100'
                              : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100')
                          }
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleView(invoice)}
                            className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(invoice, 'pdf')}
                            className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(invoice, 'word')}
                            className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                            title="Download Word"
                          >
                            <Download className="h-4 w-4 rotate-90" />
                          </button>
                          <button
                            onClick={() => handleDelete(invoice)}
                            className="rounded-md border border-gray-200 bg-white p-1.5 text-red-500 hover:border-red-200 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isFormOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {modalMode === 'edit' && 'Edit Invoice'}
                  {modalMode === 'view' && 'Invoice Details'}
                  {modalMode === 'create' && 'Create Invoice'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Client name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Enter client name"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    disabled={modalMode === 'view'}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Enter amount"
                    min="0"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    disabled={modalMode === 'view'}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Invoice date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    disabled={modalMode === 'view'}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {modalMode === 'view' ? 'Close' : 'Cancel'}
                  </button>
                  {modalMode !== 'view' && (
                    <button
                      type="submit"
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                    >
                      {modalMode === 'edit' ? 'Save Changes' : 'Save Invoice'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

