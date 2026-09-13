import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';

export default function Footer() {
  const { settings } = useContent();

  const email = settings?.contactEmail || 'clinical@aniheal.co.ke';
  const phone = settings?.contactPhone || '+254 700 264 432';
  const emergencyPhone = settings?.emergencyHotline || '+254 700 264 432';
  const address = settings?.officeAddress || 'Veterinary Complex, Kabete Rd\nNairobi, Kenya';
  const hours =
    typeof settings?.operatingHours === 'string'
      ? settings.operatingHours
      : settings?.operatingHours?.emergency
      ? `${settings.operatingHours.weekday || 'Mon–Sat 07:00–18:00'} | ${settings.operatingHours.emergency}`
      : '24/7 Emergency Response';

  return (
    <footer id="contact-info" className="w-full bg-surface-container-low text-on-surface pt-space-2xl pb-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
        {/* Company Overview & Accreditation */}
        <div className="lg:col-span-2 flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm">
            <img
              alt="AniHeal Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WXRU6SkdH2B4lJUTRkkG5jjNrZS6J_FfZ_9jGdtW5C2Hmju9dr4yiVjhwhkF3oiIlYJNh3S2yTo4gUaTp5FHYYMVkIuF5T0zAGkSQmkU_nvyj-8EzP6IEN9Xkde0ZmCaVDS1YDGDpUqrWHF5DP03eYOe_Nq5V67puwWs8Kvr-NJ5q0iUgnvmGMhJKEk4VBGl-TPvmIXCU4qG0z1fAXp2NGARC7oT9NmZrjUmZ8LkUnfAVhqZWvzKrS2w"
            />
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              AniHeal Veterinary Solutions
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            AniHeal is an accredited agro-veterinary enterprise advancing clinical diagnostics,
            preventative medicine, and precision livestock production across Kenya. Guided by the One
            Health framework, we safeguard animal welfare, human wellbeing, and ecosystem
            sustainability.
          </p>
          <div className="p-space-md rounded-xl bg-surface-tinted">
            <div className="flex items-center gap-space-xs mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="font-label-md text-label-md text-primary font-bold">
                Kenya Veterinary Board (KVB) Certified
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Regulated Veterinary Practice License No. KVB/PR/2025/0842. Authorized for Mobile &amp;
              Ambulatory Field Procedures, Clinical Diagnostics, and Veterinary Pharmacy.
            </p>
          </div>
        </div>

        {/* Veterinary Services Links */}
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-primary font-bold tracking-wide uppercase">
            Veterinary Services
          </span>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Consultancy – One Health
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Disease Control &amp; Treatment
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Livestock Treatment
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Insurance &amp; Herd Plans
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Breeding &amp; Reproductive
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Nutritional Feeds Program
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Vaccines &amp; Biologicals
          </Link>
        </div>

        {/* Quick Access Links */}
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-primary font-bold tracking-wide uppercase">
            Quick Access
          </span>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/"
          >
            Home Overview
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/appointment-booking"
          >
            Book Farm Visit
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/services"
          >
            Research &amp; Institutional
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/our-team"
          >
            Veterinary Surgeons &amp; Faculty
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/contact-us"
          >
            Regional Clinic Contacts
          </Link>
          <a
            className="font-body-sm text-body-sm text-kvb-red font-bold hover:underline"
            href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
          >
            24/7 Field Ambulatory
          </a>
        </div>

        {/* Headquarters & Hubs */}
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-primary font-bold tracking-wide uppercase">
            Headquarters &amp; Hubs
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-line">
            {address}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <strong className="text-on-surface">Regional Ambulatory Stations:</strong><br />
            Nakuru • Eldoret • Nyeri • Kilifi
          </p>
          <div className="pt-space-xs">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Email:</strong> {email}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Direct Call:</strong> {phone}
            </p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-on-surface">Hours:</strong> {hours}
            </p>
          </div>
        </div>
      </div>

      {/* Sub-footer bottom bar */}
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter mt-space-xl pt-space-md flex flex-col md:flex-row items-center justify-between text-on-surface-variant font-label-md text-label-md gap-space-md border-t border-border-hairline">
        <p>© 2025 AniHeal Veterinary Solutions (aniheal.co.ke). All rights reserved.</p>
        <div className="flex items-center gap-space-md flex-wrap justify-center">
          <span className="text-kvb-gold font-bold">KVB Accredited Facility</span>
          <span className="text-on-surface-variant/40">|</span>
          <span>Ministry of Agriculture &amp; Livestock Standards</span>
          <span className="text-on-surface-variant/40">|</span>
          <span>One Health Alliance Member</span>
          <span className="text-on-surface-variant/40">|</span>
          <Link to="/admin" className="text-primary hover:underline font-bold">
            Staff Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
