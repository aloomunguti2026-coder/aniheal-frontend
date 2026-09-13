import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';

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
        setSettings((prev) => ({ ...prev, ...res.data }));
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
