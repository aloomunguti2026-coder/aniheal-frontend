import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';

export default function Services() {
  const { services: dbServices, pricing: dbPricing, settings } = useContent();
  const [activeFilter, setActiveFilter] = useState('all');

  const emergencyPhone = settings?.emergencyHotline || '+254 700 264 432';

  const filterTabs = [
    { id: 'all', label: 'All Disciplines' },
    { id: 'one-health', label: 'One Health & Bio-Security' },
    { id: 'therapeutic', label: 'Therapeutic & Diagnostics' },
    { id: 'reproductive', label: 'Reproductive Tech & Breeding' },
    { id: 'insurance', label: 'Insurance & Feeds' },
  ];

  const defaultServices = [
    {
      _id: 'one-health-consultancy',
      id: 'one-health-consultancy',
      category: 'one-health',
      protocol: 'Service Protocol 01',
      badgeText: 'Zoonoses & Bio-Risk',
      badgeIcon: 'public',
      statusTag: 'KVB Standard Audit',
      title: 'Consultancy – One Health Infrastructure',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD8GMqS-s8oinLCAa3VcL8Xl7AQBM1TSOEF9XkmOobmDNuBcrYO1BnJzDYY41T8p8D9N9DXAJZ5xXcXs62AY48PxF50eFEK4mvnrlAmyiiDgMPdtr-U4_r1YfvJTd93s_r1lRgit73FS86IaEBFaO558hGseYNlXJUuDUeHj2wgYr0-fWtJ7mG4UE5sfCVkqHFhtPTMjJYKvI4veFlKgjAORdXijb34IbWE4OAS4B7gmYQXrKE4mb-6',
      description:
        'Direct integration of animal wellness, farm-hand occupational safety, and water-table containment. We conduct rigorous epidemiological tracking to intercept zoonotic transmissions (Brucellosis, Anthrax, Q-Fever) before contamination spreads to distribution lines.',
      features: [
        {
          icon: 'coronavirus',
          title: 'Zoonotic Surveillance',
          desc: 'Serum banking, PCR cross-testing, and human-livestock barrier analysis.',
        },
        {
          icon: 'sanitizer',
          title: 'Bio-Security Auditing',
          desc: 'Footbath integrity, disinfection gates, visitor telemetry protocols.',
        },
        {
          icon: 'water_drop',
          title: 'Effluent Management',
          desc: 'Runoff bio-filtration, manure pathogen decay monitoring.',
        },
      ],
      compliance: 'Formal WHO & WOAH One Health Guidelines Adherent',
    },
    {
      _id: 'disease-control',
      id: 'disease-control',
      category: 'one-health',
      protocol: 'Service Protocol 02',
      badgeText: 'Prophylaxis & Isolation',
      badgeIcon: 'vaccines',
      statusTag: 'Certified Cold-Chain Biologics',
      title: 'Disease Control & Prophylactic Treatment',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBgnhlSjZh6a_oC4v7hYvCuMI9VsqHpex3EdPZPLUzhyy570fhrW6SIPBaIrSEcUFUmg07n-4pAVj_BhwZtM19s8akn86fGPdra5hoBc9pm6zfqA4GubUB72rcakr5i2vzrYLAp6Yo279jWmOk5oLWefblAWC5DZBd5Jq3O2zt97mR5v5BEDu0JPTwX6_6YnYp7NSuo_HPQ_iYf17s7DDx6utqnr2aVzP0YQM-mzxyFUTedu_6OoiDF',
      description:
        'Systematic herd immunity programs designed to eliminate Foot & Mouth Disease (FMD), Contagious Bovine Pleuropneumonia (CBPP), and East Coast Fever (ECF). We oversee ring-vaccination corridors and statutory quarantine release procedures.',
      features: [
        {
          icon: 'calendar_month',
          title: 'Herd Vaccination Rosters',
          desc: 'Predictive seasonal immunization schedules tailored to regional epidemiology.',
        },
        {
          icon: 'security',
          title: 'Vector Suppression',
          desc: 'Acaricide resistance assays and precision dip-tank management.',
        },
        {
          icon: 'fence',
          title: 'Outbreak Containment',
          desc: 'Rapid physical quarantine cordon, sentinel animal tagging, and reporting.',
        },
      ],
      compliance: 'Full Veterinary Movement Permits (VMP) Documentation',
    },
    {
      _id: 'livestock-treatment',
      id: 'livestock-treatment',
      category: 'therapeutic',
      protocol: 'Service Protocol 03',
      badgeText: '24/7 Mobile Ambulatory',
      badgeIcon: 'medical_services',
      statusTag: 'On-Farm Lab Results in 20 Mins',
      title: 'Livestock Treatment & On-Farm Diagnostics',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDh5jaUFBmHwqIryyhXOLCyM_SF4fmmOIZXVxsg_bOyqhV031U28QBWBI-lloxbLb461c7qh5Wxra5XBRp1gvhADzm1p3Fm5s3knm7MuRw7FnAwdIg3oz99cOyoGYVrtm75ibJwefv0-DUnUmK0wEmq_e8py1Osc6QY6_EyW9OXuIzn2j9xZiqLTvOxLyM03ruryocUYinIHMW600l2e449l2-sMjohLy9wj2wfFJ-O-gYsbbJQLCyU',
      description:
        'Mobile surgical suites equipped for emergency c-sections, rumenotomy, abomasal displacements, and acute trauma. Supported by field blood analyzers, California Mastitis Testing (CMT), and tick-borne blood smear staining right at your crush pen.',
      features: [
        {
          icon: 'smb_share',
          title: 'Hemoparasite Scans',
          desc: 'Anaplasmosis, Babesiosis, and Theileriosis stain assays.',
        },
        {
          icon: 'precision_manufacturing',
          title: 'Field Laparotomy',
          desc: 'Aseptic abdominal interventions with continuous sedation monitoring.',
        },
        {
          icon: 'science',
          title: 'Subclinical Mastitis',
          desc: 'Quarter somatic cell counts and pathogen-targeted therapy.',
        },
      ],
      compliance: 'Priority Triage dispatched via Ambulatory Hotline',
    },
    {
      _id: 'reproductive-health',
      id: 'reproductive-health',
      category: 'reproductive',
      protocol: 'Service Protocol 04',
      badgeText: 'Genomics & Reproduction',
      badgeIcon: 'genetics',
      statusTag: 'Liquid Nitrogen Cold Chain Verified',
      title: 'Reproductive Health & Genetic Breeding',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB_9EiuR-JPwOcWNoWj0W_UeeLanbTS5rR1me9ItLQcTrmoh4237VWg-7VMsCk1ODyaO6o-YGEmS0TmAK6VylXQwCHJuru32pFMcA4UOJsdGgTtxeGdVHzrJ2cllA-w6nC_A-aTKXHcqi2yOLZXVxjHV0KBZ5wM-Oh7Ts_hkOd4Mg4x1QQGDK1PNIbfefM1fDWWXSq-hUcKD7xfEwqw6tOTBmAQB0-b3Y1Lq04PCO_5iySgjZaKBMka',
      description:
        'Accelerating dairy milk output and beef carcass conformation through high-index international and acclimatized sires. We handle hormonal oestrus synchronization for batch calving, early ultrasound gestation scans at day 28, and repeat-breeder therapy.',
      features: [
        {
          icon: 'sync_alt',
          title: 'Fixed-Time AI (FTAI)',
          desc: 'Progesterone/GnRH hormonal protocols for clustered conception.',
        },
        {
          icon: 'monitor_heart',
          title: 'Doppler Ultrasonography',
          desc: 'Ovarian follicle dynamics and fetal viability evaluations.',
        },
        {
          icon: 'grade',
          title: 'Sexed Semen Programs',
          desc: '90%+ female heifer generation from tested pedigree bulls.',
        },
      ],
      compliance: 'Authorized Distributor of Certified ABS & World Wide Sires genetics',
    },
    {
      _id: 'nutritional-assessment',
      id: 'nutritional-assessment',
      category: 'insurance',
      protocol: 'Service Protocol 05',
      badgeText: 'Agronomic Nutrition',
      badgeIcon: 'grass',
      statusTag: 'NIR Forage Spectroscopy',
      title: 'Nutritional Assessment & Feeding Programs',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDzBmA1iUjjVdHf22mm8riFhRv4ez8Tygqa7mf6CrigA6apjigthuM23h0-YOvCXA2Q36LY4KziiH-G7r1rFEsp4qEkaek1-7jBSn2oWwKlD6JnCcYUPKmXDvBvayzz7RktYyZXCav0gVjYlqs2uDVCDizDM91FKEHh5nwkLLP7zQoSd3YPhGc05beY2PYX-z-cFjMdBKKw5bub_Px0ZXRtJb5y8M1bIlnzkpn--XTeACyOjL_QWABX',
      description:
        'Feed represents up to 70% of livestock operational overhead. We formulate scientifically balanced Total Mixed Rations (TMR), calibrate mineral premixes to combat postpartum hypocalcemia (milk fever), and optimize silage fermentation to minimize dry-matter loss.',
      features: [
        {
          icon: 'pie_chart',
          title: 'TMR Formulation',
          desc: 'Computerized least-cost ration balancing using local agro-byproducts.',
        },
        {
          icon: 'grain',
          title: 'Silage Bio-Additives',
          desc: 'Inoculant regimens that slash aerobic spoilage and mycotoxin build-up.',
        },
        {
          icon: 'analytics',
          title: 'Metabolic Profiling',
          desc: 'Ketosis testing, ruminal pH sampling, and body condition scoring (BCS).',
        },
      ],
      compliance: 'Reduces Enteric Methane While Boosting Daily Milk Yield',
    },
    {
      _id: 'animal-insurance',
      id: 'animal-insurance',
      category: 'insurance',
      protocol: 'Service Protocol 06',
      badgeText: 'Risk Management',
      badgeIcon: 'verified_user',
      statusTag: 'Underwritten by Top East African Insurers',
      title: 'Animal Insurance Underwriting & Retainer Subscription',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDc4LFTEGrQ_28rCuyAwiOYBtku6XcBb2e7c0faLJPvLPQLYQZCHWDVrHvYuTtkLqFjIET2wDlb_3o9SI8RZKGrxUk9dvhw3akQm5ZpZ0-mZmqL9qdxovEEtnPQZkIioh5hh1aNhRpkWoUbmetRv6_mIdYFF2VYGkjhVLv59ovcSlM6eZw9vUzf-cOGXcmE3QW3eUJLoXu-pcXQsAAroF_YJyLymPK_WZzUjbJR8dLKP7JtnIGruJ5I',
      description:
        'Safeguard biological equity against catastrophic herd loss, calving fatalities, and epidemic diseases. AniHeal provides certified pre-underwriting valuation, biometric RFID tagging, routine compliance audits, and expedited claims post-mortems.',
      features: [
        {
          icon: 'tag',
          title: 'Biometric Tagging',
          desc: 'Tamper-proof RFID tagging integrated with national livestock registries.',
        },
        {
          icon: 'assignment_turned_in',
          title: 'Underwriting Valuation',
          desc: 'Accurate asset valuation based on pedigree, production, and parity.',
        },
        {
          icon: 'history_edu',
          title: 'Rapid Claims Autopsy',
          desc: 'KVB-certified mortality reporting completed within 24 hours of demise.',
        },
      ],
      compliance: 'Low-loss ratio protocols rewarded with annual premium discounts',
    },
  ];

  const servicesList = dbServices && dbServices.length > 0 ? dbServices : defaultServices;

  const filteredServices = servicesList.filter((item) => {
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
                  KENYA VETERINARY BOARD REGISTERED
                </span>
                <span className="text-on-surface-variant font-label-sm text-label-sm hidden sm:inline">
                  • CAP 366 STATUTORY COMPLIANCE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-end">
                <div className="lg:col-span-8">
                  <p className="font-label-lg text-label-lg uppercase tracking-wider text-secondary mb-2 font-semibold">
                    Diagnostic, Ambulatory &amp; Genetic Infrastructure
                  </p>
                  <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight font-extrabold">
                    Specialized Agro-Pastoral &amp; Veterinary Services
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-3xl">
                    Merging molecular epidemiological rigour with sustainable livestock management under
                    Kenya’s One Health mandate. Our mobile units, cold-chain ambulatory units, and senior
                    field surgeons serve progressive dairy estates, ranches, and smallholder agrarian
                    clusters nationwide.
                  </p>
                </div>
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
                  <div className="p-4 rounded-xl bg-surface-tinted flex items-center gap-3 border border-border-accent">
                    <span className="material-symbols-outlined text-primary text-[28px]">
                      local_hospital
                    </span>
                    <div>
                      <p className="font-label-md text-label-md text-primary uppercase font-bold">
                        Average Triage Dispatch
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        38 Minutes{' '}
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
                          (Central/Rift)
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container flex items-center gap-3 border border-border-hairline">
                    <span className="material-symbols-outlined text-secondary text-[28px]">biotech</span>
                    <div>
                      <p className="font-label-md text-label-md text-secondary uppercase font-bold">
                        Rapid Field Diagnostic Kits
                      </p>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        99.2% PCR Accuracy
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
              {filteredServices.map((srv) => (
                <article
                  key={srv._id || srv.title}
                  id={srv._id || srv.title}
                  className="bg-surface-clinical rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-border-hairline"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-5 relative min-h-[280px]">
                      <img
                        className="w-full h-full object-cover"
                        alt={srv.title}
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
                            {srv.protocol || 'Service Protocol'}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-semibold">
                            {srv.statusTag || 'Certified One Health'}
                          </span>
                        </div>
                        <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-3 font-bold">
                          {srv.title}
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
                            <span>Book Triage</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* SECTION: ANIMAL INSURANCE & SUBSCRIPTIONS */}
          <section className="w-full bg-surface-container py-space-2xl border-t border-border-hairline">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin">
              <div className="text-center max-w-2xl mx-auto mb-space-xl">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Predictable Clinical Protection
                </span>
                <h2 className="font-display-lg text-display-lg text-on-surface tracking-tight mt-1 font-bold">
                  Animal Insurance &amp; Health Subscriptions
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Underwritten clinical healthcare plans tailored for Dairy Herds, Beef Cattle, Companion Pets, and Working Equine across Kenya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
                <div className="rounded-2xl p-8 flex flex-col justify-between bg-surface-clinical shadow-sm border border-border-hairline hover:shadow-md">
                  <div>
                    <span className="px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold uppercase bg-surface-container text-on-surface-variant">
                      Companion &amp; Working Pets
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mt-4 mb-2 font-bold">
                      Canine &amp; Pet Shield
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                      Full emergency medical coverage, routine DHLPP/Rabies vaccinations, deworming, and surgical trauma care for working and guard dogs.
                    </p>
                    <div className="mb-6 p-4 rounded-xl border bg-surface-tinted/50 border-border-hairline">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display-lg text-display-lg text-primary font-bold">KES 1,200</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">/ month</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">Up to KES 80,000 Annual Claim Limit</span>
                    </div>
                    <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Emergency field surgery &amp; anesthesia</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Annual anti-rabies &amp; core immunization</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Zero callout charge for trauma triage</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <Link
                      className="w-full inline-flex items-center justify-center py-3.5 rounded-full font-label-lg text-label-lg transition-all font-semibold bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                      to="/animal-insurance"
                    >
                      Explore Pet Plans
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl p-8 flex flex-col justify-between bg-surface-clinical shadow-lg border-2 border-primary ring-4 ring-surface-tinted relative">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    Most Popular Shield
                  </div>
                  <div>
                    <span className="px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold uppercase bg-surface-tinted text-primary">
                      Commercial Dairy &amp; Cattle
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mt-4 mb-2 font-bold">
                      Herd Health &amp; Mortality Shield
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                      Continuous ambulatory surveillance, FMD/ECF prophylaxis, dystocia emergency c-sections, and mortality indemnity compensation.
                    </p>
                    <div className="mb-6 p-4 rounded-xl border bg-surface-tinted border-border-accent">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display-lg text-display-lg text-primary font-bold">KES 2,500</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">/ animal / mo</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">Up to KES 200,000 Cow Valuation Cover</span>
                    </div>
                    <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Bi-weekly reproductive &amp; mastitis audits</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Priority mobile ambulatory dispatch</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>KVB-certified mortality claim payouts</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <Link
                      className="w-full inline-flex items-center justify-center py-3.5 rounded-full font-label-lg text-label-lg transition-all font-semibold bg-primary text-on-primary hover:bg-secondary shadow-sm"
                      to="/animal-insurance"
                    >
                      Enroll Dairy Herd
                    </Link>
                  </div>
                </div>

                <div className="rounded-2xl p-8 flex flex-col justify-between bg-surface-clinical shadow-sm border border-border-hairline hover:shadow-md">
                  <div>
                    <span className="px-3 py-1 rounded-full font-label-sm text-label-sm font-semibold uppercase bg-surface-container text-on-surface-variant">
                      Equine &amp; Ranches
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface mt-4 mb-2 font-bold">
                      Equine &amp; Large Stock Shield
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                      Specialized surgical colic care, lameness ultrasound diagnostics, tetanus antitoxin protocols, and pre-purchase veterinary audits.
                    </p>
                    <div className="mb-6 p-4 rounded-xl border bg-surface-tinted/50 border-border-hairline">
                      <div className="flex items-baseline gap-1">
                        <span className="font-display-lg text-display-lg text-primary font-bold">KES 4,500</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">/ month</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">Up to KES 450,000 Clinical Limit</span>
                    </div>
                    <ul className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Emergency colic &amp; wound resuscitation</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Dental floating &amp; hoof health surveillance</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                        <span>Official movement permit facilitation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8 pt-6">
                    <Link
                      className="w-full inline-flex items-center justify-center py-3.5 rounded-full font-label-lg text-label-lg transition-all font-semibold bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary"
                      to="/animal-insurance"
                    >
                      View Equine Plans
                    </Link>
                  </div>
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
                      Laboratory Precision
                    </span>
                    <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1 mb-4 font-bold">
                      Diagnostics Built on Evidence, Not Guesswork
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                      Our clinicians use mobile diagnostic benches calibrated against international WOAH
                      reference limits. We preserve therapeutic efficacy by conducting antimicrobial
                      sensitivity testing (AST) before prescribing broad-spectrum antibiotics, curbing
                      local antimicrobial resistance.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            Reproductive First-Service Conception Rate (FTAI)
                          </span>
                          <span className="text-primary font-bold">68.4%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '68.4%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            Mastitis Recovery without Quarter Blindness
                          </span>
                          <span className="text-primary font-bold">94.1%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full"
                            style={{ width: '94.1%' }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-label-md text-label-md mb-1">
                          <span className="text-on-surface font-semibold">
                            Cold Chain Vaccine Viability Score
                          </span>
                          <span className="text-primary font-bold">99.8%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full"
                            style={{ width: '99.8%' }}
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
                            Herd Somatic Cell Curve (SCC)
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Post AniHeal Nutrition &amp; Sanitization Protocol (cells/mL × 1,000)
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent">
                          -48% Drop
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
                    Custom Farm Protocol Scheduling
                  </span>
                  <h2 className="font-display-lg text-display-lg font-bold leading-tight">
                    Ready to fortify your herd’s productivity?
                  </h2>
                  <p className="font-body-lg text-body-lg opacity-90 mt-2">
                    Speak directly with a Kenya Veterinary Board registered practitioner or schedule your
                    initial comprehensive farm diagnostic survey.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                  <Link
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-surface-clinical text-primary font-label-lg text-label-lg font-bold hover:bg-surface-subtle transition-all shadow-sm"
                    to="/appointment-booking"
                  >
                    Book Appointment Now
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
