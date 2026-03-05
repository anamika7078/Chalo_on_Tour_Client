'use client';

import Image from 'next/image';
import { forwardRef } from 'react';
import styles from './TourPDF.module.css';

// SVG Icons
const NamasteIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.namasteImg}>
        <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const FingerPointIcon = () => (
    <svg viewBox="0 0 24 24" fill="#c62828" className={styles.bulletIcon} width="16" height="16">
        <path d="M21,7.24a3,3,0,0,0-5.64-1.41l-3.32,6.64A3,3,0,1,1,6.72,9.72L12,4.44l1.41,1.41-5.28,5.28a1,1,0,1,0,1.41,1.41l5.29-5.29A3,3,0,0,1,21,7.24Z" />
        <path d="M18,13a1,1,0,0,1-1-1V8.5a1,1,0,0,1,2,0V12A1,1,0,0,1,18,13Z" />
        <path d="M15,14a1,1,0,0,1-1-1V10.5a1,1,0,0,1,2,0V13A1,1,0,0,1,15,14Z" />
        <path d="M12,15a1,1,0,0,1-1-1V12.5a1,1,0,0,1,2,0V14A1,1,0,0,1,12,15Z" />
    </svg>
);

const TourPDFDocument = forwardRef(function TourPDFDocument({ data }, ref) {
    const {
        // Summary
        perPersonCost,
        totalPax,
        vehicleType,
        hotelCategory,
        mealPlan,
        tourDuration,
        tourDateFrom,
        tourDateTo,
        pickupPoint,
        dropPoint,
        destinations,
        // Hero images (optional uploads)
        heroMain,
        heroSub1,
        heroSub2,
        // Hotels
        hotels,
        // Flights
        flights,
        // Itinerary
        itinerary,
        // Notes
        accommodationNote,
        flightNote,
        // Footer / contact
        ceoName,
        cell1,
        cell2,
        // Doc meta
        quoteNumber,
        quoteDate,
    } = data;

    return (
        <div className={`${styles.pdfRoot} pdf-root-print`} ref={ref} id="pdf-document">
            {/* ── PAGE 1: COVER & SUMMARY ── */}
            <section className={styles.page}>
                <div className={styles.watermark}>
                    <Image
                        src="/chalo-on-tour-e1766686260447.png"
                        alt="Watermark"
                        width={400}
                        height={160}
                        unoptimized
                    />
                </div>
                <div className={styles.pageBody}>
                    <div className={styles.header}>
                        <div className={styles.logoBox}>
                            <Image
                                src="/chalo-on-tour-e1766686260447.png"
                                alt="Chalo On Tour"
                                width={200}
                                height={80}
                                className={styles.logoImg}
                                unoptimized
                            />
                        </div>
                        <h1 className={styles.mainTitle}>Let's Explore Vaishnodevi & Amritsar</h1>
                    </div>

                    <div className={styles.imageSection}>
                        <div className={styles.mainImageWrap}>
                            <Image
                                src={heroMain || "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=2070&auto=format&fit=crop"}
                                alt="Main Tour Image"
                                fill
                                style={{ objectFit: 'cover' }}
                                unoptimized
                            />
                        </div>
                        <div className={styles.subImagesGrid}>
                            <div className={styles.subImageWrap}>
                                <Image
                                    src={heroSub1 || "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1974&auto=format&fit=crop"}
                                    alt="Secondary Tour Image 1"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                            </div>
                            <div className={styles.subImageWrap}>
                                <Image
                                    src={heroSub2 || "https://images.unsplash.com/photo-1621840212003-7f287e0767ce?q=80&w=2070&auto=format&fit=crop"}
                                    alt="Secondary Tour Image 2"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.sectionHeader}>
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>Tour Summary: -</div>
                    </div>

                    <table className={`${styles.table} ${styles.summaryTable}`}>
                        <tbody>
                            <tr><td>01.</td><td>Per Person Cost</td><td>Rs. {perPersonCost || '—'} /- Per Person</td></tr>
                            <tr><td>02.</td><td>Total No. of Pax</td><td>Approx. {totalPax || '06 Person'}</td></tr>
                            <tr><td>03.</td><td>Vehicle Type</td><td>{vehicleType || 'Ertiga or Innova'}</td></tr>
                            <tr><td>04.</td><td>Hotel Category</td><td>{hotelCategory || '3-Star Category'}</td></tr>
                            <tr><td>05.</td><td>Meal Plan</td><td>{mealPlan || 'Breakfast Only'}</td></tr>
                            <tr><td>06.</td><td>Tour Duration</td><td>{tourDuration || '05 Nights 06 Days'}</td></tr>
                            <tr><td>07.</td><td>Tour Date</td><td>{tourDateFrom || '05/04/26'} to {tourDateTo || '10/04/2026'}</td></tr>
                            <tr><td>08.</td><td>Pick up</td><td>{pickupPoint || 'Jammu Bus Stand'}</td></tr>
                            <tr><td>09.</td><td>Drop</td><td>{dropPoint || 'Amritsar Airport'}</td></tr>
                            <tr><td>10.</td><td>Destinations</td><td>{destinations || 'Jammu, Katra, Shivkhori, Amritsar.'}</td></tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── PAGE 2: ACCOMMODATION, FLIGHTS & ITINERARY START ── */}
            <section className={styles.page}>
                <div className={styles.watermark}>
                    <Image
                        src="/chalo-on-tour-e1766686260447.png"
                        alt="Watermark"
                        width={400}
                        height={160}
                        unoptimized
                    />
                </div>
                <div className={styles.pageBody}>
                    <div className={styles.sectionHeader}>
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>Accommodation: -</div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Hotel Name</th>
                                <th>No. of Nights</th>
                                <th>Room Category</th>
                                <th>Room Sharing</th>
                                <th>Destination</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hotels && hotels.length > 0 ? (
                                hotels.map((h, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>0{i + 1}.</td>
                                        <td>{h.name}</td>
                                        <td>{h.nights}</td>
                                        <td>{h.roomCategory}</td>
                                        <td>{h.roomSharing}</td>
                                        <td>{h.destination}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No accommodation details provided.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {accommodationNote && (
                        <div className={styles.noteBox}>
                            (Note- {accommodationNote})
                        </div>
                    )}

                    <div className={styles.sectionHeader}>
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>Flight Details: -</div>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Airline</th>
                                <th>PNR Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights && flights.length > 0 ? (
                                flights.map((f, i) => (
                                    <tr key={i}>
                                        <td style={{ textAlign: 'center' }}>0{i + 1}.</td>
                                        <td>{f.from} {f.depDate} {f.depTime}</td>
                                        <td>{f.to} {f.arrDate} {f.arrTime}</td>
                                        <td>{f.airline} {f.flightNo}</td>
                                        <td style={{ fontWeight: 'bold' }}>{f.pnr}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center' }}>No flight details provided.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {flightNote && (
                        <div className={styles.noteBox}>
                            (Note- {flightNote})
                        </div>
                    )}

                    <div className={styles.sectionHeader} style={{ textAlign: 'left' }}>
                        <div className={`${styles.headingBox} ${styles.redBgHeader}`}>Tour Itinerary: -</div>
                    </div>

                    {itinerary && itinerary.slice(0, 3).map((day, di) => (
                        <div key={di} className={styles.itineraryContent}>
                            <div className={styles.dayLabel}>
                                {day.dayLabel || `Day ${di + 1}`} :– {day.title} ({day.date})
                            </div>
                            <p className={styles.itineraryDesc}>{day.description}</p>
                            {day.places && day.places.length > 0 && (
                                <div>
                                    <div className={styles.placesTitle}>Places to Visit: -</div>
                                    <ul className={styles.placesList}>
                                        {day.places.map((place, pi) => (
                                            <li key={pi} className={styles.placeItem}>
                                                <FingerPointIcon />
                                                {place}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── PAGE 3: ITINERARY CONTINUED & FOOTER ── */}
            <section className={styles.page}>
                <div className={styles.watermark}>
                    <Image
                        src="/chalo-on-tour-e1766686260447.png"
                        alt="Watermark"
                        width={400}
                        height={160}
                        unoptimized
                    />
                </div>
                <div className={styles.pageBody}>
                    {itinerary && itinerary.slice(3).map((day, di) => (
                        <div key={di + 3} className={styles.itineraryContent}>
                            <div className={styles.dayLabel}>
                                {day.dayLabel || `Day ${di + 4}`} :– {day.title} ({day.date})
                            </div>
                            <p className={styles.itineraryDesc}>{day.description}</p>
                            {day.places && day.places.length > 0 && (
                                <div>
                                    <div className={styles.placesTitle}>Places to Visit: -</div>
                                    <ul className={styles.placesList}>
                                        {day.places.map((place, pi) => (
                                            <li key={pi} className={styles.placeItem}>
                                                <FingerPointIcon />
                                                {place}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className={styles.footer}>
                        <p className={`${styles.textBlue} ${styles.bold}`}>
                            It's time to say goodbye Vaishnodevi Amritsar Tour — Phir Milenge!!!
                        </p>
                        <p className={styles.footerNote}>
                            Let's stay connected via email, phone, WhatsApp, Facebook, Instagram, and more. We look forward to seeing you again on another memorable Chalo On Tour Trip.
                        </p>

                        <div className={styles.signatureGrid}>
                            <div className={styles.namasteBox}>
                                <NamasteIcon />
                            </div>
                            <div className={styles.companyInfoFooter}>
                                <div className={styles.regards}>Thanks & Regards</div>
                                <div className={styles.companyLink}>CHALO ON TOUR</div>
                                <div className={styles.ceoName}>{ceoName || 'Mr. Utkarsh Kale (C.E.O.)'}</div>
                                <div className={styles.contactNumbers}>Cell: - {cell1} / {cell2}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
});

export default TourPDFDocument;
