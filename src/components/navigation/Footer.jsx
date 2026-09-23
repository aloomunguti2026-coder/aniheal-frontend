import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import SocialIcon from '../common/SocialIcon';

export default function Footer() {
  const { settings, services: dbServices, hubs: dbHubs } = useContent();

  const siteName = settings?.siteName || 'AniHeal Veterinary Solutions';
  const licenseNumber = settings?.licenseNumber || 'KVB/PR/2025/0842';
  const licenseDescription =
    settings?.licenseDescription ||
    `Regulated Veterinary Practice License No. ${licenseNumber}. Authorized for Mobile & Ambulatory Field Procedures, Clinical Diagnostics, and Veterinary Pharmacy.`;
  const aboutText =
    settings?.metaDescription ||
    'AniHeal is an accredited agro-veterinary enterprise advancing clinical diagnostics, preventative medicine, and precision livestock production across Kenya. Guided by the One Health framework, we safeguard animal welfare, human wellbeing, and ecosystem sustainability.';

  const email = settings?.primaryEmail || settings?.contactEmail || 'clinical@aniheal.co.ke';
  const phone = settings?.primaryPhone || settings?.contactPhone || '+254 700 264 432';
  const emergencyPhone =
    settings?.emergencyPhone ||
    settings?.emergencyHotline ||
    settings?.hotlinePhone ||
    '+254 700 264 432';
  const address =
    settings?.headquartersAddress ||
    settings?.officeAddress ||
    'Veterinary Complex, Kabete Rd\nNairobi, Kenya';

  const hours =
    typeof settings?.operatingHours === 'string'
      ? settings.operatingHours
      : settings?.operatingHours?.emergency
      ? `${settings.operatingHours.weekday || 'Mon–Sat 07:00–18:00'} | ${settings.operatingHours.emergency}`
      : '24/7 Emergency Response';

  const publishedServices = Array.isArray(dbServices)
    ? dbServices.filter((s) => s.isPublished !== false)
    : [];

  const publishedHubs = Array.isArray(dbHubs)
    ? dbHubs.filter((h) => h.isPublished !== false)
    : [];

  const hubsSummary =
    publishedHubs.length > 0
      ? publishedHubs
          .map((h) => h.name.replace(/Ambulatory|Hub|Station|Depot|Center/gi, '').trim())
          .filter(Boolean)
          .join(' • ')
      : settings?.regionalHubsSummary || 'Nakuru • Eldoret • Nyeri • Kilifi';

  return (
    <footer id="contact-info" className="w-full bg-surface-container-low text-on-surface pt-space-2xl pb-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
        {/* Company Overview & Accreditation */}
        <div className="lg:col-span-2 flex flex-col gap-space-md">
          <div className="flex items-center gap-space-sm">
            <img
              alt="AniHeal Logo"
              className="h-8 w-auto object-contain"
              src="/logo.png"
            />
            <span className="font-headline-sm text-headline-sm text-primary font-bold">
              {siteName}
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {aboutText}
          </p>
          <div className="p-space-md rounded-xl bg-surface-tinted">
            <div className="flex items-center gap-space-xs mb-1">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="font-label-md text-label-md text-primary font-bold">
                Kenya Veterinary Board (KVB) Certified
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {licenseDescription}
            </p>
          </div>

          {/* Footer Social Links */}
          {(() => {
            const sLinks = settings?.socialLinks || {};
            const socialAccounts = [
              { platform: 'facebook', label: 'Facebook', url: sLinks.facebook },
              { platform: 'twitter', label: 'Twitter / X', url: sLinks.twitter },
              { platform: 'instagram', label: 'Instagram', url: sLinks.instagram },
              { platform: 'linkedin', label: 'LinkedIn', url: sLinks.linkedin },
              { platform: 'youtube', label: 'YouTube', url: sLinks.youtube },
              { platform: 'tiktok', label: 'TikTok', url: sLinks.tiktok },
              { platform: 'whatsapp', label: 'WhatsApp', url: sLinks.whatsapp },
            ].filter((acc) => acc.url && acc.url.trim() !== '' && acc.url !== '#');

            if (socialAccounts.length === 0) return null;

            return (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                {socialAccounts.map((acc, idx) => (
                  <a
                    key={idx}
                    href={acc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={acc.label}
                    title={acc.label}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all duration-200 transform hover:scale-110 shadow-sm"
                  >
                    <SocialIcon platform={acc.platform} className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            );
          })()}
        </div>

        {/* Dynamic Veterinary Services Links from Admin CMS */}
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-primary font-bold tracking-wide uppercase">
            Veterinary Services
          </span>
          {publishedServices.length > 0 ? (
            publishedServices.slice(0, 6).map((service, idx) => (
              <Link
                key={service._id || idx}
                className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1.5"
                to={`/services/${service.slug || service._id}`}
              >
                <span className="truncate">{service.title || service.name}</span>
              </Link>
            ))
          ) : (
            <p className="font-body-sm text-xs text-outline">
              Clinical protocols synced live from CMS.
            </p>
          )}
          <Link
            className="font-body-sm text-body-sm text-primary font-bold hover:underline flex items-center gap-1 pt-1"
            to="/services"
          >
            <span>All Clinical Services</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
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
            to="/products"
          >
            Products &amp; Feeds
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/animal-insurance"
          >
            Animal Insurance Plans
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/collaborations"
          >
            Collaborations &amp; Alliances
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/our-team"
          >
            Our Team &amp; Faculty
          </Link>
          <Link
            className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors"
            to="/contact-us"
          >
            Regional Clinic Contacts
          </Link>
          <a
            className="font-body-sm text-body-sm text-error font-bold hover:underline inline-flex items-center gap-1"
            href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>24/7 Field Ambulatory</span>
          </a>
        </div>

        {/* Dynamic Headquarters & Regional Offices */}
        <div className="flex flex-col gap-space-sm">
          <span className="font-label-lg text-label-lg text-primary font-bold tracking-wide uppercase">
            Headquarters &amp; Offices
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-line">
            {address}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            <strong className="text-on-surface">Regional Stations:</strong><br />
            {hubsSummary}
          </p>
          <div className="pt-space-xs space-y-1">
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
          <Link
            to="/our-team"
            className="font-body-sm text-body-sm text-primary font-bold hover:underline flex items-center gap-1 pt-1"
          >
            <span>View Office Locations</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Sub-footer bottom bar */}
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter mt-space-xl pt-space-md flex items-center justify-center text-center text-on-surface-variant font-label-md text-label-md border-t border-border-hairline">
        <p>© {new Date().getFullYear()} {siteName} (aniheal.co.ke). All rights reserved.</p>
      </div>
    </footer>
  );
}
