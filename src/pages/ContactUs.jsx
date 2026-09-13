import React, { useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';
import { API_BASE_URL } from '../services/api';

export default function ContactUs() {
  const { settings, hubs: dbHubs, faqs: dbFaqs } = useContent();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneContact: '',
    emailAddress: '',
    countySelect: '',
    inquiryType: 'clinical',
    messageText: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketRef, setTicketRef] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const email = settings?.contactEmail || 'clinical@aniheal.co.ke';
  const phone = settings?.contactPhone || '+254 700 264 432';
  const emergencyPhone = settings?.emergencyHotline || '+254 700 264 432';

  const defaultFaqs = [
    {
      q: "What are AniHeal's emergency ambulatory response timeframes?",
      a: 'For critical bovine obstetrics (dystocia), acute bloat, or downer cow emergencies within our 45-kilometer radius hubs (Kabete, Nakuru, Eldoret, Nyeri), our dedicated rapid response units dispatch immediately with an average on-farm arrival time between 25 and 45 minutes. For rural smallholdings beyond active radii, we initiate instant WhatsApp Tele-Triage to guide farm managers through primary intervention steps while our vehicle is en route.',
    },
    {
      q: 'What payment methods are supported for field procedures and diagnostics?',
      a: 'We accept instant settlement via Safaricom M-Pesa Buy Goods Till 894022 (AniHeal Agro-Vet Ltd) directly on site. For corporate commercial dairies, agricultural cooperatives, and subscribed enterprises under our Animal Insurance & Subscription retainer, 30-day corporate invoices and direct bank transfers (RTGS/EFT) are standard.',
    },
    {
      q: 'What biosecurity protocols do AniHeal clinicians follow upon entering a farm?',
      a: 'In strict compliance with the Kenya Veterinary Board (KVB) and One Health antimicrobial stewardship guidelines, our mobile ambulatory vans feature self-contained disinfection gear. Veterinarians deploy virgin disposable overshoes or autoclave-sanitized gumboots with broad-spectrum Virkon-S foot dips prior to crossing farm perimeter gates. All surgical kits, A.I. guns, and ultrasound probes undergo clinical sterilization between client farm visits to prevent horizontal pathogen transmission (e.g., FMD, Brucellosis, Mastitis).',
    },
    {
      q: 'Can AniHeal assist with cross-border animal health documentation and export certification?',
      a: 'Yes. Our senior consulting veterinarians liaise directly with County Veterinary Directors and the Directorate of Veterinary Services (DVS) at Kabete. We conduct statutory quarantine screening, serological testing, Brucella/TB profiling, and rabies titer verification to facilitate valid international movement permits for breeding stock and companion animals.',
    },
  ];

  const faqsList = dbFaqs && dbFaqs.length > 0
    ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
    : defaultFaqs;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        farmerName: formData.fullName || 'Valued Farmer',
        farmName: formData.fullName ? `${formData.fullName}'s Farm` : 'Client Holding',
        phone: formData.phoneContact,
        email: formData.emailAddress || '',
        county: formData.countySelect || 'Nairobi Central',
        speciesType: 'general',
        clinicalService: formData.inquiryType || 'general_inquiry',
        dispatchTier: formData.inquiryType === 'clinical' ? 'emergency' : 'standard',
        symptomsDescription: formData.messageText || 'Inquiry logged via Contact Us portal',
      };

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.data?.ticketRef) {
        setTicketRef(data.data.ticketRef);
        setIsSubmitted(true);
        setErrorMsg('');
        setFormData({
          fullName: '',
          phoneContact: '',
          emailAddress: '',
          countySelect: '',
          inquiryType: 'clinical',
          messageText: '',
        });
      } else {
        setIsSubmitted(false);
        setTicketRef('');
        if (res.status >= 500) {
          setErrorMsg(data?.message || 'Server error encountered while sending message. Please try again.');
        } else {
          setErrorMsg(data?.message || 'Failed to submit contact triage ticket. Please verify inputs.');
        }
      }
    } catch (err) {
      console.error('Contact submit network error:', err);
      setIsSubmitted(false);
      setTicketRef('');
      setErrorMsg('Unable to submit your triage request. The server is currently unavailable. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-320px)]">
        <div className="flex flex-col w-full">
          {/* Top Emergency Ticker & Dispatch Availability */}
          <section className="w-full bg-surface-container-high py-2.5 px-margin-mobile lg:px-margin border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-ping"></span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Live Status: Field Units Operational
                </span>
                <span className="text-on-surface-variant text-[12px] hidden sm:inline font-medium">
                  • Real-time GPS-directed fleet in Nairobi, Nakuru, Eldoret &amp; Nyeri basins
                </span>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                  KVB Registered Fleet #VET-MOB-449
                </span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <span className="material-symbols-outlined text-[16px]">timer</span>
                  Average Dispatch: &lt; 28 Mins
                </span>
              </div>
            </div>
          </section>

          {/* Editorial Section Header */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-gradient-to-b from-surface-tinted/40 to-surface border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">satellite_alt</span>
                    <span>KVB-CERTIFIED CLINICAL AGRO-VET DISPATCH</span>
                  </div>
                  <h1 className="font-display-lg text-display-lg text-on-background tracking-tight font-extrabold leading-tight">
                    Contact AniHeal Veterinary Solutions
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                    24/7 Field Ambulatory Response across Central Kenya, Rift Valley, and Nationwide
                    Agro-Consultancy. Direct link to licensed veterinary surgeons, diagnostic trucks, and
                    farm health specialists.
                  </p>
                </div>

                {/* Quick Triage Badges Stack */}
                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-3 min-w-[280px]">
                  <a
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white font-label-lg text-label-lg shadow-md hover:bg-[#1EBE5D] transition-transform hover:-translate-y-0.5 font-semibold"
                    href={`https://wa.me/${emergencyPhone.replace(/[^0-9]/g, '')}?text=EMERGENCY%20TRIAGE%20REQUEST:%20Livestock%20Distress`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>WhatsApp Emergency Tele-Triage</span>
                  </a>
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-clinical shadow-sm text-on-surface-variant font-label-sm text-label-sm border border-border-hairline">
                    <span className="material-symbols-outlined text-primary text-[18px]">lock_clock</span>
                    <span>Routine: Mon–Sat 07:00–18:00 | Emergencies: 24/7/365</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact Ribbon */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-space-lg">
                <div className="p-5 rounded-xl bg-surface-clinical shadow-sm flex items-start gap-3.5 border border-border-hairline">
                  <div className="p-2.5 rounded-lg bg-surface-tinted text-primary">
                    <span className="material-symbols-outlined text-[24px]">call</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-bold">
                      Central Dispatch Line
                    </span>
                    <a
                      className="font-headline-sm text-headline-sm text-primary hover:underline font-bold"
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                    >
                      {phone}
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                      Direct link to Mobile Paramedic Desk
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-clinical shadow-sm flex items-start gap-3.5 border border-border-hairline">
                  <div className="p-2.5 rounded-lg bg-surface-tinted text-primary">
                    <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
                  </div>
                  <div className="truncate">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-bold">
                      Electronic Medical Records
                    </span>
                    <a
                      className="font-headline-sm text-headline-sm text-on-surface hover:text-primary transition-colors truncate block font-bold"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                      General: info@aniheal.co.ke
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-surface-clinical shadow-sm flex items-start gap-3.5 border border-border-hairline">
                  <div className="p-2.5 rounded-lg bg-surface-tinted text-kvb-gold">
                    <span className="material-symbols-outlined text-[24px]">payments</span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-bold">
                      Direct Till &amp; Farm Billing
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface block font-bold">
                      M-Pesa Buy Goods: 894022
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                      Official Name: AniHeal Agro-Vet Ltd
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Contact Interface & Regional Stations */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin">
            <div className="max-w-[1280px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                {/* Left Column: Direct Inquiry & Field Request Form */}
                <div className="lg:col-span-7 bg-surface-clinical rounded-xl shadow-md p-6 sm:p-space-lg border border-border-hairline">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                        Fast Routing Engine
                      </span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Book Ambulatory or Clinical Service
                      </h2>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[32px]">
                      local_shipping
                    </span>
                  </div>

                  <form className="space-y-5" id="anihealContactForm" onSubmit={handleSubmit}>
                    {errorMsg && (
                      <div className="p-4 rounded-xl bg-error-container text-on-error-container text-body-sm font-semibold flex items-center gap-3 border border-error/30 animate-fade-in">
                        <span className="material-symbols-outlined text-[24px] text-error">error</span>
                        <div className="flex-1">
                          <strong className="block font-bold">Contact Submission Notice:</strong>
                          <span>{errorMsg}</span>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                          htmlFor="fullName"
                        >
                          Full Name / Farm Enterprise *
                        </label>
                        <input
                          className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                          id="fullName"
                          placeholder="e.g. Dr. Kamau / Riftview Dairy"
                          required
                          type="text"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                          htmlFor="phoneContact"
                        >
                          Phone / M-Pesa Number *
                        </label>
                        <input
                          className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                          id="phoneContact"
                          placeholder="+254 7XX XXX XXX"
                          required
                          type="tel"
                          value={formData.phoneContact}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                          htmlFor="emailAddress"
                        >
                          Email Address
                        </label>
                        <input
                          className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                          id="emailAddress"
                          placeholder="kamau@dairykenya.com"
                          type="email"
                          value={formData.emailAddress}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                          htmlFor="countySelect"
                        >
                          Location / County *
                        </label>
                        <select
                          className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                          id="countySelect"
                          required
                          value={formData.countySelect}
                          onChange={handleChange}
                        >
                          <option disabled value="">
                            Select Operational County
                          </option>
                          <option value="Nairobi / Kiambu (Kabete Central)">Nairobi / Kiambu (Kabete Central)</option>
                          <option value="Nakuru (Rift Valley Hub)">Nakuru (Rift Valley Hub)</option>
                          <option value="Uasin Gishu / Eldoret Basin">Uasin Gishu / Eldoret Basin</option>
                          <option value="Nyeri / Mt. Kenya Region">Nyeri / Mt. Kenya Region</option>
                          <option value="Kilifi / Coastal Livestock">Kilifi / Coastal Livestock</option>
                          <option value="Other Agro-Ecological Zone">Other Agro-Ecological Zone</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                        htmlFor="inquiryType"
                      >
                        Nature of Inquiry *
                      </label>
                      <select
                        className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                        id="inquiryType"
                        required
                        value={formData.inquiryType}
                        onChange={handleChange}
                      >
                        <option value="clinical">Emergency / Ambulatory Clinical Visit</option>
                        <option value="retainer">
                          Commercial Farm Retainer &amp; Preventive Herd Health
                        </option>
                        <option value="reproduction">
                          Reproductive Synchronization / Artificial Insemination (A.I.)
                        </option>
                        <option value="diagnostics">
                          On-Site Pathological &amp; Mastitis Diagnostic Lab
                        </option>
                        <option value="supply">Agro-Vet Pharmaceuticals Supply Partnership</option>
                        <option value="internship">Veterinary Residency &amp; Agro-Tech Internship</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface mb-1.5 font-semibold"
                        htmlFor="messageText"
                      >
                        Herd Status, Clinical Observations, or Message *
                      </label>
                      <textarea
                        className="w-full p-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-tinted focus:border-primary transition-colors"
                        id="messageText"
                        placeholder="Detail species (dairy cattle, shoats, canine), number of affected animals, symptoms, landmarks for ambulatory navigation..."
                        required
                        rows="4"
                        value={formData.messageText}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-surface-tinted text-on-surface-variant border border-border-accent">
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        health_and_safety
                      </span>
                      <p className="font-body-sm text-body-sm">
                        Biosecurity assurance: Every AniHeal mobile unit arrives sanitized with
                        disposable boots, Virkon-S footbaths, and KVB-audited cold-chain handling kits.
                      </p>
                    </div>

                    <button
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 h-12 rounded-full font-label-lg text-label-lg shadow-sm transition-all cursor-pointer ${
                        isSubmitting
                          ? 'bg-secondary text-on-primary'
                          : 'bg-primary-container text-on-primary hover:bg-primary'
                      }`}
                      id="submitBtn"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                          <span>Transmitting Dispatch Request...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[20px]">send</span>
                          <span>Submit Urgent Medical Dispatch Request</span>
                        </>
                      )}
                    </button>

                    {errorMsg && (
                      <div
                        className="p-4 rounded-xl bg-error-container text-on-error-container font-label-md text-label-md animate-fade-in border-2 border-error/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm"
                        id="contactErrorMessage"
                        role="alert"
                      >
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="material-symbols-outlined text-[24px] text-error shrink-0">
                            cloud_off
                          </span>
                          <span>{errorMsg}</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold shadow hover:brightness-95 transition-all cursor-pointer whitespace-nowrap shrink-0 disabled:opacity-50"
                          id="contactRetryBtn"
                        >
                          {isSubmitting ? 'Retrying...' : 'Retry'}
                        </button>
                      </div>
                    )}

                    {isSubmitted && (
                      <div
                        className="p-4 rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md animate-fade-in border border-secondary/20"
                        id="formSuccessMessage"
                      >
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <span className="material-symbols-outlined text-[20px]">check_circle</span>
                          <span>Triage Ticket #{ticketRef} Queued with Central Dispatch</span>
                        </div>
                        Your inquiry has been queued with central dispatch. An on-call Veterinary
                        Officer will contact you within 15 minutes.
                      </div>
                    )}
                  </form>

                  {/* Field Diagnostic Fleet Vignette */}
                  <div className="mt-space-lg pt-space-md bg-surface-subtle rounded-xl p-5 border border-border-hairline">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                        Ambulatory Fleet In Action
                      </span>
                      <span className="font-label-sm text-label-sm text-primary font-semibold">
                        Cold Chain + Ultrasound Equipped
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="relative rounded-lg overflow-hidden h-36 bg-surface-container border border-border-hairline">
                        <img
                          className="w-full h-full object-cover"
                          alt="Mobile Lab Fleet #3"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdMipf_wHgAU1jJHBgzZ-6Av_FOWhaYTe_R9-pUVcedYopdfsqz05h2pLUvunESqUTs5qQ7PE4qFASeBGVWfVSZvspJFb4JPAt5kk3WO0D9tu2HlST18cJ3ygPKcaYjKN3hJrJ8lyFMrr5ozKgdT1YM4lsEa7ZpWUMDO1_Y_AY42lHfrKIfvOn6JZx30CnGUq2rCrWC_AYy4ozTsbtvRFnM5Bb1gl2r4BcFoGaHWLvSF3AtJW7KU2B"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-clinical/90 text-on-surface font-label-sm text-label-sm font-semibold">
                          Mobile Lab Fleet #3
                        </div>
                      </div>
                      <div className="relative rounded-lg overflow-hidden h-36 bg-surface-container border border-border-hairline">
                        <img
                          className="w-full h-full object-cover"
                          alt="Rift Valley Herd Triage"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuKHTURKZQOaYcfibAeMONBddKmwPREFD5iGH_CqqzH9tQiNalVh80yYdaD0v6ZSKMqKPTXd_0lYTdqHA5_Cwdky_5a9BRoHxuJSzbVZM74updOwNHCc1AXfrfkW8MxahBdJocfbPQmqZzW6CoJQiaYRUeQWT0LznnWguWv_dvn3UzlMalVH4Xa9Iag7GOCQmDzydia2FrRZvqduy8IrpPc0j6sLiA3Lp11DHLJ1WDkXDuT04mMW0v"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-surface-clinical/90 text-on-surface font-label-sm text-label-sm font-semibold">
                          Rift Valley Herd Triage
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Regional Ambulatory Hubs & Stations */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                        Strategic Presence
                      </span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Ambulatory Hubs &amp; Stations
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary font-bold">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>{' '}
                      {dbHubs && dbHubs.length > 0 ? `${dbHubs.length} Active Hubs` : '5 Active Hubs'}
                    </span>
                  </div>

                  {(dbHubs && dbHubs.length > 0 ? dbHubs : [
                    {
                      _id: 'hub-hq',
                      name: 'Headquarters & Kabete Central Clinic',
                      subtitle: 'Tier-1 Surgical & Pathological Lab',
                      stationType: 'headquarters',
                      address: 'Veterinary Complex, Kabete Road, Nairobi, Kenya',
                      phone: phone,
                      leadOfficer: 'Dr. M. Gatheca, DVM',
                    },
                    {
                      _id: 'hub-nakuru',
                      name: 'Nakuru & Rift Valley Ambulatory Hub',
                      subtitle: 'Dairy, Feedlot & Commercial Pasture Unit',
                      stationType: 'hub',
                      address: 'George Morara Rd, Central Industrial Area, Nakuru',
                      phone: emergencyPhone,
                      leadOfficer: 'Dr. Eleanor Vance',
                      coverageAreas: ['Naivasha', 'Rongai', 'Njoro']
                    },
                    {
                      _id: 'hub-eldoret',
                      name: 'Eldoret Dairy Basin Station',
                      subtitle: 'Genetics & Synchronization Station',
                      stationType: 'station',
                      address: 'Uganda Rd, Agri-Business Mile, Eldoret',
                      phone: phone,
                      leadOfficer: 'Dr. Dennis Kipchumba',
                      coverageAreas: ['Uasin Gishu', 'Trans Nzoia']
                    },
                    {
                      _id: 'hub-nyeri',
                      name: 'Nyeri Mount Kenya Regional Station',
                      subtitle: 'Smallholder Agro-Vet Outreach',
                      stationType: 'station',
                      address: "Ruring'u Agricultural Hub, Nyeri County",
                      phone: phone,
                      leadOfficer: 'Dr. Grace Wanjiku',
                      coverageAreas: ['Nyeri', 'Kirinyaga', 'Muranga']
                    },
                    {
                      _id: 'hub-kilifi',
                      name: 'Kilifi Coastal & Livestock Unit',
                      subtitle: 'Tropical Disease & Vector Control',
                      stationType: 'outpost',
                      address: 'Mnarani Agricultural Outpost, Kilifi Coastal Strip',
                      phone: phone,
                      leadOfficer: 'Dr. Tariq Al-Mansoor',
                      coverageAreas: ['Kilifi', 'Mombasa', 'Kwale']
                    }
                  ]).map((hub, idx) => (
                    <div
                      key={hub._id || idx}
                      className="p-5 rounded-xl bg-surface-clinical shadow-sm hover:shadow-md transition-shadow border border-border-hairline"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg ${hub.stationType === 'headquarters' ? 'bg-primary-container text-on-primary' : hub.stationType === 'hub' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-primary'}`}>
                            <span className="material-symbols-outlined text-[20px]">
                              {hub.stationType === 'headquarters' ? 'domain' : hub.stationType === 'hub' ? 'agriculture' : 'location_on'}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                              {hub.name}
                            </h3>
                            <span className="font-label-sm text-label-sm text-primary font-semibold">
                              {hub.subtitle || (hub.zone ? `Zone: ${hub.zone}` : 'Regional Support Depot')}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-surface-tinted text-primary font-bold uppercase">
                          {hub.stationType === 'headquarters' ? 'Main Hub' : hub.stationType || 'Station'}
                        </span>
                      </div>
                      <p className="mt-3 font-body-md text-body-md text-on-surface-variant flex items-start gap-2">
                        <span className="material-symbols-outlined text-[18px] text-outline mt-0.5">
                          pin_drop
                        </span>
                        <span>{hub.address}</span>
                      </p>
                      <div className="mt-3 pt-3 flex flex-wrap items-center justify-between gap-2 text-label-md font-label-md bg-surface-subtle p-2.5 rounded-lg border border-border-hairline">
                        <a
                          className="text-primary hover:underline font-bold flex items-center gap-1"
                          href={`tel:${(hub.phone || phone).replace(/\s+/g, '')}`}
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span> {hub.phone || phone}
                        </a>
                        <span className="text-outline text-[13px]">
                          {hub.leadOfficer ? `Station Lead: ${hub.leadOfficer}` : (Array.isArray(hub.coverageAreas) && hub.coverageAreas.length > 0 ? `Covers: ${hub.coverageAreas.join(', ')}` : 'Ambulatory Dispatch Ready')}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Interactive Static Map View */}
                  <div className="rounded-xl overflow-hidden shadow-sm mt-4 bg-surface-subtle border border-border-hairline">
                    <div
                      className="w-full h-44 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3sQHZm8XJ9JFoetAa_Bx6Bhgnv5kIorTfUXS3HKPIBrzlo4mN4k5dMG0lHzJxTI-G9-e00yt-GD4pxzS9ka94BSnx96bFRjCF0bn7jHxeHC-1OZXYNovL-D-IlPuuWU4MwGAWiQJUvaYn33bxVpCbhEyovL7n8kFZEpXtHvPiTj3AUVxhOl-IaylfNgdu5qu4302IbEcsSN0214l91GMze2Crx4uocVbVkZYj03ypTQyPRLMeVwcs')`,
                      }}
                    ></div>
                    <div className="p-3 bg-surface-clinical flex items-center justify-between text-label-sm font-label-sm text-on-surface-variant">
                      <span className="font-semibold">National Operations Coverage Map</span>
                      <a
                        className="text-primary hover:underline font-semibold flex items-center gap-1"
                        href="https://maps.google.com/?q=Kabete+Veterinary+Laboratories+Nairobi"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Open in Google Maps</span>
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive FAQ Section */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface-container-low border-t border-border-hairline">
            <div className="max-w-[1000px] mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-space-lg">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Frequently Addressed Questions
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface mt-1 font-bold">
                  Field Service &amp; Protocol Clarifications
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Clear procedural expectations on emergency response timeframes, payment verification,
                  and farm biosafety standards.
                </p>
              </div>

              <div className="space-y-3" id="faqAccordion">
                {faqsList.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-surface-clinical rounded-xl shadow-sm overflow-hidden border border-border-hairline transition-colors"
                    >
                      <button
                        className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                        onClick={() => toggleFaq(index)}
                        type="button"
                      >
                        <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                          {faq.q}
                        </span>
                        <span
                          className={`material-symbols-outlined text-primary transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 pt-1 text-on-surface-variant font-body-md text-body-md leading-relaxed animate-fade-in">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Emergency Strip above Footer */}
          <section className="w-full bg-surface-tinted/60 py-4 border-t border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">emergency</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Animal Emergency Triage Hotline:
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Rapid Field Unit dispatch available 24/7 in Central &amp; Rift Valley
                </span>
              </div>
              <a
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-[#991B1B] transition-colors"
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
              >
                <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
                <span>Call {emergencyPhone}</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
