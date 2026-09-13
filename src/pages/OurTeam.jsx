import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';

export default function OurTeam() {
  const { team: dbTeam, hubs: dbHubs, research: dbResearch, settings } = useContent();
  const [activeFilter, setActiveFilter] = useState('all');

  const emergencyPhone = settings?.emergencyHotline || settings?.emergencyPhone || '+254 700 264 432';

  const filterTabs = [
    { id: 'all', label: 'All Specialists' },
    { id: 'leadership', label: 'Clinical Leadership' },
    { id: 'field-surgery', label: 'Surgery & Triage' },
    { id: 'one-health', label: 'One Health & Lab' },
    { id: 'theriogenology', label: 'Genomics & Breeding' },
  ];

  const defaultDirector = {
    _id: 'dr-eleanor-vance',
    name: 'Dr. Eleanor Vance',
    title: 'BVM, MSc Large Animal Medicine, Fellow KVB',
    category: 'leadership',
    roleTag: 'Clinical Director',
    specialtyTag: 'Lead Large-Herd Clinician',
    kvbLicense: 'KVB: 0842-VS',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6uHQ0mK1vEbJJ7r5iSwnI6VManp47wrpdFR4a4mQLfZ0VYyHuIioZ1ZYRruHuVt8eQqLj__ff8hRhsBEr-q4e0TFGggcPtmt_aNgCSXUDsUPTESJ-lz7tlx2NYVgwg6QjXgdPDrLPBcksTPOcwTzk6nkcojhVyDG4W113V_weBBx5fonyW9aVoVIvNUYfPMkloDK2TY204SXrKlpf5ZFX9CqcoTK9u1KGJZiQFMFov3KNI1vK564J',
    bio: 'Serving as Senior Veterinary Director at AniHeal, Dr. Vance steers commercial herd health programs across Kenya, specializing in bovine metabolic integrity, epidemic containment, and intensive dairy health protocols. She oversees our regional clinical hubs and acts as principal advisor for One Health livestock biosecurity.',
    location: 'Naivasha & Central Rift Diagnostic Core',
    experience: '18+ Years Field Experience',
    actionLabel: 'Request Specialist Consult',
    isDirector: true,
    directorSpecialty: 'Herd Theriogenology & Metabolic Care',
    directorAccreditation: 'Licensed Surgeon (KVB/SRG/2006)',
    directorDutyHub: 'Naivasha & Central Rift Diagnostic Core',
    email: 'e.vance@aniheal.co.ke',
  };

  const defaultSpecialists = [
    {
      _id: 'dr-dennis-kipchumba',
      name: 'Dr. Dennis Kipchumba',
      title: 'BVM, MSc Veterinary Surgery (UoN)',
      category: 'field-surgery',
      roleTag: 'Surgical Lead',
      specialtyTag: 'Field Surgery',
      kvbLicense: 'KVB: 1248-VS',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAwEQECb8OurVoi2GFDxSPomx5mCzT1SPE2x6JKkK4uwMPyk36iit-a7RG1-Qt28yyNu-iiQqN-C7zWmf3jnNf0ERgucQupyrUKISH80Ov4HXHZIZ1n_zBZ-92rZqr7TzQ8xM7i9pZ5pwvilXPSndralMnY9aBrtKJpQj5YltnY8A1pq5x4ghVeQtwzFyr516MZ_UDD5uXEpxDhp_g8eq4EK23Ye7UCLLacU8LqbbPAq2La-_VWujuo',
      bio: 'Chief Field Surgeon and Emergency Triage Lead. Directs rapid response ambulatory interventions for equine abdominal crises, cesarean livestock emergencies, and orthopedic stabilization.',
      location: 'Eldoret Mobile Lab',
      experience: '12 Yrs Active',
      actionLabel: 'Dispatch Surgical Unit',
      isDirector: false,
    },
    {
      _id: 'dr-grace-wanjiku',
      name: 'Dr. Grace Wanjiku',
      title: 'BVM, PhD Vet Epidemiology (Edinburgh)',
      category: 'one-health',
      roleTag: 'Biosecurity',
      specialtyTag: 'One Health Surveillance',
      kvbLicense: 'KVB: 0917-EP',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDJS382Pd1JFmwtNrnYPt2c6NXrHF5v5CpMpmMi9PSnogKWH-XPwzspoKM-mM0xLeZYdh1U8PT0rEeYzTOLomHEHKTDTe_LEXaGfxrnSB_-eehc5w_VtsdlOrTCV8bDVvVV9FTh8uNcaTPTD4edOyoeiJslLn8YB6H8gTOKhWLmKWNCmWjgC_X-Nc3-WJBPgFPozvcLubGhggI5xxv3LJqLSq3k7GcjVz837Da_zXlEMDgEaNRFiYA0',
      bio: 'One Health & Biosecurity Director. Specialist in zoonotic spillover control, antimicrobial resistance (AMR) mitigation, and cross-border disease surveillance in commercial herds.',
      location: 'Nairobi Central HQ',
      experience: 'WOAH Contributor',
      actionLabel: 'Epidemiology Audit',
      isDirector: false,
    },
    {
      _id: 'dr-tariq-al-mansoor',
      name: 'Dr. Tariq Al-Mansoor',
      title: 'MVSc Theriogenology',
      category: 'theriogenology',
      roleTag: 'Genomics',
      specialtyTag: 'Reproductive Health',
      kvbLicense: 'KVB: 1512-TR',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB7CgHXSSzQIsuq94XF-7j_g3-QLLNmYJ2NKq4Azzia2cQBlVIzPlW296KfRAWaOUZP6R0_HzmN_1NR_E2DRbrRPIB2jkFoSmkcSLb-bsA-BM1OFyZndFWT4QQq0J03vsR8z4dO6ZZFLY81K7cjqaa1iaTUNl76QLsOzQ7ZbxzEDR97avPRl_hT53YHs3mB04SMd7QF3vAYpbKnrNjydV7jkqudpq0-P__rhQs3SNzQaa8KNOhxen8s',
      bio: "Reproductive Biology & Embryo Transfer Specialist. Leads AniHeal's advanced assisted reproduction protocols, artificial insemination synchronization, and genomics yield mapping.",
      location: 'Nakuru Cryo-Station',
      experience: 'IVF / ET Lead',
      actionLabel: 'Schedule Breeding Plan',
      isDirector: false,
    },
    {
      _id: 'dr-mercy-chebet',
      name: 'Dr. Mercy Chebet',
      title: 'BVM, MSc Veterinary Pathology',
      category: 'one-health',
      roleTag: 'Diagnostics',
      specialtyTag: 'Pathology & Toxicology',
      kvbLicense: 'KVB: 1804-PT',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBt5Ugp7zvHZCSUK9UgBJh9A7OHl0kRC-tnyY_eapNi8WqYNANRXJPe3pdjAQgFD-ZkBOChDomWhrhJzsc4yIUBSxhI8UQCqoV4W9TTRm35WNmslpBhOrkNIdVzNhqrdLg6hA05R-TrmnK1_ZRJhYHyxgEnVLTABbvfqeajQGCX7oDTwGRaleyl4qHjYp0_iBchEYjU2YzpWtkTSER2JzGzCjzhPLARP0_e0-ElWk4iPxUm1jyrzJUn',
      bio: 'Diagnostic Laboratory & Toxicology Lead. Manages biosafety PCR tests, hematological profiling, post-mortem histopathology, and pasture toxicology verification assays.',
      location: 'Kabete Reference Lab',
      experience: '24h Turnaround',
      actionLabel: 'Submit Lab Sample',
      isDirector: false,
    },
  ];

  const teamList = dbTeam && dbTeam.length > 0 ? dbTeam : [defaultDirector, ...defaultSpecialists];
  const directorMember = teamList.find((m) => m.isDirector) || defaultDirector;
  const specialistsOnly = teamList.filter((m) => !m.isDirector);

  const showDirector = activeFilter === 'all' || activeFilter === 'leadership';

  const filteredSpecialists = specialistsOnly.filter((spec) => {
    if (activeFilter === 'all') return true;
    const cat = Array.isArray(spec.category)
      ? spec.category.join(' ').toLowerCase()
      : (spec.category || spec.specialtyTag || '').toLowerCase();
    return cat.includes(activeFilter.replace('-', '')) || cat.includes(activeFilter);
  });

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-320px)]">
        <div className="flex flex-col w-full">
          {/* Sub-Header & Clinical Badging Strip */}
          <section className="w-full bg-surface-tinted py-space-xl px-margin-mobile lg:px-margin border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-clinical shadow-sm border border-border-accent">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                    KVB Regulated Faculty &amp; Fellows
                  </span>
                </div>
                <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight leading-tight font-extrabold">
                  Our Licensed Veterinary Surgeons &amp; Clinical Epidemiologists
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Accredited by the Kenya Veterinary Board (KVB). Delivering high-tier veterinary medicine,
                  One Health surveillance, and livestock genomics across Africa.
                </p>
              </div>

              {/* Quick Metrics Counter Pill */}
              <div className="flex items-center gap-4 bg-surface-clinical p-4 rounded-xl shadow-sm border border-border-hairline">
                <div className="flex flex-col pr-4">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">18+</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Years Lead Exp
                  </span>
                </div>
                <div className="flex flex-col px-4 bg-surface-container-low/60 rounded-lg py-1 border border-border-hairline">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">100%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    KVB Licensed
                  </span>
                </div>
                <div className="flex flex-col pl-2">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">47</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    Counties Active
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Interactive Filter Tabs for Disciplines */}
          <section className="w-full bg-surface py-space-md px-margin-mobile lg:px-margin border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between overflow-x-auto pb-2 gap-2">
              <div className="inline-flex p-1.5 rounded-full bg-surface-container gap-1 shadow-inner">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-primary text-on-primary shadow-sm font-semibold'
                          : 'text-on-surface-variant hover:text-primary hover:bg-surface-clinical'
                      }`}
                      onClick={() => setActiveFilter(tab.id)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm bg-surface-clinical px-3 py-1.5 rounded-full shadow-sm border border-border-hairline">
                <span className="material-symbols-outlined text-[16px] text-kvb-gold">verified</span>
                <span>Verified Under Cap 366 (Laws of Kenya)</span>
              </div>
            </div>
          </section>

          {/* Faculty Grid */}
          <section className="w-full bg-surface py-space-xl px-margin-mobile lg:px-margin">
            <div className="max-w-[1280px] mx-auto space-y-space-xl">
              {/* Primary Feature Card: Senior Director (Dr. Eleanor Vance) */}
              {showDirector && directorMember && (
                <div className="team-card leadership all bg-surface-clinical rounded-xl shadow-md p-space-lg lg:p-space-xl overflow-hidden relative border border-border-hairline">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                    <div className="lg:col-span-5 relative group">
                      <div className="overflow-hidden rounded-xl aspect-[4/5] shadow-inner bg-surface-container-high relative">
                        <img
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          alt={`Senior Veterinary Director ${directorMember.name}`}
                          src={
                            directorMember.image ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuC6uHQ0mK1vEbJJ7r5iSwnI6VManp47wrpdFR4a4mQLfZ0VYyHuIioZ1ZYRruHuVt8eQqLj__ff8hRhsBEr-q4e0TFGggcPtmt_aNgCSXUDsUPTESJ-lz7tlx2NYVgwg6QjXgdPDrLPBcksTPOcwTzk6nkcojhVyDG4W113V_weBBx5fonyW9aVoVIvNUYfPMkloDK2TY204SXrKlpf5ZFX9CqcoTK9u1KGJZiQFMFov3KNI1vK564J'
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-primary">
                          <span className="font-label-sm text-label-sm bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                            {directorMember.roleTag || 'Clinical Director'}
                          </span>
                          <span className="font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">verified</span> KVB Lic:
                            {directorMember.kvbLicense || directorMember.kvbLic || '0842-VS'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-semibold border border-border-accent">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{' '}
                          {directorMember.specialtyTag || directorMember.directorSpecialty || 'Lead Large-Herd Clinician'}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                          {directorMember.experience || directorMember.exp || '18+ Years Field Experience'}
                        </span>
                      </div>

                      <div>
                        <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold tracking-tight">
                          {directorMember.name}
                        </h2>
                        <p className="font-headline-sm text-headline-sm text-secondary mt-1 font-semibold">
                          {directorMember.title}
                        </p>
                      </div>

                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                        {directorMember.bio}
                      </p>

                      {/* Diagnostics Focus Tags */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                        <div className="bg-surface-tinted p-3 rounded-lg border border-border-hairline">
                          <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold block">
                            Specialty
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {directorMember.directorSpecialty || directorMember.specialtyTag || 'Herd Theriogenology & Metabolic Care'}
                          </span>
                        </div>
                        <div className="bg-surface-tinted p-3 rounded-lg border border-border-hairline">
                          <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold block">
                            Accreditation
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {directorMember.directorAccreditation || directorMember.kvbLicense || 'Licensed Surgeon (KVB/SRG/2006)'}
                          </span>
                        </div>
                        <div className="bg-surface-tinted p-3 rounded-lg border border-border-hairline">
                          <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold block">
                            Duty Hub
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {directorMember.directorDutyHub || directorMember.location || 'Naivasha & Central Rift Diagnostic Core'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                          className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-secondary transition-all font-semibold"
                          to="/appointment-booking"
                        >
                          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                          <span>{directorMember.actionLabel || 'Request Specialist Consult'}</span>
                        </Link>
                        {directorMember.email && (
                          <a
                            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-tinted hover:text-primary transition-colors font-semibold"
                            href={`mailto:${directorMember.email}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">mail</span>
                            <span>Direct Dispatch Inquiries</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Specialists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter" id="specialistsGrid">
                {filteredSpecialists.map((spec) => (
                  <div
                    key={spec._id || spec.name}
                    className="team-card bg-surface-clinical rounded-xl shadow-sm p-space-md flex flex-col justify-between hover:shadow-md transition-shadow group border border-border-hairline"
                  >
                    <div className="space-y-4">
                      <div className="relative overflow-hidden rounded-lg aspect-square bg-surface-container-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          alt={spec.name}
                          src={
                            spec.image ||
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuAwEQECb8OurVoi2GFDxSPomx5mCzT1SPE2x6JKkK4uwMPyk36iit-a7RG1-Qt28yyNu-iiQqN-C7zWmf3jnNf0ERgucQupyrUKISH80Ov4HXHZIZ1n_zBZ-92rZqr7TzQ8xM7i9pZ5pwvilXPSndralMnY9aBrtKJpQj5YltnY8A1pq5x4ghVeQtwzFyr516MZ_UDD5uXEpxDhp_g8eq4EK23Ye7UCLLacU8LqbbPAq2La-_VWujuo'
                          }
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-on-primary font-label-sm text-label-sm font-semibold">
                          {spec.roleTag || spec.role || 'Specialist'}
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface-clinical/90 text-primary font-label-sm text-label-sm font-semibold">
                          {spec.kvbLicense || spec.kvbLic || 'KVB Certified'}
                        </span>
                      </div>

                      <div>
                        <div className="inline-block px-2 py-0.5 rounded bg-surface-tinted text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider mb-1">
                          {spec.specialtyTag || 'Clinical Specialist'}
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                          {spec.name}
                        </h3>
                        <p className="font-body-sm text-body-sm text-secondary font-semibold">
                          {spec.title || spec.credentials}
                        </p>
                      </div>

                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-3">
                        {spec.bio}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 bg-surface-subtle -mx-space-md -mb-space-md p-space-md rounded-b-xl space-y-2 border-t border-border-hairline">
                      <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px] text-primary">
                            location_on
                          </span>{' '}
                          {spec.location || 'Mobile Lab Unit'}
                        </span>
                        <span className="font-semibold text-primary">{spec.experience || spec.exp || 'Active Field Vet'}</span>
                      </div>
                      <Link
                        className="w-full inline-flex items-center justify-center py-2 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                        to="/appointment-booking"
                      >
                        {spec.actionLabel || 'Dispatch Surgical Unit'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Regional Ambulatory & Field Para-Veterinary Corps Section */}
          <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile lg:px-margin border-t border-border-hairline">
            <div className="max-w-[1280px] mx-auto space-y-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold mb-1">
                    <span className="material-symbols-outlined text-[18px]">rv_hookup</span>
                    <span>Mobile Diagnostics Network</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    Regional Ambulatory Squads &amp; Paravets
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                    Fully mobile clinical units outfitted with portable ultrasonography, cold-chain
                    biologics, and real-time telehealth telemetry across the country.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    32 Field Units Actively Patrolling
                  </span>
                </div>
              </div>

              {/* Regional Pods Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {(dbHubs && dbHubs.length > 0 ? dbHubs : [
                  {
                    _id: 'hub-1',
                    zone: 'Zone 1: Rift Valley Cluster',
                    name: 'Nakuru, Uasin Gishu & Trans-Nzoia',
                    zoneDescription: 'Coordinated by 6 Lead Paravets and 3 Veterinary Surgeons specializing in intensive dairy cattle, herd synchronization, and Brucellosis quarantine monitoring.',
                    subtitle: 'Nakuru Ambulatory Depot',
                    responseRadiusKm: 120,
                    fleetEquipment: ['Portable Sonar & Dewormer Gun']
                  },
                  {
                    _id: 'hub-2',
                    zone: 'Zone 2: Central Highlands',
                    name: "Kiambu, Nyeri, Murang'a & Kirinyaga",
                    zoneDescription: 'Specialized smallholder zero-grazing consultation, mastitis control squads, and commercial poultry disease surveillance units operating round the clock.',
                    subtitle: 'Thika / Sagana Hub',
                    responseRadiusKm: 85,
                    fleetEquipment: ['Sub-zero Vaccine Freezers']
                  },
                  {
                    _id: 'hub-3',
                    zone: 'Zone 3: Western & Lake Basin',
                    name: 'Kakamega, Bungoma & Kisumu',
                    zoneDescription: 'Pastoralist herd interventions, trypanosomiasis tick-vector management, and sustainable piggery herd health programs with accredited village scouts.',
                    subtitle: 'Kakamega Agro-Center',
                    responseRadiusKm: 140,
                    fleetEquipment: ['Off-road Mobile Treatment Rig']
                  }
                ]).map((hub, idx) => (
                  <div key={hub._id || idx} className="bg-surface-clinical p-space-lg rounded-xl shadow-sm space-y-4 border border-border-hairline">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold">
                        {hub.zone || `Zone ${idx + 1}`}
                      </span>
                      <span className="material-symbols-outlined text-primary">sensors</span>
                    </div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      {hub.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {hub.zoneDescription || hub.address || 'Regional veterinary support base and rapid emergency response center.'}
                    </p>
                    <div className="space-y-2 pt-2 text-on-surface-variant font-body-sm text-body-sm">
                      <div className="flex justify-between py-1 bg-surface-subtle px-2 rounded border border-border-hairline">
                        <span>Station Base</span>
                        <span className="font-semibold text-on-surface">{hub.subtitle || hub.address || 'Regional Depot'}</span>
                      </div>
                      <div className="flex justify-between py-1 bg-surface-subtle px-2 rounded border border-border-hairline">
                        <span>Response Radius</span>
                        <span className="font-semibold text-on-surface">{hub.responseRadiusKm || 100} KM Max</span>
                      </div>
                      <div className="flex justify-between py-1 bg-surface-subtle px-2 rounded border border-border-hairline">
                        <span>Fleet Equipment</span>
                        <span className="font-semibold text-on-surface">
                          {Array.isArray(hub.fleetEquipment) && hub.fleetEquipment.length > 0 
                            ? hub.fleetEquipment.join(', ') 
                            : (hub.leadOfficer ? `Officer: ${hub.leadOfficer}` : 'Mobile Treatment Rig')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Clinical Quality & KVB Governance Framework */}
          <section className="w-full bg-surface-clinical py-space-2xl px-margin-mobile lg:px-margin border-t border-border-hairline">
            <div className="max-w-[1280px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
                <div className="lg:col-span-4 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent">
                    <span className="material-symbols-outlined text-[16px] text-kvb-gold">
                      verified_user
                    </span>
                    <span>Accreditation Framework</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold leading-tight">
                    Institutional Standards &amp; KVB Oversight
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Every veterinarian and paraprofessional deployed by AniHeal is individually indexed
                    in the official registry of the Kenya Veterinary Board. Our practitioners fulfill
                    mandatory continuous medical points (CPD) annually.
                  </p>
                  <div className="p-space-md rounded-xl bg-surface-subtle space-y-3 border border-border-hairline">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[28px]">shield</span>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          Cap 366 Compliance
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Veterinary Surgeons and Para-Professionals Act
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[28px]">chips</span>
                      <div>
                        <span className="font-label-md text-label-md text-on-surface font-semibold block">
                          Biosafety Level II+ Protocols
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          Certified disposal and field sterilization units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Publications & CPD Badges */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  {(dbResearch && dbResearch.length > 0 ? dbResearch : [
                    {
                      _id: 'res-1',
                      tag: 'Research Output',
                      year: 2024,
                      title: 'Subclinical Mastitis in Dual-Purpose Cattle: Surveillance Models',
                      authors: 'Authored by Dr. Eleanor Vance and Dr. Grace Wanjiku in collaboration with KALRO and ILRI.',
                      journal: 'African Journal of Animal Health, Vol 41'
                    },
                    {
                      _id: 'res-2',
                      tag: 'Technical Paper',
                      year: 2023,
                      title: 'Field Diagnostics for East Coast Fever (Theileriosis) in Rift Valley',
                      authors: 'Clinical validation and farm-level trial data on rapid lateral flow tests by Dr. Mercy Chebet.',
                      journal: 'One Health Global Review, Issue 8'
                    }
                  ]).map((res, idx) => (
                    <div key={res._id || idx} className="bg-surface-tinted p-space-md rounded-xl space-y-3 border border-border-accent">
                      <div className="flex items-center justify-between">
                        <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                          {res.tag || 'Research Output'}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                          {res.year || 2024} Peer-Reviewed
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        {res.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {res.authors || res.summary}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[16px]">menu_book</span>
                        <span>{res.journal || 'AniHeal Clinical Bulletin'}</span>
                      </div>
                    </div>
                  ))}

                  <div className="bg-surface-container p-space-md rounded-xl space-y-2 border border-border-hairline">
                    <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm font-bold">
                      <span className="material-symbols-outlined">workspace_premium</span>
                      <span>Continuous CPD Mandate</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      100% of our clinical personnel have met the 40+ annual CPD points mandated by KVB for
                      current year license renewals.
                    </p>
                  </div>

                  <div className="bg-surface-container p-space-md rounded-xl space-y-2 border border-border-hairline">
                    <div className="flex items-center gap-2 text-primary font-headline-sm text-headline-sm font-bold">
                      <span className="material-symbols-outlined">health_and_safety</span>
                      <span>Pharmacovigilance Strictness</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Veterinary medicines administered by AniHeal teams originate exclusively from
                      certified cold-chain suppliers with trace batch certificates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recruitment & Squad Callout Banner */}
          <section className="w-full bg-primary-container text-on-primary py-space-2xl px-margin-mobile lg:px-margin relative overflow-hidden">
            <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-space-lg">
              <div className="max-w-2xl space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-clinical/10 text-on-primary font-label-sm text-label-sm uppercase tracking-wider backdrop-blur-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px]">group_add</span>
                  <span>Careers in Modern Agroveterinary</span>
                </div>
                <h2 className="font-headline-xl text-headline-xl font-bold leading-tight">
                  Join Our Veterinary Ambulatory Squad
                </h2>
                <p className="font-body-lg text-body-lg opacity-90 leading-relaxed">
                  Are you a licensed veterinary surgeon, animal health technologist, or certified
                  veterinary para-professional seeking to practice modern, data-driven medicine? AniHeal
                  is expanding its fleet across Western, Mount Kenya, and Coast zones.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 font-label-md text-label-md opacity-90 font-semibold">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>{' '}
                    Competitive Remuneration
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> 4x4
                    Mobile Clinic Units
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span> Funded CPD
                    Programs
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto">
                <a
                  className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-surface-clinical text-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-surface-tinted transition-transform hover:-translate-y-0.5 text-center"
                  href="mailto:careers@aniheal.co.ke"
                >
                  Submit KVB Credentials
                </a>
                <a
                  className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary/40 text-on-primary font-label-md text-label-md hover:bg-primary/60 transition-colors text-center font-semibold"
                  href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                >
                  Talk to Veterinary Recruiter
                </a>
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
