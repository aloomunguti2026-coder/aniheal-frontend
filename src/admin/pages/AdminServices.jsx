import React, { useState, useEffect, useId } from 'react';
import api, { API_BASE_URL } from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

const CATEGORY_OPTIONS = [
  { value: 'one-health', label: 'One Health & Bio-Security' },
  { value: 'therapeutic', label: 'Therapeutic & Diagnostics' },
  { value: 'reproductive', label: 'Reproductive Tech & Breeding' },
  { value: 'insurance', label: 'Insurance & Feeds' },
  { value: 'diagnostics', label: 'Laboratory & Diagnostics' },
  { value: 'surgery', label: 'Field Surgery & Triage' },
];

const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD8GMqS-s8oinLCAa3VcL8Xl7AQBM1TSOEF9XkmOobmDNuBcrYO1BnJzDYY41T8p8D9N9DXAJZ5xXcXs62AY48PxF50eFEK4mvnrlAmyiiDgMPdtr-U4_r1YfvJTd93s_r1lRgit73FS86IaEBFaO558hGseYNlXJUuDUeHj2wgYr0-fWtJ7mG4UE5sfCVkqHFhtPTMjJYKvI4veFlKgjAORdXijb34IbWE4OAS4B7gmYQXrKE4mb-6';

export default function AdminServices() {
  const [activeMainTab, setActiveMainTab] = useState('catalog'); // 'catalog' | 'page_headers'
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fileInputId = useId();

  // Service form state
  const [formData, setFormData] = useState({
    protocolNumber: 'Service Protocol 01',
    title: '',
    slug: '',
    badgeText: 'Zoonoses & Bio-Risk',
    badgeIcon: 'public',
    statusTag: 'KVB Standard Audit',
    category: 'one-health',
    image: DEFAULT_IMAGE,
    description: '',
    compliance: 'Formal WHO & WOAH One Health Guidelines Adherent',
    bookingCTA: 'Schedule Clinical Triage',
    features: [
      { icon: 'coronavirus', title: 'Zoonotic Surveillance', desc: 'Serum banking and barrier testing.' },
      { icon: 'sanitizer', title: 'Bio-Security Auditing', desc: 'Disinfection gates and protocol telemetry.' },
      { icon: 'water_drop', title: 'Effluent Management', desc: 'Runoff bio-filtration monitoring.' },
    ],
    sortOrder: 0,
    isPublished: true,
  });

  // Services page headers content blocks
  const [pageHero, setPageHero] = useState({
    badge: 'KENYA VETERINARY BOARD REGISTERED',
    complianceSubtext: 'CAP 366 STATUTORY COMPLIANCE',
    subtitle: 'Diagnostic, Ambulatory & Genetic Infrastructure',
    title: 'Specialized Agro-Pastoral & Veterinary Services',
    body: 'Merging molecular epidemiological rigour with sustainable livestock management under Kenya’s One Health mandate. Our mobile units, cold-chain ambulatory units, and senior field surgeons serve progressive dairy estates, ranches, and smallholder agrarian clusters nationwide.',
    stat1Title: 'Average Triage Dispatch',
    stat1Value: '38 Minutes',
    stat1Subtitle: '(Central/Rift)',
    stat2Title: 'Rapid Field Diagnostic Kits',
    stat2Value: '99.2% PCR Accuracy',
  });

  const [insuranceHeader, setInsuranceHeader] = useState({
    subtitle: 'Predictable Clinical Protection',
    title: 'Animal Insurance & Health Subscriptions',
    body: 'Underwritten clinical healthcare plans tailored for Dairy Herds, Beef Cattle, Companion Pets, and Working Equine across Kenya.',
  });

  const [labPrecision, setLabPrecision] = useState({
    subtitle: 'Laboratory Precision',
    title: 'Diagnostics Built on Evidence, Not Guesswork',
    body: 'Our clinicians use mobile diagnostic benches calibrated against international WOAH reference limits. We preserve therapeutic efficacy by conducting antimicrobial sensitivity testing (AST) before prescribing broad-spectrum antibiotics, curbing local antimicrobial resistance.',
    metric1Label: 'Reproductive First-Service Conception Rate (FTAI)',
    metric1Value: '68.4%',
    metric2Label: 'Mastitis Recovery without Quarter Blindness',
    metric2Value: '94.1%',
    metric3Label: 'Cold Chain Vaccine Viability Score',
    metric3Value: '99.8%',
    chartTitle: 'Herd Somatic Cell Curve (SCC)',
    chartSubtitle: 'Post AniHeal Nutrition & Sanitization Protocol (cells/mL × 1,000)',
    chartBadge: '-48% Drop',
  });

  const [ctaBanner, setCtaBanner] = useState({
    subtitle: 'Custom Farm Protocol Scheduling',
    title: 'Ready to fortify your herd’s productivity?',
    body: 'Speak directly with a Kenya Veterinary Board registered practitioner or schedule your initial comprehensive farm diagnostic survey.',
    buttonText: 'Book Appointment Now',
  });

  useEffect(() => {
    fetchServicesAndHeaders();
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchServicesAndHeaders = async () => {
    try {
      setLoading(true);
      const [servicesRes, blocksRes] = await Promise.allSettled([
        api.get('/admin/services'),
        api.get('/public/content/all'),
      ]);

      if (servicesRes.status === 'fulfilled' && servicesRes.value.success) {
        setServices(servicesRes.value.data || []);
      }

      if (blocksRes.status === 'fulfilled' && blocksRes.value.success) {
        const byKey = blocksRes.value.data?.byKey || {};

        if (byKey.services_hero) {
          const m = byKey.services_hero.metadata || {};
          setPageHero({
            badge: byKey.services_hero.badge || 'KENYA VETERINARY BOARD REGISTERED',
            complianceSubtext: m.complianceSubtext || 'CAP 366 STATUTORY COMPLIANCE',
            subtitle: byKey.services_hero.subtitle || 'Diagnostic, Ambulatory & Genetic Infrastructure',
            title: byKey.services_hero.title || 'Specialized Agro-Pastoral & Veterinary Services',
            body: byKey.services_hero.body || '',
            stat1Title: m.stat1Title || 'Average Triage Dispatch',
            stat1Value: m.stat1Value || '38 Minutes',
            stat1Subtitle: m.stat1Subtitle || '(Central/Rift)',
            stat2Title: m.stat2Title || 'Rapid Field Diagnostic Kits',
            stat2Value: m.stat2Value || '99.2% PCR Accuracy',
          });
        }

        if (byKey.services_insurance_header) {
          setInsuranceHeader({
            subtitle: byKey.services_insurance_header.subtitle || 'Predictable Clinical Protection',
            title: byKey.services_insurance_header.title || 'Animal Insurance & Health Subscriptions',
            body: byKey.services_insurance_header.body || '',
          });
        }

        if (byKey.services_lab_precision) {
          const m = byKey.services_lab_precision.metadata || {};
          setLabPrecision({
            subtitle: byKey.services_lab_precision.subtitle || 'Laboratory Precision',
            title: byKey.services_lab_precision.title || 'Diagnostics Built on Evidence, Not Guesswork',
            body: byKey.services_lab_precision.body || '',
            metric1Label: m.metric1Label || 'Reproductive First-Service Conception Rate (FTAI)',
            metric1Value: m.metric1Value || '68.4%',
            metric2Label: m.metric2Label || 'Mastitis Recovery without Quarter Blindness',
            metric2Value: m.metric2Value || '94.1%',
            metric3Label: m.metric3Label || 'Cold Chain Vaccine Viability Score',
            metric3Value: m.metric3Value || '99.8%',
            chartTitle: m.chartTitle || 'Herd Somatic Cell Curve (SCC)',
            chartSubtitle: m.chartSubtitle || 'Post AniHeal Nutrition & Sanitization Protocol (cells/mL × 1,000)',
            chartBadge: m.chartBadge || '-48% Drop',
          });
        }

        if (byKey.services_cta_banner) {
          const m = byKey.services_cta_banner.metadata || {};
          setCtaBanner({
            subtitle: byKey.services_cta_banner.subtitle || 'Custom Farm Protocol Scheduling',
            title: byKey.services_cta_banner.title || 'Ready to fortify your herd’s productivity?',
            body: byKey.services_cta_banner.body || '',
            buttonText: m.buttonText || 'Book Appointment Now',
          });
        }
      }
    } catch (err) {
      console.error('Failed to load services data:', err);
      showToast('Failed to load data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      protocolNumber: `Service Protocol 0${services.length + 1}`,
      title: '',
      slug: '',
      badgeText: 'Zoonoses & Bio-Risk',
      badgeIcon: 'biotech',
      statusTag: 'KVB Standard Audit',
      category: 'one-health',
      image: DEFAULT_IMAGE,
      description: 'Detail the veterinary scope, procedures, and disease targets...',
      compliance: 'Formal WHO & WOAH One Health Guidelines Adherent',
      bookingCTA: 'Schedule Clinical Triage',
      features: [
        { icon: 'check_circle', title: 'Diagnostic Step 1', desc: 'Field diagnostic validation' },
        { icon: 'check_circle', title: 'Diagnostic Step 2', desc: 'Therapeutic intervention' },
        { icon: 'check_circle', title: 'Diagnostic Step 3', desc: 'Post-treatment herd audit' },
      ],
      sortOrder: services.length + 1,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setEditingService(srv);
    const cat = Array.isArray(srv.category) ? srv.category[0] || 'one-health' : srv.category || 'one-health';
    setFormData({
      protocolNumber: srv.protocolNumber || '',
      title: srv.title || srv.name || '',
      slug: srv.slug || '',
      badgeText: srv.badgeText || '',
      badgeIcon: srv.badgeIcon || 'biotech',
      statusTag: srv.statusTag || '',
      category: cat,
      image: srv.image || DEFAULT_IMAGE,
      description: srv.description || '',
      compliance: srv.compliance || '',
      bookingCTA: srv.bookingCTA || 'Schedule Clinical Triage',
      features:
        Array.isArray(srv.features) && srv.features.length > 0
          ? srv.features
          : [{ icon: 'check_circle', title: '', desc: '' }],
      sortOrder: typeof srv.sortOrder === 'number' ? srv.sortOrder : 0,
      isPublished: srv.isPublished !== false,
    });
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = new FormData();
      data.append('file', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/media/upload`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: data,
      });

      const res = await response.json();
      if (res.success && res.data?.url) {
        setFormData((prev) => ({ ...prev, image: res.data.url }));
        showToast('Service image uploaded successfully');
      } else {
        throw new Error(res.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      showToast('Image upload error: ' + err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTogglePublish = async (srv) => {
    const nextPublished = !srv.isPublished;
    try {
      const res = await api.put(`/admin/services/${srv._id}`, {
        isPublished: nextPublished,
      });
      if (res.success) {
        setServices((prev) =>
          prev.map((s) => (s._id === srv._id ? { ...s, isPublished: nextPublished } : s))
        );
        notifyContentUpdated({ resource: 'service', id: srv._id, action: 'publish_toggle' });
        showToast(`Service ${nextPublished ? 'published live' : 'hidden from public view'}`);
      }
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the clinical service protocol "${title}"?`)) return;
    try {
      const res = await api.delete(`/admin/services/${id}`);
      if (res.success) {
        setServices((prev) => prev.filter((s) => s._id !== id));
        notifyContentUpdated({ resource: 'service', id, action: 'delete' });
        showToast(`Service "${title}" deleted`);
      }
    } catch (err) {
      showToast('Failed to delete service: ' + err.message, 'error');
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  const addFeatureRow = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { icon: 'check_circle', title: '', desc: '' }],
    });
  };

  const removeFeatureRow = (index) => {
    if (formData.features.length <= 1) return;
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      category: [formData.category],
      sortOrder: Number(formData.sortOrder) || 0,
    };

    try {
      if (editingService) {
        const res = await api.put(`/admin/services/${editingService._id}`, payload);
        if (res.success) {
          setServices((prev) =>
            prev.map((s) => (s._id === editingService._id ? res.data : s))
          );
          setIsModalOpen(false);
          notifyContentUpdated({ resource: 'service', id: editingService._id, action: 'update' });
          showToast(`Service "${res.data.title}" updated successfully!`);
        }
      } else {
        const res = await api.post('/admin/services', payload);
        if (res.success) {
          setServices((prev) => [res.data, ...prev]);
          setIsModalOpen(false);
          notifyContentUpdated({ resource: 'service', id: res.data._id, action: 'create' });
          showToast(`Service "${res.data.title}" created successfully!`);
        }
      }
    } catch (err) {
      showToast('Failed to save service: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePageHeaders = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await Promise.all([
        // 1. Services Hero Overview
        api.put('/admin/content-blocks/services_hero', {
          section: 'services',
          title: pageHero.title,
          subtitle: pageHero.subtitle,
          body: pageHero.body,
          badge: pageHero.badge,
          metadata: {
            complianceSubtext: pageHero.complianceSubtext,
            stat1Title: pageHero.stat1Title,
            stat1Value: pageHero.stat1Value,
            stat1Subtitle: pageHero.stat1Subtitle,
            stat2Title: pageHero.stat2Title,
            stat2Value: pageHero.stat2Value,
          },
        }),

        // 2. Insurance Header
        api.put('/admin/content-blocks/services_insurance_header', {
          section: 'services',
          title: insuranceHeader.title,
          subtitle: insuranceHeader.subtitle,
          body: insuranceHeader.body,
        }),

        // 3. Laboratory Precision
        api.put('/admin/content-blocks/services_lab_precision', {
          section: 'services',
          title: labPrecision.title,
          subtitle: labPrecision.subtitle,
          body: labPrecision.body,
          metadata: {
            metric1Label: labPrecision.metric1Label,
            metric1Value: labPrecision.metric1Value,
            metric2Label: labPrecision.metric2Label,
            metric2Value: labPrecision.metric2Value,
            metric3Label: labPrecision.metric3Label,
            metric3Value: labPrecision.metric3Value,
            chartTitle: labPrecision.chartTitle,
            chartSubtitle: labPrecision.chartSubtitle,
            chartBadge: labPrecision.chartBadge,
          },
        }),

        // 4. CTA Banner
        api.put('/admin/content-blocks/services_cta_banner', {
          section: 'services',
          title: ctaBanner.title,
          subtitle: ctaBanner.subtitle,
          body: ctaBanner.body,
          metadata: {
            buttonText: ctaBanner.buttonText,
          },
        }),
      ]);

      notifyContentUpdated({ resource: 'services_page_headers' });
      showToast('Services page headers and laboratory metrics saved & live synced!');
    } catch (err) {
      console.error('Failed to save headers:', err);
      showToast('Failed to save page headers: ' + (err.message || 'Error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      !searchQuery ||
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.protocolNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.badgeText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      categoryFilter === 'all' ||
      (Array.isArray(s.category) ? s.category.includes(categoryFilter) : s.category === categoryFilter);

    return matchesSearch && matchesCat;
  });

  const publishedCount = services.filter((s) => s.isPublished !== false).length;

  return (
    <div className="space-y-6 max-w-6xl pb-12">
      {/* Toast Alert */}
      {feedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all animate-in fade-in slide-in-from-top-4 ${
            feedback.type === 'error' ? 'bg-error text-on-error' : 'bg-primary text-on-primary'
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
            <span className="material-symbols-outlined text-[16px] text-kvb-gold">verified</span>
            <span>KVB Clinical Protocols &amp; Services CMS</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Clinical Services &amp; Protocols
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Manage live clinical service protocols, diagnostic steps, statutory compliance badges, and page headers on the public Services portal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchServicesAndHeaders}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">sync</span>
            <span>Refresh</span>
          </button>
          {activeMainTab === 'catalog' && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Protocol</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
        <button
          type="button"
          onClick={() => setActiveMainTab('catalog')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label-md font-bold text-sm transition-all cursor-pointer ${
            activeMainTab === 'catalog'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">medical_services</span>
          <span>1. Clinical Services Catalog ({services.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('page_headers')}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-label-md font-bold text-sm transition-all cursor-pointer ${
            activeMainTab === 'page_headers'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>2. Services Page Headers &amp; Lab Metrics</span>
        </button>
      </div>

      {/* TAB 1: SERVICES CATALOG */}
      {activeMainTab === 'catalog' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                Total Protocols
              </span>
              <span className="font-headline-lg font-bold text-primary">{services.length}</span>
            </div>
            <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                Published Live
              </span>
              <span className="font-headline-lg font-bold text-[#16a34a]">{publishedCount}</span>
            </div>
            <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                Disciplines
              </span>
              <span className="font-headline-lg font-bold text-secondary">
                {CATEGORY_OPTIONS.length}
              </span>
            </div>
            <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline shadow-sm">
              <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider block">
                Real-Time Sync
              </span>
              <span className="font-headline-lg font-bold text-primary flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-ping inline-block"></span>
                Active
              </span>
            </div>
          </div>

          {/* Search & Category Pills */}
          <div className="bg-surface-clinical p-4 rounded-xl border border-border-hairline flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocols, badges, keywords..."
                className="w-full pl-10 pr-4 py-2 bg-surface-subtle border border-border-hairline rounded-lg text-body-sm focus:outline-none focus:border-primary focus:bg-surface-clinical"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All Disciplines ({services.length})
              </button>
              {CATEGORY_OPTIONS.map((opt) => {
                const count = services.filter((s) =>
                  Array.isArray(s.category) ? s.category.includes(opt.value) : s.category === opt.value
                ).length;
                const isActive = categoryFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategoryFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {opt.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Services List Cards */}
          {loading ? (
            <div className="py-20 text-center text-on-surface-variant space-y-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="font-label-md font-semibold">Loading clinical services catalog...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-16 text-center text-on-surface-variant bg-surface-clinical rounded-2xl border border-dashed border-border-hairline space-y-3">
              <span className="material-symbols-outlined text-[48px] text-outline">
                medical_information
              </span>
              <p className="font-headline-sm font-bold text-on-surface">No clinical protocols found</p>
              <p className="text-body-sm text-on-surface-variant max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all'
                  ? 'Try clearing your search query or discipline filter.'
                  : 'Get started by creating your first clinical service protocol.'}
              </p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Create First Protocol</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv._id}
                  className={`bg-surface-clinical rounded-2xl p-6 shadow-sm border flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between transition-all hover:shadow-md ${
                    srv.isPublished === false ? 'opacity-70 bg-surface-subtle' : 'border-border-hairline'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1 min-w-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-border-hairline shadow-inner">
                      <img
                        src={srv.image || DEFAULT_IMAGE}
                        alt={srv.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-tinted text-primary font-mono text-xs font-bold uppercase">
                          {srv.protocolNumber || 'Protocol'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-subtle text-secondary text-xs font-semibold">
                          {srv.badgeText || 'Clinical'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface-subtle text-on-surface-variant text-xs font-medium">
                          {srv.statusTag || 'KVB Accredited'}
                        </span>
                      </div>

                      <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
                        {srv.title || srv.name}
                      </h3>

                      <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-outline pt-1">
                        <span className="font-semibold text-primary">
                          {Array.isArray(srv.features) ? `${srv.features.length} diagnostic steps` : ''}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-sm">{srv.compliance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap sm:flex-col lg:flex-row items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(srv)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                        srv.isPublished !== false
                          ? 'bg-[#16a34a]/10 text-[#16a34a] hover:bg-[#16a34a]/20'
                          : 'bg-surface-subtle text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          srv.isPublished !== false ? 'bg-[#16a34a]' : 'bg-outline'
                        }`}
                      ></span>
                      <span>{srv.isPublished !== false ? 'Published' : 'Draft'}</span>
                    </button>

                    <a
                      href={`/services/${srv.slug || srv._id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-secondary hover:bg-surface-tinted transition-colors cursor-pointer"
                      title="Preview public protocol page"
                    >
                      <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(srv)}
                      className="p-2 rounded-lg text-primary hover:bg-surface-tinted transition-colors cursor-pointer"
                      title="Edit Service Protocol"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(srv._id, srv.title || srv.name)}
                      className="p-2 rounded-lg text-error hover:bg-error-container/40 transition-colors cursor-pointer"
                      title="Delete Service Protocol"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SERVICES PAGE HEADERS & METRICS */}
      {activeMainTab === 'page_headers' && (
        <form onSubmit={handleSavePageHeaders} className="space-y-6">
          {/* Hero Overview */}
          <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
              <span className="material-symbols-outlined text-primary text-[22px]">flag</span>
              <h2 className="font-headline-md font-bold text-on-surface">1. Services Page Hero &amp; Overview</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Top Status Pill
                </label>
                <input
                  type="text"
                  value={pageHero.badge}
                  onChange={(e) => setPageHero({ ...pageHero, badge: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Compliance Subtext
                </label>
                <input
                  type="text"
                  value={pageHero.complianceSubtext}
                  onChange={(e) => setPageHero({ ...pageHero, complianceSubtext: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Hero Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={pageHero.subtitle}
                  onChange={(e) => setPageHero({ ...pageHero, subtitle: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Main Page Headline
                </label>
                <input
                  type="text"
                  value={pageHero.title}
                  onChange={(e) => setPageHero({ ...pageHero, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Page Intro Body Description
                </label>
                <textarea
                  rows="3"
                  value={pageHero.body}
                  onChange={(e) => setPageHero({ ...pageHero, body: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Stat 1 */}
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Dispatch Stat 1 Title
                </label>
                <input
                  type="text"
                  value={pageHero.stat1Title}
                  onChange={(e) => setPageHero({ ...pageHero, stat1Title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                    Stat 1 Value
                  </label>
                  <input
                    type="text"
                    value={pageHero.stat1Value}
                    onChange={(e) => setPageHero({ ...pageHero, stat1Value: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-primary focus:bg-surface-clinical focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                    Stat 1 Region
                  </label>
                  <input
                    type="text"
                    value={pageHero.stat1Subtitle}
                    onChange={(e) => setPageHero({ ...pageHero, stat1Subtitle: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Diagnostic Stat 2 Title
                </label>
                <input
                  type="text"
                  value={pageHero.stat2Title}
                  onChange={(e) => setPageHero({ ...pageHero, stat2Title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Stat 2 Value
                </label>
                <input
                  type="text"
                  value={pageHero.stat2Value}
                  onChange={(e) => setPageHero({ ...pageHero, stat2Value: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-secondary focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Insurance Section Header */}
          <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
              <span className="material-symbols-outlined text-primary text-[22px]">shield</span>
              <h2 className="font-headline-md font-bold text-on-surface">2. Animal Insurance &amp; Health Retainers Header</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Eyebrow Subtitle
                </label>
                <input
                  type="text"
                  value={insuranceHeader.subtitle}
                  onChange={(e) => setInsuranceHeader({ ...insuranceHeader, subtitle: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={insuranceHeader.title}
                  onChange={(e) => setInsuranceHeader({ ...insuranceHeader, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Section Description Copy
                </label>
                <textarea
                  rows="2"
                  value={insuranceHeader.body}
                  onChange={(e) => setInsuranceHeader({ ...insuranceHeader, body: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Laboratory Precision & Diagnostics */}
          <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
              <span className="material-symbols-outlined text-primary text-[22px]">biotech</span>
              <h2 className="font-headline-md font-bold text-on-surface">3. Diagnostic Precision &amp; Laboratory Metrics</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Eyebrow Subtitle
                </label>
                <input
                  type="text"
                  value={labPrecision.subtitle}
                  onChange={(e) => setLabPrecision({ ...labPrecision, subtitle: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={labPrecision.title}
                  onChange={(e) => setLabPrecision({ ...labPrecision, title: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Laboratory Scope Description
                </label>
                <textarea
                  rows="3"
                  value={labPrecision.body}
                  onChange={(e) => setLabPrecision({ ...labPrecision, body: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Progress metric 1 */}
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 1 (FTAI Conception Rate)
                </label>
                <input
                  type="text"
                  value={labPrecision.metric1Label}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric1Label: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 1 Value
                </label>
                <input
                  type="text"
                  value={labPrecision.metric1Value}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric1Value: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-primary focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              {/* Progress metric 2 */}
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 2 (Mastitis Recovery)
                </label>
                <input
                  type="text"
                  value={labPrecision.metric2Label}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric2Label: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 2 Value
                </label>
                <input
                  type="text"
                  value={labPrecision.metric2Value}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric2Value: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-secondary focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>

              {/* Progress metric 3 */}
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 3 (Vaccine Cold Chain Score)
                </label>
                <input
                  type="text"
                  value={labPrecision.metric3Label}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric3Label: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Metric 3 Value
                </label>
                <input
                  type="text"
                  value={labPrecision.metric3Value}
                  onChange={(e) => setLabPrecision({ ...labPrecision, metric3Value: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-primary focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
              <span className="material-symbols-outlined text-primary text-[22px]">campaign</span>
              <h2 className="font-headline-md font-bold text-on-surface">4. Bottom Call-To-Action Banner</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Banner Eyebrow Tag
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
                  Banner Description
                </label>
                <textarea
                  rows="2"
                  value={ctaBanner.body}
                  onChange={(e) => setCtaBanner({ ...ctaBanner, body: e.target.value })}
                  className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block font-label-md text-on-surface font-semibold mb-1 text-xs uppercase">
                  Booking Action Button Text
                </label>
                <input
                  type="text"
                  value={ctaBanner.buttonText}
                  onChange={(e) => setCtaBanner({ ...ctaBanner, buttonText: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border-hairline">
            <button
              type="submit"
              disabled={saving}
              className="px-8 h-12 rounded-full bg-primary text-on-primary font-label-lg font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">
                {saving ? 'sync' : 'save'}
              </span>
              <span>{saving ? 'Saving...' : 'Publish Services Page Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8 border border-border-hairline my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-hairline mb-6">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {editingService ? `Edit ${editingService.title}` : 'Add New Clinical Service Protocol'}
                </h2>
                <p className="text-body-sm text-on-surface-variant">
                  This protocol will update immediately on the public Services page and protocol details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-tinted cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Protocol Tag / Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.protocolNumber}
                    onChange={(e) => setFormData({ ...formData, protocolNumber: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-mono focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="Service Protocol 01"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Discipline Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. Disease Control &amp; Prophylactic Treatment"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={formData.badgeText}
                    onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="Prophylaxis &amp; Isolation"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Badge Icon (Material Icon)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeIcon}
                    onChange={(e) => setFormData({ ...formData, badgeIcon: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-mono focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="e.g. public, vaccines, medical_services"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Status Tag (Header Right)
                  </label>
                  <input
                    type="text"
                    value={formData.statusTag}
                    onChange={(e) => setFormData({ ...formData, statusTag: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="Certified Cold-Chain Biologics"
                  />
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Booking Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.bookingCTA}
                    onChange={(e) => setFormData({ ...formData, bookingCTA: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="Schedule Clinical Triage"
                  />
                </div>

                {/* Service Image with File Upload */}
                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Protocol Illustration Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container shrink-0 border border-border-hairline">
                      <img
                        src={formData.image || DEFAULT_IMAGE}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="flex-1 h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none w-full"
                      placeholder="https://... or upload photo"
                    />
                    <label
                      htmlFor={fileInputId}
                      className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-semibold cursor-pointer border border-border-hairline whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {uploadingImage ? 'sync' : 'upload_file'}
                      </span>
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        id={fileInputId}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingImage}
                        onChange={handleImageFileUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Protocol Comprehensive Description *
                  </label>
                  <textarea
                    rows="4"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none leading-relaxed"
                    placeholder="Detail the veterinary scope, procedures, disease targets, and clinical rigor..."
                  ></textarea>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Compliance &amp; Statutory Certification Note
                  </label>
                  <input
                    type="text"
                    value={formData.compliance}
                    onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary focus:outline-none"
                    placeholder="Full Veterinary Movement Permits (VMP) Documentation"
                  />
                </div>
              </div>

              {/* Sub-features / Diagnostic Steps */}
              <div className="pt-4 border-t border-border-hairline space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-headline-sm text-headline-sm font-bold text-on-surface text-sm">
                    Diagnostic Steps &amp; Sub-Protocol Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeatureRow}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span> Add Step
                  </button>
                </div>

                {formData.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-surface-subtle rounded-xl border border-border-hairline grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                  >
                    <div className="sm:col-span-3">
                      <input
                        type="text"
                        value={feat.icon}
                        onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                        placeholder="Icon (e.g. biotech)"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-mono focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={feat.title}
                        onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                        placeholder="Step Title"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs font-semibold focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={feat.desc}
                        onChange={(e) => handleFeatureChange(idx, 'desc', e.target.value)}
                        placeholder="Step Description"
                        className="w-full h-9 px-2.5 rounded-lg bg-surface-clinical border border-border-hairline text-xs focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeFeatureRow(idx)}
                        className="text-error hover:text-red-700 p-1 cursor-pointer"
                        title="Remove Step"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status & Ordering */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-hairline">
                <label className="flex items-center gap-2 cursor-pointer font-label-md font-semibold text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-primary cursor-pointer"
                  />
                  <span>Published on Live Portal</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="font-label-md font-semibold text-on-surface-variant text-xs">
                    Sort Order:
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    className="w-20 h-9 px-3 rounded-lg bg-surface-subtle border border-border-hairline text-body-sm text-center focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold hover:bg-surface-subtle transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingService ? 'Update Protocol' : 'Create Protocol'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
