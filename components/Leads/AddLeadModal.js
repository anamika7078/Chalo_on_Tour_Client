'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { X, UserPlus, User, Mail, Phone, Globe, Tag, Loader2, MapPin, Building2, Plus, Trash2, Route, CheckCircle, XCircle, CreditCard, AlertCircle, Plane } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'booked', label: 'Booked' },
  { value: 'lost', label: 'Lost' },
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  destination: '',
  travel_date: '',
  budget: '',
  status: 'new',
  notes: '',
  total_amount: '',
  paxCount: '',
  paxType: 'Adults',
  vehicleType: '',
  hotelCategory: '',
  mealPlan: '',
  tourNights: '',
  tourDays: '',
  tourStartDate: '',
  tourEndDate: '',
  pickupPoint: '',
  dropPoint: '',
  destinationsText: '',
  accommodation: [],
  flights: [],
  itinerary: [],
  inclusions: '',
  exclusions: '',
  payment_policy: '',
  cancellation_policy: '',
};

const emptyAccommodationRow = () => ({ hotelName: '', nights: '', roomType: 'Double', sharing: 'Double', destination: '', hotelTotalAmount: '', hotelPaidAmount: '' });
const emptyFlightRow = () => ({ from: '', to: '', airline: '', pnr: '' });
const emptyItineraryRow = () => ({ day: '', route: '', placesText: '' });

function mapTemplateToForm(template) {
  if (!template) return null;
  return {
    paxType: template.paxType || 'Adults',
    vehicleType: template.vehicleType || '',
    hotelCategory: template.hotelCategory || '',
    mealPlan: template.mealPlan || '',
    tourNights: template.tourNights != null ? String(template.tourNights) : '',
    tourDays: template.tourDays != null ? String(template.tourDays) : '',
    pickupPoint: template.pickupPoint || '',
    dropPoint: template.dropPoint || '',
    destinationsText: Array.isArray(template.destinations) && template.destinations.length ? template.destinations.join(', ') : '',
    accommodation: Array.isArray(template.accommodation) && template.accommodation.length
      ? template.accommodation.map((a) => ({
          hotelName: a.hotelName || '',
          nights: a.nights != null ? String(a.nights) : '',
          roomType: a.roomType || 'Double',
          sharing: a.sharing || 'Double',
          destination: a.destination || '',
          hotelTotalAmount: a.hotelTotalAmount != null ? String(a.hotelTotalAmount) : '',
          hotelPaidAmount: a.hotelPaidAmount != null ? String(a.hotelPaidAmount) : '',
        }))
      : [],
    itinerary: Array.isArray(template.itinerary) && template.itinerary.length
      ? template.itinerary.map((item) => ({
          day: item.day != null ? String(item.day) : '',
          route: item.route || '',
          placesText: Array.isArray(item.places) ? item.places.join('\n') : '',
        }))
      : [],
    inclusions: template.inclusions || '',
    exclusions: template.exclusions || '',
    payment_policy: template.payment_policy || '',
    cancellation_policy: template.cancellation_policy || '',
  };
}

export default function AddLeadModal({ open, onClose, onSuccess, initialTourData }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;
    const mapped = mapTemplateToForm(initialTourData);
    if (mapped) {
      setForm((prev) => ({ ...prev, ...mapped }));
    } else {
      setForm(initialForm);
    }
  }, [open, initialTourData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const addAccommodationRow = () => {
    setForm((p) => ({ ...p, accommodation: [...(p.accommodation || []), emptyAccommodationRow()] }));
  };
  const updateAccommodationRow = (index, field, value) => {
    setForm((p) => {
      const next = [...(p.accommodation || [])];
      if (!next[index]) next[index] = emptyAccommodationRow();
      next[index] = { ...next[index], [field]: value };
      return { ...p, accommodation: next };
    });
  };
  const removeAccommodationRow = (index) => {
    setForm((p) => ({ ...p, accommodation: (p.accommodation || []).filter((_, i) => i !== index) }));
  };

  const addFlightRow = () => {
    setForm((p) => ({ ...p, flights: [...(p.flights || []), emptyFlightRow()] }));
  };
  const updateFlightRow = (index, field, value) => {
    setForm((p) => {
      const next = [...(p.flights || [])];
      if (!next[index]) next[index] = emptyFlightRow();
      next[index] = { ...next[index], [field]: value };
      return { ...p, flights: next };
    });
  };
  const removeFlightRow = (index) => {
    setForm((p) => ({ ...p, flights: (p.flights || []).filter((_, i) => i !== index) }));
  };

  const addItineraryDay = () => {
    setForm((p) => ({ ...p, itinerary: [...(p.itinerary || []), emptyItineraryRow()] }));
  };
  const updateItineraryRow = (index, field, value) => {
    setForm((p) => {
      const next = [...(p.itinerary || [])];
      if (!next[index]) next[index] = emptyItineraryRow();
      next[index] = { ...next[index], [field]: value };
      return { ...p, itinerary: next };
    });
  };
  const removeItineraryRow = (index) => {
    setForm((p) => ({ ...p, itinerary: (p.itinerary || []).filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const destinations = form.destinationsText.trim() ? form.destinationsText.split(/[,;]/).map((d) => d.trim()).filter(Boolean) : undefined;
      const accommodation = (form.accommodation || []).filter((a) => a.hotelName?.trim() || a.destination?.trim()).map((a) => ({
        hotelName: (a.hotelName || '').trim(),
        nights: a.nights !== '' && a.nights != null ? Number(a.nights) : null,
        roomType: (a.roomType || '').trim(),
        sharing: (a.sharing || '').trim(),
        destination: (a.destination || '').trim(),
        hotelTotalAmount: a.hotelTotalAmount !== '' && a.hotelTotalAmount != null ? Number(a.hotelTotalAmount) : null,
        hotelPaidAmount: a.hotelPaidAmount !== '' && a.hotelPaidAmount != null ? Number(a.hotelPaidAmount) : null,
      }));
      const flights = (form.flights || []).filter((f) => (f.from || f.to || f.airline || f.pnr)?.trim()).map((f) => ({
        from: (f.from || '').trim(),
        to: (f.to || '').trim(),
        airline: (f.airline || '').trim(),
        pnr: (f.pnr || '').trim(),
      }));
      const itinerary = (form.itinerary || [])
        .filter((item) => item.day !== '' || item.route?.trim() || item.placesText?.trim())
        .map((item) => ({
          day: item.day !== '' && item.day != null ? Number(item.day) : null,
          route: (item.route || '').trim(),
          places: (item.placesText || '').split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean),
        }));
      await api.post('/leads', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        destination: form.destination.trim() || undefined,
        travel_date: form.travel_date || undefined,
        budget: form.budget.trim() || undefined,
        status: form.status,
        notes: form.notes.trim() || undefined,
        total_amount: form.total_amount ? Number(form.total_amount) : undefined,
        paxCount: form.paxCount ? Number(form.paxCount) : undefined,
        paxType: form.paxType?.trim() || undefined,
        vehicleType: form.vehicleType?.trim() || undefined,
        hotelCategory: form.hotelCategory?.trim() || undefined,
        mealPlan: form.mealPlan?.trim() || undefined,
        tourNights: form.tourNights ? Number(form.tourNights) : undefined,
        tourDays: form.tourDays ? Number(form.tourDays) : undefined,
        tourStartDate: form.tourStartDate || undefined,
        tourEndDate: form.tourEndDate || undefined,
        pickupPoint: form.pickupPoint?.trim() || undefined,
        dropPoint: form.dropPoint?.trim() || undefined,
        destinations,
        accommodation: accommodation.length ? accommodation : undefined,
        flights: flights.length ? flights : undefined,
        itinerary: itinerary.length ? itinerary : undefined,
        inclusions: form.inclusions?.trim() || undefined,
        exclusions: form.exclusions?.trim() || undefined,
        payment_policy: form.payment_policy?.trim() || undefined,
        cancellation_policy: form.cancellation_policy?.trim() || undefined,
      });
      toast.success('Lead created successfully.');
      setForm(initialForm);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create lead.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setForm(initialForm);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-primary-600 to-primary-700">
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-white" />
            <h2 className="text-xl font-bold text-white">Add New Lead</h2>
          </div>
          <button type="button" onClick={handleClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center gap-2">
                <User className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Contact Information</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="e.g. John Doe" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="e.g. john@example.com" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="e.g. 9876543210" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Trip Details</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Goa" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travel Date</label>
                  <input name="travel_date" type="date" value={form.travel_date} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. 50000" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white">
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} placeholder="Optional notes" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Tour Summary (Optional)</h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Package Cost (₹)</label>
                    <input name="total_amount" type="number" min={0} value={form.total_amount} onChange={handleChange} placeholder="e.g. 62500" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">No. of Pax</label>
                    <input name="paxCount" type="number" min={0} value={form.paxCount} onChange={handleChange} placeholder="e.g. 3" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pax Type</label>
                  <input name="paxType" value={form.paxType} onChange={handleChange} placeholder="e.g. Adults" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <input name="vehicleType" value={form.vehicleType} onChange={handleChange} placeholder="e.g. Sedan or Similar" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Category</label>
                  <input name="hotelCategory" value={form.hotelCategory} onChange={handleChange} placeholder="e.g. 3 Star Category" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                  <input name="mealPlan" value={form.mealPlan} onChange={handleChange} placeholder="e.g. Breakfast & Dinner" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Nights</label>
                    <input name="tourNights" type="number" min={0} value={form.tourNights} onChange={handleChange} placeholder="e.g. 7" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Days</label>
                    <input name="tourDays" type="number" min={0} value={form.tourDays} onChange={handleChange} placeholder="e.g. 8" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Start Date</label>
                    <input name="tourStartDate" type="date" value={form.tourStartDate} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour End Date</label>
                    <input name="tourEndDate" type="date" value={form.tourEndDate} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick up</label>
                  <input name="pickupPoint" value={form.pickupPoint} onChange={handleChange} placeholder="e.g. Rajkot Railway Station" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Drop</label>
                  <input name="dropPoint" value={form.dropPoint} onChange={handleChange} placeholder="e.g. Surat Railway Station" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (comma or semicolon separated)</label>
                  <input name="destinationsText" value={form.destinationsText} onChange={handleChange} placeholder="e.g. Dwarka, Somnath, Sasan Gir" className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">Accommodation (Optional)</h3>
                </div>
                <button type="button" onClick={addAccommodationRow} className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  <Plus className="h-4 w-4" /> Add hotel
                </button>
              </div>
              <div className="p-4 space-y-4">
                {(form.accommodation || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No hotels added. Click &quot;Add hotel&quot; to add accommodation.</p>
                ) : (
                  (form.accommodation || []).map((row, i) => (
                    <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Hotel #{i + 1}</span>
                        <button type="button" onClick={() => removeAccommodationRow(i)} className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Hotel Name</label>
                          <input value={row.hotelName || ''} onChange={(e) => updateAccommodationRow(i, 'hotelName', e.target.value)} placeholder="e.g. Hotel The Dwarika" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Nights</label>
                          <input type="number" min={0} value={row.nights ?? ''} onChange={(e) => updateAccommodationRow(i, 'nights', e.target.value)} placeholder="2" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Room Type</label>
                          <input value={row.roomType || ''} onChange={(e) => updateAccommodationRow(i, 'roomType', e.target.value)} placeholder="e.g. Deluxe Room" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Sharing</label>
                          <input value={row.sharing || ''} onChange={(e) => updateAccommodationRow(i, 'sharing', e.target.value)} placeholder="e.g. Double" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Destination</label>
                          <input value={row.destination || ''} onChange={(e) => updateAccommodationRow(i, 'destination', e.target.value)} placeholder="e.g. Dwarka" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Hotel Total (Rs)</label>
                          <input type="number" min={0} step={1} value={row.hotelTotalAmount ?? ''} onChange={(e) => updateAccommodationRow(i, 'hotelTotalAmount', e.target.value)} placeholder="Total for this hotel" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Hotel Paid (Rs)</label>
                          <input type="number" min={0} step={1} value={row.hotelPaidAmount ?? ''} onChange={(e) => updateAccommodationRow(i, 'hotelPaidAmount', e.target.value)} placeholder="Paid for this hotel" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Plane className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">Flight Details: - (Optional)</h3>
                </div>
                <button type="button" onClick={addFlightRow} className="inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:text-indigo-800">
                  <Plus className="h-4 w-4" /> Add flight
                </button>
              </div>
              <div className="p-4 space-y-4">
                {(form.flights || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No flights. Click &quot;Add flight&quot; to add flight details.</p>
                ) : (
                  (form.flights || []).map((row, i) => (
                    <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Flight #{i + 1}</span>
                        <button type="button" onClick={() => removeFlightRow(i)} className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">From</label>
                          <input value={row.from || ''} onChange={(e) => updateFlightRow(i, 'from', e.target.value)} placeholder="e.g. Mumbai" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">To</label>
                          <input value={row.to || ''} onChange={(e) => updateFlightRow(i, 'to', e.target.value)} placeholder="e.g. Goa" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Airline Info</label>
                          <input value={row.airline || ''} onChange={(e) => updateFlightRow(i, 'airline', e.target.value)} placeholder="e.g. IndiGo 6E-234" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">PNR / Booking</label>
                          <input value={row.pnr || ''} onChange={(e) => updateFlightRow(i, 'pnr', e.target.value)} placeholder="e.g. ABC123" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-violet-50 border-b border-violet-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-violet-600" />
                  <h3 className="font-semibold text-gray-900">Day-wise Itinerary (Optional)</h3>
                </div>
                <button type="button" onClick={addItineraryDay} className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:text-violet-800">
                  <Plus className="h-4 w-4" /> Add day
                </button>
              </div>
              <div className="p-4 space-y-4">
                {(form.itinerary || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No days added. Click &quot;Add day&quot; to add itinerary.</p>
                ) : (
                  (form.itinerary || []).map((row, i) => (
                    <div key={i} className="p-3 border border-gray-200 rounded-lg bg-gray-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Day #{i + 1}</span>
                        <button type="button" onClick={() => removeItineraryRow(i)} className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1">
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">Day number</label>
                            <input type="number" min={1} value={row.day ?? ''} onChange={(e) => updateItineraryRow(i, 'day', e.target.value)} placeholder="1" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-0.5">Route (e.g. City A – City B (250KM))</label>
                            <input value={row.route || ''} onChange={(e) => updateItineraryRow(i, 'route', e.target.value)} placeholder="Rajkot – Dwarka (250KM)" className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-0.5">Places to visit (one per line or comma separated)</label>
                          <textarea value={row.placesText || ''} onChange={(e) => updateItineraryRow(i, 'placesText', e.target.value)} rows={3} placeholder={'Dwarkadhish Temple\nNageshwar Jyotirlinga\nGomati Ghat'} className="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Package Inclusions (Optional)</h3>
              </div>
              <div className="p-4">
                <textarea name="inclusions" value={form.inclusions} onChange={handleChange} rows={4} placeholder={'One item per line, e.g.\n• Accommodation on double sharing\n• Breakfast and Dinner\n• All transfers by vehicle'} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm" />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">Package Exclusions (Optional)</h3>
              </div>
              <div className="p-4">
                <textarea name="exclusions" value={form.exclusions} onChange={handleChange} rows={4} placeholder={'One item per line, e.g.\n• GST\n• Train/Flight tickets\n• Entry fees, personal expenses'} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm" />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Payment Policy (Optional)</h3>
              </div>
              <div className="p-4">
                <textarea name="payment_policy" value={form.payment_policy} onChange={handleChange} rows={3} placeholder={'e.g. Initial deposit 40% to confirm. 60% before 10 days of departure. 100% for flight/train tickets.'} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm" />
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Cancellation Policy (Optional)</h3>
              </div>
              <div className="p-4">
                <textarea name="cancellation_policy" value={form.cancellation_policy} onChange={handleChange} rows={4} placeholder={'e.g. 35+ days: 25%. 34-15 days: 25%. 14-10 days: 50%. 10-7 days: 100%. Train as per IRCTC.'} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm" />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button type="button" onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
