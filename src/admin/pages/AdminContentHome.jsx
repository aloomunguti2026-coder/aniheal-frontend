import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import SocialIcon from '../../components/common/SocialIcon';

export default function AdminContentHome() {
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // 1. Top Bar & Hero Section
  const [topBar, setTopBar] = useState({
    badge: 'KENYA VETERINARY BOARD ACCREDITED',
    licenseText: 'Practice License KVB/PR/2025/0842',
    oneHealthText: 'One Health Alliance Member',
    dispatchText: '24/7 Mobile Triage Response',
  });

  const [hero, setHero] = useState({
    badge: 'KENYA VETERINARY BOARD ACCREDITED',
    subtitle: 'ACCREDITED KENYA VETERINARY CONSULTANCY',
    title: 'Professional Consultancy You Can Trust',
    body: 'AniHeal veterinary consultancy works on providing sustainable animal related solutions in fields of veterinary medicine, One Health, animal husbandry and animal welfare.',
    primaryCtaText: 'Get Help from Us',
    primaryCtaLink: '#booking-dispatch',
    secondaryCtaText: 'Explore Services & Solutions',
    secondaryCtaLink: '/services',
    heroImage: '/logo.png',
    heroTagline: 'Healthy Animals • Healthy People • Healthy Planet',
    fieldTriageStatus: 'Active Mobile Units',
    fieldTriageSquads: 'Central & Rift Valley Squads',
    fieldTriageDesc: 'Diagnostics, Ultrasound & Vaccine Dispensary',
    kvbVerifiedText: 'KVB Verified Clinical Practice',
    kvbLicenseTag: 'ACC/2025',
    metrics: [
      { label: 'Accredited Practice', value: 'KVB' },
      { label: 'One Health Focused', value: '100%' },
      { label: 'Field Triage Units', value: '24/7' },
      { label: 'Counties Covered', value: '14+' },
    ],
    showSocialPresence: true,
    socialLabel: 'Follow Clinical Updates:',
    socialAccounts: [
      { platform: 'facebook', label: 'Facebook', url: '', enabled: true },
      { platform: 'twitter', label: 'Twitter / X', url: '', enabled: true },
      { platform: 'instagram', label: 'Instagram', url: '', enabled: true },
      { platform: 'linkedin', label: 'LinkedIn', url: '', enabled: false },
      { platform: 'youtube', label: 'YouTube', url: '', enabled: false },
      { platform: 'tiktok', label: 'TikTok', url: '', enabled: false },
      { platform: 'whatsapp', label: 'WhatsApp', url: '', enabled: false },
    ],
  });

  // 2. Why Choose Us Section
  const [whyChooseUs, setWhyChooseUs] = useState({
    subtitle: 'Core Practice Pillars',
    title: 'Why Choose us',
    body: 'Built on surgical rigor, preventive epidemiological discipline, and certified regulatory compliance.',
    pillars: [
      {
        icon: 'stethoscope',
        title: 'Experienced Veterinary Team',
        subtitle: 'Accredited By The KVB',
        desc: 'Licensed veterinary surgeons, livestock epidemiologists, and reproduction technicians adhering to the highest standards of the Kenya Veterinary Board.',
        badge: 'KVB Verified',
      },
      {
        icon: 'biotech',
        title: 'Science-Driven solutions',
        subtitle: 'Evidence-Based Diagnostics',
        desc: 'We combine diagnostics, research, and practical veterinary care for accurate decision-making.',
        badge: 'Rapid Panels',
      },
      {
        icon: 'verified',
        title: 'Trusted Across the Animal Health Chain',
        subtitle: 'Holistic Value Network',
        desc: 'Supporting farmers, pet owners, and livestock enterprises with dependable care.',
        badge: 'Nationwide',
      },
    ],
  });

  // 3. Services & Booking Headers
  const [servicesHeader, setServicesHeader] = useState({
    subtitle: 'Specialized Veterinary Practice',
    title: 'AniHeal Clinical Services',
    body: 'Structured agro-veterinary interventions engineered for sustainable animal productivity, preventative health, and community safety.',
  });

  const [bookingHeader, setBookingHeader] = useState({
    badge: 'FIELD CLINICAL APPOINTMENT',
    title: 'Schedule Farm Visit',
    body: 'Direct dispatch to commercial farms, smallholder dairy units, ranches, and companion animal households throughout Kenya.',
    emergencyTitle: 'Acute Animal Emergency?',
    emergencyBody: 'Do not wait for form confirmation. Call our 24/7 Field Ambulatory Hotline directly at',
    whatsappTitle: 'WhatsApp Photo/Tele-Triage',
    whatsappSubtitle: 'Send photos/video of symptoms',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqcSFbViwyr8mocbzKIJzG7IJgNmsQDzShlDKng9RrHFUSvUhWyciE7nI9uHjuQfZ96NGPRAsj9A1glCm1YFtuRnFJSTGFkb2Jc5LZca1_O2NlNpv7TopYviyBfcfMMKhAruZR-Tzd2pmlf3FWFu254SnIurU5M1YaXvMS3SbWILfZTh-EtQgrH2nUMow-nYT_8PJs_hE2LzrTSReh3E_y8M-CKRPkeMptKhejBOUbnoDNdvqMBqA3',
    imageTitle: 'Mobile Diagnostic Ultrasound Unit',
    imageCaption: 'Equipped for real-time ovarian scanning, surgical intervention & herd synchronization.',
  });

  // 4. Mission & Vision Section
  const [missionVision, setMissionVision] = useState({
    mission:
      'To deliver long-lasting, affordable and sustainable animal health solutions that empower farmers, veterinarians and communities across Africa - integrating one-health principles, climate smart practices and innovation to combat diseases, strengthen food systems and advance animal welfare.',
    missionTag1: 'Climate-Smart',
    missionTag2: 'Community-Empowered',
    vision:
      'A world where animal life matters, every farmer thrives and every community is protected.',
    visionTag1: 'Animal Welfare First',
    visionTag2: 'Thriving Agribusiness',
  });

  // 5. Collaborations & CTA Banner
  const [partnerships, setPartnerships] = useState({
    subtitle: 'Institutional Network',
    title: 'Collaborations & Partnerships',
    body: 'Partnering across government entities, pharmaceutical manufacturers, and research bodies to advance One Health across East Africa.',
  });

  const [ctaBanner, setCtaBanner] = useState({
    subtitle: 'Rapid Response Service',
    title: 'Need Immediate Clinical Assistance on Your Farm?',
    body: 'Our field veterinary team provides real-time WhatsApp visual triage, emergency ambulatory dispatch, and immediate drug dosage guidance.',
    whatsappButtonText: 'WhatsApp Vet Now',
    hotlineButtonText: 'Hotline Call',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/content/homepage');
      if (res.success && res.data?.byKey) {
        const b = res.data.byKey;

        // Top bar
        if (b.home_top_bar) {
          setTopBar({
            badge: b.home_top_bar.badge || 'KENYA VETERINARY BOARD ACCREDITED',
            licenseText: b.home_top_bar.metadata?.licenseText || 'Practice License KVB/PR/2025/0842',
            oneHealthText: b.home_top_bar.metadata?.oneHealthText || 'One Health Alliance Member',
            dispatchText: b.home_top_bar.metadata?.dispatchText || '24/7 Mobile Triage Response',
          });
        }

        // Hero
        if (b.home_hero) {
          const m = b.home_hero.metadata || {};
          setHero({
            badge: b.home_hero.badge || '',
            subtitle: b.home_hero.subtitle || '',
            title: b.home_hero.title || '',
            body: b.home_hero.body || '',
            primaryCtaText: m.primaryCtaText || 'Get Help from Us',
            primaryCtaLink: m.primaryCtaLink || '#booking-dispatch',
            secondaryCtaText: m.secondaryCtaText || 'Explore Services & Solutions',
            secondaryCtaLink: m.secondaryCtaLink || '/services',
            heroImage: m.heroImage || '/logo.png',
            heroTagline: m.heroTagline || 'Healthy Animals • Healthy People • Healthy Planet',
            fieldTriageStatus: m.fieldTriageStatus || 'Active Mobile Units',
            fieldTriageSquads: m.fieldTriageSquads || 'Central & Rift Valley Squads',
            fieldTriageDesc: m.fieldTriageDesc || 'Diagnostics, Ultrasound & Vaccine Dispensary',
            kvbVerifiedText: m.kvbVerifiedText || 'KVB Verified Clinical Practice',
            kvbLicenseTag: m.kvbLicenseTag || 'ACC/2025',
            metrics:
              Array.isArray(m.metrics) && m.metrics.length > 0
                ? m.metrics
                : [
                  { label: 'Accredited Practice', value: 'KVB' },
                  { label: 'One Health Focused', value: '100%' },
                  { label: 'Field Triage Units', value: '24/7' },
                  { label: 'Counties Covered', value: '14+' },
                ],
            showSocialPresence: m.showSocialPresence !== false,
            socialLabel: m.socialLabel || 'Follow Clinical Updates:',
            socialAccounts:
              Array.isArray(m.socialAccounts) && m.socialAccounts.length > 0
                ? m.socialAccounts
                : [
                  { platform: 'facebook', label: 'Facebook', url: m.socialLinks?.facebook || '', enabled: Boolean(m.socialLinks?.facebook && m.socialLinks.facebook !== '#') },
                  { platform: 'twitter', label: 'Twitter / X', url: m.socialLinks?.twitter || '', enabled: Boolean(m.socialLinks?.twitter && m.socialLinks.twitter !== '#') },
                  { platform: 'instagram', label: 'Instagram', url: m.socialLinks?.instagram || '', enabled: Boolean(m.socialLinks?.instagram && m.socialLinks.instagram !== '#') },
                  { platform: 'linkedin', label: 'LinkedIn', url: m.socialLinks?.linkedin || '', enabled: Boolean(m.socialLinks?.linkedin && m.socialLinks.linkedin !== '#') },
                  { platform: 'youtube', label: 'YouTube', url: m.socialLinks?.youtube || '', enabled: Boolean(m.socialLinks?.youtube && m.socialLinks.youtube !== '#') },
                  { platform: 'tiktok', label: 'TikTok', url: m.socialLinks?.tiktok || '', enabled: Boolean(m.socialLinks?.tiktok && m.socialLinks.tiktok !== '#') },
                  { platform: 'whatsapp', label: 'WhatsApp', url: m.socialLinks?.whatsapp || '', enabled: Boolean(m.socialLinks?.whatsapp && m.socialLinks.whatsapp !== '#') },
                ],
          });
        }

        // Why choose us
        if (b.home_why_choose_us) {
          const m = b.home_why_choose_us.metadata || {};
          setWhyChooseUs({
            subtitle: b.home_why_choose_us.subtitle || '',
            title: b.home_why_choose_us.title || '',
            body: b.home_why_choose_us.body || '',
            pillars:
              Array.isArray(m.pillars) && m.pillars.length > 0
                ? m.pillars
                : whyChooseUs.pillars,
          });
        }

        // Services header
        if (b.home_services_header) {
          setServicesHeader({
            subtitle: b.home_services_header.subtitle || '',
            title: b.home_services_header.title || '',
            body: b.home_services_header.body || '',
          });
        }

        // Booking header
        if (b.home_booking_header) {
          const m = b.home_booking_header.metadata || {};
          setBookingHeader({
            badge: b.home_booking_header.badge || '',
            title: b.home_booking_header.title || '',
            body: b.home_booking_header.body || '',
            emergencyTitle: m.emergencyTitle || 'Acute Animal Emergency?',
            emergencyBody: m.emergencyBody || 'Do not wait for form confirmation. Call our 24/7 Field Ambulatory Hotline directly at',
            whatsappTitle: m.whatsappTitle || 'WhatsApp Photo/Tele-Triage',
            whatsappSubtitle: m.whatsappSubtitle || 'Send photos/video of symptoms',
            imageUrl:
              m.imageUrl ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuCqcSFbViwyr8mocbzKIJzG7IJgNmsQDzShlDKng9RrHFUSvUhWyciE7nI9uHjuQfZ96NGPRAsj9A1glCm1YFtuRnFJSTGFkb2Jc5LZca1_O2NlNpv7TopYviyBfcfMMKhAruZR-Tzd2pmlf3FWFu254SnIurU5M1YaXvMS3SbWILfZTh-EtQgrH2nUMow-nYT_8PJs_hE2LzrTSReh3E_y8M-CKRPkeMptKhejBOUbnoDNdvqMBqA3',
            imageTitle: m.imageTitle || 'Mobile Diagnostic Ultrasound Unit',
            imageCaption: m.imageCaption || 'Equipped for real-time ovarian scanning, surgical intervention & herd synchronization.',
          });
        }

        // Mission & Vision
        if (b.home_mission_vision?.metadata) {
          const m = b.home_mission_vision.metadata;
          setMissionVision({
            mission: m.mission || '',
            missionTag1: m.missionTags?.[0] || 'Climate-Smart',
            missionTag2: m.missionTags?.[1] || 'Community-Empowered',
            vision: m.vision || '',
            visionTag1: m.visionTags?.[0] || 'Animal Welfare First',
            visionTag2: m.visionTags?.[1] || 'Thriving Agribusiness',
          });
        }

        // Partnerships
        if (b.home_partnerships) {
          setPartnerships({
            subtitle: b.home_partnerships.subtitle || '',
            title: b.home_partnerships.title || '',
            body: b.home_partnerships.body || '',
          });
        }

        // CTA Banner
        if (b.home_cta_banner) {
          const m = b.home_cta_banner.metadata || {};
          setCtaBanner({
            subtitle: b.home_cta_banner.subtitle || '',
            title: b.home_cta_banner.title || '',
            body: b.home_cta_banner.body || '',
            whatsappButtonText: m.whatsappButtonText || 'WhatsApp Vet Now',
            hotlineButtonText: m.hotlineButtonText || 'Hotline Call',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load homepage content blocks:', err);
      showToast('Failed to load content from database: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await Promise.all([
        // 1. Top bar
        api.put('/admin/content-blocks/home_top_bar', {
          section: 'homepage',
          title: 'Regulatory Status Bar',
          badge: topBar.badge,
          metadata: {
            licenseText: topBar.licenseText,
            oneHealthText: topBar.oneHealthText,
            dispatchText: topBar.dispatchText,
          },
        }),

        // 2. Hero
        api.put('/admin/content-blocks/home_hero', {
          section: 'homepage',
          title: hero.title,
          subtitle: hero.subtitle,
          body: hero.body,
          badge: hero.badge,
          metadata: {
            metrics: hero.metrics,
            primaryCtaText: hero.primaryCtaText,
            primaryCtaLink: hero.primaryCtaLink,
            secondaryCtaText: hero.secondaryCtaText,
            secondaryCtaLink: hero.secondaryCtaLink,
            heroImage: hero.heroImage,
            heroTagline: hero.heroTagline,
            fieldTriageStatus: hero.fieldTriageStatus,
            fieldTriageSquads: hero.fieldTriageSquads,
            fieldTriageDesc: hero.fieldTriageDesc,
            kvbVerifiedText: hero.kvbVerifiedText,
            kvbLicenseTag: hero.kvbLicenseTag,
            showSocialPresence: hero.showSocialPresence,
            socialLabel: hero.socialLabel,
            socialAccounts: hero.socialAccounts,
          },
        }),

        // 3. Why Choose Us
        api.put('/admin/content-blocks/home_why_choose_us', {
          section: 'homepage',
          title: whyChooseUs.title,
          subtitle: whyChooseUs.subtitle,
          body: whyChooseUs.body,
          metadata: {
            pillars: whyChooseUs.pillars,
          },
        }),

        // 4. Services Header
        api.put('/admin/content-blocks/home_services_header', {
          section: 'homepage',
          title: servicesHeader.title,
          subtitle: servicesHeader.subtitle,
          body: servicesHeader.body,
        }),

        // 5. Booking Header
        api.put('/admin/content-blocks/home_booking_header', {
          section: 'homepage',
          badge: bookingHeader.badge,
          title: bookingHeader.title,
          body: bookingHeader.body,
          metadata: {
            emergencyTitle: bookingHeader.emergencyTitle,
            emergencyBody: bookingHeader.emergencyBody,
            whatsappTitle: bookingHeader.whatsappTitle,
            whatsappSubtitle: bookingHeader.whatsappSubtitle,
            imageUrl: bookingHeader.imageUrl,
            imageTitle: bookingHeader.imageTitle,
            imageCaption: bookingHeader.imageCaption,
          },
        }),

        // 6. Mission & Vision
        api.put('/admin/content-blocks/home_mission_vision', {
          section: 'homepage',
          title: 'Purpose & Vision',
          metadata: {
            mission: missionVision.mission,
            missionTags: [missionVision.missionTag1, missionVision.missionTag2],
            vision: missionVision.vision,
            visionTags: [missionVision.visionTag1, visionVisionTag2(missionVision)],
          },
        }),

        // 7. Collaborations Header
        api.put('/admin/content-blocks/home_partnerships', {
          section: 'homepage',
          title: partnerships.title,
          subtitle: partnerships.subtitle,
          body: partnerships.body,
          metadata: {},
        }),

        // 8. CTA Banner
        api.put('/admin/content-blocks/home_cta_banner', {
          section: 'homepage',
          title: ctaBanner.title,
          subtitle: ctaBanner.subtitle,
          body: ctaBanner.body,
          metadata: {
            whatsappButtonText: ctaBanner.whatsappButtonText,
            hotlineButtonText: ctaBanner.hotlineButtonText,
          },
        }),
      ]);

      notifyContentUpdated({ resource: 'homepage_content' });
      showToast('All homepage sections saved & live website synchronized!');
    } catch (err) {
      console.error('Failed to save homepage:', err);
      showToast('Failed to save content: ' + (err.message || 'Error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const visionVisionTag2 = (mv) => mv.visionTag2 || 'Thriving Agribusiness';

  // Pillar change helper
  const updatePillar = (index, field, value) => {
    setWhyChooseUs((prev) => {
      const newPillars = [...prev.pillars];
      newPillars[index] = { ...newPillars[index], [field]: value };
      return { ...prev, pillars: newPillars };
    });
  };

  // Partner Card change helper
  const updatePartnerCard = (index, field, value) => {
    setPartnerships((prev) => {
      const newCards = [...prev.partnerCards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, partnerCards: newCards };
    });
  };

  // Hero Metric change helper
  const updateMetric = (index, field, value) => {
    setHero((prev) => {
      const newMetrics = [...prev.metrics];
      newMetrics[index] = { ...newMetrics[index], [field]: value };
      return { ...prev, metrics: newMetrics };
    });
  };

  // Hero Social Account helpers
  const updateSocialAccount = (index, field, value) => {
    setHero((prev) => {
      const newAccounts = [...(prev.socialAccounts || [])];
      newAccounts[index] = { ...newAccounts[index], [field]: value };
      return { ...prev, socialAccounts: newAccounts };
    });
  };

  const addSocialAccount = () => {
    setHero((prev) => ({
      ...prev,
      socialAccounts: [
        ...(prev.socialAccounts || []),
        { platform: 'website', label: 'Custom Channel', url: '', enabled: true },
      ],
    }));
  };

  const removeSocialAccount = (index) => {
    setHero((prev) => {
      const newAccounts = (prev.socialAccounts || []).filter((_, idx) => idx !== index);
      return { ...prev, socialAccounts: newAccounts };
    });
  };

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Toast Alert */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${feedback.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
            }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {feedback.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-label-md font-semibold">{feedback.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-tinted text-primary font-label-sm text-label-sm font-bold border border-border-accent mb-2">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Live Homepage Content Management</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Homepage Comprehensive CMS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Edit headlines, metrics, pillars, triage copy, mission/vision, and institutional network cards across the landing page with instant live broadcast.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchContent}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Reload</span>
          </button>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">
              {saving ? 'sync' : 'save'}
            </span>
            <span>{saving ? 'Saving Live...' : 'Publish All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-hairline">
        {[
          { id: 'hero', label: '1. Hero & Top Bar', icon: 'flag' },
          { id: 'pillars', label: '2. Why Choose Us (3 Pillars)', icon: 'verified' },
          { id: 'services_booking', label: '3. Services & Triage Booking', icon: 'medical_services' },
          { id: 'mission_vision', label: '4. Mission & Vision', icon: 'target' },
          { id: 'partners_cta', label: '5. Partnerships & Banner', icon: 'handshake' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full font-label-md text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface hover:bg-surface-clinical'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant space-y-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-label-md font-semibold">Loading homepage content blocks...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveAll} className="space-y-6">
          {/* TAB 1: HERO & TOP BAR */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              {/* Top Bar Strip */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">horizontal_rule</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Top Accreditation Bar</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Top Strip Badge Pill
                    </label>
                    <input
                      type="text"
                      value={topBar.badge}
                      onChange={(e) => setTopBar({ ...topBar, badge: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      License Subtext
                    </label>
                    <input
                      type="text"
                      value={topBar.licenseText}
                      onChange={(e) => setTopBar({ ...topBar, licenseText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Alliance Member Tag
                    </label>
                    <input
                      type="text"
                      value={topBar.oneHealthText}
                      onChange={(e) => setTopBar({ ...topBar, oneHealthText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Response Tag
                    </label>
                    <input
                      type="text"
                      value={topBar.dispatchText}
                      onChange={(e) => setTopBar({ ...topBar, dispatchText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Main Hero Section */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">star</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Hero Copy &amp; CTAs</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Hero Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={hero.badge}
                      onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={hero.subtitle}
                      onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Main Hero Headline
                    </label>
                    <input
                      type="text"
                      value={hero.title}
                      onChange={(e) => setHero({ ...hero, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Hero Description Body
                    </label>
                    <textarea
                      rows="3"
                      value={hero.body}
                      onChange={(e) => setHero({ ...hero, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none leading-relaxed"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Primary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={hero.primaryCtaText}
                      onChange={(e) => setHero({ ...hero, primaryCtaText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Primary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={hero.primaryCtaLink}
                      onChange={(e) => setHero({ ...hero, primaryCtaLink: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Secondary CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={hero.secondaryCtaText}
                      onChange={(e) => setHero({ ...hero, secondaryCtaText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Secondary CTA Target Link
                    </label>
                    <input
                      type="text"
                      value={hero.secondaryCtaLink}
                      onChange={(e) => setHero({ ...hero, secondaryCtaLink: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Social Presence & Quick Connect Channels */}
                <div className="pt-4 border-t border-border-hairline space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-headline-sm font-bold text-on-surface text-sm uppercase text-primary flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">share</span>
                        <span>Hero Social Presence &amp; Follow Channels</span>
                      </h3>
                      <p className="text-[12px] text-outline mt-0.5">
                        Displayed below the main Hero Call-To-Action buttons on the live homepage.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-surface-subtle px-3 py-1.5 rounded-xl border border-border-hairline hover:bg-surface-container-low transition-colors">
                      <input
                        type="checkbox"
                        checked={hero.showSocialPresence}
                        onChange={(e) => setHero({ ...hero, showSocialPresence: e.target.checked })}
                        className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                      />
                      <span className="text-xs font-bold text-on-surface">Show on Homepage</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Section Title Label
                      </label>
                      <input
                        type="text"
                        value={hero.socialLabel}
                        onChange={(e) => setHero({ ...hero, socialLabel: e.target.value })}
                        placeholder="Follow Clinical Updates:"
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Social Accounts List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-on-surface-variant">
                        Configured Channels ({hero.socialAccounts?.filter(a => a.enabled && a.url).length || 0} Active)
                      </span>
                      <button
                        type="button"
                        onClick={addSocialAccount}
                        className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg bg-surface-tinted text-primary hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Add Channel</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {hero.socialAccounts?.map((account, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-xl border transition-all flex flex-col md:flex-row items-start md:items-center gap-3 ${
                            account.enabled && account.url
                              ? 'bg-surface-subtle border-border-hairline'
                              : 'bg-surface-subtle/50 border-border-hairline/60 opacity-75'
                          }`}
                        >
                          {/* Icon Badge & Platform Selector */}
                          <div className="flex items-center gap-2.5 min-w-[175px]">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                account.enabled && account.url
                                  ? 'bg-primary text-on-primary shadow-sm'
                                  : 'bg-surface-container text-outline'
                              }`}
                            >
                              <SocialIcon platform={account.platform} className="w-4 h-4" />
                            </div>
                            <select
                              value={account.platform}
                              onChange={(e) => updateSocialAccount(idx, 'platform', e.target.value)}
                              className="h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-bold text-on-surface focus:border-primary focus:outline-none"
                            >
                              <option value="facebook">Facebook</option>
                              <option value="twitter">Twitter / X</option>
                              <option value="instagram">Instagram</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="youtube">YouTube</option>
                              <option value="tiktok">TikTok</option>
                              <option value="whatsapp">WhatsApp</option>
                              <option value="telegram">Telegram</option>
                              <option value="website">Custom / Website</option>
                            </select>
                          </div>

                          {/* Account Label */}
                          <div className="w-full md:w-44 shrink-0">
                            <input
                              type="text"
                              value={account.label || ''}
                              onChange={(e) => updateSocialAccount(idx, 'label', e.target.value)}
                              placeholder="Display Label"
                              className="w-full h-9 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                            />
                          </div>

                          {/* Account URL */}
                          <div className="w-full flex-1">
                            <input
                              type="text"
                              value={account.url || ''}
                              onChange={(e) => updateSocialAccount(idx, 'url', e.target.value)}
                              placeholder="URL (e.g. https://instagram.com/aniheal)"
                              className="w-full h-9 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-mono focus:border-primary focus:outline-none"
                            />
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold select-none">
                              <input
                                type="checkbox"
                                checked={account.enabled !== false}
                                onChange={(e) => updateSocialAccount(idx, 'enabled', e.target.checked)}
                                className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                              />
                              <span className={account.enabled ? 'text-primary' : 'text-outline'}>
                                {account.enabled ? 'Active' : 'Off'}
                              </span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeSocialAccount(idx)}
                              className="w-8 h-8 rounded-lg text-outline hover:text-error hover:bg-error/10 flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove Channel"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4 Hero Numerical Counter Metrics */}
                <div className="pt-4 border-t border-border-hairline">
                  <h3 className="font-headline-sm font-bold text-on-surface mb-3 text-sm uppercase text-primary">
                    4 Hero Key Metrics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {hero.metrics.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-surface-subtle border border-border-hairline space-y-2">
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant">
                          Metric #{idx + 1}
                        </label>
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                          placeholder="Value (e.g. 24/7)"
                          className="w-full h-9 px-2 rounded-lg bg-surface-clinical border border-border-hairline text-body-md font-bold focus:border-primary focus:outline-none"
                        />
                        <input
                          type="text"
                          value={m.label}
                          onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                          placeholder="Label (e.g. Field Triage Units)"
                          className="w-full h-9 px-2 rounded-lg bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Hero Composite Card Customization */}
                <div className="pt-4 border-t border-border-hairline">
                  <h3 className="font-headline-sm font-bold text-on-surface mb-3 text-sm uppercase text-primary">
                    Right Hero Visual Composite Card
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Official Emblem Image URL
                      </label>
                      <input
                        type="text"
                        value={hero.heroImage}
                        onChange={(e) => setHero({ ...hero, heroImage: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Brand Motto Tagline
                      </label>
                      <input
                        type="text"
                        value={hero.heroTagline}
                        onChange={(e) => setHero({ ...hero, heroTagline: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Field Triage Status Tag
                      </label>
                      <input
                        type="text"
                        value={hero.fieldTriageStatus}
                        onChange={(e) => setHero({ ...hero, fieldTriageStatus: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Triage Card Title
                      </label>
                      <input
                        type="text"
                        value={hero.fieldTriageSquads}
                        onChange={(e) => setHero({ ...hero, fieldTriageSquads: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                        Triage Card Subtext
                      </label>
                      <input
                        type="text"
                        value={hero.fieldTriageDesc}
                        onChange={(e) => setHero({ ...hero, fieldTriageDesc: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WHY CHOOSE US (3 PILLARS) */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Why Choose Us Section Header</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Eyebrow Subtitle
                    </label>
                    <input
                      type="text"
                      value={whyChooseUs.subtitle}
                      onChange={(e) => setWhyChooseUs({ ...whyChooseUs, subtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={whyChooseUs.title}
                      onChange={(e) => setWhyChooseUs({ ...whyChooseUs, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Description Copy
                    </label>
                    <textarea
                      rows="2"
                      value={whyChooseUs.body}
                      onChange={(e) => setWhyChooseUs({ ...whyChooseUs, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* 3 Clinical Pillars */}
              <div className="space-y-4">
                <h3 className="font-headline-sm font-bold text-on-surface text-base">
                  3 Primary Practice Pillars
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {whyChooseUs.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="bg-surface-clinical rounded-2xl p-5 shadow-sm border border-border-hairline space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
                        <span className="font-label-sm font-bold uppercase text-primary">
                          Pillar #{idx + 1}
                        </span>
                        <span className="material-symbols-outlined text-primary text-[20px]">
                          {pillar.icon || 'verified'}
                        </span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Material Icon Name
                        </label>
                        <input
                          type="text"
                          value={pillar.icon}
                          onChange={(e) => updatePillar(idx, 'icon', e.target.value)}
                          placeholder="e.g. stethoscope, biotech, verified"
                          className="w-full h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-xs font-mono focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Pillar Title
                        </label>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => updatePillar(idx, 'title', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-sm font-bold focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={pillar.subtitle}
                          onChange={(e) => updatePillar(idx, 'subtitle', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          value={pillar.desc}
                          onChange={(e) => updatePillar(idx, 'desc', e.target.value)}
                          className="w-full p-2.5 rounded-lg bg-surface-subtle border border-border-hairline text-xs leading-relaxed focus:border-primary focus:outline-none"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={pillar.badge}
                          onChange={(e) => updatePillar(idx, 'badge', e.target.value)}
                          className="w-full h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-xs focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & TRIAGE BOOKING */}
          {activeTab === 'services_booking' && (
            <div className="space-y-6">
              {/* Services Section Header */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">medical_services</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Clinical Services Header</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={servicesHeader.subtitle}
                      onChange={(e) => setServicesHeader({ ...servicesHeader, subtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={servicesHeader.title}
                      onChange={(e) => setServicesHeader({ ...servicesHeader, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Description
                    </label>
                    <textarea
                      rows="2"
                      value={servicesHeader.body}
                      onChange={(e) => setServicesHeader({ ...servicesHeader, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Booking Dispatch Section Copy */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">calendar_month</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Farm Dispatch &amp; Triage Form Header</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Pill Badge
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.badge}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, badge: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Booking Form Headline
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.title}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Booking Form Description
                    </label>
                    <textarea
                      rows="2"
                      value={bookingHeader.body}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Emergency Alert Box Headline
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.emergencyTitle}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, emergencyTitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Emergency Alert Box Body Subtext
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.emergencyBody}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, emergencyBody: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      WhatsApp Triage Card Title
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.whatsappTitle}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, whatsappTitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      WhatsApp Triage Card Subtitle
                    </label>
                    <input
                      type="text"
                      value={bookingHeader.whatsappSubtitle}
                      onChange={(e) => setBookingHeader({ ...bookingHeader, whatsappSubtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Booking Page Visual Operational Image & Caption Controls */}
                  <div className="sm:col-span-2 pt-4 border-t border-border-hairline space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">image</span>
                      <h3 className="font-headline-sm font-bold text-on-surface text-sm">
                        Booking Page Featured Image &amp; Operational Card
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                          Featured Image URL
                        </label>
                        <input
                          type="text"
                          value={bookingHeader.imageUrl}
                          onChange={(e) => setBookingHeader({ ...bookingHeader, imageUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                          Operational Card Title
                        </label>
                        <input
                          type="text"
                          value={bookingHeader.imageTitle}
                          onChange={(e) => setBookingHeader({ ...bookingHeader, imageTitle: e.target.value })}
                          placeholder="e.g. Mobile Diagnostic Ultrasound Unit"
                          className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                          Image Caption / Description
                        </label>
                        <textarea
                          rows="2"
                          value={bookingHeader.imageCaption}
                          onChange={(e) => setBookingHeader({ ...bookingHeader, imageCaption: e.target.value })}
                          placeholder="Describe the unit or service shown..."
                          className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                        ></textarea>
                      </div>
                    </div>

                    {bookingHeader.imageUrl && (
                      <div className="p-3 bg-surface-subtle rounded-xl border border-border-hairline flex flex-col sm:flex-row items-center gap-4">
                        <img
                          src={bookingHeader.imageUrl}
                          alt="Booking preview"
                          className="w-32 h-20 rounded-lg object-cover border border-border-hairline shrink-0"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="text-xs space-y-1">
                          <span className="font-bold text-on-surface block">{bookingHeader.imageTitle || 'No Title Set'}</span>
                          <span className="text-on-surface-variant block">{bookingHeader.imageCaption || 'No Caption Set'}</span>
                          <span className="text-primary font-mono text-[10px] truncate block max-w-md">{bookingHeader.imageUrl}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MISSION & VISION */}
          {activeTab === 'mission_vision' && (
            <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-6">
              <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                <span className="material-symbols-outlined text-primary text-[22px]">target</span>
                <h2 className="font-headline-md font-bold text-on-surface">Mission &amp; Vision Statements</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Mission */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline space-y-3">
                  <h3 className="font-headline-sm font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px]">target</span>
                    <span>Our Mission</span>
                  </h3>
                  <textarea
                    rows="5"
                    value={missionVision.mission}
                    onChange={(e) => setMissionVision({ ...missionVision, mission: e.target.value })}
                    className="w-full p-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-md focus:border-primary focus:outline-none leading-relaxed"
                  ></textarea>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Pill Tag 1
                      </label>
                      <input
                        type="text"
                        value={missionVision.missionTag1}
                        onChange={(e) => setMissionVision({ ...missionVision, missionTag1: e.target.value })}
                        className="w-full h-9 px-2 rounded bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Pill Tag 2
                      </label>
                      <input
                        type="text"
                        value={missionVision.missionTag2}
                        onChange={(e) => setMissionVision({ ...missionVision, missionTag2: e.target.value })}
                        className="w-full h-9 px-2 rounded bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Vision */}
                <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline space-y-3">
                  <h3 className="font-headline-sm font-bold text-secondary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                    <span>Our Vision</span>
                  </h3>
                  <textarea
                    rows="5"
                    value={missionVision.vision}
                    onChange={(e) => setMissionVision({ ...missionVision, vision: e.target.value })}
                    className="w-full p-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-md focus:border-primary focus:outline-none leading-relaxed"
                  ></textarea>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Pill Tag 1
                      </label>
                      <input
                        type="text"
                        value={missionVision.visionTag1}
                        onChange={(e) => setMissionVision({ ...missionVision, visionTag1: e.target.value })}
                        className="w-full h-9 px-2 rounded bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-on-surface-variant mb-1">
                        Pill Tag 2
                      </label>
                      <input
                        type="text"
                        value={missionVision.visionTag2}
                        onChange={(e) => setMissionVision({ ...missionVision, visionTag2: e.target.value })}
                        className="w-full h-9 px-2 rounded bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PARTNERSHIPS & BOTTOM CTA BANNER */}
          {activeTab === 'partners_cta' && (
            <div className="space-y-6">
              {/* Collaborations Header */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">handshake</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Collaborations &amp; Partnerships Header</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Eyebrow Subtitle
                    </label>
                    <input
                      type="text"
                      value={partnerships.subtitle}
                      onChange={(e) => setPartnerships({ ...partnerships, subtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={partnerships.title}
                      onChange={(e) => setPartnerships({ ...partnerships, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Section Description Copy
                    </label>
                    <textarea
                      rows="2"
                      value={partnerships.body}
                      onChange={(e) => setPartnerships({ ...partnerships, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Dynamic Database Collaborations Notice */}
              <div className="bg-surface-tinted rounded-2xl p-6 border border-border-hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[22px]">database</span>
                    <h3 className="font-headline-sm font-bold text-on-surface text-base">
                      Dynamic Collaborations &amp; Partner Stories
                    </h3>
                  </div>
                  <p className="text-body-sm text-on-surface-variant max-w-xl">
                    All collaboration cards, partner logos, research alliances, and articles displayed on the homepage and the public site are directly saved and queried from the database.
                  </p>
                </div>
                <Link
                  to="/admin/collaborations"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary-dark transition-all shadow-sm shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px]">handshake</span>
                  <span>Manage Collaborations</span>
                </Link>
              </div>

              {/* Bottom Tele-Triage Emergency Banner */}
              <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
                  <span className="material-symbols-outlined text-primary text-[22px]">campaign</span>
                  <h2 className="font-headline-md font-bold text-on-surface">Bottom Direct Tele-Triage Banner</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Banner Subtitle
                    </label>
                    <input
                      type="text"
                      value={ctaBanner.subtitle}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, subtitle: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Banner Headline
                    </label>
                    <input
                      type="text"
                      value={ctaBanner.title}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, title: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Banner Description Copy
                    </label>
                    <textarea
                      rows="2"
                      value={ctaBanner.body}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, body: e.target.value })}
                      className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      WhatsApp Button Label
                    </label>
                    <input
                      type="text"
                      value={ctaBanner.whatsappButtonText}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, whatsappButtonText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                      Hotline Button Label
                    </label>
                    <input
                      type="text"
                      value={ctaBanner.hotlineButtonText}
                      onChange={(e) => setCtaBanner({ ...ctaBanner, hotlineButtonText: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Action Bar */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-hairline">
            <button
              type="submit"
              disabled={saving}
              className="px-8 h-12 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {saving ? 'sync' : 'save'}
              </span>
              <span>{saving ? 'Saving Changes...' : 'Publish All Homepage Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
