import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function BookAppointment() {
  const [speciesType, setSpeciesType] = useState('dairy');
  const [headcountTotal, setHeadcountTotal] = useState('48');
  const [affectedCount, setAffectedCount] = useState('3');
  const [clinicalService, setClinicalService] = useState('acute_treatment');
  const [farmCounty, setFarmCounty] = useState('');
  const [farmName, setFarmName] = useState('');
  const [farmLandmarks, setFarmLandmarks] = useState('');
  const [dispatchTier, setDispatchTier] = useState('morning');
  const [visitDate, setVisitDate] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [gpsStatus, setGpsStatus] = useState('Capture Current GPS');
  const [filesCount, setFilesCount] = useState(0);
  const [ticketRef, setTicketRef] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setTicketRef(`ANH-2025-${randomNum}`);
    setIsSubmitted(true);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const speciesOptions = [
    { id: 'dairy', label: 'Dairy Cattle', sub: 'Lactating / Heifers', icon: 'agriculture' },
    { id: 'beef', label: 'Beef Feedlot', sub: 'Boran / Steers', icon: 'grass' },
    { id: 'shoats', label: 'Shoats / Sheep', sub: 'Dorper / Goats', icon: 'cruelty_free' },
    { id: 'poultry', label: 'Poultry Flock', sub: 'Layers / Broilers', icon: 'egg' },
    { id: 'swine', label: 'Swine / Piggery', sub: 'Commercial sows', icon: 'shelves' },
    { id: 'camel', label: 'Camelids', sub: 'Dromedary', icon: 'flare' },
    { id: 'canine', label: 'Working Dogs', sub: 'Pastoral canines', icon: 'sound_detection_dog_barking' },
    { id: 'equine', label: 'Equine / Asses', sub: 'Draft & Riding', icon: 'pest_control_rodent' }
  ];

  const serviceOptions = [
    {
      id: 'acute_treatment',
      title: 'Sick Animal / Acute Treatment',
      desc: 'High fever, bloat, downer cow, dystocia, or respiratory distress.',
      icon: 'vital_signs',
      iconColor: 'text-error'
    },
    {
      id: 'vaccination',
      title: 'Routine Herd Vaccination',
      desc: 'FMD, Anthrax, Blackquarter, Lumpy Skin, Newcastle disease.',
      icon: 'vaccines',
      iconColor: 'text-primary'
    },
    {
      id: 'ultrasound_breeding',
      title: 'Ultrasound / Fertility Check',
      desc: 'Early pregnancy diagnosis (30d+), ovary profiling, sync protocols.',
      icon: 'female',
      iconColor: 'text-secondary'
    },
    {
      id: 'surgery',
      title: 'Surgical Intervention',
      desc: 'Field caesarean, dehorning, wound revision, rumenotomy.',
      icon: 'chips',
      iconColor: 'text-primary'
    },
    {
      id: 'nutrition_audit',
      title: 'Feed & Nutrition Audit',
      desc: 'Silage testing, mineral deficieny analysis, TMR ration balancing.',
      icon: 'nutrition',
      iconColor: 'text-primary'
    },
    {
      id: 'post_mortem',
      title: 'Post-Mortem / Pathology',
      desc: 'Rapid herd mortality investigation & lab histology sampling.',
      icon: 'deceased',
      iconColor: 'text-error'
    }
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-320px)]">
        <div className="flex flex-col w-full">
          {/* Triage Emergency Banner */}
          <section className="w-full bg-error-container text-on-error-container py-3.5 px-margin-mobile lg:px-margin shadow-sm">
            <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-[24px] animate-pulse">
                  crisis_alert
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-headline-sm text-headline-sm text-error font-bold tracking-tight">
                    Acute Herd Emergency?
                  </span>
                  <span className="font-body-md text-body-md text-on-error-container">
                    Field Ambulatory Mobile Units standing by in Central Kenya &amp; Rift Valley.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wider font-bold shadow-sm hover:brightness-95 transition-all"
                  href="tel:+254700264432"
                >
                  <span className="material-symbols-outlined text-[16px]">phone_forwarded</span>
                  <span>Call Ambulatory Squad: +254 700 264 432</span>
                </a>
              </div>
            </div>
          </section>

          {/* Title & Context Overview */}
          <section className="w-full max-w-[1280px] mx-auto px-margin-mobile lg:px-margin pt-space-xl pb-space-md">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-space-md">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  <span>Verified Field Ambulatory &amp; Clinic Logistics</span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                  Schedule a Farm Visit or Clinical Triage
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                  Deploy KVB-registered veterinary surgeons, mobile diagnostic ultrasound kits, and
                  cold-chain therapeutics directly to your farm gate.
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-low text-on-surface-variant border border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    verified_user
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm uppercase text-outline font-bold">
                      Standard SLA
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-semibold">
                      Priority Triage Active
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
              <div className="lg:col-span-8 space-y-space-lg">
                {/* Progress Indicator */}
                <div className="p-space-md rounded-xl bg-surface-container-low shadow-sm flex items-center justify-between gap-2 overflow-x-auto border border-border-hairline">
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-sm text-label-sm">
                      1
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold uppercase">
                      Livestock
                    </span>
                  </div>
                  <div className="h-0.5 w-6 bg-secondary-container"></div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-6 h-6 rounded-full bg-surface-clinical text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm border border-border-hairline">
                      2
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                      Service
                    </span>
                  </div>
                  <div className="h-0.5 w-6 bg-surface-variant"></div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-6 h-6 rounded-full bg-surface-clinical text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm border border-border-hairline">
                      3
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                      Location
                    </span>
                  </div>
                  <div className="h-0.5 w-6 bg-surface-variant"></div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-6 h-6 rounded-full bg-surface-clinical text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm border border-border-hairline">
                      4
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                      Dispatch
                    </span>
                  </div>
                  <div className="h-0.5 w-6 bg-surface-variant"></div>
                  <div className="flex items-center gap-2 min-w-max">
                    <span className="w-6 h-6 rounded-full bg-surface-clinical text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm border border-border-hairline">
                      5
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-medium uppercase">
                      Symptoms
                    </span>
                  </div>
                </div>

                {!isSubmitted ? (
                  <form className="space-y-space-lg" id="triageBookingForm" onSubmit={handleSubmit}>
                    {/* STEP 1: Livestock Classification & Herd Size */}
                    <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-[20px]">pets</span>
                          </div>
                          <div>
                            <h2 className="font-headline-sm text-headline-sm text-on-surface">
                              1. Livestock Classification &amp; Population
                            </h2>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              Select animal species category and confirm aggregate herd or flock count.
                            </p>
                          </div>
                        </div>
                        <span className="font-label-sm text-label-sm uppercase bg-surface-container-low px-2 py-1 rounded text-primary font-bold">
                          Mandatory
                        </span>
                      </div>

                      {/* Species Grid Selector */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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
                                className={`p-3 rounded-lg text-center flex flex-col items-center gap-1.5 shadow-sm transition-all border ${
                                  isSelected
                                    ? 'bg-surface-tinted text-primary border-primary font-semibold ring-2 ring-primary/20'
                                    : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[24px]">
                                  {opt.icon}
                                </span>
                                <span className="font-label-md text-label-md font-semibold">
                                  {opt.label}
                                </span>
                                <span className="font-label-sm text-label-sm text-outline">
                                  {opt.sub}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Quantitative Headcount */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="headcountTotal"
                          >
                            Total Herd / Flock Headcount *
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="headcountTotal"
                              max="100000"
                              min="1"
                              placeholder="e.g. 48"
                              required
                              type="number"
                              value={headcountTotal}
                              onChange={(e) => setHeadcountTotal(e.target.value)}
                            />
                            <span className="absolute right-3 top-2.5 font-label-sm text-label-sm text-outline">
                              Heads
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="affectedCount"
                          >
                            Number of Symptomatic / Sick Animals *
                          </label>
                          <div className="relative">
                            <input
                              className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="affectedCount"
                              max="10000"
                              min="0"
                              placeholder="e.g. 3"
                              required
                              type="number"
                              value={affectedCount}
                              onChange={(e) => setAffectedCount(e.target.value)}
                            />
                            <span className="absolute right-3 top-2.5 font-label-sm text-label-sm text-error font-medium">
                              Patients
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP 2: Clinical Service Required */}
                    <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            medical_services
                          </span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            2. Clinical Service Required
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Select the primary clinical intervention scope for veterinary team assignment.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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
                                className={`p-3.5 rounded-lg flex items-start gap-3 shadow-sm transition-all border ${
                                  isSelected
                                    ? 'bg-surface-tinted border-primary ring-2 ring-primary/20'
                                    : 'bg-surface-subtle border-border-hairline hover:bg-surface-container-low'
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-[22px] mt-0.5 ${srv.iconColor}`}
                                >
                                  {srv.icon}
                                </span>
                                <div className="space-y-0.5">
                                  <span className="font-label-lg text-label-lg text-on-surface block font-semibold">
                                    {srv.title}
                                  </span>
                                  <span className="font-body-sm text-body-sm text-on-surface-variant block">
                                    {srv.desc}
                                  </span>
                                </div>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP 3: Location & Farm Details */}
                    <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            3. Farm Location &amp; Physical Access
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Provide precise navigational cues for veterinary 4x4 ambulatory dispatch units.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="farmCounty"
                          >
                            County Zone *
                          </label>
                          <select
                            className="w-full h-11 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                            id="farmCounty"
                            required
                            value={farmCounty}
                            onChange={(e) => setFarmCounty(e.target.value)}
                          >
                            <option disabled value="">
                              Select Primary Administrative County
                            </option>
                            <option value="nakuru">Nakuru County (Naivasha, Rongai, Njoro, Gilgil)</option>
                            <option value="kiambu">Kiambu County (Limuru, Kikuyu, Githunguri, Thika)</option>
                            <option value="muranga">Murang'a County (Karatina border, Maragua)</option>
                            <option value="nyandarua">Nyandarua County (Ol Kalou, Kinangop)</option>
                            <option value="uasin_gishu">Uasin Gishu (Eldoret, Turbo, Moiben)</option>
                            <option value="nandi">Nandi County (Kapsabet, Nandi Hills)</option>
                            <option value="kajiado">Kajiado (Kitengela, Isinya, Kajiado Central)</option>
                            <option value="machakos">Machakos (Kathiani, Athi River, Kangundo)</option>
                            <option value="nairobi">Nairobi Metropolitan Area</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="farmName"
                          >
                            Farm or Estate Enterprise Name *
                          </label>
                          <input
                            className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                            id="farmName"
                            placeholder="e.g. Ridgeview Dairy Estate / Farm Unit 4"
                            required
                            type="text"
                            value={farmName}
                            onChange={(e) => setFarmName(e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="farmLandmarks"
                          >
                            Physical Directions &amp; Prominent Landmarks *
                          </label>
                          <input
                            className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                            id="farmLandmarks"
                            placeholder="e.g. 2.4km off Nakuru-Dundori Road, opposite Ndung'u Milk Collection Center, green gate"
                            required
                            type="text"
                            value={farmLandmarks}
                            onChange={(e) => setFarmLandmarks(e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-2 p-3 rounded-lg bg-surface-container-low flex items-center justify-between gap-3 border border-border-hairline">
                          <div className="flex items-center gap-2 text-primary font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[18px]">my_location</span>
                            <span>Auto-detect Farm GPS via device geolocation for precision routing</span>
                          </div>
                          <button
                            className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors cursor-pointer"
                            onClick={handleGPS}
                            type="button"
                          >
                            {gpsStatus}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* STEP 4: Schedule & Dispatch Urgency */}
                    <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">schedule</span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            4. Schedule &amp; Triage Priority Tier
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Define temporal urgency to balance field logistics and ambulatory route plans.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
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
                              className={`p-3.5 rounded-lg text-center space-y-1 shadow-sm transition-all border ${
                                dispatchTier === 'emergency'
                                  ? 'bg-error-container text-on-error-container border-error ring-2 ring-error/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                              }`}
                            >
                              <span className="material-symbols-outlined text-error text-[26px]">
                                alarm
                              </span>
                              <span className="font-label-lg text-label-lg font-bold block text-error">
                                Immediate Emergency
                              </span>
                              <span className="font-label-sm text-label-sm text-outline block">
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
                              className={`p-3.5 rounded-lg text-center space-y-1 shadow-sm transition-all border ${
                                dispatchTier === 'morning'
                                  ? 'bg-surface-tinted text-primary border-primary ring-2 ring-primary/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                              }`}
                            >
                              <span className="material-symbols-outlined text-primary text-[26px]">
                                wb_twilight
                              </span>
                              <span className="font-label-lg text-label-lg font-bold block">
                                Morning Round
                              </span>
                              <span className="font-label-sm text-label-sm text-outline block">
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
                              className={`p-3.5 rounded-lg text-center space-y-1 shadow-sm transition-all border ${
                                dispatchTier === 'afternoon'
                                  ? 'bg-surface-tinted text-primary border-primary ring-2 ring-primary/20'
                                  : 'bg-surface-subtle text-on-surface border-border-hairline hover:bg-surface-container-low'
                              }`}
                            >
                              <span className="material-symbols-outlined text-primary text-[26px]">
                                wb_sunny
                              </span>
                              <span className="font-label-lg text-label-lg font-bold block">
                                Afternoon Round
                              </span>
                              <span className="font-label-sm text-label-sm text-outline block">
                                12:00 – 16:00 EAT
                              </span>
                            </div>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div className="space-y-1.5">
                            <label
                              className="font-label-md text-label-md text-on-surface font-semibold"
                              htmlFor="visitDate"
                            >
                              Preferred Calendar Date *
                            </label>
                            <input
                              className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="visitDate"
                              required
                              type="date"
                              value={visitDate}
                              onChange={(e) => setVisitDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label
                              className="font-label-md text-label-md text-on-surface font-semibold"
                              htmlFor="contactPhone"
                            >
                              On-Farm Contact Phone (SMS &amp; Callout) *
                            </label>
                            <input
                              className="w-full h-11 px-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                              id="contactPhone"
                              placeholder="+254 7XX XXX XXX"
                              required
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* STEP 5: Symptoms / Farm History & Attachments */}
                    <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-tinted flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            description
                          </span>
                        </div>
                        <div>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface">
                            5. Clinical Symptoms &amp; Prior Interventions
                          </h2>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Describe observable symptoms, rectal temperature if recorded, milk drop %, and
                            previous antibiotics administered.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                          <label
                            className="font-label-md text-label-md text-on-surface font-semibold"
                            htmlFor="symptomsDescription"
                          >
                            Clinical Presentation Notes *
                          </label>
                          <textarea
                            className="w-full p-4 rounded-lg bg-surface-subtle border border-border-hairline text-on-surface font-body-md text-body-md focus:bg-surface-clinical focus:outline-none focus:border-primary shadow-sm"
                            id="symptomsDescription"
                            placeholder="Detail specific symptoms: e.g., cow stopped eating yesterday evening, heavy salivation, rectal temp 40.2 C, treated with OTC 2 days ago with zero response..."
                            required
                            rows="4"
                            value={symptomsDescription}
                            onChange={(e) => setSymptomsDescription(e.target.value)}
                          ></textarea>
                        </div>

                        {/* Media Attachment Trigger */}
                        <div className="p-4 rounded-xl bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-3 border border-border-hairline">
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[28px]">
                              add_photo_alternate
                            </span>
                            <div>
                              <span className="font-label-md text-label-md text-on-surface font-semibold block">
                                Attach Visual Evidence (Photos, Mucosa, Dung, Video)
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant block">
                                Allows diagnostic triage officer to assemble specific biologics before
                                dispatch.
                              </span>
                            </div>
                          </div>
                          <label className="cursor-pointer px-4 py-2 rounded-full bg-surface-clinical shadow-sm text-primary font-label-md text-label-md font-semibold hover:bg-surface-tinted transition-colors flex items-center gap-1.5 shrink-0 border border-border-hairline">
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

                        {filesCount > 0 && (
                          <div className="text-primary font-label-sm text-label-sm flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              check_circle
                            </span>
                            <span>{filesCount} file(s) staged for clinical triage intake</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submission Action Bar */}
                    <div className="p-space-md rounded-xl bg-surface-tinted flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-accent">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          shield
                        </span>
                        <span className="font-body-sm text-body-sm">
                          Data handled under strict Veterinary Medical Confidentiality and KVB
                          Compliance.
                        </span>
                      </div>
                      <button
                        className="w-full sm:w-auto px-8 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
                        type="submit"
                      >
                        <span>Submit &amp; Dispatch Squad</span>
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Feedback Confirmation Modal State */
                  <div className="p-space-xl rounded-2xl bg-surface-clinical shadow-lg space-y-4 text-center border border-border-accent animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-surface-tinted text-primary mx-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[36px]">check_circle</span>
                    </div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">
                      Triage Ticket Generated Successfully
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                      Your dispatch request for <strong className="text-on-surface">{farmName || 'your farm'}</strong> has
                      been logged into the AniHeal Field Operations Console. A veterinary triage
                      surgeon is reviewing your case and will call <strong className="text-on-surface">{contactPhone}</strong> immediately.
                    </p>
                    <div className="inline-flex items-center gap-3 p-3 rounded-lg bg-surface-subtle font-label-md text-label-md text-primary font-bold border border-border-hairline">
                      <span>Ticket Ref: #{ticketRef}</span>
                      <span>•</span>
                      <span>Assigned: Central Ambulance Unit 2</span>
                    </div>
                    <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                      <a
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#25D366] text-white font-label-lg text-label-lg font-semibold shadow-sm hover:brightness-95 transition-all"
                        href={`https://wa.me/254700264432?text=Hello%20AniHeal,%20I%20have%20submitted%20triage%20ticket%20%23${ticketRef}%20for%20${encodeURIComponent(
                          farmName || 'my farm'
                        )}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="material-symbols-outlined text-[20px]">chat</span>
                        <span>Open WhatsApp with this Ticket</span>
                      </a>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-low text-primary font-label-md text-label-md font-semibold hover:bg-surface-tinted transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                        <span>Book Another Visit</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Support Sidebar (4 cols on desktop) */}
              <aside className="lg:col-span-4 space-y-space-md">
                {/* Quick Tele-Triage & WhatsApp Card */}
                <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#25D366] text-[24px]">chat</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Instant Tele-Triage
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Need an instant second opinion or remote assessment before mobilization? Send
                    high-definition photos or short video clips of eye mucosa, udders, or dung direct
                    to our duty surgeon.
                  </p>
                  <a
                    className="w-full h-11 rounded-full bg-[#25D366] text-white font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-sm hover:brightness-95 transition-all"
                    href="https://wa.me/254700264432?text=Hello%20AniHeal%20Vet%20Triage,%20I%20have%20an%20urgent%20animal%20case%20to%20review."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Send Photos of Symptoms</span>
                  </a>
                  <div className="flex items-center justify-between text-outline font-label-sm text-label-sm pt-1">
                    <span>Average response: &lt; 8 mins</span>
                    <span className="text-primary font-semibold">Online Now</span>
                  </div>
                </div>

                {/* SLA Response Matrix */}
                <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">timer</span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Dispatch Response Times (SLA)
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-surface-subtle space-y-1 border border-border-hairline">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Urban &amp; Semi-Urban Zones
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-bold px-2 py-0.5 rounded-full bg-surface-tinted">
                          &lt; 60 Mins
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Nairobi Periphery, Nakuru Town, Naivasha, Limuru, Eldoret Central.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle space-y-1 border border-border-hairline">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Rural Agricultural Corridors
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary font-bold px-2 py-0.5 rounded-full bg-surface-container-low">
                          Twice Daily
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Kinangop, Ol Kalou, Rongai, Subukia, Maragua, Nandi plateau (Morning 07:00 /
                        Evening 14:00 sweeps).
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle space-y-1 border border-border-hairline">
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-on-surface font-bold">
                          Extreme Pastoral Rangelands
                        </span>
                        <span className="font-label-sm text-label-sm text-outline font-bold px-2 py-0.5 rounded-full bg-surface-container">
                          Scheduled
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Kajiado South, Baringo, Laikipia mobile unit sweeps coordinated via local clusters.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Field Preparation Protocol */}
                <div className="p-space-lg rounded-xl bg-surface-clinical shadow-sm space-y-space-md border border-border-hairline">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[24px]">
                      checklist
                    </span>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Before Our Vet Arrives
                    </h3>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Ensuring safety and rapid diagnosis for both animal and field officers:
                  </p>
                  <ul className="space-y-2.5 font-body-sm text-body-sm text-on-surface">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Restraint Facilities:</strong> Isolate animal in a secure crush, holding
                        pen, or head-bail to prevent injury.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Clean Water:</strong> Prepare at least two buckets of clean
                        borehole/piped water and clean hand towels.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Health Record Cards:</strong> Have cow vaccination cards, insemination
                        dates, and past treatment tags ready.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                        check
                      </span>
                      <span>
                        <strong>Withhold Meds:</strong> Avoid administering home antibiotic doses within
                        2 hours of surgeon arrival to preserve blood test accuracy.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* KVB Compliance Guarantee */}
                <div className="p-space-lg rounded-xl bg-surface-tinted shadow-sm space-y-3 border border-border-accent">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface-clinical flex items-center justify-center text-kvb-gold shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">verified</span>
                    </div>
                    <div>
                      <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold block">
                        KVB Certified Practice
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-semibold block">
                        Regulatory Guarantee
                      </span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    All AniHeal field clinicians are fully certified under Cap 366 (Laws of Kenya). Every
                    mobile vehicle carries licensed veterinary pharmaceuticals maintained strictly in
                    calibrated 2-8°C cold boxes.
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-sm text-label-sm text-outline">
                      License: KVB-VET-CLINIC-884
                    </span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      100% Traceable Meds
                    </span>
                  </div>
                </div>

                {/* Visual Agro-Vet Operational Context Card */}
                <div className="rounded-xl overflow-hidden shadow-sm bg-surface-clinical border border-border-hairline">
                  <img
                    className="w-full h-44 object-cover"
                    alt="A professional Kenyan veterinarian in sterile green clinical scrubs and rubber boots using an ultrasound scanner on a Friesian dairy cow"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqcSFbViwyr8mocbzKIJzG7IJgNmsQDzShlDKng9RrHFUSvUhWyciE7nI9uHjuQfZ96NGPRAsj9A1glCm1YFtuRnFJSTGFkb2Jc5LZca1_O2NlNpv7TopYviyBfcfMMKhAruZR-Tzd2pmlf3FWFu254SnIurU5M1YaXvMS3SbWILfZTh-EtQgrH2nUMow-nYT_8PJs_hE2LzrTSReh3E_y8M-CKRPkeMptKhejBOUbnoDNdvqMBqA3"
                  />
                  <div className="p-3 bg-surface-clinical">
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold block">
                      Mobile Diagnostic Ultrasound Unit
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant block">
                      Equipped for real-time ovarian scanning &amp; herd synchronization.
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          {/* Emergency Strip above Footer */}
          <section className="w-full bg-surface-tinted/60 py-4 border-t border-b border-border-hairline">
            <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-[22px]">emergency</span>
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                  Animal Emergency Triage Hotline:
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant">
                  Rapid Field Unit dispatch available 24/7 in Central &amp; Rift Valley
                </span>
              </div>
              <a
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wider font-semibold hover:bg-[#991B1B] transition-colors"
                href="tel:+254700264432"
              >
                <span className="material-symbols-outlined text-[16px]">phone_in_talk</span>
                <span>Call +254 700 ANIHEAL</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
