import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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

  // Live published Clinical Services from MongoDB
  const publishedServices = Array.isArray(dbServices)
    ? dbServices.filter((s) => s.isPublished !== false)
    : [];

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
              src="/logo.png"
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
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${isHome
              ? 'bg-primary-container text-on-primary-container font-semibold'
              : 'text-on-surface-variant hover:text-primary'
              }`}
            to="/"
          >
            Home
          </Link>

          {/* Clean Dropdown: Services & Solutions */}
          <div className="relative group">
            <Link
              to="/services"
              className={`flex items-center gap-1 px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${isServicesActive
                ? 'bg-surface-tinted text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
                }`}
            >
              <span>Services &amp; Solutions</span>
              <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </Link>

            {/* Simple Clean Dropdown Panel */}
            <div className="absolute top-full left-0 w-[560px] bg-surface-clinical rounded-2xl shadow-[0_16px_36px_rgba(20,83,45,0.12)] border border-border-hairline opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Column 1: Clinical Services (Level 3 Items) */}
                <div>
                  <div className="pb-2 mb-3 border-b border-border-hairline flex items-center justify-between">
                    <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider">
                      Clinical Services
                    </span>
                    <Link
                      to="/services"
                      onClick={closeMobileMenu}
                      className="text-xs text-on-surface-variant hover:text-primary transition-colors font-medium"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="space-y-1">
                    {publishedServices.length > 0 ? (
                      publishedServices.slice(0, 7).map((service, idx) => (
                        <Link
                          key={service._id || idx}
                          to={`/services/${service.slug || service._id}`}
                          onClick={closeMobileMenu}
                          className="block py-1.5 px-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors font-medium truncate"
                        >
                          {service.title || service.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-xs text-outline py-2 px-2">No clinical services published</p>
                    )}
                  </div>
                </div>

                {/* Column 2: Solutions & Programs */}
                <div>
                  <div className="pb-2 mb-3 border-b border-border-hairline">
                    <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider">
                      Solutions &amp; Programs
                    </span>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/animal-insurance"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors font-medium"
                    >
                      Animal Insurance &amp; Health Plans
                    </Link>
                    <Link
                      to="/products"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors font-medium"
                    >
                      Products &amp; Agro-Vet Supplies
                    </Link>
                    <Link
                      to="/collaborations"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors font-medium"
                    >
                      Collaborations &amp; Initiatives
                    </Link>
                    <Link
                      to="/appointment-booking"
                      onClick={closeMobileMenu}
                      className="block py-1.5 px-2 rounded-lg text-sm text-on-surface-variant hover:text-primary hover:bg-surface-tinted transition-colors font-medium"
                    >
                      Schedule Farm Visit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <Link
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${isTeam
              ? 'bg-surface-tinted text-primary font-semibold'
              : 'text-on-surface-variant hover:text-primary'
              }`}
            to="/our-team"
          >
            Our Team
          </Link>

          {/* Contact Us */}
          <Link
            className={`px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${isContact
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
            className={`px-4 py-2 rounded-lg font-label-lg ${isHome ? 'bg-primary-container text-on-primary-container font-semibold' : 'hover:bg-surface-tinted text-on-surface'
              }`}
          >
            Home
          </Link>

          {/* Services & Solutions Accordion */}
          <div className="border border-border-hairline rounded-xl overflow-hidden bg-surface-subtle/50">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={`w-full flex items-center justify-between px-4 py-2.5 font-label-lg font-bold transition-colors cursor-pointer ${isServicesActive ? 'bg-surface-tinted text-primary' : 'text-on-surface'
                }`}
            >
              <span>Services &amp; Solutions</span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''
                  }`}
              >
                expand_more
              </span>
            </button>

            {mobileServicesOpen && (
              <div className="p-3 space-y-3 border-t border-border-hairline bg-surface-clinical">
                <div>
                  <span className="text-[11px] uppercase font-bold text-primary block mb-1">
                    Clinical Services
                  </span>
                  <div className="space-y-1 pl-2 border-l border-border-hairline">
                    {publishedServices.length > 0 ? (
                      publishedServices.slice(0, 6).map((service, idx) => (
                        <Link
                          key={service._id || idx}
                          to={`/services/${service.slug || service._id}`}
                          onClick={closeMobileMenu}
                          className="block py-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors truncate"
                        >
                          {service.title || service.name}
                        </Link>
                      ))
                    ) : (
                      <p className="text-[11px] text-outline py-1">No clinical services published</p>
                    )}
                    <Link
                      to="/services"
                      onClick={closeMobileMenu}
                      className="block py-1 text-xs font-bold text-primary hover:underline transition-colors pt-1"
                    >
                      View All Services &rarr;
                    </Link>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] uppercase font-bold text-primary block mb-1">
                    Solutions &amp; Programs
                  </span>
                  <div className="space-y-1 pl-2 border-l border-border-hairline">
                    <Link
                      to="/animal-insurance"
                      onClick={closeMobileMenu}
                      className="block py-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Animal Insurance &amp; Health Plans
                    </Link>
                    <Link
                      to="/products"
                      onClick={closeMobileMenu}
                      className="block py-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Products &amp; Agro-Vet Supplies
                    </Link>
                    <Link
                      to="/collaborations"
                      onClick={closeMobileMenu}
                      className="block py-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Collaborations &amp; Initiatives
                    </Link>
                    <Link
                      to="/appointment-booking"
                      onClick={closeMobileMenu}
                      className="block py-1 text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
                    >
                      Schedule Farm Visit / Triage
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Our Team */}
          <Link
            to="/our-team"
            onClick={closeMobileMenu}
            className={`px-4 py-2 rounded-lg font-label-lg ${isTeam ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
              }`}
          >
            Our Team
          </Link>

          {/* Contact Us */}
          <Link
            to="/contact-us"
            onClick={closeMobileMenu}
            className={`px-4 py-2 rounded-lg font-label-lg ${isContact ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
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

