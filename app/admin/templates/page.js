'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/Layout/DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import Link from 'next/link';
import { Package, Plus, Pencil, Trash2, UserPlus, ArrowRight, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import TemplateFormModal from '../../../components/Templates/TemplateFormModal';

export default function TemplatesPage() {
  const { user, loading: authLoading } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const isSuperadmin = user?.role === 'superadmin';

  const fetchTemplates = () => {
    api.get('/templates')
      .then((r) => setTemplates(r.data.templates || []))
      .catch(() => {
        toast.error('Failed to load templates');
        setTemplates([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user || authLoading) return;
    setLoading(true);
    fetchTemplates();
  }, [user, authLoading]);

  const handleAdd = () => {
    setEditingId(null);
    setShowModal(true);
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await api.delete(`/templates/${id}`);
      toast.success('Template deleted.');
      fetchTemplates();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingId(null);
    fetchTemplates();
  };

  if (authLoading || !user) return null;

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-4">
          <h1 className="text-xl font-bold text-primary-900">Package Templates</h1>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
            >
              <ArrowRight className="h-4 w-4" />
              Leads
            </Link>
            {isSuperadmin && (
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Template
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Reusable tour packages. Use a template when creating a new lead to pre-fill tour details.
        </p>

        <div className="flex-1 min-h-0 overflow-auto bg-white rounded-xl border border-gray-100 shadow-card">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
            </div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>No package templates yet.</p>
              {isSuperadmin && (
                <button type="button" onClick={handleAdd} className="mt-3 text-primary-600 hover:text-primary-700 font-medium text-sm">
                  Create your first template
                </button>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {templates.map((t) => (
                <li key={t._id} className="p-4 hover:bg-gray-50/50 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{t.name}</h3>
                    {t.description && (
                      <p className="text-sm text-gray-500 truncate mt-0.5">{t.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-400">
                      {t.vehicleType && <span>{t.vehicleType}</span>}
                      {t.hotelCategory && <span>• {t.hotelCategory}</span>}
                      {(t.tourNights != null || t.tourDays != null) && (
                        <span>• {[t.tourNights != null && `${t.tourNights}N`, t.tourDays != null && `${t.tourDays}D`].filter(Boolean).join('/')}</span>
                      )}
                      {Array.isArray(t.destinations) && t.destinations.length > 0 && (
                        <span>• {t.destinations.slice(0, 3).join(', ')}{t.destinations.length > 3 ? '…' : ''}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      href={`/admin/leads?add=1&template=${t._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      <UserPlus className="h-4 w-4" />
                      Use for new lead
                    </Link>
                    {isSuperadmin && (
                      <>
                        <button type="button" onClick={() => handleEdit(t)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(t._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <TemplateFormModal
        open={showModal}
        templateId={editingId}
        onClose={() => { setShowModal(false); setEditingId(null); }}
        onSuccess={handleModalSuccess}
      />
    </DashboardLayout>
  );
}
