'use client';

import { useState } from 'react';
import { X, Edit, MapPin, Building2, Route, CheckCircle, XCircle, FileDown, CreditCard, AlertCircle, Plane, Banknote, ImagePlus } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  booked: 'Booked',
  lost: 'Lost',
};

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right break-all">{value ?? '–'}</span>
    </div>
  );
}

export default function LeadDetailsModal({ open, lead, onClose, onEdit, canEdit }) {
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!lead?._id) return;
    setDownloadingPdf(true);
    try {
      const res = await api.get(`/leads/${lead._id}/tour-summary-pdf`, { responseType: 'blob' });
      const data = res.data;
      const contentType = res.headers?.['content-type'] || '';
      const isPdf = contentType.includes('application/pdf');
      const hasSize = data instanceof Blob && data.size > 100;
      if (!isPdf || !hasSize) {
        const text = await (data instanceof Blob ? data.text() : Promise.resolve(String(data)));
        let msg = 'PDF download failed.';
        try {
          const j = JSON.parse(text);
          msg = j.message || msg;
        } catch (_) {}
        toast.error(msg);
        return;
      }
      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `tour-summary-${lead.leadId || lead._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded.');
    } catch (err) {
      const data = err.response?.data;
      if (data instanceof Blob) {
        try {
          const text = await data.text();
          const j = JSON.parse(text);
          toast.error(j.message || 'Failed to download PDF.');
        } catch (_) {
          toast.error('Failed to download PDF.');
        }
      } else {
        toast.error(err.response?.data?.message || 'Failed to download PDF.');
      }
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (!open) return null;

  const name = lead?.name?.trim() || 'Unknown';
  const statusLabel = STATUS_LABELS[lead?.status] || lead?.status || '–';
  const createdDate = lead?.createdAt || lead?.createdDate;
  const created = createdDate ? new Date(createdDate).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '–';
  const assigned = lead?.assigned_to;
  const assignedName = assigned && (typeof assigned === 'object') ? `${assigned.firstName || ''} ${assigned.lastName || ''}`.trim() : '–';
  const paxBreakupSummary = Array.isArray(lead?.paxBreakup) && lead.paxBreakup.length
    ? lead.paxBreakup
        .map((item) => [item?.count != null ? item.count : null, item?.type].filter(Boolean).join(' ').trim())
        .filter(Boolean)
        .join(', ')
    : ([lead?.paxCount, lead?.paxType].filter(Boolean).length ? `${lead.paxCount ?? ''} ${lead.paxType ?? ''}`.trim() : null);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary-600 to-primary-700">
          <h2 className="text-xl font-bold text-white">Lead Details – {name}</h2>
          <div className="flex items-center gap-2">
            <button type="button" onClick={handleDownloadPdf} disabled={downloadingPdf} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-60" title="Download Tour Summary PDF">
              <FileDown className="h-4 w-4" />
              {downloadingPdf ? 'Downloading…' : 'PDF'}
            </button>
            {canEdit && (
              <button type="button" onClick={() => onEdit?.(lead)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-colors">
                <Edit className="h-4 w-4" />
                Edit
              </button>
            )}
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {/* Contact & Lead Info – all form data visible */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-sky-50 border-b border-sky-100 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-gray-900">Contact & Lead Info</h3>
              <span className="text-sm font-medium text-primary-700 shrink-0">{statusLabel}</span>
            </div>
            <div className="p-4 space-y-0">
              <InfoRow label="Name" value={name} />
              <InfoRow label="Phone" value={lead?.phone} />
              <InfoRow label="Email" value={lead?.email} />
              <InfoRow label="Destination" value={lead?.destination} />
              <InfoRow label="Travel Date" value={lead?.travel_date ? new Date(lead.travel_date).toLocaleDateString('en-GB') : null} />
              <InfoRow label="Budget" value={lead?.budget} />
              <InfoRow label="Source" value={lead?.source} />
              <InfoRow label="Assigned To" value={assignedName} />
              <InfoRow label="Total Amount" value={lead?.total_amount != null ? `Rs.${Number(lead.total_amount).toLocaleString('en-IN')}/-` : null} />
              <InfoRow label="Advance Amount" value={lead?.advance_amount != null ? `Rs.${Number(lead.advance_amount).toLocaleString('en-IN')}/-` : null} />
              <InfoRow label="Remaining Amount" value={lead?.remaining_amount != null ? `Rs.${Number(lead.remaining_amount).toLocaleString('en-IN')}/-` : null} />
              <InfoRow label="Payment Status" value={lead?.payment_status} />
              <InfoRow label="Lead ID" value={lead?.leadId || lead?._id} />
              <InfoRow label="Created At" value={created} />
              <InfoRow label="Notes" value={lead?.notes} />
              {Array.isArray(lead?.followups) && lead.followups.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500 block mb-2">Follow-ups</span>
                  {lead.followups.map((fu, i) => (
                    <div key={i} className="text-sm text-gray-700 py-1">
                      {fu.date ? new Date(fu.date).toLocaleDateString('en-GB') : '–'} – {fu.note || '–'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tour Summary: - (same as PDF) – always show */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
            <div className="px-4 py-3 bg-[#1565c0] flex items-center gap-2">
              <MapPin className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Tour Summary: -</h3>
            </div>
            <div className="p-4 space-y-0">
              <InfoRow label="01. Total Package Cost" value={lead?.total_amount != null ? `Rs.${Number(lead.total_amount).toLocaleString('en-IN')}/-` : null} />
              <InfoRow label="02. Package Cost Per Person" value={lead?.packageCostPerPerson != null ? `Rs.${Number(lead.packageCostPerPerson).toLocaleString('en-IN')}/-` : null} />
              <InfoRow label="03. Total No. of Pax" value={lead?.paxCount != null ? String(lead.paxCount) : null} />
              <InfoRow label="04. Pax Type Breakdown" value={paxBreakupSummary} />
              <InfoRow label="05. Vehicle Type" value={lead?.vehicleType} />
              <InfoRow label="06. Hotel Category" value={lead?.hotelCategory} />
              <InfoRow label="07. Meal Plan" value={lead?.mealPlan} />
              <InfoRow label="08. Tour Duration" value={[lead?.tourNights != null && `${lead.tourNights} Nights`, lead?.tourDays != null && `${lead.tourDays} Days`].filter(Boolean).join(' / ') || null} />
              <InfoRow label="09. Tour Date" value={lead?.tourStartDate && lead?.tourEndDate ? `${new Date(lead.tourStartDate).toLocaleDateString('en-GB')} to ${new Date(lead.tourEndDate).toLocaleDateString('en-GB')}` : (lead?.travel_date ? new Date(lead.travel_date).toLocaleDateString('en-GB') : null)} />
              <InfoRow label="10. Pick up" value={lead?.pickupPoint} />
              <InfoRow label="11. Drop" value={lead?.dropPoint} />
              <InfoRow label="12. Destinations" value={Array.isArray(lead?.destinations) && lead.destinations.length > 0 ? lead.destinations.join(', ') : lead?.destination} />
            </div>
          </div>
          {Array.isArray(lead?.tripImages) && lead.tripImages.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
              <div className="px-4 py-3 bg-purple-50 border-b border-purple-100 flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Trip Images</h3>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {lead.tripImages.map((image, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt={`Trip ${i + 1}`} className="h-32 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Accommodation: - (same as PDF) – always show */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
            <div className="px-4 py-3 bg-[#1565c0] flex items-center gap-2">
              <Building2 className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Accommodation: -</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-gray-700">Sr</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Hotel Name</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Night(s)</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Room Category</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Sharing</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.isArray(lead?.accommodation) && lead.accommodation.length > 0 ? (
                    lead.accommodation.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2 text-gray-700">{i + 1}</td>
                        <td className="px-4 py-2 text-gray-900">{a.hotelName || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{a.nights != null ? a.nights : '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{a.roomType || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{a.sharing || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{a.destination || '–'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No accommodation details added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotel/Pay – hotel-wise payment (view only, not in PDF) */}
          {Array.isArray(lead?.accommodation) && lead.accommodation.some((a) => a.hotelTotalAmount != null || a.hotelPaidAmount != null) && (
            <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
              <div className="px-4 py-3 bg-amber-600 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-white" />
                <h3 className="font-semibold text-white">Hotel / Pay</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 font-semibold text-gray-700">Hotel Name</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Total (Rs)</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Paid (Rs)</th>
                      <th className="px-4 py-2 font-semibold text-gray-700">Remaining (Rs)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {lead.accommodation.map((a, i) => {
                      const total = a.hotelTotalAmount != null ? Number(a.hotelTotalAmount) : null;
                      const paid = a.hotelPaidAmount != null ? Number(a.hotelPaidAmount) : null;
                      const remaining = total != null && paid != null ? Math.max(0, total - paid) : (total != null ? total : null);
                      if (total == null && paid == null) return null;
                      const fmt = (n) => n != null ? `Rs.${Number(n).toLocaleString('en-IN')}/-` : '–';
                      return (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2 text-gray-900">{a.hotelName || '–'}</td>
                          <td className="px-4 py-2 text-gray-700">{fmt(total)}</td>
                          <td className="px-4 py-2 text-gray-700">{fmt(paid)}</td>
                          <td className="px-4 py-2 font-medium text-gray-900">{fmt(remaining)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Flight Details: - (same as PDF) – always show */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
            <div className="px-4 py-3 bg-[#1565c0] flex items-center gap-2">
              <Plane className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Flight Details: -</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 font-semibold text-gray-700">Sr</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">From</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">To</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Airline Info</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">PNR / Booking</th>
                    <th className="px-4 py-2 font-semibold text-gray-700">Fare (Rs)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Array.isArray(lead?.flights) && lead.flights.length > 0 ? (
                    lead.flights.map((f, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2 text-gray-700">{i + 1}</td>
                        <td className="px-4 py-2 text-gray-900">{f.from || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{f.to || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{f.airline || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{f.pnr || '–'}</td>
                        <td className="px-4 py-2 text-gray-700">{f.fare != null ? `Rs.${Number(f.fare).toLocaleString('en-IN')}/-` : '–'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-3 text-center text-gray-500">No flight details added.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tour Itinerary: - (same as PDF) – always show */}
          <div className="rounded-xl border border-gray-200 overflow-hidden mt-4">
            <div className="px-4 py-3 bg-[#c62828] flex items-center gap-2">
              <Route className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Tour Itinerary: -</h3>
            </div>
            <div className="p-4 space-y-4">
              {Array.isArray(lead?.itinerary) && lead.itinerary.length > 0 ? (
                lead.itinerary.map((item, i) => (
                  <div key={i} className="border border-amber-200 rounded-lg p-3 bg-amber-50/50">
                    <div className="font-semibold text-gray-900 text-sm mb-1">
                      Day {item.day != null ? item.day : i + 1}{item.route ? ` :– ${item.route}` : ' :– Tour'}
                      {item.date ? ` (${new Date(item.date).toLocaleDateString('en-GB')})` : ''}
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                    )}
                    {Array.isArray(item.places) && item.places.length > 0 && (
                      <>
                        <p className="text-sm font-semibold text-red-800 underline mb-1">Places can be visit: -</p>
                        <ul className="text-sm text-gray-700 list-disc list-inside space-y-0.5">
                          {item.places.map((place, j) => (
                            <li key={j}>{place}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Itinerary will be shared shortly.</p>
              )}
            </div>
          </div>
          {(lead?.payment_policy?.trim() || lead?.cancellation_policy?.trim()) && (
            <div className="mt-4 space-y-4">
              {lead.payment_policy?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Payment Policy</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.payment_policy.trim()}</p>
                  </div>
                </div>
              )}
              {lead.cancellation_policy?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    <h3 className="font-semibold text-gray-900">Cancellation Policy</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.cancellation_policy.trim()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {(lead?.termsAndConditions?.trim() || lead?.memorableTrip?.trim()) && (
            <div className="mt-4 space-y-4">
              {lead.termsAndConditions?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-slate-600" />
                    <h3 className="font-semibold text-gray-900">Terms And Conditions</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.termsAndConditions.trim()}</p>
                  </div>
                </div>
              )}
              {lead.memorableTrip?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-rose-50 border-b border-rose-100 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-rose-600" />
                    <h3 className="font-semibold text-gray-900">Memorable Trip</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lead.memorableTrip.trim()}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          {(lead?.inclusions?.trim() || lead?.exclusions?.trim()) && (
            <div className="mt-4 space-y-4">
              {lead.inclusions?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-green-50 border-b border-green-100 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Package Inclusions</h3>
                  </div>
                  <div className="p-4">
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      {lead.inclusions.trim().split(/\r?\n/).filter(Boolean).map((line, i) => (
                        <li key={i}>{line.replace(/^[\s•\-]+/, '').trim() || line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {lead.exclusions?.trim() && (
                <div className="rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <h3 className="font-semibold text-gray-900">Package Exclusions</h3>
                  </div>
                  <div className="p-4">
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      {lead.exclusions.trim().split(/\r?\n/).filter(Boolean).map((line, i) => (
                        <li key={i}>{line.replace(/^[\s•\-]+/, '').trim() || line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
