import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isServices = location.pathname === '/services' || location.pathname === '/clinical-services';
  const isBooking =
    location.pathname === '/appointment-booking' || location.pathname === '/book-appointment';
  const isTeam = location.pathname === '/our-team' || location.pathname === '/team';
  const isContact = location.pathname === '/contact-us' || location.pathname === '/contact';

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-clinical/95 backdrop-blur-md shadow-[0_1px_8px_rgba(20,83,45,0.05)] border-b border-border-hairline">
      {/* Main Navigation Bar */}
      <div className="h-20 max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link className="flex items-center gap-3 focus:outline-none" to="/">
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
        <nav className="hidden xl:flex items-center gap-1">
          <Link
            className={`px-3 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
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
              className={`flex items-center gap-1 px-3 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
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
            <div className="absolute top-full left-0 w-80 py-2 bg-surface-clinical rounded-xl shadow-[0_12px_32px_rgba(20,83,45,0.08)] border border-border-hairline opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="px-4 py-1.5 font-label-sm text-label-sm uppercase tracking-wider text-outline font-bold">
                One Health Clinical Services
              </div>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Consultancy - One Health
              </Link>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Disease Control &amp; Treatment
              </Link>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Livestock Treatment &amp; Diagnostics
              </Link>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Animal Insurance &amp; Subscription
              </Link>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Reproductive Health &amp; Breeding
              </Link>
              <Link
                className="block px-4 py-2.5 text-on-surface-variant font-label-md text-label-md hover:bg-surface-tinted hover:text-primary transition-colors"
                to="/services"
              >
                Nutritional Assessment
              </Link>
            </div>
          </div>

          <Link
            className={`px-3 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
              isBooking
                ? 'bg-surface-tinted text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            to="/appointment-booking"
          >
            Appointment Booking
          </Link>
          <Link
            className={`px-3 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
              isTeam
                ? 'bg-surface-tinted text-primary font-semibold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
            to="/our-team"
          >
            Our Team
          </Link>
          <Link
            className={`px-3 py-2 font-label-lg text-label-lg transition-colors rounded-lg ${
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
            className="hidden sm:inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg hover:bg-primary transition-all shadow-[0_2px_4px_rgba(20,83,45,0.12)] hover:-translate-y-0.5"
            to="/appointment-booking"
          >
            Book Appointment
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm text-on-primary">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

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
        <div className="xl:hidden bg-surface-clinical border-t border-border-hairline px-margin-mobile py-4 shadow-lg flex flex-col gap-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isHome ? 'bg-primary-container text-on-primary-container' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isServices ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Services &amp; Solutions
          </Link>
          <Link
            to="/appointment-booking"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isBooking ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Appointment Booking
          </Link>
          <Link
            to="/our-team"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isTeam ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Our Team
          </Link>
          <Link
            to="/contact-us"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-2 rounded-lg font-label-lg ${
              isContact ? 'bg-surface-tinted text-primary font-semibold' : 'hover:bg-surface-tinted text-on-surface'
            }`}
          >
            Contact Us
          </Link>
          <a
            href="tel:+254700264432"
            className="mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-error text-on-error font-bold text-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">phone_forwarded</span>
            24/7 Field Hotline: +254 700 ANIHEAL
          </a>
        </div>
      )}
    </header>
  );
}
