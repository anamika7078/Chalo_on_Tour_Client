'use client';

import Image from 'next/image';
import { forwardRef } from 'react';
import styles from './TourPDF.module.css';

const FingerPointIcon = () => (
    <svg viewBox="0 0 24 24" fill="#c62828" className={styles.bulletIcon} width="16" height="16">
        <path d="M21,7.24a3,3,0,0,0-5.64-1.41l-3.32,6.64A3,3,0,1,1,6.72,9.72L12,4.44l1.41,1.41-5.28,5.28a1,1,0,1,0,1.41,1.41l5.29-5.29A3,3,0,0,1,21,7.24Z" />
        <path d="M18,13a1,1,0,0,1-1-1V8.5a1,1,0,0,1,2,0V12A1,1,0,0,1,18,13Z" />
        <path d="M15,14a1,1,0,0,1-1-1V10.5a1,1,0,0,1,2,0V13A1,1,0,0,1,15,14Z" />
        <path d="M12,15a1,1,0,0,1-1-1V12.5a1,1,0,0,1,2,0V14A1,1,0,0,1,12,15Z" />
    </svg>
);

const getListItems = (value) =>
    String(value || '')
        .split(/\r?\n/)
        .map((item) => item.replace(/^[\s•\-]+/, '').trim())
        .filter(Boolean);

const TourPDFDocument = forwardRef(function TourPDFDocument({ data, compactPreview = false }, ref) {
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
        inclusions,
        exclusions,
        paymentPolicy,
        cancellationPolicy,
        termsAndConditions,
        memorableTrip,
        // Footer / contact
        ceoName,
        cell1,
        cell2,
        companyEmail,
        companyWebsite,
    } = data;

    const inclusionItems = getListItems(inclusions);
    const exclusionItems = getListItems(exclusions);
    const paymentPolicyItems = getListItems(paymentPolicy);
    const cancellationPolicyItems = getListItems(cancellationPolicy);
    const termsItems = getListItems(termsAndConditions);
    const uploadedImages = [heroMain, heroSub1, heroSub2].filter(Boolean);
    const itineraryStart = Array.isArray(itinerary) ? itinerary.slice(0, 3) : [];
    const itineraryRemaining = Array.isArray(itinerary) ? itinerary.slice(3) : [];
    const hasExtraSections = (
        itineraryRemaining.length > 0
        || inclusionItems.length > 0
        || exclusionItems.length > 0
        || paymentPolicyItems.length > 0
        || cancellationPolicyItems.length > 0
        || termsItems.length > 0
        || Boolean(memorableTrip)
    );
    const tripTitle = destinations?.trim()
        ? `Let's Explore ${destinations}`
        : "Let's Explore Your Trip";

    const footerContent = (
        <div className={styles.footer}>
            <p className={`${styles.textBlue} ${styles.bold}`}>
                Thank You
            </p>
            <p className={styles.footerNote}>
                Let's stay connected via email, phone, WhatsApp, Facebook, Instagram, and more. We look forward to seeing you again on another memorable Chalo On Tour Trip.
            </p>
            <div style={{ height: '32px' }}></div>

            <div className={styles.companyInfoFooter}>
                <div className={styles.regards}>Thanks & Regards</div>
                <div className={styles.companyLink}>CHALO ON TOUR</div>
                <div className={styles.ceoName}>{ceoName || 'Mr. Utkarsh Kale (C.E.O.)'}</div>
                <div className={styles.contactNumbers}>Cell: - {cell1} / {cell2}</div>
                <div className={styles.contactLine}>Mail ID: - <span className={styles.companyLinkInline}>{companyEmail || 'bookings@chaloontour.com'}</span></div>
                <div className={styles.contactLine}>Website: - <span className={styles.companyLinkInline}>{companyWebsite || 'www.chaloontour.com'}</span></div>
            </div>
        </div>
    );

    return (
        <div className={`${styles.pdfRoot} pdf-root-print`} ref={ref} id="pdf-document">
            {/* ── PAGE 1: COVER & SUMMARY ── */}
            <section className={`${styles.page} ${compactPreview ? styles.previewPage : ''}`}>
                <div className={styles.watermark}>
                    <Image
                        src="/Chalo-on-tour.jpg.jpeg"
                        alt="Watermark"
                        width={400}
                        height={160}
                        unoptimized
                    />
                </div>
                <div className={`${styles.pageBody} ${compactPreview ? styles.previewPageBody : ''}`}>
                    <div className={styles.header}>
                        <div className={styles.logoBox}>
                            <Image
                                src="/Chalo-on-tour.jpg.jpeg"
                                alt="Chalo On Tour"
                                width={200}
                                height={80}
                                className={styles.logoImg}
                                unoptimized
                            />
                        </div>
                        <h1 className={styles.mainTitle}>{tripTitle}</h1>
                    </div>

                    {uploadedImages.length > 0 && (
                        <div className={styles.imageSection}>
                            <div className={uploadedImages.length === 1 ? styles.singleImageWrap : styles.mainImageWrap}>
                                <Image
                                    src={uploadedImages[0]}
                                    alt="Main Tour Image"
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    unoptimized
                                />
                            </div>
                            {uploadedImages.length > 1 && (
                                <div className={styles.subImagesGrid}>
                                    {uploadedImages.slice(1).map((imageSrc, index) => (
                                        <div key={index} className={styles.subImageWrap}>
                                            <Image
                                                src={imageSrc}
                                                alt={`Secondary Tour Image ${index + 1}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                                unoptimized
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.sectionHeader}>
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>
                            <span className={styles.headingBoxText}>Tour Summary: -</span>
                        </div>
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
            <section className={`${styles.page} ${compactPreview ? styles.previewPage : ''}`}>
                <div className={styles.watermark}>
                    <Image
                        src="/Chalo-on-tour.jpg.jpeg"
                        alt="Watermark"
                        width={400}
                        height={160}
                        unoptimized
                    />
                </div>
                <div className={`${styles.pageBody} ${compactPreview ? styles.previewPageBody : ''}`}>
                    <div className={styles.sectionHeader}>
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>
                            <span className={styles.headingBoxText}>Accommodation: -</span>
                        </div>
                    </div>

                    <table className={`${styles.table} ${styles.accommodationTable}`}>
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
                        <div className={`${styles.headingBox} ${styles.blueBgHeader}`}>
                            <span className={styles.headingBoxText}>Flight Details: -</span>
                        </div>
                    </div>

                    <table className={`${styles.table} ${styles.flightTable}`}>
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
                        <div className={`${styles.headingBox} ${styles.redBgHeader}`}>
                            <span className={styles.headingBoxText}>Tour Itinerary: -</span>
                        </div>
                    </div>

                    {itineraryStart.map((day, di) => (
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

                    {!hasExtraSections && footerContent}
                </div>
            </section>

            {hasExtraSections && (
                <section className={`${styles.page} ${compactPreview ? styles.previewPage : ''}`}>
                    <div className={styles.watermark}>
                        <Image
                            src="/Chalo-on-tour.jpg.jpeg"
                            alt="Watermark"
                            width={400}
                            height={160}
                            unoptimized
                        />
                    </div>
                    <div className={`${styles.pageBody} ${compactPreview ? styles.previewPageBody : ''}`}>
                        {itineraryRemaining.map((day, di) => (
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

                        {(inclusionItems.length > 0 || exclusionItems.length > 0) && (
                            <>
                                {inclusionItems.length > 0 && (
                                    <div className={styles.optionalSection}>
                                        <div className={styles.optionalHeading}>Package Inclusions</div>
                                        <ul className={styles.optionalList}>
                                            {inclusionItems.map((item, index) => (
                                                <li key={`inc-${index}`} className={styles.optionalListItem}>
                                                    <FingerPointIcon />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {exclusionItems.length > 0 && (
                                    <div className={styles.optionalSection}>
                                        <div className={styles.optionalHeading}>Package Exclusions</div>
                                        <ul className={styles.optionalList}>
                                            {exclusionItems.map((item, index) => (
                                                <li key={`exc-${index}`} className={styles.optionalListItem}>
                                                    <FingerPointIcon />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}

                        {(paymentPolicyItems.length > 0 || cancellationPolicyItems.length > 0 || termsItems.length > 0) && (
                            <>
                                {paymentPolicyItems.length > 0 && (
                                    <div className={styles.optionalSection}>
                                        <div className={styles.optionalHeading}>Payment Policy</div>
                                        <ul className={styles.optionalList}>
                                            {paymentPolicyItems.map((item, index) => (
                                                <li key={`pay-${index}`} className={styles.optionalListItem}>
                                                    <FingerPointIcon />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {cancellationPolicyItems.length > 0 && (
                                    <div className={styles.optionalSection}>
                                        <div className={styles.optionalHeading}>Cancellation Policy</div>
                                        <ul className={styles.optionalList}>
                                            {cancellationPolicyItems.map((item, index) => (
                                                <li key={`cancel-${index}`} className={styles.optionalListItem}>
                                                    <FingerPointIcon />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {termsItems.length > 0 && (
                                    <div className={styles.optionalSection}>
                                        <div className={styles.optionalHeading}>Terms And Conditions</div>
                                        <ul className={styles.optionalList}>
                                            {termsItems.map((item, index) => (
                                                <li key={`terms-${index}`} className={styles.optionalListItem}>
                                                    <FingerPointIcon />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}

                        {memorableTrip && (
                            <div className={styles.memorableTripBox}>
                                <div className={styles.memorableTripHeading}>Tip For Memorable Trip</div>
                                <p className={styles.memorableTripText}>{memorableTrip}</p>
                            </div>
                        )}

                        {footerContent}
                    </div>
                </section>
            )}
        </div>
    );
});

export default TourPDFDocument;
