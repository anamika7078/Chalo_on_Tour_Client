'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { X, Package, Loader2, MapPin, Building2, Plus, Trash2, Route, CheckCircle, XCircle, CreditCard, AlertCircle } from 'lucide-react';

const initialForm = {
  name: '',
  description: '',
  paxType: 'Adults',
  vehicleType: '',
  hotelCategory: '',
  mealPlan: '',
  tourNights: '',
  tourDays: '',
  pickupPoint: '',
  dropPoint: '',
  destinationsText: '',
  accommodation: [],
  itinerary: [],
  inclusions: '',
  exclusions: '',
  payment_policy: '',
  cancellation_policy: '',
};

const emptyAccommodationRow = () => ({ hotelName: '', nights: '', roomType: 'Double', sharing: 'Double', destination: '' });
const emptyItineraryRow = () => ({ day: '', route: '', placesText: '' });

export default function TemplateFormModal({ open, templateId, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;
    if (templateId) {
      setFetching(true);
      api.get(`/templates/${templateId}`)
        .then((r) => {
          const t = r.data.template;
          setForm({
            name: t.name || '',
            description: t.description || '',
            paxType: t.paxType || 'Adults',
            vehicleType: t.vehicleType || '',
            hotelCategory: t.hotelCategory || '',
            mealPlan: t.mealPlan || '',
            tourNights: t.tourNights != null ? String(t.tourNights) : '',
            tourDays: t.tourDays != null ? String(t.tourDays) : '',
            pickupPoint: t.pickupPoint || '',
            dropPoint: t.dropPoint || '',
            destinationsText: Array.isArray(t.destinations) && t.destinations.length ? t.destinations.join(', ') : '',
            accommodation: Array.isArray(t.accommodation) && t.accommodation.length ? t.accommodation.map((a) => ({
              hotelName: a.hotelName || '',
              nights: a.nights != null ? String(a.nights) : '',
              roomType: a.roomType || '',
              sharing: a.sharing || '',
              destination: a.destination || '',
            })) : [],
            itinerary: Array.isArray(t.itinerary) && t.itinerary.length ? t.itinerary.map((item) => ({
              day: item.day != null ? String(item.day) : '',
              route: item.route || '',
              placesText: Array.isArray(item.places) ? item.places.join('\n') : '',
            })) : [],
            inclusions: t.inclusions || '',
            exclusions: t.exclusions || '',
            payment_policy: t.payment_policy || '',
            cancellation_policy: t.cancellation_policy || '',
          });
        })
        .catch(() => toast.error('Failed to load template'))
        .finally(() => setFetching(false));
    } else {
      setForm(initialForm);
    }
  }, [open, templateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const addAccommodationRow = () => setForm((p) => ({ ...p, accommodation: [...(p.accommodation || []), emptyAccommodationRow()] }));
  const updateAccommodationRow = (i, field, value) => {
    setForm((p) => {
      const next = [...(p.accommodation || [])];
      if (!next[i]) next[i] = emptyAccommodationRow();
      next[i] = { ...next[i], [field]: value };
      return { ...p, accommodation: next };
    });
  };
  const removeAccommodationRow = (i) => setForm((p) => ({ ...p, accommodation: (p.accommodation || []).filter((_, j) => j !== i) }));

  const addItineraryDay = () => setForm((p) => ({ ...p, itinerary: [...(p.itinerary || []), emptyItineraryRow()] }));
  const updateItineraryRow = (i, field, value) => {
    setForm((p) => {
      const next = [...(p.itinerary || [])];
      if (!next[i]) next[i] = emptyItineraryRow();
      next[i] = { ...next[i], [field]: value };
      return { ...p, itinerary: next };
    });
  };
  const removeItineraryRow = (i) => setForm((p) => ({ ...p, itinerary: (p.itinerary || []).filter((_, j) => j !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    setLoading(true);
    try {
      const destinations = form.destinationsText.trim() ? form.destinationsText.split(/[,;]/).map((d) => d.trim()).filter(Boolean) : [];
      const accommodation = (form.accommodation || []).map((a) => ({
        hotelName: (a.hotelName || '').trim(),
        nights: a.nights !== '' && a.nights != null ? Number(a.nights) : null,
        roomType: (a.roomType || '').trim(),
        sharing: (a.sharing || '').trim(),
        destination: (a.destination || '').trim(),
      }));
      const itinerary = (form.itinerary || []).map((item) => ({
        day: item.day !== '' && item.day != null ? Number(item.day) : null,
        route: (item.route || '').trim(),
        places: (item.placesText || '').split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean),
      }));
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        paxType: form.paxType?.trim(),
        vehicleType: form.vehicleType?.trim(),
        hotelCategory: form.hotelCategory?.trim(),
        mealPlan: form.mealPlan?.trim(),
        tourNights: form.tourNights ? Number(form.tourNights) : null,
        tourDays: form.tourDays ? Number(form.tourDays) : null,
        pickupPoint: form.pickupPoint?.trim(),
        dropPoint: form.dropPoint?.trim(),
        destinations,
        accommodation,
        itinerary,
        inclusions: form.inclusions?.trim() || '',
        exclusions: form.exclusions?.trim() || '',
        payment_policy: form.payment_policy?.trim() || '',
        cancellation_policy: form.cancellation_policy?.trim() || '',
      };
      if (templateId) {
        await api.put(`/templates/${templateId}`, payload);
        toast.success('Template updated.');
      } else {
        await api.post('/templates', payload);
        toast.success('Template created.');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save template.');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">{templateId ? 'Edit Template' : 'Add Template'}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        {fetching ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-sky-50 border-b border-sky-100">
                  <h3 className="font-semibold text-gray-900">Template details</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                    <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Gujarat 7N/8D" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Optional short description" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-gray-900">Tour Summary</h3>
                </div>
                <div className="p-4 space-y-3 grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Pax Type</label><input name="paxType" value={form.paxType} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Vehicle</label><input name="vehicleType" value={form.vehicleType} onChange={handleChange} placeholder="Sedan or Similar" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Hotel Category</label><input name="hotelCategory" value={form.hotelCategory} onChange={handleChange} placeholder="3 Star" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Meal Plan</label><input name="mealPlan" value={form.mealPlan} onChange={handleChange} placeholder="Breakfast & Dinner" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Nights</label><input name="tourNights" type="number" min={0} value={form.tourNights} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-0.5">Days</label><input name="tourDays" type="number" min={0} value={form.tourDays} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-0.5">Pick up</label><input name="pickupPoint" value={form.pickupPoint} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-0.5">Drop</label><input name="dropPoint" value={form.dropPoint} onChange={handleChange} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                  <div className="col-span-2"><label className="block text-xs font-medium text-gray-600 mb-0.5">Destinations (comma separated)</label><input name="destinationsText" value={form.destinationsText} onChange={handleChange} placeholder="Dwarka, Somnath, Sasan Gir" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm" /></div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Accommodation</h3>
                  <button type="button" onClick={addAccommodationRow} className="text-sm text-emerald-700 font-medium flex items-center gap-1"><Plus className="h-4 w-4" /> Add</button>
                </div>
                <div className="p-4 space-y-2">
                  {(form.accommodation || []).length === 0 ? <p className="text-xs text-gray-500">No hotels. Click Add to add rows.</p> : (form.accommodation || []).map((row, i) => (
                    <div key={i} className="p-2 border rounded bg-gray-50/50 flex gap-2 flex-wrap items-end">
                      <input value={row.hotelName} onChange={(e) => updateAccommodationRow(i, 'hotelName', e.target.value)} placeholder="Hotel" className="flex-1 min-w-[120px] px-2 py-1 rounded border text-sm" />
                      <input type="number" min={0} value={row.nights ?? ''} onChange={(e) => updateAccommodationRow(i, 'nights', e.target.value)} placeholder="Nights" className="w-16 px-2 py-1 rounded border text-sm" />
                      <input value={row.roomType} onChange={(e) => updateAccommodationRow(i, 'roomType', e.target.value)} placeholder="Room" className="w-24 px-2 py-1 rounded border text-sm" />
                      <input value={row.destination} onChange={(e) => updateAccommodationRow(i, 'destination', e.target.value)} placeholder="City" className="w-24 px-2 py-1 rounded border text-sm" />
                      <button type="button" onClick={() => removeAccommodationRow(i)} className="text-red-600 text-sm">Remove</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-violet-50 border-b border-violet-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Itinerary</h3>
                  <button type="button" onClick={addItineraryDay} className="text-sm text-violet-700 font-medium flex items-center gap-1"><Plus className="h-4 w-4" /> Add day</button>
                </div>
                <div className="p-4 space-y-2">
                  {(form.itinerary || []).length === 0 ? <p className="text-xs text-gray-500">No days. Click Add day.</p> : (form.itinerary || []).map((row, i) => (
                    <div key={i} className="p-2 border rounded bg-gray-50/50 space-y-1">
                      <div className="flex gap-2">
                        <input type="number" min={1} value={row.day ?? ''} onChange={(e) => updateItineraryRow(i, 'day', e.target.value)} placeholder="Day" className="w-14 px-2 py-1 rounded border text-sm" />
                        <input value={row.route} onChange={(e) => updateItineraryRow(i, 'route', e.target.value)} placeholder="Route" className="flex-1 px-2 py-1 rounded border text-sm" />
                        <button type="button" onClick={() => removeItineraryRow(i)} className="text-red-600 text-sm">Remove</button>
                      </div>
                      <textarea value={row.placesText || ''} onChange={(e) => updateItineraryRow(i, 'placesText', e.target.value)} rows={2} placeholder="Places (one per line)" className="w-full px-2 py-1 rounded border text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Inclusions</label>
                    <textarea name="inclusions" value={form.inclusions} onChange={handleChange} rows={2} className="w-full px-2 py-1 rounded border text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Exclusions</label>
                    <textarea name="exclusions" value={form.exclusions} onChange={handleChange} rows={2} className="w-full px-2 py-1 rounded border text-sm" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Payment Policy</label>
                    <textarea name="payment_policy" value={form.payment_policy} onChange={handleChange} rows={2} className="w-full px-2 py-1 rounded border text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-0.5">Cancellation Policy</label>
                    <textarea name="cancellation_policy" value={form.cancellation_policy} onChange={handleChange} rows={2} className="w-full px-2 py-1 rounded border text-sm" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">Cancel</button>
              <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-60">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Package className="h-5 w-5" />}
                {templateId ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
