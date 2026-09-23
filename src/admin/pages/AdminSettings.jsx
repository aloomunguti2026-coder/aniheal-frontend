import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import SocialIcon from '../../components/common/SocialIcon';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'AniHeal Veterinary Solutions',
    tagline: 'Veterinary Solutions',
    licenseNumber: 'KVB/PR/2025/0842',
    licenseDescription: '',
    primaryPhone: '+254 700 264 432',
    hotlinePhone: '+254 700 ANIHEAL',
    emergencyPhone: '+254 700 264 432',
    primaryEmail: 'clinical@aniheal.co.ke',
    infoEmail: 'info@aniheal.co.ke',
    careersEmail: 'careers@aniheal.co.ke',
    mpesaTill: '894022',
    mpesaTillName: 'AniHeal Agro-Vet Ltd',
    whatsappNumber: '254700264432',
    headquartersAddress: 'Veterinary Complex, Kabete Rd, Nairobi, Kenya',
    metaTitle: 'AniHeal Veterinary Solutions | KVB Accredited',
    metaDescription: '',
    notificationEmails: {
      triageAlertEmail: 'hello.aniheal@gmail.com',
      orderAlertEmail: 'hello.aniheal@gmail.com',
      insuranceAlertEmail: 'hello.aniheal@gmail.com',
    },
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      tiktok: '',
      whatsapp: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/settings');
      if (res.success && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          notificationEmails: {
            triageAlertEmail: 'hello.aniheal@gmail.com',
            orderAlertEmail: 'hello.aniheal@gmail.com',
            insuranceAlertEmail: 'hello.aniheal@gmail.com',
            ...(res.data.notificationEmails || {}),
          },
          socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            youtube: '',
            tiktok: '',
            whatsapp: '',
            ...(res.data.socialLinks || {}),
          },
        }));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationEmailChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notificationEmails: {
        ...(prev.notificationEmails || {}),
        [key]: value,
      },
    }));
  };

  const handleSocialChange = (platform, value) => {
    setSettings((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || {}),
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    try {
      const res = await api.put('/admin/settings', settings);
      if (res.success) {
        setSavedMsg('Settings updated successfully! Live website reflects new contact & licensing details.');
        notifyContentUpdated();
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch (err) {
      alert('Failed to save settings: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-on-surface-variant">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
          Website Settings &amp; Organization Profile
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Configure official regulatory registration, emergency hotlines, email routing, and M-Pesa billing channels.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-surface-tinted border border-border-accent text-on-surface font-label-md text-label-md flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span className="font-bold text-primary">{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Licensing & Registration Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-kvb-gold text-[24px]">verified</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              KVB Accreditation &amp; Corporate Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Enterprise Name *
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                KVB Practice License No *
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={settings.licenseNumber}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-primary focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Accreditation Disclaimer Notice
              </label>
              <textarea
                rows="2"
                name="licenseDescription"
                value={settings.licenseDescription}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Contact Channels & Hotlines Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-primary text-[24px]">phone_in_talk</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Emergency Hotlines &amp; Communications
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Animal Emergency Triage Hotline *
              </label>
              <input
                type="text"
                name="emergencyPhone"
                value={settings.emergencyPhone}
                onChange={handleChange}
                placeholder="+254 700 264 432"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold text-error focus:bg-surface-clinical focus:border-primary"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Dialed across triage banners &amp; emergency footers
              </span>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                24/7 Field Hotline Display
              </label>
              <input
                type="text"
                name="hotlinePhone"
                value={settings.hotlinePhone}
                onChange={handleChange}
                placeholder="+254 700 ANIHEAL"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-semibold text-on-surface focus:bg-surface-clinical focus:border-primary"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Branded vanity display number
              </span>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Direct Office Telephone
              </label>
              <input
                type="text"
                name="primaryPhone"
                value={settings.primaryPhone}
                onChange={handleChange}
                placeholder="+254 700 264 432"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
              <span className="text-[11px] text-outline mt-1 block">
                Official landline / HQ reception
              </span>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                WhatsApp Live Triage Number
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={handleChange}
                placeholder="254700264432"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-mono focus:bg-surface-clinical focus:border-primary"
              />
              <span className="text-[11px] text-outline mt-1 block">
                International format without '+' for wa.me links
              </span>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Clinical Email
              </label>
              <input
                type="email"
                name="primaryEmail"
                value={settings.primaryEmail}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                General Inquiries Email
              </label>
              <input
                type="email"
                name="infoEmail"
                value={settings.infoEmail}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Careers Email
              </label>
              <input
                type="email"
                name="careersEmail"
                value={settings.careersEmail}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                name="headquartersAddress"
                value={settings.headquartersAddress}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Internal Operations & Department Alert Emails Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">mark_email_unread</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Internal Department Alert Routing Emails
              </h2>
            </div>
            <span className="text-[12px] text-outline">
              Target destination inboxes for automated staff dispatches
            </span>
          </div>

          <p className="text-body-sm text-on-surface-variant">
            Set custom recipient email addresses for each department. By default, alerts route to the company official account (<strong>hello.aniheal@gmail.com</strong>).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* 1. Triage Alert Email */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline space-y-2">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Triage &amp; Clinical Alerts
                </span>
              </div>
              <label className="block text-[11px] text-on-surface-variant font-medium">
                Incoming field triage &amp; emergency cases
              </label>
              <input
                type="email"
                value={settings.notificationEmails?.triageAlertEmail || ''}
                onChange={(e) => handleNotificationEmailChange('triageAlertEmail', e.target.value)}
                placeholder="hello.aniheal@gmail.com"
                className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm font-medium focus:border-primary"
              />
              <span className="text-[10px] text-outline block">
                Dispatches urgent farmer tickets &amp; contact info
              </span>
            </div>

            {/* 2. Product Orders Alert Email */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[20px]">shopping_cart_checkout</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Store Orders &amp; Sales
                </span>
              </div>
              <label className="block text-[11px] text-on-surface-variant font-medium">
                Pharmacy fulfillment &amp; stock orders
              </label>
              <input
                type="email"
                value={settings.notificationEmails?.orderAlertEmail || ''}
                onChange={(e) => handleNotificationEmailChange('orderAlertEmail', e.target.value)}
                placeholder="hello.aniheal@gmail.com"
                className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm font-medium focus:border-primary"
              />
              <span className="text-[10px] text-outline block">
                Dispatches customer orders &amp; delivery destinations
              </span>
            </div>

            {/* 3. Insurance Alert Email */}
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-hairline space-y-2">
              <div className="flex items-center gap-2 text-primary-container">
                <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  Insurance Underwriting
                </span>
              </div>
              <label className="block text-[11px] text-on-surface-variant font-medium">
                Livestock cover enrollment applications
              </label>
              <input
                type="email"
                value={settings.notificationEmails?.insuranceAlertEmail || ''}
                onChange={(e) => handleNotificationEmailChange('insuranceAlertEmail', e.target.value)}
                placeholder="hello.aniheal@gmail.com"
                className="w-full h-10 px-3 rounded-lg bg-surface-clinical border border-border-hairline text-body-sm font-medium focus:border-primary"
              />
              <span className="text-[10px] text-outline block">
                Dispatches policy requests &amp; herd counts
              </span>
            </div>
          </div>
        </div>

        {/* Billing & M-Pesa Till Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border-hairline">
            <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              M-Pesa Buy Goods &amp; Settlements
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                M-Pesa Buy Goods Till Number
              </label>
              <input
                type="text"
                name="mpesaTill"
                value={settings.mpesaTill}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-mono font-bold focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                Official Account Name
              </label>
              <input
                type="text"
                name="mpesaTillName"
                value={settings.mpesaTillName}
                onChange={handleChange}
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-semibold focus:bg-surface-clinical focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Social Media & Online Channels Box */}
        <div className="bg-surface-clinical rounded-2xl p-6 shadow-sm border border-border-hairline space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-primary text-[24px]">share</span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Social Media Channels &amp; Public Profiles
              </h2>
            </div>
            <span className="text-[12px] text-outline">
              Used across Hero, Footer &amp; Contact Pages
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="facebook" className="w-3.5 h-3.5" />
                </span>
                <span>Facebook Page URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.facebook || ''}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="twitter" className="w-3 h-3" />
                </span>
                <span>Twitter / X Profile URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.twitter || ''}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="https://x.com/aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="instagram" className="w-3.5 h-3.5" />
                </span>
                <span>Instagram Profile URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="linkedin" className="w-3.5 h-3.5" />
                </span>
                <span>LinkedIn Organization URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="youtube" className="w-3.5 h-3.5" />
                </span>
                <span>YouTube Channel URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.youtube || ''}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="tiktok" className="w-3 h-3" />
                </span>
                <span>TikTok Profile URL</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.tiktok || ''}
                onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@aniheal"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold mb-1">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center p-0.5">
                  <SocialIcon platform="whatsapp" className="w-3.5 h-3.5" />
                </span>
                <span>WhatsApp Community / Direct Chat Link</span>
              </label>
              <input
                type="text"
                value={settings.socialLinks?.whatsapp || ''}
                onChange={(e) => handleSocialChange('whatsapp', e.target.value)}
                placeholder="https://wa.me/254700264432"
                className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
              />
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
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Save Website Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
