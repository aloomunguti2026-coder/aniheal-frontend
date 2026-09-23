import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';

export default function Services() {
  const { blocks, services: dbServices, pricing: dbPricing, settings } = useContent();
  const [activeFilter, setActiveFilter] = useState('all');

  const emergencyPhone = settings?.emergencyPhone || settings?.hotlinePhone || settings?.primaryPhone || '+254 700 264 432';

  // Dynamic Content Blocks with robust fallbacks
  const heroBlock = blocks?.services_hero;
  const heroMeta = heroBlock?.metadata || {};
  const insuranceBlock = blocks?.services_insurance_header;
  const labBlock = blocks?.services_lab_precision;
  const labMeta = labBlock?.metadata || {};
  const ctaBlock = blocks?.services_cta_banner;
  const ctaMeta = ctaBlock?.metadata || {};

  const heroBadge = heroBlock?.badge || 'KENYA VETERINARY BOARD REGISTERED';
  const heroComplianceSubtext = heroMeta.complianceSubtext || 'CAP 366 STATUTORY COMPLIANCE';
  const heroSubtitle = heroBlock?.subtitle || 'Diagnostic, Ambulatory & Genetic Infrastructure';
  const heroTitle = heroBlock?.title || 'Specialized Agro-Pastoral & Veterinary Services';
  const heroBody =
    heroBlock?.body ||
    'Merging molecular epidemiological rigour with sustainable livestock management under Kenya’s One Health mandate. Our mobile units, cold-chain ambulatory units, and senior field surgeons serve progressive dairy estates, ranches, and smallholder agrarian clusters nationwide.';
  const stat1Title = heroMeta.stat1Title || 'Average Triage Dispatch';
  const stat1Value = heroMeta.stat1Value || '38 Minutes';
  const stat1Subtitle = heroMeta.stat1Subtitle || '(Central/Rift)';
  const stat2Title = heroMeta.stat2Title || 'Rapid Field Diagnostic Kits';
  const stat2Value = heroMeta.stat2Value || '99.2% PCR Accuracy';

  const filterTabs = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'one-health', label: 'One Health & Bio-Security' },
    { id: 'therapeutic', label: 'Therapeutic & Diagnostics' },
    { id: 'reproductive', label: 'Reproductive Tech & Breeding' },
    { id: 'insurance', label: 'Insurance & Feeds' },
    { id: 'diagnostics', label: 'Laboratory & Diagnostics' },
    { id: 'surgery', label: 'Field Surgery & Triage' },
  ];

  const servicesList = Array.isArray(dbServices) ? dbServices : [];
  const publishedServices = servicesList.filter((s) => s.isPublished !== false);

  const filteredServices = publishedServices.filter((item) => {
    if (activeFilter === 'all') return true;
    const cat = Array.isArray(item.category)
      ? item.category.join(' ').toLowerCase()
      : (item.category || '').toLowerCase();
    return cat.includes(activeFilter.replace('-', '')) || cat.includes(activeFilter);
  });

  const defaultPricing = [
    {
      _id: '1',
      name: 'Basic Farm Retainer',
      targetSegment: 'Smallholder & Homestead (1-10 head)',
      price: 'KES 8,500',
      period: '/ month',
      description:
        'Continuous preventative surveillance for small dairy operations and breeding pens (1-10 head).',
      badge: 'Billed quarterly or annually',
      isFeatured: false,
      buttonText: 'Subscribe to Basic',
      features: [
        'Monthly herd health & mastitis audits',
        'Vaccination calendar oversight',
        'Subsidized ambulatory callout fees',
        'Direct WhatsApp vet support group',
      ],
    },
    {
      _id: '2',
      name: 'Commercial Dairy Protocol',
      targetSegment: 'Commercial Production (11-100+ head)',
      price: 'KES 24,000',
      period: '/ month',
      description:
        'Complete herd health, reproductive scheduling, and metabolic surveillance (11-100+ head).',
      badge: 'Includes bi-weekly on-site surgeon residency',
      isFeatured: true,
      buttonText: 'Enroll Commercial Protocol',
      features: [
        'Bi-weekly ultrasound reproductive exams',
        'TMR least-cost nutritional formulation',
        'Full priority ambulatory response (zero call fee)',
        'Pre-underwriting insurance certification',
        'Quarterly farm-worker One Health hygiene training',
      ],
    },
    {
      _id: '3',
      name: 'Emergency Ambulatory',
      targetSegment: 'On-Call Contingency',
      price: 'KES 5,000',
      period: '+ mileage',
      description:
        'Direct dispatch for non-retainer emergency surgical cases, dystocia, or toxic ingestion.',
      badge: 'Diagnostic medications billed at cost',
      isFeatured: false,
      buttonText: 'Request Emergency Unit',
      features: [
        'Rapid mobile field unit mobilization',
        'Emergency surgical intervention & anesthesia',
        'Cold-chain antivenom & antitoxin stock',
        'Official statutory notification if epizootic',
      ],
    },
  ];

  const pricingList = dbPricing && dbPricing.length > 0 ? dbPricing : defaultPricing;

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-320px)]">
        <div className="flex flex-col w-full">
          {/* SECTION: SERVICES INTRO & DIAGNOSTIC OVERVIEW */}
          <section className="relative w-full overflow-hidden bg-surface-container-lowest py-space-xl lg:py-space-2xl border-b border-border-hairline">
            <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="pointer-events-none absolute bottom-0 left-12 h-80 w-80 rounded-full bg-secondary-container/20 blur-2xl"></div>

            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin relative z-10">
              {/* Breadcrumb / Status marker */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                  {heroBadge}
                </span>
                {heroComplianceSubtext && (
                  <span className="text-on-surface-variant font-label-sm text-label-sm hidden sm:inline">
                    • {heroComplianceSubtext}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
                <div className="lg:col-span-8">
                  {heroSubtitle && (
                    <p className="font-label-lg text-label-lg uppercase tracking-wider text-secondary mb-2 font-semibold">
                      {heroSubtitle}
                    </p>
                  )}
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight font-extrabold">
                    {heroTitle}
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-3xl">
                    {heroBody}
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                  <div className="p-4 rounded-xl bg-surface-tinted flex items-center gap-3 border border-border-accent">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      local_hospital
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-primary uppercase font-bold">
                        {stat1Title}
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {stat1Value}{' '}
                        {stat1Subtitle && (
                          <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                            {stat1Subtitle}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex items-center gap-3 border border-border-hairline">
                    <span className="material-symbols-outlined text-secondary text-[28px]">biotech</span>
                    <div>
                      <p className="font-label-md text-label-md text-secondary uppercase font-bold">
                        {stat2Title}
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {stat2Value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Filter Nav */}
              <div className="mt-space-xl pt-space-md">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {filterTabs.map((tab) => {
                    const isActive = activeFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        className={`px-5 py-2.5 rounded-full font-label-lg text-label-lg whitespace-nowrap transition-all cursor-pointer ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-sm font-semibold'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                        onClick={() => setActiveFilter(tab.id)}
                        type="button"
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: SERVICES DEEP-DIVE CARDS */}
          <section className="w-full bg-surface py-space-xl">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
              {filteredServices.length === 0 ? (
                <div className="py-16 text-center text-on-surface-variant bg-surface-clinical rounded-2xl border border-dashed border-border-hairline space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-outline">
                    medical_information
                  </span>
                  <h3 className="font-headline-sm font-bold text-on-surface">No Clinical Protocols Found</h3>
                  <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                    {activeFilter !== 'all'
                      ? 'There are currently no active protocols in this discipline. Try selecting "All Disciplines".'
                      : 'There are currently no clinical service protocols published in the catalog. Please contact our triage desk for direct assistance.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    {activeFilter !== 'all' && (
                      <button
                        onClick={() => setActiveFilter('all')}
                        className="px-5 py-2.5 rounded-full bg-surface-tinted text-primary font-label-md font-semibold hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                      >
                        View All Disciplines
                      </button>
                    )}
                    <Link
                      to="/appointment-booking"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-semibold shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[18px]">emergency</span>
                      <span>Contact Triage Desk</span>
                    </Link>
                  </div>
                </div>
              ) : (
                filteredServices.map((srv) => (
                <article
                  key={srv._id || srv.title}
                  id={srv._id || srv.title}
                  className="bg-surface-clinical rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-border-hairline"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 relative min-h-[280px]">
                      <img
                        className="w-full h-full object-cover"
                        alt={srv.title || srv.name}
                        src={
                          srv.image ||
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuD8GMqS-s8oinLCAa3VcL8Xl7AQBM1TSOEF9XkmOobmDNuBcrYO1BnJzDYY41T8p8D9N9DXAJZ5xXcXs62AY48PxF50eFEK4mvnrlAmyiiDgMPdtr-U4_r1YfvJTd93s_r1lRgit73FS86IaEBFaO558hGseYNlXJUuDUeHj2wgYr0-fWtJ7mG4UE5sfCVkqHFhtPTMjJYKvI4veFlKgjAORdXijb34IbWE4OAS4B7gmYQXrKE4mb-6'
                        }
                      />
                      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-clinical/90 backdrop-blur-md shadow-sm border border-border-hairline">
                        <span className="material-symbols-outlined text-primary text-[18px]">
                          {srv.badgeIcon || srv.icon || 'verified'}
                        </span>
                        <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                          {srv.badgeText || srv.badge || 'KVB Accredited'}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-semibold">
                            {srv.protocolNumber || srv.protocol || 'Service Protocol'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-semibold">
                            {srv.statusTag || 'Certified One Health'}
                          </span>
                        </div>
                        <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-3 font-bold">
                          {srv.title || srv.name}
                        </h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
                          {srv.description}
                        </p>

                        {srv.features && srv.features.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                            {srv.features.map((feat, i) => (
                              <div
                                key={i}
                                className="p-3.5 rounded-lg bg-surface-subtle border border-border-hairline"
                              >
                                <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                                  {feat.icon || 'check_circle'}
                                </span>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface text-[15px] leading-snug font-bold">
                                  {feat.title}
                                </h3>
                                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                  {feat.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-hairline">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">verified</span>
                          <span className="font-label-md text-label-md text-on-surface-variant">
                            {srv.compliance || 'Official Kenya Veterinary Board Guideline Compliant'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Link
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-surface-tinted text-primary font-label-md text-label-md font-semibold hover:bg-primary hover:text-on-primary transition-colors border border-border-hairline"
                            to={`/services/${srv.slug || srv._id}`}
                          >
                            <span>Protocol Details</span>
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                          </Link>
                          <Link
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm"
                            to="/appointment-booking"
                          >
                            <span>{srv.bookingCTA || 'Book Triage'}</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )))}
            </div>
          </section>

          {/* SECTION: ANIMAL HEALTH CARE SUBSCRIPTIONS */}
          <section className="w-full bg-surface-container py-space-2xl border-t border-border-hairline">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
              <div className="text-center max-w-3xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  {insuranceBlock?.subtitle || 'Continuous Preventative Care'}
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight mt-1 font-bold">
                  {insuranceBlock?.title || 'Animal Health Care Subscriptions'}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                  AniHeal provides structured health subscription coverage for companion pets, dairy herds, small ruminants, and working equine. Subscriptions eliminate unexpected clinical expenses by delivering continuous veterinary supervision, scheduled wellness visits, and rapid emergency ambulatory dispatch.
                </p>
              </div>

              {/* Subscription Explanation Card */}
              <div className="bg-surface-clinical rounded-3xl p-8 lg:p-10 border border-border-hairline shadow-sm max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-5 rounded-2xl bg-surface-tinted/40 border border-border-hairline space-y-2.5">
                    <span className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
                    </span>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface">
                      Proactive Preventative Care
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Bi-annual veterinary checkups, routine vaccinations, deworming cycles, and reproductive audits.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-tinted/40 border border-border-hairline space-y-2.5">
                    <span className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">emergency</span>
                    </span>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface">
                      Cashless Emergency Triage
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      24/7 mobile ambulatory dispatch to your farm or home with zero callout fees for acute emergencies.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-surface-tinted/40 border border-border-hairline space-y-2.5">
                    <span className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                    </span>
                    <h4 className="font-headline-sm text-base font-bold text-on-surface">
                      Prescription &amp; Feeds Refills
                    </h4>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      Scheduled doorstep fulfillment of certified pharmaceuticals, nutritional supplements, and vaccines.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-hairline">
                  <p className="text-xs text-on-surface-variant text-center sm:text-left">
                    Learn more about how our subscription care protocols work or explore our upcoming dedicated platform.
                  </p>
                  <Link
                    to="/animal-insurance"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold shadow-sm hover:bg-primary-container transition-all whitespace-nowrap"
                  >
                    <span>Explore Care Subscriptions</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: ONE HEALTH DIAGNOSTIC WORKFLOW / STATS */}
          <section className="w-full bg-surface py-space-2xl">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
              <div className="bg-surface-clinical rounded-2xl p-8 lg:p-12 shadow-sm border border-border-hairline">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                      {labBlock?.subtitle || 'Laboratory Precision'}
                    </span>
                    <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1 mb-4 font-bold">
                      {labBlock?.title || 'Diagnostics Built on Evidence, Not Guesswork'}
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                      {labBlock?.body ||
                        'Our clinicians use mobile diagnostic benches calibrated against international WOAH reference limits. We preserve therapeutic efficacy by conducting antimicrobial sensitivity testing (AST) before prescribing broad-spectrum antibiotics, curbing local antimicrobial resistance.'}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            {labMeta.metric1Label || 'Reproductive First-Service Conception Rate (FTAI)'}
                          </span>
                          <span className="text-primary font-bold">{labMeta.metric1Value || '68.4%'}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: labMeta.metric1Value || '68.4%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            {labMeta.metric2Label || 'Mastitis Recovery without Quarter Blindness'}
                          </span>
                          <span className="text-primary font-bold">{labMeta.metric2Value || '94.1%'}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: labMeta.metric2Value || '94.1%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            {labMeta.metric3Label || 'Cold Chain Vaccine Viability Score'}
                          </span>
                          <span className="text-primary font-bold">{labMeta.metric3Value || '99.8%'}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full transition-all duration-500"
                            style={{ width: labMeta.metric3Value || '99.8%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col gap-4">
                    {/* Inline Mini Diagnostic Graphic: Somatic Cell Trends */}
                    <div className="p-6 rounded-xl bg-surface-subtle border border-border-hairline">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {labMeta.chartTitle || 'Herd Somatic Cell Curve (SCC)'}
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {labMeta.chartSubtitle || 'Post AniHeal Nutrition & Sanitization Protocol (cells/mL × 1,000)'}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent">
                          {labMeta.chartBadge || '-48% Drop'}
                        </span>
                      </div>
                      {/* Bar Chart Representation */}
                      <div className="w-full h-36 flex items-end gap-3 pt-4">
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-outline-variant/40 rounded-t h-28"></div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Wk 1
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-outline-variant/60 rounded-t h-24"></div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Wk 2
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-secondary/70 rounded-t h-16"></div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Wk 4
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary rounded-t h-10"></div>
                          <span className="font-label-sm text-label-sm text-primary font-semibold">
                            Wk 8
                          </span>
                        </div>
                        <div className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-primary rounded-t h-8"></div>
                          <span className="font-label-sm text-label-sm text-primary font-bold">
                            Wk 12
                          </span>
                        </div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 text-center">
                        Measured across 42 commercial herds in Nakuru, Kiambu, and Uasin Gishu.
                      </p>
                    </div>

                    <Link
                      to="/appointment-booking"
                      className="p-4 rounded-xl bg-surface-tinted flex items-center justify-between border border-border-accent hover:bg-secondary-container/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-[28px]">
                          biotech
                        </span>
                        <div>
                          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            Field Molecular PCR
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Targeted DNA identification for foot-and-mouth strain categorization
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION: CALL TO ACTION */}
          <section className="w-full bg-surface-clinical py-space-xl">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
              <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 text-on-primary flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-on-primary/15 font-label-sm text-label-sm uppercase tracking-wider mb-3 font-semibold">
                    {ctaBlock?.subtitle || 'Custom Farm Protocol Scheduling'}
                  </span>
                  <h2 className="font-display-lg text-display-lg font-bold leading-tight">
                    {ctaBlock?.title || 'Ready to fortify your herd’s productivity?'}
                  </h2>
                  <p className="font-body-lg text-body-lg opacity-90 mt-2">
                    {ctaBlock?.body ||
                      'Speak directly with a Kenya Veterinary Board registered practitioner or schedule your initial comprehensive farm diagnostic survey.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <Link
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-surface-clinical text-primary font-label-lg text-label-lg font-bold hover:bg-surface-subtle transition-all shadow-sm"
                    to="/appointment-booking"
                  >
                    {ctaMeta.buttonText || 'Book Appointment Now'}
                  </Link>
                  <a
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-on-primary/20 text-on-primary font-label-lg text-label-lg hover:bg-on-primary/30 transition-all font-semibold"
                    href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                    <span>{emergencyPhone}</span>
                  </a>
                </div>
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
