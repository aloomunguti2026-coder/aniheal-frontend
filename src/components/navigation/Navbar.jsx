import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAnimalHealthOpen, setMobileAnimalHealthOpen] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState('animal-health'); // 'animal-health' | 'products' | 'collaborations'
  
  const location = useLocation();
  const { services: dbServices } = useContent();

  const isHome = location.pathname === '/';
  const isServicesActive =
    location.pathname.startsWith('/services') ||
    location.pathname.startsWith('/clinical-services') ||
    location.pathname.startsWith('/products') ||
    location.pathname.startsWith('/animal-insurance') ||
    location.pathname.startsWith('/insurance') ||
    location.pathname.startsWith('/collaborations') ||
    location.pathname.startsWith('/partnerships');
  const isTeam = location.pathname === '/our-team' || location.pathname === '/team';
  const isContact = location.pathname === '/contact-us' || location.pathname === '/contact';

  // Live published Clinical Services from MongoDB (Level 3 sub-items for Animal Health)
  const publishedServices = Array.isArray(dbServices)
    ? dbServices.filter((s) => s.isPublished !== false)
    : [];

  const clinicalServices = publishedServices.slice(0, 6).map((srv) => ({
    name: srv.title || srv.name,
    to: `/services/${srv.slug || srv._id}`,
    icon: srv.badgeIcon || srv.icon || 'medical_services',
    desc: srv.description || srv.badgeText || 'Official Kenya Veterinary Board clinical protocol',
    badge: srv.statusTag || srv.badgeText || 'Protocol',
  }));

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-clinical/95 backdrop-blur-md shadow-[0_1px_8px_rgba(20,83,45,0.05)] border-b border-border-hairline">
      {/* Main Navigation Bar */}
      <div className="h-20 max-w-[1360px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-3 focus:outline-none" to="/" onClick={closeMobileMenu}>
            <img
              alt="AniHeal Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WXRU6SkdH2B4lJUTRkkG5jjNrZS6J_FfZ_9jGdtW5C2Hmju9dr4yiVjhwhkF3oiIlYJNh3S2yTo4gUaTp5FHYYMVkIuF5T0zAGkSQmkU_nvyj-8EzP6IEN9Xkde0ZmCaVDS1YDGDpUqrWHF5DP03eYOe_Nq5V67puwWs8Kvr-NJ5q0iUgnvmGMhJKEk4VBGl-TPvmIXCU4qG0z1fAXp2NGARC7oT9NmZrjUmZ8LkUnfAVhqZWvzKrS2w"
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm tracking-tight text-primary leading-none font-bold">
                AniHeal
              </span>
              <span className="font-label-sm text-label-sm text-secondary tracking-wider uppercase mt-0.5 font-semibold">
                Veterinary Solutions
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1.5">
          {/* Home */}
          <Link
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
              isHome
                ? 'bg-primary-container text-on-primary-container font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            to="/"
          >
            Home
          </Link>

          {/* Mega Dropdown: Services & Solutions */}
          <div className="relative group">
            <Link
              to="/services"
              className={`flex items-center gap-1 px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
                isServicesActive
                  ? 'bg-surface-tinted text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span>Services &amp; Solutions</span>
              <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </Link>

            {/* Mega Dropdown Panel: Submenu with Level 3 only for Animal Health */}
            <div className="absolute top-full left-0 w-[860px] bg-surface-clinical rounded-2xl shadow-[0_24px_48px_rgba(20,83,45,0.16)] border border-border-hairline opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
              <div className="grid grid-cols-12 min-h-[380px]">
                {/* Level 2 Submenu Column (Left 4.5 cols) */}
                <div className="col-span-4 bg-surface-subtle/80 p-4 border-r border-border-hairline flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-bold block px-2.5 mb-1">
                      Solutions Categories
                    </span>

                    {/* Submenu 1: Animal Health (Hosts Level 3 Clinical Services on the right) */}
                    <Link
                      to="/services"
                      className="w-full text-left p-3 rounded-xl transition-all flex items-center justify-between bg-surface-clinical shadow-sm border border-border-hairline text-primary font-bold group/ah"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-2xs">
                          <span className="material-symbols-outlined text-[18px]">pets</span>
                        </div>
                        <div>
                          <p className="font-label-md text-sm leading-tight font-bold text-primary">Animal Health</p>
                          <p className="text-[11px] text-outline mt-0.5">Clinical protocols &amp; plans</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        chevron_right
                      </span>
                    </Link>

                    {/* Submenu 2: Products (Direct Level 2 Link - No third-level items) */}
                    <Link
                      to="/products"
                      className="w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-on-surface-variant hover:bg-surface-clinical hover:text-primary border border-transparent hover:border-border-hairline group/prod"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-tinted text-primary flex items-center justify-center shrink-0 group-hover/prod:bg-primary group-hover/prod:text-on-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-label-md text-sm leading-tight font-bold text-on-surface group-hover/prod:text-primary transition-colors">Products</p>
                            <span className="px-1.5 py-0.2 rounded bg-surface-container text-[10px] text-secondary font-semibold uppercase">Direct</span>
                          </div>
                          <p className="text-[11px] text-outline mt-0.5">Biologics, diagnostics &amp; feeds</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-outline group-hover/prod:text-primary transition-colors">
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                  <div className="p-2.5 rounded-xl bg-surface-tinted/50 border border-border-hairline text-[11px] text-on-surface-variant space-y-1">
                    <p className="font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      <span>KVB Accredited Practice</span>
                    </p>
                    <p className="text-outline">CAP 366 Veterinary Standard</p>
                  </div>
                </div>

                {/* Level 3 Content Area (Exclusively for Animal Health) */}
                <div className="col-span-8 p-5 flex flex-col justify-between bg-surface-clinical">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2.5 border-b border-border-hairline">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase">
                          Animal Health &bull; Level 3 Sub-items
                        </span>
                        <span className="font-headline-sm text-sm font-bold text-on-surface">
                          Clinical Services &amp; Protocols
                        </span>
                      </div>
                      <Link
                        to="/services"
                        className="text-xs text-primary hover:text-primary-dark font-bold flex items-center gap-0.5"
                      >
                        <span>All Protocols</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </div>

                    {/* Third-Level Clinical Services Grid */}
                    {clinicalServices.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        {clinicalServices.map((service, idx) => (
                          <Link
                            key={idx}
                            to={service.to}
                            className="p-2.5 rounded-xl bg-surface-subtle hover:bg-surface-tinted transition-all flex items-start gap-2.5 group/item border border-border-hairline hover:border-primary/40 shadow-2xs"
                          >
                            <div className="w-8 h-8 rounded-lg bg-surface-tinted text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary group-hover/item:text-on-primary transition-colors">
                              <span className="material-symbols-outlined text-[18px]">
                                {service.icon}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-xs text-on-surface group-hover/item:text-primary transition-colors truncate">
                                  {service.name}
                                </p>
                              </div>
                              <p className="text-[11px] text-outline line-clamp-1 mt-0.5">
                                {service.desc}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline text-center space-y-1">
                        <p className="text-xs font-bold text-on-surface">No Clinical Protocols Published</p>
                        <p className="text-[11px] text-outline">Published protocols from the Admin CMS will appear here dynamically.</p>
                      </div>
                    )}

                    {/* Animal Insurance Banner under Animal Health Level 3 */}
                    <Link
                      to="/animal-insurance"
                      className="p-3 rounded-xl bg-gradient-to-r from-surface-tinted to-surface-subtle border border-border-accent flex items-center justify-between group/ins hover:border-primary transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-primary text-[22px]">
                          verified_user
                        </span>
                        <div>
                          <p className="font-bold text-xs text-on-surface group-hover/ins:text-primary transition-colors">
                            Animal Insurance &amp; Retainer Subscriptions
                          </p>
                          <p className="text-[11px] text-outline">
                            Underwritten dairy herd, equine &amp; companion pet healthcare coverage
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        arrow_forward
                      </span>
                    </Link>
                  </div>

                  {/* Dropdown Bottom Bar */}
                  <div className="mt-4 pt-3 border-t border-border-hairline flex items-center justify-between bg-surface-subtle -mx-5 -mb-5 p-3.5">
                    <div className="text-xs text-outline flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-ping"></span>
                      <span>24/7 Mobile Triage Ambulatory Dispatch</span>
                    </div>
                    <Link
                      to="/appointment-booking"
                      className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1"
                    >
                      <span>Book Field Clinician</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <Link
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
              isTeam
                ? 'bg-surface-tinted text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            to="/our-team"
          >
            Our Team
          </Link>

          {/* Contact Us */}
          <Link
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
              isContact
                ? 'bg-surface-tinted text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            to="/contact-us"
          >
            Contact Us
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            className="hidden sm:inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-[0_2px_4px_rgba(20,83,45,0.12)] hover:-translate-y-0.5 font-bold"
            to="/appointment-booking"
          >
            Book Appointment
          </Link>

          <Link
            to="/admin"
            title="Staff & Admin Portal"
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center shadow-sm text-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface hover:bg-surface-tinted cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface-clinical border-t border-border-hairline px-margin-mobile py-4 shadow-lg flex flex-col gap-2 max-h-[85vh] overflow-y-auto animate-fade-in">
          {/* Home */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isHome ? 'bg-primary-container text-on-primary-container font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Home
          </Link>

          {/* Level 1: Services & Solutions Accordion */}
          <div className="border border-border-hairline rounded-xl overflow-hidden bg-surface-subtle/50">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 font-label-lg font-bold transition-colors cursor-pointer ${
                isServicesActive ? 'bg-surface-tinted text-primary' : 'text-on-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">layers</span>
                <span>Services &amp; Solutions</span>
              </div>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                  mobileServicesOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {mobileServicesOpen && (
              <div className="p-2 space-y-2 border-t border-border-hairline bg-surface-clinical">
                {/* Level 2 Item 1: Animal Health (with Level 3 Clinical Services Accordion) */}
                <div className="rounded-lg border border-border-hairline overflow-hidden bg-surface-subtle/70">
                  <button
                    onClick={() => setMobileAnimalHealthOpen(!mobileAnimalHealthOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-primary bg-surface-tinted/40 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">pets</span>
                      <span>1. Animal Health (Clinical Services)</span>
                    </div>
                    <span
                      className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                        mobileAnimalHealthOpen ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>

                  {mobileAnimalHealthOpen && (
                    <div className="p-2 space-y-1 bg-surface-clinical">
                      <span className="text-[10px] uppercase font-bold text-outline px-2 block">
                        Level 3 Clinical Protocols
                      </span>
                      {clinicalServices.length > 0 ? (
                        clinicalServices.map((service, idx) => (
                          <Link
                            key={idx}
                            to={service.to}
                            onClick={closeMobileMenu}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-primary hover:bg-surface-tinted rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-[14px] text-primary shrink-0">
                              {service.icon}
                            </span>
                            <span className="truncate">{service.name}</span>
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-1.5 text-[11px] text-outline">No clinical protocols published</p>
                      )}

                      <Link
                        to="/animal-insurance"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-tinted rounded-md transition-colors border-t border-border-hairline mt-1 pt-1.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                        <span>Animal Insurance &amp; Plans</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Level 2 Item 2: Products */}
                <Link
                  to="/products"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-on-surface hover:text-primary hover:bg-surface-tinted rounded-lg transition-colors border border-border-hairline bg-surface-subtle"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">inventory_2</span>
                    <span>2. Products &amp; Agro-Vet Supplies</span>
                  </div>
                  <span className="material-symbols-outlined text-[14px] text-outline">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>

          {/* Our Team */}
          <Link
            to="/our-team"
            onClick={closeMobileMenu}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isTeam ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Our Team
          </Link>

          {/* Contact Us */}
          <Link
            to="/contact-us"
            onClick={closeMobileMenu}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isContact ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Contact Us
          </Link>

          {/* Book Appointment (Mobile CTA) */}
          <Link
            to="/appointment-booking"
            onClick={closeMobileMenu}
            className="px-4 py-2.5 rounded-xl font-label-lg bg-primary text-on-primary font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>Book Appointment</span>
          </Link>

          {/* Staff & Admin Portal */}
          <Link
            to="/admin"
            onClick={closeMobileMenu}
            className="px-4 py-2 rounded-lg font-label-lg text-on-surface-variant hover:bg-surface-tinted font-semibold flex items-center gap-2 border-t border-border-hairline pt-3"
          >
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
            <span>Staff &amp; Admin Portal</span>
          </Link>

          {/* 24/7 Field Hotline */}
          <a
            href="tel:+254700264432"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-error text-on-error font-bold text-label-md shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">phone_forwarded</span>
            24/7 Field Hotline: +254 700 ANIHEAL
          </a>
        </div>
      )}
    </header>
  );
}
