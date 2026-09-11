import React, { useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function Home() {
  const [formData, setFormData] = useState({
    livestockCategory: '',
    serviceCategory: '',
    farmCounty: '',
    visitDate: '',
    herdCount: '',
    producerName: '',
    producerPhone: '',
    clinicalNotes: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full">
          {/* Top Accreditation & Regulatory Status Bar */}
          <section className="w-full bg-surface-container-low py-space-sm px-margin-mobile lg:px-gutter">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-space-sm text-label-sm font-label-sm">
              <div className="flex items-center gap-space-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  KENYA VETERINARY BOARD ACCREDITED
                </span>
                <span className="text-on-surface-variant hidden sm:inline">
                  • Practice License KVB/PR/2025/0842
                </span>
              </div>
              <div className="flex items-center gap-space-md text-on-surface-variant">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                  One Health Alliance Member
                </span>
                <span className="hidden md:inline text-on-surface-variant/40">|</span>
                <span className="hidden md:inline">24/7 Mobile Triage Response</span>
              </div>
            </div>
          </section>

          {/* Hero Section */}
          <section className="relative w-full bg-surface-clinical overflow-hidden py-space-xl lg:py-space-2xl">
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-surface-tinted blur-2xl pointer-events-none"></div>
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
              {/* Left Column: Copy & CTAs */}
              <div className="lg:col-span-7 flex flex-col items-start gap-space-lg">
                <div className="inline-flex items-center gap-space-xs px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  ACCREDITED KENYA VETERINARY CONSULTANCY
                </div>
                <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
                  Professional Consultancy <span className="text-on-background">You Can Trust</span>
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl">
                  AniHeal veterinary consultancy works on providing sustainable animal related solutions
                  in fields of veterinary medicine, One Health, animal husbandry and animal welfare.
                </p>

                {/* Dual CTA Row */}
                <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto">
                  <a
                    className="inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:bg-secondary transition-all transform hover:-translate-y-0.5"
                    href="#booking-dispatch"
                  >
                    <span>Get Help from Us</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </a>
                  <a
                    className="inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-full bg-surface-tinted text-primary font-label-lg text-label-lg hover:bg-secondary-container/50 transition-all"
                    href="#clinical-services"
                  >
                    <span>Explore Services &amp; Solutions</span>
                    <span className="material-symbols-outlined text-[18px]">biotech</span>
                  </a>
                </div>

                {/* Social Presence & Quick Connect */}
                <div className="flex items-center gap-space-sm pt-space-xs">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Follow Clinical Updates:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      aria-label="Facebook"
                      className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                      href="#"
                    >
                      <span className="material-symbols-outlined text-[16px]">public</span>
                    </a>
                    <a
                      aria-label="Twitter / X"
                      className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                      href="#"
                    >
                      <span className="material-symbols-outlined text-[16px]">tag</span>
                    </a>
                    <a
                      aria-label="Instagram"
                      className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-colors"
                      href="#"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    </a>
                  </div>
                </div>

                {/* Metric Badges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm w-full pt-space-md">
                  <div className="p-space-sm rounded-lg bg-surface-subtle flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">KVB</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Accredited Practice
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-subtle flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">100%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      One Health Focused
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-subtle flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">24/7</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Field Triage Units
                    </span>
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-subtle flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">14+</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Counties Covered
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Composite & Brand Insignia */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md bg-surface-container-low rounded-2xl p-space-lg shadow-md border border-border-hairline">
                  {/* Primary Brand Badge */}
                  <div className="bg-surface-clinical rounded-xl p-space-md shadow-sm flex flex-col items-center justify-center text-center">
                    <img
                      alt="AniHeal Veterinary Solutions Official Emblem"
                      className="w-full max-w-[280px] h-auto object-contain"
                      src="https://lh3.googleusercontent.com/aida/AEtjO1WXRU6SkdH2B4lJUTRkkG5jjNrZS6J_FfZ_9jGdtW5C2Hmju9dr4yiVjhwhkF3oiIlYJNh3S2yTo4gUaTp5FHYYMVkIuF5T0zAGkSQmkU_nvyj-8EzP6IEN9Xkde0ZmCaVDS1YDGDpUqrWHF5DP03eYOe_Nq5V67puwWs8Kvr-NJ5q0iUgnvmGMhJKEk4VBGl-TPvmIXCU4qG0z1fAXp2NGARC7oT9NmZrjUmZ8LkUnfAVhqZWvzKrS2w"
                    />
                    <div className="mt-space-sm inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-tinted text-secondary font-label-sm text-label-sm">
                      <span className="w-2 h-2 rounded-full bg-primary"></span>
                      Healthy Animals • Healthy People • Healthy Planet
                    </div>
                  </div>

                  {/* Clinical Diagnostic Snapshot Card */}
                  <div className="mt-space-md bg-surface-clinical rounded-xl p-space-md shadow-sm">
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">
                        Field Triage Status
                      </span>
                      <span className="px-2 py-0.5 rounded text-label-sm font-label-sm bg-secondary-container text-on-secondary-fixed-variant">
                        Active Mobile Units
                      </span>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <div className="w-10 h-10 rounded-full bg-surface-tinted flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[22px]">
                          ambulance
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
                          Central &amp; Rift Valley Squads
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Diagnostics, Ultrasound &amp; Vaccine Dispensary
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KVB Official Certification Seal Strip */}
                  <div className="mt-space-sm p-space-sm rounded-lg bg-surface-tinted flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-kvb-gold text-[20px]">
                        military_tech
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        KVB Verified Clinical Practice
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-primary font-bold">ACC/2025</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section id="why-choose-us" className="w-full bg-surface-subtle py-space-2xl">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter flex flex-col gap-space-xl">
              <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold mb-space-xs">
                  Core Practice Pillars
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                  Why Choose us
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
                  Built on surgical rigor, preventive epidemiological discipline, and certified regulatory
                  compliance.
                </p>
              </div>

              {/* 3 Primary Clinical Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Pillar 1 */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-border-hairline">
                  <div className="w-1 h-full bg-primary absolute top-0 left-0"></div>
                  <div className="flex flex-col gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[26px]">stethoscope</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Experienced Veterinary Team
                      </h3>
                      <p className="font-label-md text-label-md text-primary font-semibold mt-1">
                        Accredited By The KVB
                      </p>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Licensed veterinary surgeons, livestock epidemiologists, and reproduction technicians
                      adhering to the highest standards of the Kenya Veterinary Board.
                    </p>
                  </div>
                  {/* KVB Regulatory Banner inside card */}
                  <div className="mt-space-lg pt-space-md bg-surface-subtle rounded-lg p-space-md flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        verified_user
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                        Official Certification
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-tinted text-primary font-label-sm text-label-sm font-bold">
                      KVB Verified
                    </span>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-border-hairline">
                  <div className="w-1 h-full bg-primary absolute top-0 left-0"></div>
                  <div className="flex flex-col gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[26px]">biotech</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Science-Driven solutions
                      </h3>
                      <p className="font-label-md text-label-md text-secondary font-semibold mt-1">
                        Evidence-Based Diagnostics
                      </p>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      We combine diagnostics, research, and practical veterinary care for accurate
                      decision-making.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md bg-surface-subtle rounded-lg p-space-md flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        science
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                        Field Lab Testing
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                      Rapid Panels
                    </span>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group border border-border-hairline">
                  <div className="w-1 h-full bg-primary absolute top-0 left-0"></div>
                  <div className="flex flex-col gap-space-md">
                    <div className="w-12 h-12 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[26px]">verified</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                        Trusted Across the Animal Health Chain
                      </h3>
                      <p className="font-label-md text-label-md text-primary font-semibold mt-1">
                        Holistic Value Network
                      </p>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Supporting farmers, pet owners, and livestock enterprises with dependable care.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md bg-surface-subtle rounded-lg p-space-md flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-[20px]">hub</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                        Producers &amp; Herds
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-tinted text-primary font-label-sm text-label-sm font-bold">
                      Nationwide
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Core Services Showcase */}
          <section className="w-full bg-surface-clinical py-space-2xl" id="clinical-services">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter flex flex-col gap-space-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                    Specialized Veterinary Practice
                  </span>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                    AniHeal Clinical Services
                  </h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                  Structured agro-veterinary interventions engineered for sustainable animal
                  productivity, preventative health, and community safety.
                </p>
              </div>

              {/* 6 Key Service Units Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
                {/* Service 1: One Health Consultancy */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">public</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-0.5 rounded bg-surface-tinted">
                        Core Focus
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Consultancy – One Health
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Integrating human, animal, and environmental ecosystems for zoonotic disease
                      prevention, biosafety audits, and climate-resilient animal agriculture.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Zoonosis &amp; Biosafety
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      Consult <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>

                {/* Service 2: Disease Control & Treatment */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">vaccines</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-bold px-2 py-0.5 rounded bg-secondary-container">
                        Epidemiology
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Disease Control &amp; Treatment
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Systematic herd vaccination regimes, biosecurity barriers, transboundary livestock
                      disease alerts, and acute clinical therapeutic interventions.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Vaccines &amp; Protocols
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      View Protocols{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>

                {/* Service 3: Livestock Treatment & Diagnostics */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">medical_services</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-0.5 rounded bg-surface-tinted">
                        Ambulatory
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Livestock Treatment &amp; Diagnostics
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Ambulatory farm-gate diagnosis, hematology profiles, tick-borne pathogen
                      screenings, mastitis diagnostic milk cultures, and surgical procedures.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      On-Farm Lab Diagnostics
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      Request Diagnostics{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>

                {/* Service 4: Animal Insurance & Subscription */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">shield</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-kvb-gold font-bold px-2 py-0.5 rounded bg-surface-tinted">
                        Herd Security
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Animal Insurance &amp; Subscription
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Comprehensive livestock insurance verification, scheduled preventive audits,
                      mortality mitigation coverage, and affordable monthly veterinary retainers.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Commercial &amp; Dairy Plans
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      Subscription Rates{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>

                {/* Service 5: Reproductive Health & Breeding */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">rebase_edit</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-0.5 rounded bg-surface-tinted">
                        Genetics
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Reproductive Health &amp; Breeding Management
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Artificial insemination (AI) programs, high-yield sire genetics selection, heat
                      synchronization, ultrasound pregnancy checks, and dystocia intervention.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      AI &amp; Pregnancy Scanning
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      Breeding Program{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>

                {/* Service 6: Nutritional Assessment & Feeding Programs */}
                <div className="bg-surface-subtle rounded-xl p-space-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow border border-border-hairline">
                  <div>
                    <div className="flex items-center justify-between mb-space-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[22px]">grain</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-bold px-2 py-0.5 rounded bg-secondary-container">
                        Productivity
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                      Nutritional Assessment &amp; Feeding Programs
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Total mixed ration (TMR) optimization, fodder analysis, mycotoxin binding protocols,
                      body condition scoring, and drought-hardy silages.
                    </p>
                  </div>
                  <div className="mt-space-md pt-space-sm flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Ration Balancing
                    </span>
                    <a
                      className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1"
                      href="#booking-dispatch"
                    >
                      Ration Consult{' '}
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Rapid Farm Dispatch & Appointment Booking Form */}
          <section className="w-full bg-surface-subtle py-space-2xl" id="booking-dispatch">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter">
              <div className="bg-surface-clinical rounded-2xl shadow-sm p-space-lg lg:p-space-xl border border-border-hairline">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                  {/* Left Instructions & Direct Channels */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    <div className="flex flex-col gap-space-md">
                      <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold w-fit">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        FIELD CLINICAL APPOINTMENT
                      </div>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                        Schedule Farm Visit or Clinical Triage
                      </h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">
                        Direct dispatch to commercial farms, smallholder dairy units, ranches, and
                        companion animal households throughout Kenya.
                      </p>
                      {/* Urgent Triage Box */}
                      <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex flex-col gap-space-xs">
                        <div className="flex items-center gap-space-xs font-bold text-label-md font-label-md text-kvb-red">
                          <span className="material-symbols-outlined text-[20px]">
                            e911_emergency
                          </span>
                          Acute Animal Emergency?
                        </div>
                        <p className="font-body-sm text-body-sm">
                          Do not wait for form confirmation. Call our 24/7 Field Ambulatory Hotline
                          directly at{' '}
                          <a href="tel:+254700264432" className="font-bold underline">
                            +254 700 264 432
                          </a>
                          .
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Live Triage Shortcut */}
                    <div className="mt-space-lg pt-space-md">
                      <a
                        className="w-full flex items-center justify-between p-space-md rounded-xl bg-surface-tinted hover:bg-secondary-container transition-colors text-primary"
                        href="https://wa.me/254700264432"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-[24px]">chat</span>
                          <div className="flex flex-col text-left">
                            <span className="font-label-md text-label-md font-bold text-on-surface">
                              WhatsApp Photo/Tele-Triage
                            </span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">
                              Send photos/video of symptoms
                            </span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </a>
                    </div>
                  </div>

                  {/* Right: Interactive Scheduling Matrix */}
                  <div className="lg:col-span-8">
                    <form className="flex flex-col gap-space-md" id="triageForm" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        {/* Animal Enterprise / Category */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="livestockCategory"
                          >
                            Animal Category / Herd Type
                          </label>
                          <select
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="livestockCategory"
                            value={formData.livestockCategory}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Livestock / Animal Type</option>
                            <option value="dairy">Dairy Cattle (Pedigree &amp; Crossbred)</option>
                            <option value="beef">Beef Cattle / Ranch Production</option>
                            <option value="shoats">Goats &amp; Sheep (Small Ruminants)</option>
                            <option value="poultry">Poultry (Layers, Broilers, Kienyeji)</option>
                            <option value="swine">Piggery / Swine Enterprise</option>
                            <option value="equine">Equine (Horses &amp; Donkeys)</option>
                            <option value="companion">Companion Animal (Canine / Feline)</option>
                          </select>
                        </div>
                        {/* Service Needed */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="serviceCategory"
                          >
                            Requested Clinical Service
                          </label>
                          <select
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="serviceCategory"
                            value={formData.serviceCategory}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Primary Concern</option>
                            <option value="onehealth">One Health Consultancy &amp; Farm Audit</option>
                            <option value="disease">Disease Outbreak / Herd Treatment</option>
                            <option value="diagnostics">
                              On-Farm Lab Diagnostics &amp; Blood Panel
                            </option>
                            <option value="insurance">Animal Insurance Health Verification</option>
                            <option value="breeding">AI, Estrus Sync &amp; Ultrasound Scanning</option>
                            <option value="nutrition">Nutritional Rations &amp; Fodder Analysis</option>
                            <option value="routine">Routine Vaccination &amp; Parasite Control</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
                        {/* Location / County */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="farmCounty"
                          >
                            Region / County
                          </label>
                          <select
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="farmCounty"
                            value={formData.farmCounty}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Location</option>
                            <option value="nairobi">Nairobi County</option>
                            <option value="kiambu">Kiambu County</option>
                            <option value="nakuru">Nakuru County</option>
                            <option value="uasin_gishu">Uasin Gishu / Eldoret</option>
                            <option value="kajiado">Kajiado County</option>
                            <option value="nyeri">Nyeri / Mt Kenya</option>
                            <option value="muranga">Murang'a County</option>
                            <option value="kilifi">Kilifi / Coast Hub</option>
                            <option value="other">Other Regional Dispatch</option>
                          </select>
                        </div>
                        {/* Preferred Date */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="visitDate"
                          >
                            Preferred Date
                          </label>
                          <input
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="visitDate"
                            value={formData.visitDate}
                            onChange={handleChange}
                            required
                            type="date"
                          />
                        </div>
                        {/* Herd Size / Animals Affected */}
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="herdCount"
                          >
                            Herd Headcount / Cases
                          </label>
                          <input
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="herdCount"
                            placeholder="e.g. 24 Dairy Cows"
                            value={formData.herdCount}
                            onChange={handleChange}
                            required
                            type="text"
                          />
                        </div>
                      </div>

                      {/* Contact Particulars */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="producerName"
                          >
                            Farmer / Farm Enterprise Name
                          </label>
                          <input
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="producerName"
                            placeholder="Full Name or Farm Registry"
                            value={formData.producerName}
                            onChange={handleChange}
                            required
                            type="text"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="producerPhone"
                          >
                            Primary Telephone / M-Pesa Contact
                          </label>
                          <input
                            className="h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                            id="producerPhone"
                            placeholder="+254 7XX XXX XXX"
                            value={formData.producerPhone}
                            onChange={handleChange}
                            required
                            type="tel"
                          />
                        </div>
                      </div>

                      {/* Clinical Notes */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          className="font-label-md text-label-md text-on-surface font-semibold"
                          htmlFor="clinicalNotes"
                        >
                          Clinical Symptoms or Objectives
                        </label>
                        <textarea
                          className="p-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-md font-body-md text-on-surface focus:outline-none focus:bg-surface-clinical focus:border-primary"
                          id="clinicalNotes"
                          placeholder="Describe symptoms (e.g. drop in milk production, fever, breathing distress, sudden mortalities, or breeding audit goals)..."
                          rows="3"
                          value={formData.clinicalNotes}
                          onChange={handleChange}
                        ></textarea>
                      </div>

                      {/* Submit Action */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                        <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            verified
                          </span>
                          <span>Direct triage review by licensed KVB veterinary officer</span>
                        </div>
                        <button
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-xl py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-secondary transition-all cursor-pointer"
                          type="submit"
                        >
                          <span>Schedule Veterinary Visit / Dispatch Triage</span>
                          <span className="material-symbols-outlined text-[18px]">send</span>
                        </button>
                      </div>

                      {/* Success Alert Message */}
                      {submitted && (
                        <div
                          className="p-space-md rounded-xl bg-surface-tinted border border-border-accent text-on-surface animate-fade-in"
                          id="bookingSuccessMsg"
                        >
                          <div className="flex items-center gap-space-xs">
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              check_circle
                            </span>
                            <span className="font-label-md text-label-md font-bold text-primary">
                              Triage Request Received Successfully!
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            Thank you, <strong className="text-on-surface">{formData.producerName || 'Farmer'}</strong>.
                            Our regional ambulatory dispatch officer is reviewing your case details for {formData.farmCounty || 'your location'}.
                            A licensed veterinary surgeon will contact you directly at <strong className="text-on-surface">{formData.producerPhone || 'your phone number'}</strong> shortly.
                          </p>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Verbatim Mission & Vision Section */}
          <section className="w-full bg-surface-clinical py-space-2xl">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg items-stretch">
                {/* Our Mission Card */}
                <div className="bg-surface-tinted rounded-2xl p-space-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-accent">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-10 h-10 rounded-full bg-surface-clinical flex items-center justify-center text-primary shadow-sm">
                        <span className="material-symbols-outlined text-[22px]">target</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
                        Purpose &amp; Commitment
                      </span>
                    </div>
                    <h2 className="font-headline-xl text-headline-xl text-primary font-bold">
                      Our Mission
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                      To deliver long-lasting, affordable and sustainable animal health solutions that
                      empower farmers, veterinarians and communities across Africa - integrating
                      one-health principles, climate smart practices and innovation to combat diseases,
                      strengthen food systems and advance animal welfare.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md flex items-center gap-space-md text-label-sm font-label-sm text-secondary font-semibold">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">eco</span> Climate-Smart
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">diversity_1</span>{' '}
                      Community-Empowered
                    </span>
                  </div>
                </div>

                {/* Our Vision Card */}
                <div className="bg-surface-subtle rounded-2xl p-space-xl flex flex-col justify-between shadow-sm relative overflow-hidden border border-border-hairline">
                  <div className="flex flex-col gap-space-md">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-10 h-10 rounded-full bg-surface-clinical flex items-center justify-center text-secondary shadow-sm">
                        <span className="material-symbols-outlined text-[22px]">visibility</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-widest">
                        Future Outlook
                      </span>
                    </div>
                    <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                      Our Vision
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                      A world where animal life matters, every farmer thrives and every community is
                      protected.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md flex items-center gap-space-md text-label-sm font-label-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[16px]">pets</span>{' '}
                      Animal Welfare First
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        agriculture
                      </span>{' '}
                      Thriving Agribusiness
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Strategic Collaborations Section */}
          <section id="collaborations" className="w-full bg-surface-subtle py-space-2xl">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter flex flex-col gap-space-xl">
              <div className="text-center max-w-2xl mx-auto flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest">
                  Institutional Network
                </span>
                <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                  Collaborations &amp; Partnerships
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Partnering across government entities, pharmaceutical manufacturers, and research
                  bodies to advance One Health across East Africa.
                </p>
              </div>

              {/* 3 Tier Partner Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Government & Regulators */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm border border-border-hairline">
                  <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">account_balance</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Government &amp; Veterinary Authorities
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Collaborating with the Directorate of Veterinary Services (DVS), Kenya Veterinary
                    Board (KVB), and County Agriculture departments on statutory disease surveillance
                    and vaccination.
                  </p>
                  <span className="mt-auto font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                    Statutory Compliance
                  </span>
                </div>

                {/* Pharmaceuticals & Cold Chain */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm border border-border-hairline">
                  <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">medication</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Pharmaceutical &amp; Biological Suppliers
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Sourcing accredited high-stability cold chain vaccines, high-potency veterinary
                    therapeutics, and certified antiparasitics with strict traceability.
                  </p>
                  <span className="mt-auto font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                    Cold-Chain Assurance
                  </span>
                </div>

                {/* Research & Academic Institutions */}
                <div className="bg-surface-clinical rounded-xl p-space-lg shadow-sm flex flex-col gap-space-sm border border-border-hairline">
                  <div className="w-10 h-10 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">school</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Academic &amp; Research Institutions
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Conducting field validation trials, antimicrobial resistance (AMR) monitoring, and
                    livestock disease transmission mapping with universities and research consortia.
                  </p>
                  <span className="mt-auto font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                    Applied One Health Research
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Direct Farmer Support & Tele-Triage Banner */}
          <section className="w-full bg-primary text-on-primary py-space-xl">
            <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter flex flex-col md:flex-row items-center justify-between gap-space-lg">
              <div className="flex flex-col gap-space-xs text-center md:text-left max-w-2xl">
                <span className="font-label-sm text-label-sm text-on-primary/80 uppercase font-bold tracking-widest">
                  Rapid Response Service
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold">
                  Need Immediate Clinical Assistance on Your Farm?
                </h2>
                <p className="font-body-md text-body-md text-on-primary/90">
                  Our field veterinary team provides real-time WhatsApp visual triage, emergency
                  ambulatory dispatch, and immediate drug dosage guidance.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-space-sm shrink-0">
                <a
                  className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-full bg-surface-clinical text-primary font-label-lg text-label-lg shadow-sm hover:bg-surface-tinted transition-all"
                  href="https://wa.me/254700264432"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>WhatsApp Vet Now</span>
                </a>
                <a
                  className="inline-flex items-center gap-space-xs px-space-lg py-3 rounded-full bg-error text-on-error font-label-lg text-label-lg shadow-sm hover:bg-kvb-red transition-all"
                  href="tel:+254700264432"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  <span>Hotline: +254 700 ANIHEAL</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
