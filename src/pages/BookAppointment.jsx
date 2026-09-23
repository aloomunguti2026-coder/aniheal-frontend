import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useContent } from '../hooks/useContent';
import { API_BASE_URL } from '../services/api';

export default function BookAppointment() {
  const { settings, services: dbServices, hubs: dbHubs, blocks } = useContent();

  // Wizard Step State (1: Mode & Livestock, 2: Service & Symptoms, 3: Location & Time, 4: Contact & Confirm)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [appointmentType, setAppointmentType] = useState('farm_visit'); // 'farm_visit' | 'office_visit'
  const [speciesType, setSpeciesType] = useState('dairy');
  const [headcountTotal, setHeadcountTotal] = useState('24');
  const [affectedCount, setAffectedCount] = useState('1');

  const [clinicalService, setClinicalService] = useState('acute_treatment');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [filesCount, setFilesCount] = useState(0);

  // Farm Visit Location fields
  const [farmCounty, setFarmCounty] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmLandmarks, setFarmLandmarks] = useState('');
  const [gpsStatus, setGpsStatus] = useState('Capture Current GPS');

  // Office Visit Location fields
  const [assignedHub, setAssignedHub] = useState('');

  // Scheduling
  const [dispatchTier, setDispatchTier] = useState('morning');
  const [visitDate, setVisitDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Client / Contact fields
  const [farmerName, setFarmerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  // Submission & Feedback State
  const [ticketRef, setTicketRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stepError, setStepError] = useState('');

  const emergencyPhone = settings?.emergencyPhone || settings?.hotlinePhone || settings?.primaryPhone || '+254 700 264 432';

  // CMS Content Block for Booking
  const bookingBlock = blocks?.['home_booking_header'] || {};
  const bookingMeta = bookingBlock?.metadata || {};

  const bookingImage =
    bookingMeta.imageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCqcSFbViwyr8mocbzKIJzG7IJgNmsQDzShlDKng9RrHFUSvUhWyciE7nI9uHjuQfZ96NGPRAsj9A1glCm1YFtuRnFJSTGFkb2Jc5LZca1_O2NlNpv7TopYviyBfcfMMKhAruZR-Tzd2pmlf3FWFu254SnIurU5M1YaXvMS3SbWILfZTh-EtQgrH2nUMow-nYT_8PJs_hE2LzrTSReh3E_y8M-CKRPkeMptKhejBOUbnoDNdvqMBqA3';

  const bookingImageTitle = bookingMeta.imageTitle || 'Mobile Diagnostic Ultrasound & Ambulatory Unit';
  const bookingImageCaption =
    bookingMeta.imageCaption ||
    'Equipped for real-time ovarian scanning, field surgery, cold-chain biologics & herd synchronization.';

  const bookingBadge = bookingBlock.badge || 'VERIFIED FIELD AMBULATORY & CLINIC LOGISTICS';
  const bookingTitle = bookingBlock.title || 'Schedule a Farm Visit or In-Office Appointment';
  const bookingSubtitle =
    bookingBlock.body ||
    'Deploy KVB-registered veterinary surgeons directly to your farm gate, or schedule a clinical consultation at any of our regional hubs.';

  const emergencyTitle = bookingMeta.emergencyTitle || 'Acute Animal Emergency?';
  const emergencyBody =
    bookingMeta.emergencyBody ||
    'Field Ambulatory Mobile Units standing by in Central Kenya & Rift Valley.';

  const handleGPS = () => {
    if (navigator.geolocation) {
      setGpsStatus('Acquiring Fix...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setGpsStatus(`${lat}, ${lng} Captured`);
          setFarmLandmarks((prev) => (prev ? `${prev} | GPS: ${lat}, ${lng}` : `GPS: ${lat}, ${lng}`));
        },
        () => {
          setGpsStatus('Location Available Manually');
        }
      );
    } else {
      setGpsStatus('Not Supported by Browser');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFilesCount(e.target.files.length);
    }
  };

  // Step Validation & Navigation
  const validateStep = (step) => {
    setStepError('');
    if (step === 1) {
      if (!speciesType) {
        setStepError('Please select a livestock / animal species category.');
        return false;
      }
      if (!headcountTotal || Number(headcountTotal) < 1) {
        setStepError('Please specify total herd / group headcount.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!clinicalService) {
        setStepError('Please select the clinical service required.');
        return false;
      }
      if (!symptomsDescription || symptomsDescription.trim().length < 5) {
        setStepError('Please provide a brief description of the observable symptoms or clinical reason.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (appointmentType === 'farm_visit') {
        if (!farmCounty) {
          setStepError('Please select your County / Administrative Zone.');
          return false;
        }
        if (!farmName.trim()) {
          setStepError('Please enter your Farm or Estate Enterprise Name.');
          return false;
        }
        if (!farmLandmarks.trim()) {
          setStepError('Please provide directions or prominent landmarks for ambulatory dispatch.');
          return false;
        }
      } else {
        if (!assignedHub) {
          setStepError('Please select the AniHeal Office / Clinic Hub you wish to visit.');
          return false;
        }
      }
      if (!visitDate) {
        setStepError('Please pick your preferred appointment date.');
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!farmerName.trim()) {
        setStepError('Please enter your full name or farm representative name.');
        return false;
      }
      if (!contactPhone.trim() || contactPhone.trim().length < 9) {
        setStepError('Please enter a valid telephone number for dispatch updates and SMS confirmation.');
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setStepError('');
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 160, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 160, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    setErrorMsg('');
    try {
      const payload = {
        farmerName: farmerName.trim(),
        farmName: appointmentType === 'farm_visit' ? (farmName.trim() || `${farmerName}'s Farm`) : (farmName.trim() || `${farmerName}'s Holding (Clinic Visit)`),
        phone: contactPhone.trim(),
        email: emailAddress.trim(),
        county: appointmentType === 'farm_visit' ? farmCounty : (assignedHub || 'AniHeal Clinic Office'),
        appointmentType,
        assignedHub: appointmentType === 'office_visit' ? assignedHub : '',
        speciesType,
        totalHeadcount: Number(headcountTotal) || 1,
        affectedCount: Number(affectedCount) || 1,
        clinicalService,
        dispatchTier,
        preferredDate: visitDate,
        landmarks: appointmentType === 'farm_visit' ? farmLandmarks : `In-Office Visit at: ${assignedHub}`,
        symptomsDescription: symptomsDescription.trim(),
      };

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success && data?.data?.ticketRef) {
        setTicketRef(data.data.ticketRef);
        setIsSubmitted(true);
        setErrorMsg('');
        window.scrollTo({ top: 120, behavior: 'smooth' });
      } else {
        setIsSubmitted(false);
        setTicketRef('');
        if (res.status >= 500) {
          setErrorMsg(data?.message || 'Server error encountered while processing your ticket. Please try again or call our hotline.');
        } else {
          setErrorMsg(data?.message || 'Failed to submit appointment request. Please verify required fields.');
        }
      }
    } catch (err) {
      console.error('Appointment submission network error:', err);
      setIsSubmitted(false);
      setTicketRef('');
      setErrorMsg('Unable to submit your appointment request. Please check your internet connection or call our emergency line.');
    } finally {
      setSubmitting(false);
    }
  };

  const speciesOptions = [
    { id: 'dairy', label: 'Dairy Cattle', sub: 'Lactating / Heifers', icon: 'agriculture' },
    { id: 'beef', label: 'Beef Feedlot', sub: 'Boran / Steers', icon: 'grass' },
    { id: 'shoats', label: 'Shoats / Sheep', sub: 'Dorper / Goats', icon: 'cruelty_free' },
    { id: 'poultry', label: 'Poultry Flock', sub: 'Layers / Broilers', icon: 'egg' },
    { id: 'swine', label: 'Swine / Piggery', sub: 'Commercial sows', icon: 'shelves' },
    { id: 'camel', label: 'Camelids', sub: 'Dromedary', icon: 'flare' },
    { id: 'canine', label: 'Working Dogs & Pets', sub: 'Pastoral & Companion', icon: 'sound_detection_dog_barking' },
    { id: 'equine', label: 'Equine / Asses', sub: 'Draft & Riding', icon: 'pest_control_rodent' },
  ];

  const defaultServices = [
    {
      id: 'acute_treatment',
      title: 'Sick Animal / Acute Treatment',
      desc: 'High fever, bloat, downer cow, dystocia, or respiratory distress.',
      icon: 'vital_signs',
      iconColor: 'text-error',
    },
    {
      id: 'vaccination',
      title: 'Routine Herd Vaccination',
      desc: 'FMD, Anthrax, Blackquarter, Lumpy Skin, Newcastle disease.',
      icon: 'vaccines',
      iconColor: 'text-primary',
    },
    {
      id: 'ultrasound_breeding',
      title: 'Ultrasound / Fertility Check',
      desc: 'Early pregnancy diagnosis (30d+), ovary profiling, sync protocols.',
      icon: 'female',
      iconColor: 'text-secondary',
    },
    {
      id: 'surgery',
      title: 'Surgical Intervention',
      desc: 'Field caesarean, dehorning, wound revision, rumenotomy.',
      icon: 'chips',
      iconColor: 'text-primary',
    },
    {
      id: 'nutrition_audit',
      title: 'Feed & Nutrition Audit',
      desc: 'Silage testing, mineral deficieny analysis, TMR ration balancing.',
      icon: 'nutrition',
      iconColor: 'text-primary',
    },
    {
      id: 'post_mortem',
      title: 'Post-Mortem / Pathology',
      desc: 'Rapid herd mortality investigation & lab histology sampling.',
      icon: 'deceased',
      iconColor: 'text-error',
    },
  ];

  const serviceOptions =
    dbServices && dbServices.length > 0
      ? dbServices.map((s) => ({
        id: s.slug || s._id || s.title?.toLowerCase().replace(/\s+/g, '_'),
        title: s.title,
        desc: s.description || s.summary || '',
        icon: s.icon || 'medical_services',
        iconColor:
          s.category === 'emergency'
            ? 'text-error'
            : s.category === 'reproduction'
              ? 'text-secondary'
              : 'text-primary',
      }))
      : defaultServices;

  const defaultHubs = [
    { name: 'Nairobi Central Headquarters & Referral Hub', county: 'Nairobi County', address: 'Veterinary Complex, Kabete Rd, Nairobi', hours: 'Mon–Sat 07:00–18:00 (24/7 Triage)' },
    { name: 'Nakuru Regional Ambulatory & Clinical Station', county: 'Nakuru County', address: 'George Morara Rd, Nakuru Town', hours: 'Mon–Sat 07:30–17:30' },
    { name: 'Eldoret North Rift Ambulatory Squad Hub', county: 'Uasin Gishu', address: 'Uganda Rd, Eldoret Central', hours: 'Mon–Sat 07:30–17:30' },
    { name: 'Nyeri & Mt Kenya Clinical Outreach Center', county: 'Nyeri County', address: 'Kenyatta Way, Nyeri Town', hours: 'Mon–Sat 08:00–17:00' },
    { name: 'Kilifi Coast Ambulatory Station', county: 'Kilifi County', address: 'Bofa Rd, Kilifi', hours: 'Mon–Fri 08:00–17:00' },
  ];

  const hubOptions = dbHubs && dbHubs.length > 0 ? dbHubs : defaultHubs;

  const stepTitles = [
    { num: 1, label: 'Type & Animals', icon: 'pets' },
    { num: 2, label: 'Service & Symptoms', icon: 'medical_services' },
    { num: 3, label: 'Location & Schedule', icon: 'calendar_month' },
    { num: 4, label: 'Contact & Confirm', icon: 'verified' },
  ];

  const selectedServiceObj = serviceOptions.find((s) => s.id === clinicalService) || serviceOptions[0];
  const selectedSpeciesObj = speciesOptions.find((sp) => sp.id === speciesType) || speciesOptions[0];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="w-full pt-20 bg-surface flex-1">
        <div className="flex flex-col w-full">
          {/* Triage Emergency Banner */}
          <section className="w-full bg-error-container text-on-error-container py-3 px-margin-mobile lg:px-margin shadow-sm">
            <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-[24px] animate-pulse">
                  crisis_alert
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-headline-sm text-headline-sm text-error font-bold tracking-tight">
                    {emergencyTitle}
                  </span>
                  <span className="font-body-md text-body-md text-on-error-container">
                    {emergencyBody}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm hover:brightness-95 transition-all"
                  href={`tel:${emergencyPhone.replace(/\s+/g, '')}`}
                >
                  <span className="material-symbols-outlined text-[16px]">phone_forwarded</span>
                  <span>Ambulatory Squad: {emergencyPhone}</span>
                </a>
              </div>
            </div>
          </section>

          {/* Title & Context Overview */}
          <section className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin pt-space-lg pb-space-sm">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-space-xs">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider border border-border-accent">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  <span>{bookingBadge}</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                  {bookingTitle}
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                  {bookingSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface-clinical text-on-surface-variant border border-border-hairline shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    verified_user
                  </span>
                  <div className="flex flex-col text-xs">
                    <span className="font-label-sm uppercase text-outline font-bold">
                      KVB Accredited SLA
                    </span>
                    <span className="font-label-md text-on-surface font-semibold">
                      Priority Squad Dispatch Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Booking Interface & Support Sidebar Grid */}
          <section className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin pb-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
              {/* Primary Wizard Form (8 cols on desktop) */}
              <div className="lg:col-span-8 space-y-space-md">
                {/* Step Progress Bar */}
                <div className="p-4 rounded-2xl bg-surface-clinical shadow-sm border border-border-hairline">
                  <div className="grid grid-cols-4 gap-2">
                    {stepTitles.map((st) => {
                      const isCompleted = currentStep > st.num;
                      const isCurrent = currentStep === st.num;
                      return (
                        <button
                          key={st.num}
                          type="button"
                          onClick={() => {
                            if (st.num < currentStep) setCurrentStep(st.num);
                          }}
                          disabled={st.num > currentStep}
                          className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-2.5 rounded-xl transition-all text-center sm:text-left ${isCurrent
                            ? 'bg-primary text-on-primary shadow-sm font-bold'
                            : isCompleted
                              ? 'bg-surface-tinted text-primary font-semibold hover:bg-surface-container cursor-pointer'
                              : 'bg-surface-subtle text-outline opacity-60 cursor-not-allowed'
                            }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${isCurrent
                              ? 'bg-white text-primary font-bold'
                              : isCompleted
                                ? 'bg-primary text-on-primary'
                                : 'bg-surface-container text-outline'
                              }`}
                          >
                            {isCompleted ? (
                              <span className="material-symbols-outlined text-[14px]">check</span>
                            ) : (
                              st.num
                            )}
                          </div>
                          <span className="text-[11px] sm:text-xs tracking-tight truncate">
                            {st.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!isSubmitted ? (
                  <div className="space-y-space-md">
                    {/* Error Alerts */}
                    {(stepError || errorMsg) && (
                      <div
                        className="p-4 rounded-xl bg-error-container text-on-error-container text-body-sm font-semibold border border-error/30 shadow-sm flex items-start gap-3 animate-fade-in"
                        role="alert"
                      >
                        <span className="material-symbols-outlined text-error text-[22px] shrink-0 mt-0.5">
                          error
                        </span>
                        <div className="flex-1">
                          <p>{stepError || errorMsg}</p>
                        </div>
                      </div>
                    )}

                    {/* STEP 1: APPOINTMENT MODE & LIVESTOCK CLASSIFICATION */}
                    {currentStep === 1 && (
                      <div className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-6 border border-border-hairline animate-fade-in">
                        {/* Section 1A: Choose Appointment Mode */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5 pb-2 border-b border-border-hairline">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                              how_to_reg
                            </span>
                            <div>
                              <h2 className="font-headline-sm font-bold text-on-surface text-lg">
                                1. Select Appointment Mode
                              </h2>
                              <p className="font-body-sm text-on-surface-variant text-xs">
                                Choose between a field mobile squad visiting your farm or a clinic walk-in.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Option 1: Farm Visit */}
                            <label className="cursor-pointer">
                              <input
                                type="radio"
                                name="appointment_type"
                                value="farm_visit"
                                checked={appointmentType === 'farm_visit'}
                                onChange={() => setAppointmentType('farm_visit')}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-2xl border transition-all h-full flex flex-col justify-between gap-3 ${appointmentType === 'farm_visit'
                                  ? 'bg-surface-tinted border-primary ring-2 ring-primary/20 shadow-sm'
                                  : 'bg-surface-subtle border-border-hairline hover:bg-surface-container-low'
                                  }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">
                                      local_shipping
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${appointmentType === 'farm_visit'
                                      ? 'bg-primary text-on-primary'
                                      : 'bg-surface-container text-outline'
                                      }`}
                                  >
                                    Most Popular
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-headline-sm font-bold text-on-surface text-base">
                                    Schedule a Farm Visit
                                  </h3>
                                  <p className="font-body-sm text-on-surface-variant text-xs mt-1 leading-relaxed">
                                    Our KVB veterinary surgeons &amp; 4x4 mobile unit travel directly to your farm gate with mobile ultrasound and therapeutics.
                                  </p>
                                </div>
                                <div className="text-primary font-label-sm font-semibold text-xs flex items-center gap-1 pt-1">
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>Direct Farm Gate Dispatch</span>
                                </div>
                              </div>
                            </label>

                            {/* Option 2: Office / Clinic Visit */}
                            <label className="cursor-pointer">
                              <input
                                type="radio"
                                name="appointment_type"
                                value="office_visit"
                                checked={appointmentType === 'office_visit'}
                                onChange={() => setAppointmentType('office_visit')}
                                className="sr-only"
                              />
                              <div
                                className={`p-4 rounded-2xl border transition-all h-full flex flex-col justify-between gap-3 ${appointmentType === 'office_visit'
                                  ? 'bg-surface-tinted border-primary ring-2 ring-primary/20 shadow-sm'
                                  : 'bg-surface-subtle border-border-hairline hover:bg-surface-container-low'
                                  }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[24px]">
                                      storefront
                                    </span>
                                  </div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${appointmentType === 'office_visit'
                                      ? 'bg-secondary text-on-secondary'
                                      : 'bg-surface-container text-outline'
                                      }`}
                                  >
                                    Clinic Walk-In
                                  </span>
                                </div>
                                <div>
                                  <h3 className="font-headline-sm font-bold text-on-surface text-base">
                                    In-Office / Clinic Appointment
                                  </h3>
                                  <p className="font-body-sm text-on-surface-variant text-xs mt-1 leading-relaxed">
                                    Visit any of our accredited regional offices or clinical hubs in Kabete Nairobi, Nakuru, Eldoret, Nyeri, or Kilifi.
                                  </p>
                                </div>
                                <div className="text-secondary font-label-sm font-semibold text-xs flex items-center gap-1 pt-1">
                                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                  <span>In-Person Consultation &amp; Pharmacy</span>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Section 1B: Livestock Species & Population */}
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-[22px]">
                                pets
                              </span>
                              <h3 className="font-headline-sm font-bold text-on-surface text-base">
                                Animal / Patient Species Classification
                              </h3>
                            </div>
                            <span className="text-[11px] font-bold uppercase bg-surface-tinted text-primary px-2.5 py-0.5 rounded-full">
                              Required
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {speciesOptions.map((opt) => {
                              const isSelected = speciesType === opt.id;
                              return (
                                <label key={opt.id} className="cursor-pointer">
                                  <input
                                    className="sr-only"
                                    name="species_type"
                                    type="radio"
                                    value={opt.id}
                                    checked={isSelected}
                                    onChange={() => setSpeciesType(opt.id)}
                                  />
                                  <div
                                    className={`p-3 rounded-xl text-center flex flex-col items-center gap-1.5 shadow-sm transition-all border ${isSelected
                                      ? 'bg-surface-tinted text-primary border-primary font-semibold ring-2 ring-primary/20'
                                      : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                                      }`}
                                  >
                                    <span className="material-symbols-outlined text-[24px]">
                                      {opt.icon}
                                    </span>
                                    <span className="font-label-md text-label-md font-semibold text-xs">
                                      {opt.label}
                                    </span>
                                    <span className="font-label-sm text-label-sm text-outline text-[10px]">
                                      {opt.sub}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>

                          {/* Headcount numbers */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                            <div className="space-y-1.5">
                              <label
                                className="font-label-md text-label-md text-on-surface font-semibold text-xs"
                                htmlFor="headcountTotal"
                              >
                                Total Herd / Flock / Group Size *
                              </label>
                              <div className="relative">
                                <input
                                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                                  id="headcountTotal"
                                  max="100000"
                                  min="1"
                                  placeholder="e.g. 24"
                                  required
                                  type="number"
                                  value={headcountTotal}
                                  onChange={(e) => setHeadcountTotal(e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 font-label-sm text-label-sm text-outline text-xs">
                                  Heads
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label
                                className="font-label-md text-label-md text-on-surface font-semibold text-xs"
                                htmlFor="affectedCount"
                              >
                                Number of Symptomatic / Sick Animals *
                              </label>
                              <div className="relative">
                                <input
                                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                                  id="affectedCount"
                                  max="10000"
                                  min="0"
                                  placeholder="e.g. 1"
                                  required
                                  type="number"
                                  value={affectedCount}
                                  onChange={(e) => setAffectedCount(e.target.value)}
                                />
                                <span className="absolute right-3 top-2.5 font-label-sm text-label-sm text-error font-medium text-xs">
                                  Patients
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Step 1 Navigation Button */}
                        <div className="pt-4 border-t border-border-hairline flex justify-end">
                          <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow hover:bg-primary/90 transition-all cursor-pointer"
                          >
                            <span>Continue to Clinical Service</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: CLINICAL SERVICE & SYMPTOMS */}
                    {currentStep === 2 && (
                      <div className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-6 border border-border-hairline animate-fade-in">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-border-hairline">
                          <span className="material-symbols-outlined text-primary text-[24px]">
                            medical_services
                          </span>
                          <div>
                            <h2 className="font-headline-sm font-bold text-on-surface text-lg">
                              2. Primary Service &amp; Symptoms Description
                            </h2>
                            <p className="font-body-sm text-on-surface-variant text-xs">
                              Select the intervention scope and detail observable symptoms for our duty surgeon.
                            </p>
                          </div>
                        </div>

                        {/* Service Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {serviceOptions.map((srv) => {
                            const isSelected = clinicalService === srv.id;
                            return (
                              <label key={srv.id} className="cursor-pointer">
                                <input
                                  className="sr-only"
                                  name="clinical_service"
                                  type="radio"
                                  value={srv.id}
                                  checked={isSelected}
                                  onChange={() => setClinicalService(srv.id)}
                                />
                                <div
                                  className={`p-3.5 rounded-xl flex items-start gap-3 shadow-sm transition-all border h-full ${isSelected
                                    ? 'bg-surface-tinted border-primary ring-2 ring-primary/20'
                                    : 'bg-surface-subtle border-border-hairline hover:bg-surface-container-low'
                                    }`}
                                >
                                  <span
                                    className={`material-symbols-outlined text-[24px] mt-0.5 ${srv.iconColor}`}
                                  >
                                    {srv.icon}
                                  </span>
                                  <div className="space-y-0.5">
                                    <span className="font-label-lg text-label-lg text-on-surface block font-semibold text-xs sm:text-sm">
                                      {srv.title}
                                    </span>
                                    <span className="font-body-sm text-body-sm text-on-surface-variant block text-xs leading-relaxed">
                                      {srv.desc}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>

                        {/* Symptoms Notes */}
                        <div className="space-y-2 pt-2">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold text-xs flex items-center justify-between"
                            htmlFor="symptomsDescription"
                          >
                            <span>Clinical Symptoms / Presentation Notes *</span>
                            <span className="text-outline text-[11px] font-normal">
                              e.g., fever, loss of appetite, coughing, milk drop, injury
                            </span>
                          </label>
                          <textarea
                            className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm leading-relaxed"
                            id="symptomsDescription"
                            placeholder="Detail specific observations: e.g. cow stopped eating yesterday, heavy salivation, rectal temp 40.2°C, administered antibiotics 2 days ago..."
                            required
                            rows="4"
                            value={symptomsDescription}
                            onChange={(e) => setSymptomsDescription(e.target.value)}
                          ></textarea>
                        </div>

                        {/* Photo/Media Upload trigger */}
                        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border border-border-hairline">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[28px]">
                              add_photo_alternate
                            </span>
                            <div>
                              <span className="font-label-md text-on-surface font-semibold block text-xs">
                                Attach Visual Evidence (Photos, Mucosa, Dung, Video)
                              </span>
                              <span className="font-body-sm text-on-surface-variant block text-[11px]">
                                Helps the duty triage officer assemble specific cold-chain biologics before dispatch.
                              </span>
                            </div>
                          </div>
                          <label className="cursor-pointer px-4 py-2 rounded-full bg-surface-clinical shadow-sm text-primary font-label-md font-semibold hover:bg-surface-tinted transition-colors flex items-center gap-1.5 shrink-0 border border-border-hairline text-xs">
                            <span className="material-symbols-outlined text-[18px]">upload_file</span>
                            <span>{filesCount > 0 ? `${filesCount} Selected` : 'Upload Media'}</span>
                            <input
                              accept="image/*,video/*"
                              className="sr-only"
                              multiple
                              onChange={handleFileChange}
                              type="file"
                            />
                          </label>
                        </div>

                        {/* Step 2 Navigation Buttons */}
                        <div className="pt-4 border-t border-border-hairline flex items-center justify-between">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Back</span>
                          </button>
                          <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow hover:bg-primary/90 transition-all cursor-pointer"
                          >
                            <span>Continue to Location &amp; Schedule</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: LOCATION / CLINIC HUB & SCHEDULE */}
                    {currentStep === 3 && (
                      <div className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-6 border border-border-hairline animate-fade-in">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-border-hairline">
                          <span className="material-symbols-outlined text-primary text-[24px]">
                            {appointmentType === 'farm_visit' ? 'pin_drop' : 'storefront'}
                          </span>
                          <div>
                            <h2 className="font-headline-sm font-bold text-on-surface text-lg">
                              3. {appointmentType === 'farm_visit' ? 'Farm Location & Navigational Directions' : 'Select Office Location / Clinic Hub'}
                            </h2>
                            <p className="font-body-sm text-on-surface-variant text-xs">
                              {appointmentType === 'farm_visit'
                                ? 'Provide clear directions for veterinary 4x4 ambulatory dispatch units.'
                                : 'Choose the AniHeal consultation office you will be visiting.'}
                            </p>
                          </div>
                        </div>

                        {/* Case A: Farm Visit Location Fields */}
                        {appointmentType === 'farm_visit' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label
                                className="font-label-md text-on-surface font-semibold text-xs"
                                htmlFor="farmCounty"
                              >
                                Primary County Zone *
                              </label>
                              <select
                                className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                                id="farmCounty"
                                required
                                value={farmCounty}
                                onChange={(e) => setFarmCounty(e.target.value)}
                              >
                                <option value="">Select County Zone</option>
                                <option value="Nakuru County (Naivasha, Rongai, Njoro, Gilgil)">Nakuru County (Naivasha, Rongai, Njoro, Gilgil)</option>
                                <option value="Kiambu County (Limuru, Kikuyu, Githunguri, Thika)">Kiambu County (Limuru, Kikuyu, Githunguri, Thika)</option>
                                <option value="Nairobi Metropolitan Area">Nairobi Metropolitan Area</option>
                                <option value="Murang'a County (Karatina border, Maragua)">Murang'a County (Karatina border, Maragua)</option>
                                <option value="Nyandarua County (Ol Kalou, Kinangop)">Nyandarua County (Ol Kalou, Kinangop)</option>
                                <option value="Uasin Gishu (Eldoret, Turbo, Moiben)">Uasin Gishu (Eldoret, Turbo, Moiben)</option>
                                <option value="Nandi County (Kapsabet, Nandi Hills)">Nandi County (Kapsabet, Nandi Hills)</option>
                                <option value="Kajiado (Kitengela, Isinya, Kajiado Central)">Kajiado (Kitengela, Isinya, Kajiado Central)</option>
                                <option value="Machakos (Kathiani, Athi River, Kangundo)">Machakos (Kathiani, Athi River, Kangundo)</option>
                                <option value="Kilifi / Coast Regional Dispatch">Kilifi / Coast Regional Dispatch</option>
                                <option value="Other Regional Zone">Other Regional Zone</option>
                              </select>
                            </div>

                            <div className="space-y-1.5">
                              <label
                                className="font-label-md text-on-surface font-semibold text-xs"
                                htmlFor="farmName"
                              >
                                Farm or Estate Enterprise Name *
                              </label>
                              <input
                                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                                id="farmName"
                                placeholder="e.g. Ridgeview Dairy Unit / Mutua Farm"
                                required
                                type="text"
                                value={farmName}
                                onChange={(e) => setFarmName(e.target.value)}
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-1.5">
                              <label
                                className="font-label-md text-on-surface font-semibold text-xs"
                                htmlFor="farmLandmarks"
                              >
                                Physical Directions &amp; Landmarks *
                              </label>
                              <input
                                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                                id="farmLandmarks"
                                placeholder="e.g. 2.5km off Nakuru-Dundori Road, opposite Ndung'u Milk Collection Center, green gate"
                                required
                                type="text"
                                value={farmLandmarks}
                                onChange={(e) => setFarmLandmarks(e.target.value)}
                              />
                            </div>

                            <div className="sm:col-span-2 p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 border border-border-hairline">
                              <div className="flex items-center gap-2 text-primary font-label-sm text-xs">
                                <span className="material-symbols-outlined text-[18px]">my_location</span>
                                <span>Auto-detect GPS via device geolocation for precision 4x4 dispatch</span>
                              </div>
                              <button
                                className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-label-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer text-xs"
                                onClick={handleGPS}
                                type="button"
                              >
                                {gpsStatus}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Case B: Office / Clinic Selection */
                          <div className="space-y-4">
                            <label className="block font-label-md text-on-surface font-semibold text-xs">
                              Select Regional Office / Clinic Hub *
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {hubOptions.map((hub, idx) => {
                                const isSelected = assignedHub === hub.name;
                                return (
                                  <label key={idx} className="cursor-pointer">
                                    <input
                                      type="radio"
                                      name="assigned_hub"
                                      value={hub.name}
                                      checked={isSelected}
                                      onChange={() => setAssignedHub(hub.name)}
                                      className="sr-only"
                                    />
                                    <div
                                      className={`p-4 rounded-xl border transition-all h-full space-y-2 ${isSelected
                                        ? 'bg-surface-tinted border-primary ring-2 ring-primary/20 shadow-sm'
                                        : 'bg-surface-subtle border-border-hairline hover:bg-surface-container-low'
                                        }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <span className="font-bold text-on-surface text-xs sm:text-sm">
                                          {hub.name}
                                        </span>
                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                          {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                                        <span>{hub.address || hub.county}</span>
                                      </p>
                                      {hub.hours && (
                                        <p className="text-[11px] text-outline flex items-center gap-1">
                                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                                          <span>{hub.hours}</span>
                                        </p>
                                      )}
                                    </div>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Scheduling & Urgency Tier */}
                        <div className="space-y-4 pt-4 border-t border-border-hairline">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              schedule
                            </span>
                            <h3 className="font-headline-sm font-bold text-on-surface text-base">
                              Preferred Date &amp; Urgency Tier
                            </h3>
                          </div>

                          {/* Urgency Selector */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <label className="cursor-pointer">
                              <input
                                className="sr-only"
                                name="dispatch_tier"
                                type="radio"
                                value="emergency"
                                checked={dispatchTier === 'emergency'}
                                onChange={() => setDispatchTier('emergency')}
                              />
                              <div
                                className={`p-3.5 rounded-xl text-center space-y-1 shadow-sm transition-all border ${dispatchTier === 'emergency'
                                  ? 'bg-error-container text-on-error-container border-error ring-2 ring-error/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                                  }`}
                              >
                                <span className="material-symbols-outlined text-error text-[24px]">
                                  crisis_alert
                                </span>
                                <span className="font-label-lg font-bold block text-error text-xs sm:text-sm">
                                  Immediate Emergency
                                </span>
                                <span className="font-label-sm text-outline block text-[10px]">
                                  Dispatched &lt; 60 Mins
                                </span>
                              </div>
                            </label>

                            <label className="cursor-pointer">
                              <input
                                className="sr-only"
                                name="dispatch_tier"
                                type="radio"
                                value="morning"
                                checked={dispatchTier === 'morning'}
                                onChange={() => setDispatchTier('morning')}
                              />
                              <div
                                className={`p-3.5 rounded-xl text-center space-y-1 shadow-sm transition-all border ${dispatchTier === 'morning'
                                  ? 'bg-surface-tinted text-primary border-primary ring-2 ring-primary/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                                  }`}
                              >
                                <span className="material-symbols-outlined text-primary text-[24px]">
                                  wb_twilight
                                </span>
                                <span className="font-label-lg font-bold block text-xs sm:text-sm">
                                  Morning Slot
                                </span>
                                <span className="font-label-sm text-outline block text-[10px]">
                                  07:00 – 11:00 EAT
                                </span>
                              </div>
                            </label>

                            <label className="cursor-pointer">
                              <input
                                className="sr-only"
                                name="dispatch_tier"
                                type="radio"
                                value="afternoon"
                                checked={dispatchTier === 'afternoon'}
                                onChange={() => setDispatchTier('afternoon')}
                              />
                              <div
                                className={`p-3.5 rounded-xl text-center space-y-1 shadow-sm transition-all border ${dispatchTier === 'afternoon'
                                  ? 'bg-surface-tinted text-primary border-primary ring-2 ring-primary/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                                  }`}
                              >
                                <span className="material-symbols-outlined text-primary text-[24px]">
                                  wb_sunny
                                </span>
                                <span className="font-label-lg font-bold block text-xs sm:text-sm">
                                  Afternoon Slot
                                </span>
                                <span className="font-label-sm text-outline block text-[10px]">
                                  12:00 – 16:00 EAT
                                </span>
                              </div>
                            </label>
                          </div>

                          {/* Date Selector */}
                          <div className="space-y-1.5 pt-1">
                            <label
                              className="font-label-md text-on-surface font-semibold text-xs"
                              htmlFor="visitDate"
                            >
                              Preferred Calendar Date *
                            </label>
                            <input
                              className="w-full sm:w-1/2 h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="visitDate"
                              required
                              type="date"
                              value={visitDate}
                              onChange={(e) => setVisitDate(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Step 3 Navigation Buttons */}
                        <div className="pt-4 border-t border-border-hairline flex items-center justify-between">
                          <button
                            type="button"
                            onClick={prevStep}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Back</span>
                          </button>
                          <button
                            type="button"
                            onClick={nextStep}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow hover:bg-primary/90 transition-all cursor-pointer"
                          >
                            <span>Review &amp; Contact Info</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: CONTACT PARTICULARS & CONFIRMATION */}
                    {currentStep === 4 && (
                      <form onSubmit={handleSubmit} className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-6 border border-border-hairline animate-fade-in">
                        <div className="flex items-center gap-2.5 pb-2 border-b border-border-hairline">
                          <span className="material-symbols-outlined text-primary text-[24px]">
                            contact_phone
                          </span>
                          <div>
                            <h2 className="font-headline-sm font-bold text-on-surface text-lg">
                              4. Contact Particulars &amp; Final Confirmation
                            </h2>
                            <p className="font-body-sm text-on-surface-variant text-xs">
                              Provide the phone number to receive immediate SMS triage confirmation and squad dispatch callouts.
                            </p>
                          </div>
                        </div>

                        {/* Contact Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label
                              className="font-label-md text-on-surface font-semibold text-xs"
                              htmlFor="farmerName"
                            >
                              Client / Farm Representative Name *
                            </label>
                            <input
                              className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="farmerName"
                              placeholder="e.g. Dr. Jane Mwangi / Peter Kamau"
                              required
                              type="text"
                              value={farmerName}
                              onChange={(e) => setFarmerName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label
                              className="font-label-md text-on-surface font-semibold text-xs"
                              htmlFor="contactPhone"
                            >
                              Primary Telephone Contact (SMS &amp; Callout) *
                            </label>
                            <input
                              className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="contactPhone"
                              placeholder="e.g. +254 712 345 678"
                              required
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1.5">
                            <label
                              className="font-label-md text-on-surface font-semibold text-xs"
                              htmlFor="emailAddress"
                            >
                              Email Address (Optional for Digital Receipt / Lab Report)
                            </label>
                            <input
                              className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-xs sm:text-sm focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="emailAddress"
                              placeholder="e.g. farm@example.com"
                              type="email"
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Booking Summary Card */}
                        <div className="p-4 rounded-2xl bg-surface-subtle border border-border-hairline space-y-3">
                          <h3 className="font-headline-sm font-bold text-on-surface text-sm flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              receipt_long
                            </span>
                            <span>Appointment Summary Overview</span>
                          </h3>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-2.5 rounded-lg bg-surface-clinical border border-border-hairline">
                              <span className="text-outline block text-[10px]">Mode:</span>
                              <span className="font-bold text-primary">
                                {appointmentType === 'farm_visit' ? '🚜 Farm Visit' : '🏥 Clinic Walk-in'}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-surface-clinical border border-border-hairline">
                              <span className="text-outline block text-[10px]">Livestock:</span>
                              <span className="font-semibold text-on-surface">
                                {selectedSpeciesObj.label} ({headcountTotal} hd)
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-surface-clinical border border-border-hairline">
                              <span className="text-outline block text-[10px]">Service:</span>
                              <span className="font-semibold text-on-surface truncate block">
                                {selectedServiceObj.title}
                              </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-surface-clinical border border-border-hairline">
                              <span className="text-outline block text-[10px]">Urgency / Date:</span>
                              <span className="font-bold text-error uppercase">
                                {dispatchTier} ({visitDate})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Regulatory Notice & Submit Bar */}
                        <div className="p-4 rounded-xl bg-surface-tinted flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-accent">
                          <div className="flex items-center gap-2 text-on-surface-variant">
                            <span className="material-symbols-outlined text-primary text-[20px]">
                              shield
                            </span>
                            <span className="font-body-sm text-xs">
                              Data handled under strict Kenya Veterinary Board (KVB) Medical Confidentiality.
                            </span>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={prevStep}
                              className="px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold text-xs cursor-pointer"
                            >
                              Back
                            </button>
                            <button
                              className="px-8 h-12 rounded-full bg-primary text-on-primary font-label-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                              type="submit"
                              disabled={submitting}
                            >
                              <span>
                                {submitting
                                  ? 'Transmitting Ticket...'
                                  : appointmentType === 'farm_visit'
                                    ? 'Submit & Dispatch Squad'
                                    : 'Confirm Office Appointment'}
                              </span>
                              <span className="material-symbols-outlined text-[18px]">check</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  /* Feedback Confirmation Modal State */
                  <div className="p-space-xl rounded-2xl bg-surface-clinical shadow-lg space-y-5 text-center border border-border-accent animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-surface-tinted text-primary mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[36px]">check_circle</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                      Appointment Ticket Generated Successfully
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto text-sm sm:text-base leading-relaxed">
                      Your {appointmentType === 'farm_visit' ? 'farm dispatch request' : 'in-office consultation'} for{' '}
                      <strong className="text-on-surface">{farmerName || 'your farm'}</strong> has been logged into the AniHeal Central Operations Desk.
                      A duty veterinary officer is reviewing your case and will call <strong className="text-on-surface">{contactPhone}</strong> shortly.
                    </p>

                    <div className="inline-flex flex-wrap items-center justify-center gap-3 p-3.5 rounded-xl bg-surface-subtle font-label-md text-primary font-bold border border-border-hairline text-xs sm:text-sm">
                      <span>Ticket Ref: #{ticketRef}</span>
                      <span>•</span>
                      <span>
                        {appointmentType === 'farm_visit'
                          ? `Assigned: Ambulatory Squad (${farmCounty || 'Central Region'})`
                          : `Office: ${assignedHub || 'Headquarters Clinic'}`}
                      </span>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <a
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white font-label-lg text-xs sm:text-sm font-semibold shadow-sm hover:brightness-95 transition-all"
                        href={`https://wa.me/${emergencyPhone.replace(/[^0-9]/g, '')}?text=Hello%20AniHeal,%20I%20have%20submitted%20appointment%20ticket%20%23${ticketRef}%20for%20${encodeURIComponent(
                          farmerName || 'my farm'
                        )}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        <span>Open WhatsApp with this Ticket</span>
                      </a>
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setCurrentStep(1);
                        }}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-low text-primary font-label-md text-xs sm:text-sm font-semibold hover:bg-surface-tinted transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        <span>Book Another Appointment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Support Sidebar (4 cols on desktop) */}
              <aside className="lg:col-span-4 space-y-space-md">
                {/* Visual Agro-Vet Operational Context Card (Admin CMS Editable) */}
                <div className="rounded-2xl overflow-hidden shadow-sm bg-surface-clinical border border-border-hairline">
                  <img
                    className="w-full h-48 object-cover transition-all hover:scale-105 duration-300"
                    alt={bookingImageTitle}
                    src={bookingImage}
                    onError={(e) => {
                      e.target.src =
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqcSFbViwyr8mocbzKIJzG7IJgNmsQDzShlDKng9RrHFUSvUhWyciE7nI9uHjuQfZ96NGPRAsj9A1glCm1YFtuRnFJSTGFkb2Jc5LZca1_O2NlNpv7TopYviyBfcfMMKhAruZR-Tzd2pmlf3FWFu254SnIurU5M1YaXvMS3SbWILfZTh-EtQgrH2nUMow-nYT_8PJs_hE2LzrTSReh3E_y8M-CKRPkeMptKhejBOUbnoDNdvqMBqA3';
                    }}
                  />
                  <div className="p-4 bg-surface-clinical space-y-1">
                    <span className="font-label-sm text-label-sm text-on-surface font-bold block text-sm">
                      {bookingImageTitle}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block text-xs leading-relaxed">
                      {bookingImageCaption}
                    </span>
                  </div>
                </div>

                {/* Quick Tele-Triage & WhatsApp Card */}
                <div className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#25D366] text-[24px]">chat</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base">
                      Chat with us
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed text-xs">
                    Need remote assessment before mobilization? Send high-definition photos or short video clips of eye mucosa, udders, or dung directly to our duty surgeon.
                  </p>
                  <a
                    className="w-full h-11 rounded-full bg-[#25D366] text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition-all text-xs"
                    href={`https://wa.me/${emergencyPhone.replace(/[^0-9]/g, '')}?text=Hello%20AniHeal%20Vet%20Triage,%20I%20have%20an%20urgent%20animal%20case%20to%20review.`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>WhatsApp Photos of Symptoms</span>
                  </a>
                  <div className="flex items-center justify-between text-outline font-label-sm text-[11px] pt-1">
                    <span>Average response: &lt; 8 mins</span>
                    <span className="text-primary font-semibold">Surgeon Online Now</span>
                  </div>
                </div>


                {/* Field Preparation Protocol */}
                <div className="p-space-lg rounded-2xl bg-surface-clinical shadow-sm space-y-3 border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">
                      checklist
                    </span>
                    <h3 className="font-headline-sm text-on-surface font-bold text-base">
                      Before Our Vet Arrives
                    </h3>
                  </div>
                  <ul className="space-y-2 font-body-sm text-on-surface text-xs leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Restraint Facilities:</strong> Isolate animal in a secure crush or holding pen.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Clean Water:</strong> Prepare at least two buckets of clean borehole/piped water.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Health Record Cards:</strong> Have vaccination cards and AI dates ready.
                      </span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>
          </section>

          {/* Emergency Strip above Footer */}
          <section className="w-full bg-surface-tinted/60 py-4 border-t border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">emergency</span>
                <span className="font-label-lg text-on-surface font-semibold text-sm">
                  Animal Emergency Triage Hotline:
                </span>
                <span className="font-body-md text-on-surface-variant text-xs sm:text-sm">
                  Rapid Field Unit dispatch available 24/7 across Kenya
                </span>
              </div>
              <a
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm uppercase tracking-wider font-semibold hover:bg-[#991B1B] transition-colors text-xs"
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
