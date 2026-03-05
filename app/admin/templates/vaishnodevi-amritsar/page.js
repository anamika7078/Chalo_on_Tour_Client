'use client';

import { useState } from 'react';
import DashboardLayout from '../../../../components/Layout/DashboardLayout';
import TourInvoicePreview from '../../../../components/Templates/TourInvoicePreview';
import { Printer, RefreshCw } from 'lucide-react';

export default function VaishnodeviAmritsarTemplatePage() {
  const [form, setForm] = useState({
    guestName: '',
    perPersonCost: '',
    totalPax: '06',
    vehicleType: 'Ertiga or Innova',
    hotelCategory: '3-Star Category',
    mealPlan: 'Breakfast Only',
    tourDuration: '05 Nights 06 Days',
    tourDate: '05/04/2026 to 10/04/2026',
    pickupPoint: 'Jammu Bus Stand',
    dropPoint: 'Amritsar Airport',
    destinations: 'Jammu, Katra, Shivkhori, Amritsar',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleReset = () => {
    setForm({
      guestName: '',
      perPersonCost: '',
      totalPax: '06',
      vehicleType: 'Ertiga or Innova',
      hotelCategory: '3-Star Category',
      mealPlan: 'Breakfast Only',
      tourDuration: '05 Nights 06 Days',
      tourDate: '05/04/2026 to 10/04/2026',
      pickupPoint: 'Jammu Bus Stand',
      dropPoint: 'Amritsar Airport',
      destinations: 'Jammu, Katra, Shivkhori, Amritsar',
    });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <DashboardLayout>
      <div className="tour-pdf-page h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between gap-4 mb-4 no-print">
          <div>
            <h1 className="text-xl font-bold text-primary-900">
              Vaishnodevi – Amritsar Tour PDF
            </h1>
            <p className="text-sm text-gray-600">
              Fill key fields on the left and preview the final PDF layout on the right. Use the Print button to export
              as PDF.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm hover:bg-primary-700 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[320px,minmax(0,1fr)] gap-4">
          {/* Simple admin form (only for feel, not yet saved to backend) */}
          <div className="no-print bg-white rounded-xl border border-gray-100 shadow-card p-4 space-y-3 overflow-auto">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">
              Tour Summary (Editable)
            </h2>
            <p className="text-xs text-gray-500 mb-2">
              These fields update the PDF preview live. Use templates/leads modules to manage actual booking data.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Guest / Group Name
                </label>
                <input
                  type="text"
                  name="guestName"
                  value={form.guestName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. Mr. Sharma Family"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Per Person Cost (₹)
                </label>
                <input
                  type="text"
                  name="perPersonCost"
                  value={form.perPersonCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g. 25,999"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Total Pax
                  </label>
                  <input
                    type="text"
                    name="totalPax"
                    value={form.totalPax}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Hotel Category
                  </label>
                  <input
                    type="text"
                    name="hotelCategory"
                    value={form.hotelCategory}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Meal Plan
                  </label>
                  <input
                    type="text"
                    name="mealPlan"
                    value={form.mealPlan}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tour Duration
                </label>
                <input
                  type="text"
                  name="tourDuration"
                  value={form.tourDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tour Date
                </label>
                <input
                  type="text"
                  name="tourDate"
                  value={form.tourDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Pick up
                  </label>
                  <input
                    type="text"
                    name="pickupPoint"
                    value={form.pickupPoint}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Drop
                  </label>
                  <input
                    type="text"
                    name="dropPoint"
                    value={form.dropPoint}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Destinations
                </label>
                <input
                  type="text"
                  name="destinations"
                  value={form.destinations}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* PDF preview area */}
          <div className="flex-1 min-h-0 overflow-auto pb-4">
            <TourInvoicePreview data={form} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

