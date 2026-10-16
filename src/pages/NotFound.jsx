import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function NotFound() {
  useEffect(() => {
    // Enforce noindex for crawlers on 404 pages
    let metaRobots = document.querySelector('meta[name="robots"]');
    let created = false;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
      created = true;
    }
    const previousContent = metaRobots.getAttribute('content');
    metaRobots.setAttribute('content', 'noindex, nofollow');

    const previousTitle = document.title;
    document.title = '404 - Clinical Protocol Not Found | AniHeal Vetspace Solutions';

    return () => {
      if (created) {
        metaRobots.remove();
      } else if (previousContent) {
        metaRobots.setAttribute('content', previousContent);
      } else {
        metaRobots.removeAttribute('content');
      }
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-surface-tinted border border-border-accent text-primary flex items-center justify-center mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[44px]">healing</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-error-container/40 text-error font-label-sm text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span>HTTP 404 - Missing Protocol</span>
          </div>

          <h1 className="font-headline-xl text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
            Page or Clinical Protocol Not Found
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto leading-relaxed">
            The agro-veterinary protocol, pharmaceutical record, or page you requested could not be located. It may have been updated, relocated, or retired.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              <span>Back to Home</span>
            </Link>

            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-clinical text-primary border border-border-hairline font-label-md font-semibold hover:bg-surface-tinted transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              <span>Browse Clinical Services</span>
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-clinical text-primary border border-border-hairline font-label-md font-semibold hover:bg-surface-tinted transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>Products Catalog</span>
            </Link>

            <Link
              to="/appointment-booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-surface-tinted text-primary font-label-md font-semibold hover:bg-primary hover:text-on-primary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>Book Farm Visit</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
