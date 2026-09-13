import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isServices =
    location.pathname.startsWith('/services') ||
    location.pathname === '/clinical-services' ||
    location.pathname === '/animal-insurance' ||
    location.pathname === '/insurance';
  const isTeam = location.pathname === '/our-team' || location.pathname === '/team';
  const isContact = location.pathname === '/contact-us' || location.pathname === '/contact';

  const veterinaryServices = [
    {
      name: 'Consultancy - One Health',
      to: '/services',
      icon: 'health_and_safety',
      desc: 'Zoonotic risk assessment & holistic agro-veterinary advisory',
    },
    {
      name: 'Disease Control & Treatment',
      to: '/services',
      icon: 'coronavirus',
      desc: 'Epidemiological containment, biosecurity & therapeutic regimes',
    },
    {
      name: 'Livestock Treatment & Diagnostics',
      to: '/services',
      icon: 'biotech',
      desc: 'Point-of-care ultrasound, hematology & mobile intensive care',
    },
    {
      name: 'Animal Insurance & Subscription',
      to: '/animal-insurance',
      icon: 'verified_user',
      desc: 'Comprehensive pet & herd health plans with subsidized care',
    },
    {
      name: 'Reproductive Health & Breeding Management',
      to: '/services',
      icon: 'pregnancy',
      desc: 'Estrus synchronization, AI protocols & breeding herd soundness',
    },
    {
      name: 'Nutrition Assessment & Feeding Program',
      to: '/services',
      icon: 'nutrition',
      desc: 'TMR formulation, metabolic profiling & yield optimization',
    },
  ];

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

          {/* Services Dropdown */}
          <div className="relative group">
            <Link
              to="/services"
              className={`flex items-center gap-1 px-3.5 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
                isServices
                  ? 'bg-surface-tinted text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span>Services</span>
              <span className="material-symbols-outlined text-[18px] text-outline transition-transform duration-200 group-hover:rotate-180">
                expand_more
              </span>
            </Link>

            {/* Services Dropdown Panel */}
            <div className="absolute top-full left-0 w-[640px] p-5 bg-surface-clinical rounded-2xl shadow-[0_20px_40px_rgba(20,83,45,0.12)] border border-border-hairline opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[18px]">medical_services</span>
                  <span>Veterinary Clinical Services &amp; Insurance</span>
                </div>
                <Link
                  to="/services"
                  className="text-xs text-outline hover:text-primary font-semibold flex items-center gap-0.5"
                >
                  All Protocols &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {veterinaryServices.map((service, idx) => (
                  <Link
                    key={idx}
                    to={service.to}
                    className="p-2.5 rounded-xl hover:bg-surface-tinted transition-colors flex items-start gap-3 group/item border border-transparent hover:border-border-hairline"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-primary group-hover/item:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">{service.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-on-surface group-hover/item:text-primary transition-colors leading-snug">
                        {service.name}
                      </p>
                      <p className="text-xs text-outline line-clamp-1 mt-0.5">{service.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border-hairline flex items-center justify-between bg-surface-tinted/40 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <div className="text-xs text-outline">
                  <span className="font-semibold text-on-surface">KVB Accredited</span> Ambulatory Care &amp; Retainers
                </div>
                <Link
                  to="/appointment-booking"
                  className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1"
                >
                  Book Field Clinician &rarr;
                </Link>
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
            className="xl:hidden p-2 rounded-lg text-on-surface hover:bg-surface-tinted"
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
        <div className="xl:hidden bg-surface-clinical border-t border-border-hairline px-margin-mobile py-4 shadow-lg flex flex-col gap-2 max-h-[80vh] overflow-y-auto animate-fade-in">
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

          {/* Services Accordion */}
          <div>
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-label-lg font-semibold transition-colors ${
                isServices ? 'bg-surface-tinted text-primary' : 'text-on-surface hover:bg-surface-tinted'
              }`}
            >
              <span>Services</span>
              <span
                className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                  mobileServicesOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 pr-2 py-2 space-y-1 bg-surface-tinted/40 rounded-xl mt-1">
                {veterinaryServices.map((service, idx) => (
                  <Link
                    key={idx}
                    to={service.to}
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-clinical/70 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary shrink-0">
                      {service.icon}
                    </span>
                    <span>{service.name}</span>
                  </Link>
                ))}
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
            className="px-4 py-2 rounded-lg font-label-lg text-primary hover:bg-surface-tinted font-bold flex items-center gap-2"
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
