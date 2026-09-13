import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import serviceService from '../services/serviceService';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  useEffect(() => {
    fetchServiceDetail();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await serviceService.getServiceBySlug(slug);
      if (res.success && res.data) {
        setService(res.data);
      } else {
        setError('Clinical service protocol not found.');
      }
    } catch (err) {
      console.error('Failed to load service details:', err);
      setError('Unable to load clinical service protocol details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-body-md text-on-surface-variant font-medium">Loading clinical protocol...</p>
          </div>
        ) : error || !service ? (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">error</span>
            </div>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">Service Protocol Not Found</h2>
            <p className="text-body-md text-on-surface-variant">
              The requested clinical protocol may have been moved or updated.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Clinical Services Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Service Hero Header */}
            <section className="bg-gradient-to-b from-surface-clinical via-surface-tinted/40 to-surface py-12 lg:py-16 border-b border-border-hairline">
              <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-label-sm text-outline mb-6">
                  <Link to="/" className="hover:text-primary">Home</Link>
                  <span>/</span>
                  <Link to="/services" className="hover:text-primary">Clinical Services</Link>
                  <span>/</span>
                  <span className="text-primary font-semibold">{service.title || service.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                        {service.protocolNumber || 'ANH-PROT-01'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-surface-clinical text-secondary border border-border-hairline font-label-sm text-label-sm font-semibold">
                        {service.statusTag || 'KVB Accredited'}
                      </span>
                    </div>

                    <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                      {service.title || service.name}
                    </h1>

                    <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                      {service.description}
                    </p>

                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        to="/appointment-booking"
                        className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[20px]">crisis_alert</span>
                        <span>{service.bookingCTA || 'Dispatch Ambulatory Triage'}</span>
                      </Link>

                      <Link
                        to="/contact-us"
                        className="px-6 py-3 rounded-2xl bg-surface-clinical text-primary border border-border-hairline font-label-md text-label-md font-semibold hover:bg-surface-tinted transition-colors"
                      >
                        Inquire with Clinical Specialist
                      </Link>
                    </div>
                  </div>

                  {/* Image Card */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-border-hairline bg-surface-tinted">
                      {service.image || service.heroImage ? (
                        <img
                          src={service.heroImage || service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-primary/60">
                          <span className="material-symbols-outlined text-[72px]">biotech</span>
                          <span className="font-label-md font-bold mt-2">AniHeal Clinical Protocol</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Protocol Breakdown & Procedures */}
            <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Details */}
                <div className="lg:col-span-8 space-y-10">
                  {/* Features & Key Interventions */}
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
                        Core Clinical Interventions &amp; Standards
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {service.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-surface-clinical border border-border-hairline space-y-2 hover:border-primary/40 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-xl bg-surface-tinted text-primary flex items-center justify-center font-bold">
                              <span className="material-symbols-outlined text-[20px]">{feat.icon || 'verified'}</span>
                            </div>
                            <h3 className="font-label-lg font-bold text-on-surface">{feat.title}</h3>
                            {feat.desc && <p className="font-body-sm text-on-surface-variant">{feat.desc}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Procedures Steps */}
                  {service.procedures && service.procedures.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
                        Step-by-Step Field Execution Protocol
                      </h2>
                      <div className="space-y-3">
                        {service.procedures.map((step, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-surface-clinical border border-border-hairline flex items-start gap-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center shrink-0">
                              {step.stepNumber || idx + 1}
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-label-lg font-bold text-on-surface">{step.title}</h4>
                              <p className="font-body-sm text-on-surface-variant">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preparation Guidelines */}
                  {service.preparation && (
                    <div className="p-6 rounded-3xl bg-secondary-container/30 border border-secondary/20 space-y-2">
                      <div className="flex items-center gap-2 text-secondary font-label-md font-bold">
                        <span className="material-symbols-outlined text-[20px]">assignment</span>
                        <span>Farmer &amp; Herd Pre-Visit Preparation</span>
                      </div>
                      <p className="font-body-md text-on-surface leading-relaxed">
                        {service.preparation}
                      </p>
                    </div>
                  )}

                  {/* FAQs Accordion */}
                  {service.faq && service.faq.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="font-headline-sm text-2xl font-bold text-on-surface">
                        Frequently Asked Clinical Questions
                      </h2>
                      <div className="space-y-3">
                        {service.faq.map((item, idx) => (
                          <div
                            key={idx}
                            className="rounded-2xl bg-surface-clinical border border-border-hairline overflow-hidden"
                          >
                            <button
                              onClick={() => toggleFaq(idx)}
                              className="w-full p-5 text-left flex items-center justify-between font-label-lg font-bold text-on-surface hover:text-primary transition-colors"
                            >
                              <span>{item.question}</span>
                              <span
                                className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                                  openFaqIndex === idx ? 'rotate-180 text-primary' : 'text-outline'
                                }`}
                              >
                                expand_more
                              </span>
                            </button>
                            {openFaqIndex === idx && (
                              <div className="px-5 pb-5 pt-1 text-body-sm text-on-surface-variant border-t border-border-hairline bg-surface-tinted/20">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Info Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Pricing Guidance Card */}
                  <div className="p-6 rounded-3xl bg-surface-clinical border border-border-hairline shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-primary font-label-sm font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[18px]">payments</span>
                      <span>Pricing &amp; Coverage Guidance</span>
                    </div>

                    <div className="font-headline-sm text-lg font-bold text-on-surface">
                      {service.pricingGuidelines || 'Standard KVB Regional Rates Apply'}
                    </div>

                    <p className="text-body-sm text-on-surface-variant">
                      AniHeal subscribers with active Animal Insurance policies receive full or partial coverage for this protocol.
                    </p>

                    <Link
                      to="/animal-insurance"
                      className="block w-full py-2.5 text-center rounded-xl bg-surface-tinted text-primary font-label-md font-bold hover:bg-primary hover:text-on-primary transition-colors text-sm"
                    >
                      Check Insurance Coverage
                    </Link>
                  </div>

                  {/* Specialists in Charge */}
                  {service.specialists && service.specialists.length > 0 && (
                    <div className="p-6 rounded-3xl bg-surface-clinical border border-border-hairline space-y-4">
                      <h4 className="font-label-md font-bold uppercase tracking-wider text-outline">
                        Lead Specialists for this Protocol
                      </h4>
                      <div className="space-y-3">
                        {service.specialists.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center overflow-hidden shrink-0">
                              {doc.image ? (
                                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{doc.name?.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <h5 className="font-label-md font-bold text-on-surface">{doc.name}</h5>
                              <p className="text-label-sm text-on-surface-variant">{doc.title} &bull; {doc.roleTag || 'Specialist'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance & Accreditation */}
                  <div className="p-6 rounded-3xl bg-surface-tinted/40 border border-border-hairline space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-label-sm uppercase">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                      <span>Accreditation Guarantee</span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      {service.compliance || 'All procedures strictly adhere to Kenya Veterinary Board Clinical Practice Standards 2025.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
