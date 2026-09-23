import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

/**
 * Interactive Cat illustration whose head and eyes follow the mouse cursor
 */
function CursorTrackingCat() {
  const catRef = useRef(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headTransform, setHeadTransform] = useState({ x: 0, y: 0, rotate: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Periodic natural blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Track mouse cursor and compute gaze vector
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!catRef.current) return;
      const rect = catRef.current.getBoundingClientRect();
      const catCenterX = rect.left + rect.width / 2;
      const catCenterY = rect.top + rect.height / 2 - 30; // focus on head center

      const dx = e.clientX - catCenterX;
      const dy = e.clientY - catCenterY;
      const distance = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);

      // Max eye pupil displacement (within eyeball boundaries)
      const maxEyeDisplacement = 7;
      const eyeMagnitude = Math.min(maxEyeDisplacement, distance / 25);
      const pupilX = Math.cos(angle) * eyeMagnitude;
      const pupilY = Math.sin(angle) * eyeMagnitude;

      // Head tilt & slight movement in 2D perspective
      const maxHeadShift = 10;
      const headMagnitude = Math.min(maxHeadShift, distance / 35);
      const headX = Math.cos(angle) * headMagnitude;
      const headY = Math.sin(angle) * headMagnitude;
      const headRotate = Math.max(-14, Math.min(14, (dx / (window.innerWidth / 2)) * 12));

      setEyeOffset({ x: pupilX, y: pupilY });
      setHeadTransform({ x: headX, y: headY, rotate: headRotate });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={catRef}
      className="relative flex flex-col items-center justify-center select-none"
    >
      {/* Cat SVG Artwork */}
      <svg
        width="280"
        height="260"
        viewBox="0 0 280 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-xl overflow-visible"
      >
        {/* Cat Body & Back Paws */}
        <ellipse cx="140" cy="195" rx="72" ry="58" fill="#1e293b" />
        <ellipse cx="140" cy="190" rx="64" ry="52" fill="#334155" />
        {/* Chest Fur */}
        <path
          d="M 120 160 Q 140 190 160 160 Q 150 180 140 195 Q 130 180 120 160 Z"
          fill="#f8fafc"
          opacity="0.9"
        />

        {/* Tail swaying gently */}
        <path
          d="M 205 200 C 235 195, 255 170, 245 140 C 240 125, 225 125, 230 140 C 235 155, 220 175, 195 190"
          stroke="#334155"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
          className="transition-transform duration-500 origin-bottom"
        />

        {/* Front Paws */}
        <ellipse cx="112" cy="232" rx="18" ry="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <ellipse cx="168" cy="232" rx="18" ry="12" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M 106 230 L 106 238 M 118 230 L 118 238" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        <path d="M 162 230 L 162 238 M 174 230 L 174 238" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

        {/* Moving Head Group */}
        <g
          style={{
            transform: `translate(${headTransform.x}px, ${headTransform.y}px) rotate(${headTransform.rotate}deg)`,
            transformOrigin: '140px 110px',
            transition: 'transform 0.08s ease-out',
          }}
        >
          {/* Left Ear */}
          <path
            d="M 85 90 L 65 30 L 110 65 Z"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Left Inner Ear Pink */}
          <path d="M 86 82 L 73 42 L 104 66 Z" fill="#fda4af" />

          {/* Right Ear */}
          <path
            d="M 195 90 L 215 30 L 170 65 Z"
            fill="#334155"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Inner Ear Pink */}
          <path d="M 194 82 L 207 42 L 176 66 Z" fill="#fda4af" />

          {/* Cat Head Base */}
          <ellipse cx="140" cy="110" rx="66" ry="54" fill="#334155" stroke="#1e293b" strokeWidth="3" />

          {/* Forehead Marking / M Shape */}
          <path
            d="M 125 75 L 140 88 L 155 75 M 132 81 L 140 92 L 148 81"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Cheeks Fluff */}
          <path d="M 74 115 L 60 120 L 75 128" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          <path d="M 206 115 L 220 120 L 205 128" fill="#334155" stroke="#1e293b" strokeWidth="2" />

          {/* Eyes (Left & Right) */}
          {/* Left Eyeball */}
          <ellipse cx="112" cy="106" rx="16" ry={isBlinking ? '1' : '15'} fill="#22c55e" stroke="#14532d" strokeWidth="2" />
          {/* Right Eyeball */}
          <ellipse cx="168" cy="106" rx="16" ry={isBlinking ? '1' : '15'} fill="#22c55e" stroke="#14532d" strokeWidth="2" />

          {!isBlinking && (
            <>
              {/* Left Eye Pupil (Tracks Cursor) */}
              <ellipse
                cx={112 + eyeOffset.x}
                cy={106 + eyeOffset.y}
                rx="6"
                ry="11"
                fill="#0f172a"
              />
              {/* Left Eye Light Catch */}
              <circle cx={110 + eyeOffset.x} cy={102 + eyeOffset.y} r="3" fill="#ffffff" />

              {/* Right Eye Pupil (Tracks Cursor) */}
              <ellipse
                cx={168 + eyeOffset.x}
                cy={106 + eyeOffset.y}
                rx="6"
                ry="11"
                fill="#0f172a"
              />
              {/* Right Eye Light Catch */}
              <circle cx={166 + eyeOffset.x} cy={102 + eyeOffset.y} r="3" fill="#ffffff" />
            </>
          )}

          {/* Cat Nose */}
          <polygon points="140,126 133,118 147,118" fill="#f43f5e" />

          {/* Cat Mouth / Muzzle */}
          <path
            d="M 140 126 L 140 132 M 140 132 Q 133 138 126 133 M 140 132 Q 147 138 154 133"
            stroke="#1e293b"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Left Whiskers */}
          <line x1="122" y1="128" x2="68" y2="120" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="122" y1="133" x2="65" y2="135" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="122" y1="138" x2="72" y2="148" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

          {/* Right Whiskers */}
          <line x1="158" y1="128" x2="212" y2="120" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="158" y1="133" x2="215" y2="135" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="158" y1="138" x2="208" y2="148" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" opacity="0.9" />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="98" cy="122" rx="8" ry="4" fill="#fb7185" opacity="0.4" />
          <ellipse cx="182" cy="122" rx="8" ry="4" fill="#fb7185" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}

export default function AnimalInsurance() {
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistAnimal, setWaitlistAnimal] = useState('Cats & Dogs');
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes('@')) return;
    setWaitlistSuccess(true);
  };

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Digital Health & Identification Profile',
      icon: 'badge',
      badge: 'Step 1: Onboarding',
      desc: 'Create an intelligent digital animal profile with microchip ID, ear-tag records, breed, age, and verified vaccination history.',
    },
    {
      step: '02',
      title: 'Routine Preventative Wellness & Tele-Triage',
      icon: 'vaccines',
      badge: 'Step 2: Proactive Care',
      desc: 'Scheduled bi-annual veterinarian farm visits, mandatory rabies / FMD inoculations, deworming cycles, and unlimited WhatsApp clinical tele-triage.',
    },
    {
      step: '03',
      title: 'Cashless Emergency Clinical Intervention',
      icon: 'emergency',
      badge: 'Step 3: Rapid Dispatch',
      desc: '24/7 priority ambulatory mobile dispatch to your farm or household with direct cashless coverage for surgeries, diagnostics, and dystocia relief.',
    },
    {
      step: '04',
      title: 'Automated Pharmacy & Supplement Refills',
      icon: 'local_shipping',
      badge: 'Step 4: Continuous Health',
      desc: 'Automated doorstep fulfillment of essential livestock minerals, flea/tick topicals, prescription diets, and therapeutic feed additives.',
    },
  ];

  const upcomingFeatures = [
    {
      icon: 'pets',
      title: 'Feline & Canine Pet Care Pass',
      desc: 'All-inclusive annual preventative packages covering vaccines, dental scaling, routine blood work, and emergency hospital admittance.',
    },
    {
      icon: 'agriculture',
      title: 'Commercial Herd & Dairy Subscriptions',
      desc: 'Per-head monthly coverage for milking herds, artificial insemination cycles, mastitis control, and calf-rearing guarantees.',
    },
    {
      icon: 'sync_saved_locally',
      title: 'Automated Direct Farm Sync',
      desc: 'Live synchronization between farmer records, milk yield logs, and AniHeal clinical monitoring telemetry.',
    },
    {
      icon: 'verified_user',
      title: 'Zero-Deductible Emergency Claims',
      desc: 'Instant claim approval across all KVB-certified partner hospitals and AniHeal mobile ambulance units.',
    },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section with Interactive Cursor Tracking Cat */}
        <section className="relative w-full bg-surface-clinical overflow-hidden py-12 lg:py-16 border-b border-border-hairline">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-surface-tinted blur-2xl pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Heading & Description */}
            <div className="lg:col-span-7 flex flex-col items-start gap-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>STANDALONE PLATFORM COMING SOON</span>
              </div>

              <h1 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl text-primary tracking-tight font-extrabold leading-tight">
                Animal Care &amp; Health Subscriptions
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                We are transitioning our complete <strong>Pets &amp; Livestock Health Subscription Ecosystem</strong> into a dedicated, state-of-the-art digital portal engineered for comprehensive preventive care, digital microchip tracking, and rapid cashless clinical triage.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2"
                >
                  <span>How Subscriptions Work</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                </a>
                <Link
                  to="/appointment-booking"
                  className="px-6 py-3 rounded-full bg-surface-tinted text-primary border border-border-accent font-label-lg text-label-lg font-bold hover:bg-surface-container transition-all"
                >
                  Book Immediate Clinical Visit
                </Link>
              </div>
            </div>

            {/* Right Column: Interactive Cursor Tracking Cat Component */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-surface-subtle/70 rounded-3xl border border-border-hairline shadow-sm backdrop-blur-sm">
              <CursorTrackingCat />
            </div>
          </div>
        </section>

        {/* How The Animal Care Subscription Works */}
        <section id="how-it-works" className="py-16 max-w-7xl mx-auto px-margin-mobile lg:px-gutter space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider">
              System Blueprint &amp; Care Protocol
            </span>
            <h2 className="font-headline-xl text-3xl font-bold text-on-surface">
              How the AniHeal Care Subscription Works
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Designed under the One Health framework to eliminate unexpected medical bills and deliver continuous, preventative veterinarian supervision directly to your doorstep.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((stepItem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm hover:border-primary transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-12 h-12 rounded-xl bg-surface-tinted text-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[26px]">{stepItem.icon}</span>
                    </span>
                    <span className="font-display-md text-2xl font-black text-outline/40 group-hover:text-primary transition-colors">
                      {stepItem.step}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-1">
                      {stepItem.badge}
                    </span>
                    <h3 className="font-headline-md text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {stepItem.title}
                    </h3>
                  </div>
                  <p className="font-body-sm text-sm text-on-surface-variant leading-relaxed">
                    {stepItem.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated System Preview & Waitlist */}
        <section className="py-12 bg-surface-container-low border-y border-border-hairline">
          <div className="max-w-7xl mx-auto px-margin-mobile lg:px-gutter grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: What's coming */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-label-sm text-xs text-primary uppercase font-bold tracking-wider">
                  Upcoming Standalone Platform
                </span>
                <h2 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                  Built for Household Pets &amp; Enterprise Ranches
                </h2>
                <p className="font-body-md text-on-surface-variant mt-2">
                  The upcoming standalone AniHeal Subscriptions application provides farmers and pet owners with dedicated mobile apps, automated renewal billing, microchip scanners, and real-time telehealth.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {upcomingFeatures.map((feat, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-surface-clinical border border-border-hairline flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-[22px] shrink-0 mt-0.5">
                      {feat.icon}
                    </span>
                    <div>
                      <h4 className="font-label-md text-sm font-bold text-on-surface">{feat.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: VIP Early Notification Form */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-surface-clinical border-2 border-border-accent shadow-md space-y-5">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase">
                  <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                  Get Notified Upon Launch
                </span>
                <h3 className="font-headline-md text-xl font-bold text-on-surface">
                  Join the Health Subscription Waitlist
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Be the first to enroll your animals with an exclusive <strong>20% Early Adopter Discount</strong> when the standalone portal launches.
                </p>
              </div>

              {waitlistSuccess ? (
                <div className="p-5 rounded-2xl bg-surface-tinted border border-border-accent text-center space-y-2">
                  <span className="material-symbols-outlined text-primary text-[36px]">check_circle</span>
                  <h4 className="font-bold text-primary text-base">You're on the Priority List!</h4>
                  <p className="text-xs text-on-surface-variant">
                    We'll email you at <strong>{waitlistEmail}</strong> as soon as the dedicated animal subscription system is officially released.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Primary Animal Category
                    </label>
                    <select
                      value={waitlistAnimal}
                      onChange={(e) => setWaitlistAnimal(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl bg-surface-subtle border border-border-hairline text-sm font-semibold text-on-surface focus:border-primary"
                    >
                      <option value="Cats & Dogs">Companion Pets (Cats &amp; Dogs)</option>
                      <option value="Dairy & Beef Cattle">Cattle &amp; Dairy Herds</option>
                      <option value="Goats & Sheep">Small Ruminants (Goats &amp; Sheep)</option>
                      <option value="Horses & Equine">Horses &amp; Equine</option>
                      <option value="Poultry Enterprises">Commercial Poultry Units</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="farmer@domain.com"
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-sm focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-12 rounded-full bg-primary text-on-primary font-label-md text-sm font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Notify Me On Launch</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>

                  <p className="text-[11px] text-center text-outline">
                    No spam. You can request urgent veterinary services anytime via our 24/7 hotline.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
