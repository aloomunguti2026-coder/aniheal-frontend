import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';

const DEFAULT_DIRECTOR_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC6uHQ0mK1vEbJJ7r5iSwnI6VManp47wrpdFR4a4mQLfZ0VYyHuIioZ1ZYRruHuVt8eQqLj__ff8hRhsBEr-q4e0TFGggcPtmt_aNgCSXUDsUPTESJ-lz7tlx2NYVgwg6QjXgdPDrLPBcksTPOcwTzk6nkcojhVyDG4W113V_weBBx5fonyW9aVoVIvNUYfPMkloDK2TY204SXrKlpf5ZFX9CqcoTK9u1KGJZiQFMFov3KNI1vK564J';

const DEFAULT_SPECIALIST_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAwEQECb8OurVoi2GFDxSPomx5mCzT1SPE2x6JKkK4uwMPyk36iit-a7RG1-Qt28yyNu-iiQqN-C7zWmf3jnNf0ERgucQupyrUKISH80Ov4HXHZIZ1n_zBZ-92rZqr7TzQ8xM7i9pZ5pwvilXPSndralMnY9aBrtKJpQj5YltnY8A1pq5x4ghVeQtwzFyr516MZ_UDD5uXEpxDhp_g8eq4EK23Ye7UCLLacU8LqbbPAq2La-_VWujuo';

export default function OurTeam() {
  const { team: dbTeam, hubs: dbHubs, research: dbResearch, settings, loading } = useContent();
  const [activeFilter, setActiveFilter] = useState('all');

  const emergencyPhone = settings?.emergencyPhone || settings?.hotlinePhone || settings?.primaryPhone || '+254 700 264 432';

  const filterTabs = [
    { id: 'all', label: 'All Specialists' },
    { id: 'leadership', label: 'Clinical Leadership' },
    { id: 'field-surgery', label: 'Surgery & Triage' },
    { id: 'one-health', label: 'One Health & Lab' },
    { id: 'theriogenology', label: 'Genomics & Breeding' },
    { id: 'diagnostics', label: 'Diagnostics & Pathology' },
  ];

  // Team list directly derived from live database
  const teamList = Array.isArray(dbTeam) ? dbTeam : [];

  // Find designated Senior Clinical Director
  const directorMember = teamList.find((m) => m.isDirector) || null;

  // Specialists (excluding the top featured director if one is designated)
  const specialistsOnly = directorMember
    ? teamList.filter((m) => m._id !== directorMember._id)
    : teamList;

  // Show director card if filter is 'all' or matches director's categories
  const showDirector =
    directorMember &&
    (activeFilter === 'all' ||
      activeFilter === 'leadership' ||
      (Array.isArray(directorMember.category)
        ? directorMember.category.some(
          (c) =>
            c.toLowerCase().includes(activeFilter.replace(/-/g, '')) ||
            c.toLowerCase().includes(activeFilter.toLowerCase())
        )
        : (directorMember.category || '')
          .toLowerCase()
          .includes(activeFilter.replace(/-/g, ''))));

  // Filter specialists according to active tab
  const filteredSpecialists = specialistsOnly.filter((spec) => {
    if (activeFilter === 'all') return true;
    const cat = Array.isArray(spec.category)
      ? spec.category.join(' ').toLowerCase()
      : (spec.category || spec.specialtyTag || '').toLowerCase();
    const filterKey = activeFilter.toLowerCase().replace(/-/g, '');
    const cleanCat = cat.replace(/-/g, '');
    return cleanCat.includes(filterKey) || cat.includes(activeFilter.toLowerCase());
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
                  Our Licensed Veterinarians &amp; Epidemiologists
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                  Accredited by the Kenya Veterinary Board (KVB). Delivering high-tier veterinary medicine,
                  One Health surveillance, and livestock genomics across Kenya and East Africa.
                </p>
              </div>

              {/* Quick Metrics Counter Pill */}
              <div className="flex items-center gap-4 bg-surface-clinical p-4 rounded-xl shadow-sm border border-border-hairline">
                <div className="flex flex-col pr-4">
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    {directorMember?.experience?.match(/\d+/)?.[0] ? `${directorMember.experience.match(/\d+/)[0]}+` : '18+'}
                  </span>
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
                  <span className="font-headline-lg text-headline-lg text-primary font-bold">
                    {teamList.length > 0 ? teamList.length : '47'}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                    {teamList.length > 0 ? 'Active Specialists' : 'Counties Active'}
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
                      className={`px-4 py-1.5 rounded-full font-label-md text-label-md transition-all whitespace-nowrap cursor-pointer ${isActive
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
              {/* Loading Skeleton */}
              {loading && teamList.length === 0 && (
                <div className="space-y-6">
                  <div className="bg-surface-clinical rounded-xl p-8 border border-border-hairline animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-5 aspect-[4/5] bg-surface-container rounded-xl"></div>
                      <div className="lg:col-span-7 space-y-4">
                        <div className="h-6 w-32 bg-surface-container rounded-full"></div>
                        <div className="h-10 w-3/4 bg-surface-container rounded-lg"></div>
                        <div className="h-5 w-1/2 bg-surface-container rounded-lg"></div>
                        <div className="h-20 w-full bg-surface-container rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-surface-clinical rounded-xl p-4 border border-border-hairline animate-pulse space-y-3">
                        <div className="aspect-square bg-surface-container rounded-lg"></div>
                        <div className="h-5 w-3/4 bg-surface-container rounded"></div>
                        <div className="h-4 w-1/2 bg-surface-container rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Feature Card: Senior Director (When Designated) */}
              {showDirector && directorMember && (
                <div className="team-card leadership all bg-surface-clinical rounded-xl shadow-md p-space-lg lg:p-space-xl overflow-hidden relative border border-border-hairline">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
                    <div className="lg:col-span-5 relative group">
                      <div className="overflow-hidden rounded-xl aspect-[4/5] shadow-inner bg-surface-container-high relative">
                        <img
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          alt={`Senior Veterinary Director ${directorMember.name}`}
                          src={directorMember.image || DEFAULT_DIRECTOR_IMAGE}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_DIRECTOR_IMAGE;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-primary">
                          <span className="font-label-sm text-label-sm bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                            {directorMember.roleTag || 'Clinical Director'}
                          </span>
                          <span className="font-label-sm text-label-sm flex items-center gap-1 font-semibold">
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            {directorMember.kvbLicense || 'KVB Accredited'}
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
                        {directorMember.experience && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-medium">
                            {directorMember.experience}
                          </span>
                        )}
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
                            {directorMember.directorSpecialty || directorMember.specialtyTag || 'Herd Health & Ambulatory Surgery'}
                          </span>
                        </div>
                        <div className="bg-surface-tinted p-3 rounded-lg border border-border-hairline">
                          <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold block">
                            Accreditation
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {directorMember.directorAccreditation || directorMember.kvbLicense || 'Licensed Surgeon (KVB)'}
                          </span>
                        </div>
                        <div className="bg-surface-tinted p-3 rounded-lg border border-border-hairline">
                          <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary font-bold block">
                            Duty Hub
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface">
                            {directorMember.directorDutyHub || directorMember.location || 'Central Regional Diagnostic Core'}
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
              {filteredSpecialists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter" id="specialistsGrid">
                  {filteredSpecialists.map((spec) => (
                    <div
                      key={spec._id || spec.slug || spec.name}
                      className="team-card bg-surface-clinical rounded-xl shadow-sm p-space-md flex flex-col justify-between hover:shadow-md transition-shadow group border border-border-hairline"
                    >
                      <div className="space-y-4">
                        <div className="relative overflow-hidden rounded-lg aspect-square bg-surface-container-low">
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            alt={spec.name}
                            src={spec.image || DEFAULT_SPECIALIST_IMAGE}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_SPECIALIST_IMAGE;
                            }}
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary/90 text-on-primary font-label-sm text-label-sm font-semibold">
                            {spec.roleTag || 'Specialist'}
                          </span>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-surface-clinical/90 text-primary font-label-sm text-label-sm font-semibold">
                            {spec.kvbLicense || 'KVB Certified'}
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
                            <span className="truncate max-w-[130px]">{spec.location || 'Mobile Unit'}</span>
                          </span>
                          <span className="font-semibold text-primary">{spec.experience || 'Field Vet'}</span>
                        </div>
                        <Link
                          className="w-full inline-flex items-center justify-center py-2 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                          to="/appointment-booking"
                        >
                          {spec.actionLabel || 'Dispatch Specialist Unit'}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && !showDirector && (
                  <div className="py-16 text-center bg-surface-clinical rounded-2xl border border-dashed border-border-hairline space-y-3">
                    <span className="material-symbols-outlined text-[48px] text-outline">group_off</span>
                    <h3 className="font-headline-sm font-bold text-on-surface">
                      No Specialists Found in this Category
                    </h3>
                    <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                      There are currently no veterinary surgeons listed under this specific discipline.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveFilter('all')}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold cursor-pointer"
                    >
                      View All Faculty
                    </button>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Regional Ambulatory & Field Para-Veterinary Corps Section */}
          <section className="w-full bg-surface-container-low py-space-xl px-margin-mobile lg:px-margin border-t border-border-hairline">
            <div className="max-w-[1280px] mx-auto space-y-space-lg">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-primary font-label-sm text-label-sm uppercase tracking-wider font-bold mb-1">
                    <span className="material-symbols-outlined text-[18px]">location_city</span>
                    <span>National Practice Presence</span>
                  </div>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface font-bold">
                    Our Offices
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                    Visit us
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    {Array.isArray(dbHubs) && dbHubs.filter((h) => h.isPublished !== false).length > 0
                      ? `${dbHubs.filter((h) => h.isPublished !== false).length} Active Regional Locations`
                      : 'Active Regional Stations'}
                  </span>
                </div>
              </div>

              {/* Regional Pods Bento Grid */}
              {Array.isArray(dbHubs) && dbHubs.filter((h) => h.isPublished !== false).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                  {dbHubs
                    .filter((h) => h.isPublished !== false)
                    .map((hub, idx) => (
                      <div
                        key={hub._id || idx}
                        className="bg-surface-clinical p-space-lg rounded-2xl shadow-sm space-y-4 border border-border-hairline hover:border-primary/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-xs font-bold uppercase tracking-wider">
                              {hub.zone || hub.stationType || `Zone ${idx + 1}`}
                            </span>
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              {hub.stationType === 'headquarters' ? 'location_city' : 'sensors'}
                            </span>
                          </div>

                          <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {hub.name}
                          </h4>

                          {hub.subtitle && (
                            <p className="text-xs font-semibold text-secondary">{hub.subtitle}</p>
                          )}

                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            {hub.zoneDescription ||
                              hub.address ||
                              'Regional veterinary support base and rapid emergency ambulatory response center.'}
                          </p>

                          <div className="space-y-2 pt-2 text-on-surface-variant font-body-sm text-xs">
                            <div className="flex justify-between py-1 bg-surface-subtle px-2.5 rounded-lg border border-border-hairline">
                              <span className="text-outline">Physical Base:</span>
                              <span className="font-semibold text-on-surface text-right truncate max-w-[180px]">
                                {hub.address || hub.subtitle || 'Regional Depot'}
                              </span>
                            </div>

                            <div className="flex justify-between py-1 bg-surface-subtle px-2.5 rounded-lg border border-border-hairline">
                              <span className="text-outline">Response Radius:</span>
                              <span className="font-bold text-primary">
                                {hub.responseRadiusKm || 100} KM Max
                              </span>
                            </div>

                            {hub.phone && (
                              <div className="flex justify-between py-1 bg-surface-subtle px-2.5 rounded-lg border border-border-hairline">
                                <span className="text-outline">Direct Helpline:</span>
                                <span className="font-semibold text-on-surface">
                                  {hub.phone}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between py-1 bg-surface-subtle px-2.5 rounded-lg border border-border-hairline">
                              <span className="text-outline">Clinician / Squad:</span>
                              <span className="font-semibold text-on-surface text-right truncate max-w-[170px]">
                                {hub.leadOfficer
                                  ? hub.leadOfficer
                                  : Array.isArray(hub.fleetEquipment) && hub.fleetEquipment.length > 0
                                    ? hub.fleetEquipment.join(', ')
                                    : 'Active Ambulatory Squad'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {Array.isArray(hub.coverageAreas) && hub.coverageAreas.length > 0 && (
                          <div className="pt-2 border-t border-border-hairline flex flex-wrap gap-1">
                            {hub.coverageAreas.map((area, aIdx) => (
                              <span
                                key={aIdx}
                                className="px-2 py-0.5 rounded bg-surface-tinted/60 text-on-surface-variant text-[10px] font-medium"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="bg-surface-clinical rounded-2xl p-10 text-center border border-border-hairline max-w-md mx-auto space-y-3">
                  <span className="material-symbols-outlined text-[48px] text-outline">location_off</span>
                  <h4 className="font-bold text-on-surface">No Regional Offices Listed</h4>
                  <p className="text-xs text-on-surface-variant">
                    Office locations and ambulatory squad stations configured in the Admin CMS will appear here dynamically.
                  </p>
                </div>
              )}
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
                  {Array.isArray(dbResearch) && dbResearch.length > 0 ? (
                    dbResearch.map((res, idx) => (
                      <div
                        key={res._id || idx}
                        className="bg-surface-tinted p-space-md rounded-xl space-y-3 border border-border-accent"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                            {res.tag || 'Research Output'}
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                            {res.year || 2025} Peer-Reviewed
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
                    ))
                  ) : (
                    <div className="col-span-full bg-surface-tinted p-space-lg rounded-xl text-center border border-border-accent/40 space-y-2">
                      <span className="material-symbols-outlined text-primary text-[32px]">biotech</span>
                      <p className="font-label-md text-label-md font-bold text-on-surface">
                        Continuous Professional Development &amp; Research
                      </p>
                      <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                        Official veterinary clinical trial publications, One Health epidemiology reports, and peer-reviewed journals will be cataloged here.
                      </p>
                    </div>
                  )}

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
                  Are you a licensed veterinary surgeon or veterinary para-professional seeking to practice modern, data-driven medicine? AniHeal
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
