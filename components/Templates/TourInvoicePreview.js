import React from 'react';

const headerBg =
  'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?cs=srgb&dl=pexels-asadphoto-1268855.jpg&fm=jpg';

export default function TourInvoicePreview({ data }) {
  const d = data || {};

  return (
    <div className="tour-pdf-print-area max-w-5xl mx-auto bg-white shadow-xl rounded-2xl border border-slate-200 overflow-hidden text-[13px] leading-relaxed">
      {/* Top banner with logo + background image */}
      <div className="relative">
        <div
          className="h-32 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${headerBg})` }}
        />
        <div className="absolute inset-0 bg-slate-900/60" />
        <div className="absolute inset-0 flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-md overflow-hidden">
              <img
                src="/Chalo-on-tour.jpg.jpeg"
                alt="Chalo On Tour"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-extrabold tracking-wide">
                Chalo On Tour
              </h1>
              <p className="text-xs text-slate-100 max-w-xs">
                Memorable journeys, curated with care – Vaishnodevi &amp;
                Amritsar Pilgrimage Tour.
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-100 space-y-0.5">
            <p>
              <span className="font-semibold">Contact:</span> 99606 25167 /
              91365 49898
            </p>
            <p>
              <span className="font-semibold">Email:</span> info@chaloontour.com
            </p>
            <p className="text-[11px]">
              Follow us on WhatsApp, Facebook &amp; Instagram
            </p>
          </div>
        </div>
      </div>

      {/* Title strip */}
      <div className="bg-slate-50 border-y border-slate-200 px-8 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            Tour Proposal
          </p>
          <h2 className="text-lg font-bold text-slate-800">
            Vaishnodevi – Amritsar Tour Package
          </h2>
          <p className="text-[11px] text-slate-500">
            Duration: 05 Nights / 06 Days &nbsp;|&nbsp; Jammu – Katra – Shivkhori – Amritsar
          </p>
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <p>
            <span className="font-semibold">Tour Date:</span>{' '}
            05/04/2026 to 10/04/2026
          </p>
          <p>
            <span className="font-semibold">Prepared for:</span>{' '}
            {d.guestName || 'Vaishnodevi Amritsar Group (Approx. 06 Pax)'}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-5">
        {/* Tour Summary */}
        <section>
          <h3 className="section-heading">Tour Summary</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/80">
            <table className="w-full text-xs">
              <thead className="bg-slate-100">
                <tr>
                  <th className="summary-th w-10">Sr.</th>
                  <th className="summary-th w-40">Particulars</th>
                  <th className="summary-th">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="summary-td text-center">01</td>
                  <td className="summary-td">Per Person Cost</td>
                  <td className="summary-td">
                    Rs. {d.perPersonCost || '_____/‑'} Per Person
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">02</td>
                  <td className="summary-td">Total No. of Pax</td>
                  <td className="summary-td">
                    Approx. {d.totalPax || '06'} Person
                  </td>
                </tr>
                <tr>
                  <td className="summary-td text-center">03</td>
                  <td className="summary-td">Vehicle Type</td>
                  <td className="summary-td">
                    {d.vehicleType || 'Ertiga or Innova'}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">04</td>
                  <td className="summary-td">Hotel Category</td>
                  <td className="summary-td">
                    {d.hotelCategory || '3-Star Category'}
                  </td>
                </tr>
                <tr>
                  <td className="summary-td text-center">05</td>
                  <td className="summary-td">Meal Plan</td>
                  <td className="summary-td">
                    {d.mealPlan || 'Breakfast Only'}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">06</td>
                  <td className="summary-td">Tour Duration</td>
                  <td className="summary-td">
                    {d.tourDuration || '05 Nights 06 Days'}
                  </td>
                </tr>
                <tr>
                  <td className="summary-td text-center">07</td>
                  <td className="summary-td">Tour Date</td>
                  <td className="summary-td">
                    {d.tourDate || '05/04/2026 to 10/04/2026'}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">08</td>
                  <td className="summary-td">Pick up</td>
                  <td className="summary-td">
                    {d.pickupPoint || 'Jammu Bus Stand'}
                  </td>
                </tr>
                <tr>
                  <td className="summary-td text-center">09</td>
                  <td className="summary-td">Drop</td>
                  <td className="summary-td">
                    {d.dropPoint || 'Amritsar Airport'}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">10</td>
                  <td className="summary-td">Destinations</td>
                  <td className="summary-td">
                    {d.destinations ||
                      'Jammu, Katra, Shivkhori, Amritsar'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Accommodation */}
        <section>
          <h3 className="section-heading">Accommodation</h3>
          <p className="note-text">
            Note:
            <br />
            1. Early check-in and check-out are subject to availability of rooms,
            otherwise extra charges may be applicable as per hotel norms.
            <br />
            2. Hotel may change at the time of final booking due to availability
            of rooms.
          </p>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead className="bg-slate-100">
                <tr>
                  <th className="summary-th w-10">Sr.</th>
                  <th className="summary-th">Hotel Name</th>
                  <th className="summary-th">No. of Nights</th>
                  <th className="summary-th">Room Category</th>
                  <th className="summary-th">Room Sharing</th>
                  <th className="summary-th">Destination</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="summary-td text-center">01</td>
                  <td className="summary-td">Hotel Rama Trident</td>
                  <td className="summary-td">02 Nights</td>
                  <td className="summary-td">Standard</td>
                  <td className="summary-td">Double</td>
                  <td className="summary-td">Katra</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">02</td>
                  <td className="summary-td">Clarks Inn Express</td>
                  <td className="summary-td">01 Night</td>
                  <td className="summary-td">Standard</td>
                  <td className="summary-td">Double</td>
                  <td className="summary-td">Jammu</td>
                </tr>
                <tr>
                  <td className="summary-td text-center">03</td>
                  <td className="summary-td">One Earth GG Regency</td>
                  <td className="summary-td">01 Night</td>
                  <td className="summary-td">Standard</td>
                  <td className="summary-td">Double</td>
                  <td className="summary-td">Amritsar</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Flight Details */}
        <section>
          <h3 className="section-heading">Flight Details</h3>
          <p className="note-text">
            Note:
            <br />
            1. Flight rates and seats may change at the time of final booking.
          </p>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs">
              <thead className="bg-slate-100">
                <tr>
                  <th className="summary-th w-10">Sr.</th>
                  <th className="summary-th">From</th>
                  <th className="summary-th">To</th>
                  <th className="summary-th">Airline</th>
                  <th className="summary-th">PNR Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="summary-td text-center">01</td>
                  <td className="summary-td">
                    Pune (05/04/2026) 02:05 PM
                  </td>
                  <td className="summary-td">
                    Delhi (05/04/2026) 04:15 PM
                  </td>
                  <td className="summary-td">IndiGo 6E-2285</td>
                  <td className="summary-td">M1JMVB</td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="summary-td text-center">02</td>
                  <td className="summary-td">
                    Amritsar (10/04/2026) 11:20 PM
                  </td>
                  <td className="summary-td">
                    Pune (11/04/2026) 01:00 AM
                  </td>
                  <td className="summary-td">IndiGo 6E-6129</td>
                  <td className="summary-td">M7RHMM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Tour Itinerary */}
        <section>
          <h3 className="section-heading">Tour Itinerary</h3>
          <div className="space-y-3 text-[12px] text-slate-800">
            <ItineraryDay
              dayLabel="Day 1"
              date="05 April 2026"
              title="Arrive Delhi &amp; Proceed to Jammu–Katra"
              description="On the first day of your trip, guests depart from their own city. Upon arrival at Delhi airport or railway station proceed to Volvo junction. Overnight travel by Volvo bus from Delhi to Katra. On next day morning reach Katra around 09:00–10:00 AM."
            />
            <ItineraryDay
              dayLabel="Day 2"
              date="06 April 2026"
              title="Katra – Leisure Day"
              description="In the morning enjoy breakfast and take rest in the hotel. At noon after lunch, you can visit the local market of Katra where you can buy dry fruits, warm clothes and other varieties."
            />
            <ItineraryDay
              dayLabel="Day 3"
              date="07 April 2026"
              title="Arrival at Katra (Vaishnodevi Temple Darshan)"
              description="On arrival at Katra, our driver will transfer you to the pre‑booked hotel. Check in, freshen up and proceed to Banganga to start your trek for Mata Vaishno Devi Shrine. The trek is approx. 13 kms one way (26 kms both ways). You can hire Pithoo, Pony &amp; Palki at your own expense. Kindly note you need to take yatra slip from Katra to start the yatra. Dinner at outside hotel and overnight stay at Katra."
              places={[
                'Mata Vaishnodevi Temple',
                'Ardhkuwari',
                'Bhairavnath Temple',
                'Ban Ganga',
              ]}
            />
            <ItineraryDay
              dayLabel="Day 4"
              date="08 April 2026"
              title="Katra to Shivkhori to Jammu"
              description="After breakfast proceed to Shivkhori. Shiv Khori temple is dedicated to Lord Shiva, situated in Reasi district of Jammu &amp; Kashmir. The natural cave is almost 200 metres long and contains a self‑made lingam which is unending. You will also visit Baba Dhansar temple. After darshan, proceed back to Jammu for night stay."
              places={[
                'Lord Shiva’s Caves',
                'Shiv Parvati Temples',
                'Swami Amarnath Cave',
                'Baba Dhansar Temple',
              ]}
            />
            <ItineraryDay
              dayLabel="Day 5"
              date="09 April 2026"
              title="Jammu – Amritsar"
              description="In the morning proceed for Amritsar. Upon arrival in the evening, visit the Golden Temple which has unique Sikh architecture, built at a level lower than the surrounding land with four gates. Later, visit Jallianwala Bagh which houses a memorial of national importance to commemorate the massacre of peaceful celebrators on April 13, 1919. Return to hotel and overnight stay in Amritsar."
              places={['Golden Temple', 'Jallianwala Bagh']}
            />
            <ItineraryDay
              dayLabel="Day 6"
              date="10 April 2026"
              title="Amritsar Local and Departure"
              description="After breakfast, spend half day in Amritsar. You can explore the local market famous for warm clothes, footwear and garments. Later visit the Indo‑Pak Wagah Border ceremony and then proceed to airport or railway station for onward journey with great memories."
              places={['Atari–Indo Pak Wagah Border']}
            />
          </div>
        </section>

        {/* Closing message */}
        <section className="mt-4 border-t border-dashed border-slate-300 pt-4">
          <p className="text-[12px] text-slate-700 mb-2">
            It’s time to say goodbye to Vaishnodevi–Amritsar Tour — <span className="font-semibold">Phir Milenge!!!</span>
          </p>
          <p className="text-[12px] text-slate-700 mb-3">
            Let’s stay connected via email, phone, WhatsApp, Facebook, Instagram and more. We look forward to seeing you
            again on another memorable <span className="font-semibold">Chalo On Tour</span> trip.
          </p>
          <div className="flex items-start justify-between gap-4 text-[12px]">
            <div>
              <p className="font-semibold text-slate-800">Thanks &amp; Regards,</p>
              <p className="font-semibold text-slate-900">Chalo On Tour</p>
              <p className="font-medium text-slate-800 mt-1">
                Mr. Utkarsh Kale <span className="text-[10px] text-slate-500">(C.E.O.)</span>
              </p>
              <p className="text-slate-700">
                Cell: 99606 25167 / 91365 49898
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <p>All rates are subject to availability &amp; change at the time of confirmation.</p>
              <p>No booking has been made as of now.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ItineraryDay({ dayLabel, date, title, description, places }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/70">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-sky-600 to-sky-500 text-white">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center h-7 px-3 rounded-full bg-white/15 text-[11px] font-semibold tracking-wide uppercase">
            {dayLabel}
          </span>
          <div>
            <p className="text-xs font-semibold">{title}</p>
            <p className="text-[10px] text-sky-100">{date}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white">
        <p className="text-[12px] text-slate-800 mb-2">{description}</p>
        {Array.isArray(places) && places.length > 0 && (
          <div className="mt-1">
            <p className="font-semibold text-[11px] text-slate-900 mb-1">
              Places can be visit:
            </p>
            <ul className="list-disc list-inside text-[11px] text-slate-800 space-y-0.5">
              {places.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

