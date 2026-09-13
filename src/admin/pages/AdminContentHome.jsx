import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

export default function AdminContentHome() {
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroBody, setHeroBody] = useState('');
  const [heroBadge, setHeroBadge] = useState('');
  const [missionText, setMissionText] = useState('');
  const [visionText, setVisionText] = useState('');
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaBody, setCtaBody] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await api.get('/public/content/homepage');
      if (res.success && res.data?.byKey) {
        const byKey = res.data.byKey;
        if (byKey.home_hero) {
          setHeroTitle(byKey.home_hero.title || '');
          setHeroSubtitle(byKey.home_hero.subtitle || '');
          setHeroBody(byKey.home_hero.body || '');
          setHeroBadge(byKey.home_hero.badge || '');
        }
        if (byKey.home_mission_vision?.metadata) {
          setMissionText(byKey.home_mission_vision.metadata.mission || '');
          setVisionText(byKey.home_mission_vision.metadata.vision || '');
        }
        if (byKey.home_cta_banner) {
          setCtaTitle(byKey.home_cta_banner.title || '');
          setCtaBody(byKey.home_cta_banner.body || '');
        }
      }
    } catch (err) {
      console.error('Failed to load homepage content blocks:', err);
    }
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    try {
      await Promise.all([
        api.put('/admin/content-blocks/home_hero', {
          section: 'homepage',
          title: heroTitle,
          subtitle: heroSubtitle,
          body: heroBody,
          badge: heroBadge,
        }),
        api.put('/admin/content-blocks/home_mission_vision', {
          section: 'homepage',
          title: 'Purpose & Vision',
          metadata: {
            mission: missionText,
            vision: visionText,
          },
        }),
        api.put('/admin/content-blocks/home_cta_banner', {
          section: 'homepage',
          title: ctaTitle,
          body: ctaBody,
        }),
      ]);

      setSavedMsg('Homepage content updated successfully! Live website will reflect changes immediately.');
      notifyContentUpdated();
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err) {
      alert('Failed to save changes: ' + (err.message || 'Error occurred'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Homepage Content Editor
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Update marketing headlines, mission/vision statements, and urgent response banners.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-surface-tinted border border-border-accent text-on-surface font-label-md text-label-md flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span className="font-bold text-primary">{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* 1. Hero Section Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-primary text-[22px]">hero</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              1. Hero Section
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Eyebrow Subtitle
              </label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="ACCREDITED KENYA VETERINARY CONSULTANCY"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Accreditation Badge Pill
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="KENYA VETERINARY BOARD ACCREDITED"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Main Hero Headline
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                placeholder="Professional Consultancy You Can Trust"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Hero Description Body Copy
              </label>
              <textarea
                rows="3"
                value={heroBody}
                onChange={(e) => setHeroBody(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="AniHeal veterinary consultancy works on providing sustainable animal related solutions..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* 2. Mission & Vision Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-secondary text-[22px]">target</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              2. Mission &amp; Vision Statements
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Our Mission
              </label>
              <textarea
                rows="3"
                value={missionText}
                onChange={(e) => setMissionText(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="To deliver long-lasting, affordable and sustainable animal health solutions..."
              ></textarea>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Our Vision
              </label>
              <textarea
                rows="2"
                value={visionText}
                onChange={(e) => setVisionText(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="A world where animal life matters, every farmer thrives and every community is protected."
              ></textarea>
            </div>
          </div>
        </div>

        {/* 3. CTA Banner Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-primary text-[22px]">campaign</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              3. Tele-Triage Call-To-Action Banner
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Banner Headline
              </label>
              <input
                type="text"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-semibold focus:bg-surface-clinical focus:border-primary"
                placeholder="Need Immediate Clinical Assistance on Your Farm?"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Banner Subtitle / Description
              </label>
              <textarea
                rows="2"
                value={ctaBody}
                onChange={(e) => setCtaBody(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                placeholder="Our field veterinary team provides real-time WhatsApp visual triage..."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 h-12 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold shadow-md hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Saving Content...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Publish All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
