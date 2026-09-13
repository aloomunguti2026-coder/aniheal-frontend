import React, { useState, useEffect } from 'react';
import insuranceService from '../services/insuranceService';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function AnimalInsurance() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('dairy_cattle');
  const [billingCycle, setBillingCycle] = useState('annual'); // 'annual' or 'monthly'
  const [selectedPlanForEnroll, setSelectedPlanForEnroll] = useState(null);

  // Application form state
  const [appForm, setAppForm] = useState({
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    county: '',
    farmLocation: '',
    animalName: '',
    tagOrChipId: '',
    breed: '',
    age: '',
    animalCount: 1,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const speciesOptions = [
    { id: 'dairy_cattle', label: 'Dairy Cattle', icon: 'pets' },
    { id: 'beef_cattle', label: 'Beef Cattle', icon: 'agriculture' },
    { id: 'canine', label: 'Canines / Dogs', icon: 'sound_detection_dog_barking' },
    { id: 'feline', label: 'Felines / Cats', icon: 'cruelty_free' },
    { id: 'equine', label: 'Equine / Horses', icon: 'sports_kabaddi' },
    { id: 'small_ruminants', label: 'Goats & Sheep', icon: 'grass' },
    { id: 'poultry', label: 'Commercial Poultry', icon: 'egg' },
  ];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await insuranceService.getActivePlans();
      if (res.success) {
        setPlans(res.data || []);
      } else {
        setError('Unable to load insurance plans.');
      }
    } catch (err) {
      console.error('Failed to fetch insurance plans:', err);
      setError('Unable to connect to AniHeal Insurance Desk.');
    } finally {
      setLoading(false);
    }
  };

  const getPriceForSpecies = (plan, species, cycle) => {
    if (plan.speciesPricing && plan.speciesPricing.length > 0) {
      const match = plan.speciesPricing.find((sp) => sp.species === species);
      if (match) {
        return cycle === 'annual' ? match.annualPremium : match.monthlyPremium;
      }
    }
    return cycle === 'annual' ? plan.basePrice : Math.round(plan.basePrice / 10);
  };

  const getCoverageLimit = (plan, species) => {
    if (plan.speciesPricing && plan.speciesPricing.length > 0) {
      const match = plan.speciesPricing.find((sp) => sp.species === species);
      if (match) return match.coverageLimit;
    }
    return 150000;
  };

  const getDeductible = (plan, species) => {
    if (plan.speciesPricing && plan.speciesPricing.length > 0) {
      const match = plan.speciesPricing.find((sp) => sp.species === species);
      if (match) return match.deductible;
    }
    return 1000;
  };

  const handleOpenEnroll = (plan) => {
    setSelectedPlanForEnroll(plan);
    setSubmitSuccess(null);
    setSubmitError('');
    setAppForm({
      applicantName: '',
      applicantPhone: '',
      applicantEmail: '',
      county: '',
      farmLocation: '',
      animalName: '',
      tagOrChipId: '',
      breed: '',
      age: '',
      animalCount: 1,
      notes: '',
    });
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!appForm.applicantName || !appForm.applicantPhone || !appForm.county) {
      setSubmitError('Please complete all required contact fields.');
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError('');

      const payload = {
        ...appForm,
        species: selectedSpecies,
        planId: selectedPlanForEnroll._id,
        preferredBilling: billingCycle,
      };

      const res = await insuranceService.submitSubscription(payload);
      if (res.success) {
        setSubmitSuccess(res.data);
      } else {
        setSubmitError(res.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setSubmitError(err.message || 'Error processing enrollment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-b from-surface-clinical via-surface-tinted/40 to-surface py-12 lg:py-16 border-b border-border-hairline">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>AniHeal Clinical Shield &bull; Underwritten by KVB Veterinary Experts</span>
            </div>
            <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
              Animal Insurance &amp; Health Subscriptions
            </h1>
            <p className="font-body-lg text-lg text-on-surface-variant">
              Protect your high-value dairy herds, companion pets, and working horses against unexpected surgical emergencies, mortality, and infectious disease outbreaks.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="pt-4 inline-flex items-center p-1 rounded-full bg-surface-clinical border border-border-hairline shadow-sm">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full font-label-md text-label-md font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Monthly Retainer
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-full font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                <span>Annual Policy</span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary text-[10px] font-bold">
                  Save 15%
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Species Selector */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-6">
            <h2 className="font-headline-sm text-xl font-bold text-on-surface">
              1. Select Your Animal or Livestock Category
            </h2>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Premiums and clinical underwriting limits are customized for each species' veterinary risk profile.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {speciesOptions.map((sp) => (
              <button
                key={sp.id}
                onClick={() => setSelectedSpecies(sp.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-label-md text-label-md font-semibold whitespace-nowrap transition-all border ${
                  selectedSpecies === sp.id
                    ? 'bg-primary text-on-primary border-primary shadow-sm scale-105'
                    : 'bg-surface-clinical text-on-surface-variant hover:bg-surface-tinted border-border-hairline'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{sp.icon}</span>
                <span>{sp.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Pricing & Plans Cards */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-body-md text-on-surface-variant">Loading insurance plans...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-surface-clinical border border-error/20 text-center max-w-md mx-auto">
              <p className="text-error font-semibold">{error}</p>
              <button onClick={fetchPlans} className="mt-4 px-6 py-2 rounded-full bg-primary text-on-primary font-bold">
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => {
                const calculatedPrice = getPriceForSpecies(plan, selectedSpecies, billingCycle);
                const coverageLimit = getCoverageLimit(plan, selectedSpecies);
                const deductible = getDeductible(plan, selectedSpecies);

                return (
                  <div
                    key={plan._id}
                    className={`relative flex flex-col justify-between rounded-3xl bg-surface-clinical p-8 border transition-all ${
                      plan.isPopular
                        ? 'border-primary shadow-xl shadow-primary/5 ring-2 ring-primary/20'
                        : 'border-border-hairline hover:border-primary/40 shadow-sm'
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm">
                        Most Popular Shield
                      </span>
                    )}

                    <div className="space-y-6">
                      {/* Plan Header */}
                      <div className="space-y-2">
                        <div className="text-label-sm font-mono uppercase text-secondary font-bold">
                          {plan.code}
                        </div>
                        <h3 className="font-headline-sm text-2xl font-bold text-on-surface">
                          {plan.name}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {plan.description}
                        </p>
                      </div>

                      {/* Pricing Tag */}
                      <div className="p-4 rounded-2xl bg-surface-tinted/50 border border-border-hairline space-y-1">
                        <span className="text-label-sm text-outline uppercase font-semibold block">
                          Premium ({selectedSpecies.replace('_', ' ')})
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-headline-xl text-3xl font-bold text-primary">
                            KES {Number(calculatedPrice).toLocaleString()}
                          </span>
                          <span className="text-label-md text-on-surface-variant font-medium">
                            / {billingCycle === 'annual' ? 'year' : 'month'}
                          </span>
                        </div>
                        <div className="pt-2 text-[12px] text-secondary flex items-center justify-between border-t border-border-hairline">
                          <span>Max Claim Limit: <strong>KES {Number(coverageLimit).toLocaleString()}</strong></span>
                          <span>Deductible: <strong>KES {Number(deductible).toLocaleString()}</strong></span>
                        </div>
                      </div>

                      {/* Features List */}
                      <div className="space-y-3">
                        <span className="text-label-sm font-bold uppercase tracking-wider text-outline block">
                          Included Clinical Cover:
                        </span>
                        <ul className="space-y-2.5">
                          {plan.coverageDetails?.map((cov, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-body-sm text-on-surface">
                              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
                                check_circle
                              </span>
                              <span>{cov}</span>
                            </li>
                          ))}
                          {plan.exclusions && plan.exclusions.length > 0 && (
                            <li className="pt-2 text-[12px] text-on-surface-variant/80 border-t border-border-hairline">
                              <strong>Waiting Period:</strong> {plan.waitingPeriodDays || 14} days
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border-hairline">
                      <button
                        onClick={() => handleOpenEnroll(plan)}
                        className={`w-full py-3 rounded-2xl font-label-md text-label-md font-bold transition-all shadow-sm flex items-center justify-center gap-2 ${
                          plan.isPopular
                            ? 'bg-primary text-on-primary hover:bg-secondary'
                            : 'bg-surface-tinted text-primary hover:bg-primary hover:text-on-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                        <span>Enroll Animal in Plan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Enrollment Application Modal */}
      {selectedPlanForEnroll && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-xl w-full border border-border-hairline shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">Animal Insurance Enrollment</h3>
                <p className="font-label-sm text-label-sm text-on-primary/85 mt-0.5">
                  Plan: {selectedPlanForEnroll.name} &bull; {selectedSpecies.replace('_', ' ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedPlanForEnroll(null)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-4 overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[36px]">verified</span>
                </div>
                <h4 className="font-headline-sm text-2xl font-bold text-on-surface">Application Submitted!</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your insurance enrollment file reference is <strong className="font-mono text-primary font-bold">{submitSuccess.applicationNumber}</strong>.
                </p>
                <div className="p-4 rounded-2xl bg-surface-tinted text-label-sm text-left space-y-1.5 border border-border-hairline">
                  <div><strong>Applicant:</strong> {submitSuccess.applicantName} ({submitSuccess.applicantPhone})</div>
                  <div><strong>Insured Species:</strong> {submitSuccess.species}</div>
                  <div><strong>Plan Selected:</strong> {selectedPlanForEnroll.name}</div>
                  <div><strong>Status:</strong> Underwriting &amp; Health Verification in Progress</div>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  A certified AniHeal veterinary officer in your county will contact you within 24 hours to conduct a baseline health inspection and issue your official policy certificate.
                </p>
                <button
                  onClick={() => setSelectedPlanForEnroll(null)}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="p-6 space-y-4 overflow-y-auto">
                {submitError && (
                  <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error font-body-sm text-body-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-surface-tinted flex items-center justify-between text-label-sm">
                  <span>Selected Category: <strong className="uppercase">{selectedSpecies.replace('_', ' ')}</strong></span>
                  <span>Premium: <strong>KES {Number(getPriceForSpecies(selectedPlanForEnroll, selectedSpecies, billingCycle)).toLocaleString()} / {billingCycle}</strong></span>
                </div>

                <h5 className="font-label-sm font-bold uppercase tracking-wider text-outline">
                  1. Farmer / Pet Owner Details
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mary Njeri"
                      value={appForm.applicantName}
                      onChange={(e) => setAppForm({ ...appForm, applicantName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000"
                      value={appForm.applicantPhone}
                      onChange={(e) => setAppForm({ ...appForm, applicantPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      County *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kiambu, Uasin Gishu"
                      value={appForm.county}
                      onChange={(e) => setAppForm({ ...appForm, county: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="mary@domain.com"
                      value={appForm.applicantEmail}
                      onChange={(e) => setAppForm({ ...appForm, applicantEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <h5 className="font-label-sm font-bold uppercase tracking-wider text-outline pt-2">
                  2. Animal / Pet Identification
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Animal / Pet Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bella"
                      value={appForm.animalName}
                      onChange={(e) => setAppForm({ ...appForm, animalName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Tag or Microchip ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. EAR-TAG-991"
                      value={appForm.tagOrChipId}
                      onChange={(e) => setAppForm({ ...appForm, tagOrChipId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Breed / Age
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. German Shepherd, 2yo"
                      value={appForm.breed}
                      onChange={(e) => setAppForm({ ...appForm, breed: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                    Known Medical History or Notes
                  </label>
                  <textarea
                    rows="2"
                    placeholder="List recent vaccinations, surgical history, or breeding status..."
                    value={appForm.notes}
                    onChange={(e) => setAppForm({ ...appForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForEnroll(null)}
                    className="px-5 py-2.5 rounded-xl text-on-surface-variant font-label-md font-semibold hover:bg-surface-tinted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                  >
                    {submitting ? 'Processing Application...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
