import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { notifyContentUpdated } from '../../services/eventBus';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminPricing() {
  const { confirm, alert: showAlert } = useConfirm();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 8500,
    currency: 'KES',
    billingPeriod: '/ month',
    billingNote: '',
    description: '',
    featuresText: '',
    isPopular: false,
    isEmergency: false,
    ctaText: 'Subscribe to Plan',
    ctaLink: '/appointment-booking',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/pricing-plans');
      if (res.success) {
        setPlans(res.data);
      }
    } catch (err) {
      console.error('Failed to load pricing plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      category: 'Farm Plan',
      price: 10000,
      currency: 'KES',
      billingPeriod: '/ month',
      billingNote: 'Billed monthly',
      description: 'Comprehensive veterinary herd coverage.',
      featuresText: 'Monthly herd health audits\nVaccination oversight\nDirect WhatsApp vet support',
      isPopular: false,
      isEmergency: false,
      ctaText: 'Enroll in Plan',
      ctaLink: '/appointment-booking',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || '',
      category: plan.category || '',
      price: plan.price || 0,
      currency: plan.currency || 'KES',
      billingPeriod: plan.billingPeriod || '/ month',
      billingNote: plan.billingNote || '',
      description: plan.description || '',
      featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      isPopular: !!plan.isPopular,
      isEmergency: !!plan.isEmergency,
      ctaText: plan.ctaText || 'Subscribe',
      ctaLink: plan.ctaLink || '/appointment-booking',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirm({
      title: 'Delete Pricing Plan',
      message: `Are you sure you want to permanently delete pricing tier "${name}"?`,
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await api.delete(`/admin/pricing-plans/${id}`);
      if (res.success) {
        setPlans((prev) => prev.filter((p) => p._id !== id));
        notifyContentUpdated();
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: 'Failed to delete pricing plan: ' + err.message,
        type: 'error',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      features: formData.featuresText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (editingPlan) {
        const res = await api.put(`/admin/pricing-plans/${editingPlan._id}`, payload);
        if (res.success) {
          setPlans((prev) =>
            prev.map((p) => (p._id === editingPlan._id ? res.data : p))
          );
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      } else {
        const res = await api.post('/admin/pricing-plans', payload);
        if (res.success) {
          setPlans((prev) => [...prev, res.data]);
          setIsModalOpen(false);
          notifyContentUpdated();
        }
      }
    } catch (err) {
      await showAlert({
        title: 'Save Failed',
        message: 'Failed to save pricing plan: ' + err.message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">
            Retainer Pricing &amp; Service Tiers
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage clinical subscription packages, monthly rates, and emergency callout pricing.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-sm hover:bg-primary-container transition-all cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Add Pricing Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            Loading pricing plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-on-surface-variant">
            No pricing plans configured.
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-surface-clinical rounded-2xl p-6 shadow-sm border flex flex-col justify-between relative ${
                plan.isPopular
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-border-hairline'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-bold uppercase">
                  Most Recommended
                </span>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-subtle text-on-surface font-label-sm text-label-sm font-semibold uppercase">
                    {plan.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="p-1 rounded text-primary hover:bg-surface-tinted"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id, plan.name)}
                      className="p-1 rounded text-error hover:bg-error-container/40"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1">
                  {plan.name}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                  {plan.description}
                </p>

                <div className="p-4 rounded-xl bg-surface-tinted/60 border border-border-hairline mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="font-display-lg text-headline-xl font-bold text-primary">
                      {plan.currency} {plan.price?.toLocaleString()}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {plan.billingPeriod}
                    </span>
                  </div>
                  {plan.billingNote && (
                    <span className="font-label-sm text-label-sm text-secondary block mt-0.5 font-medium">
                      {plan.billingNote}
                    </span>
                  )}
                </div>

                <ul className="space-y-2 text-body-sm text-on-surface-variant mb-6">
                  {plan.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-[18px] mt-0.5 shrink-0">
                        check_circle
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border-hairline flex items-center justify-between text-xs text-outline">
                <span>CTA: {plan.ctaText}</span>
                <span>Link: {plan.ctaLink}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-clinical rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border-hairline mb-4">
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                {editingPlan ? 'Edit Retainer Plan' : 'Create Retainer Plan'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-tinted"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                  placeholder="e.g. Commercial Dairy Protocol"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Commercial Production"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md font-bold focus:bg-surface-clinical focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Billing Period
                  </label>
                  <input
                    type="text"
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="/ month"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                    Billing Sub-Note
                  </label>
                  <input
                    type="text"
                    value={formData.billingNote}
                    onChange={(e) => setFormData({ ...formData, billingNote: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                    placeholder="Billed quarterly"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface font-semibold mb-1">
                  Features Checklist (One per line)
                </label>
                <textarea
                  rows="4"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-surface-subtle border border-border-hairline text-body-md focus:bg-surface-clinical focus:border-primary font-mono text-xs"
                  placeholder="Monthly herd health audits&#10;Vaccination oversight&#10;Direct WhatsApp vet support"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-label-md text-label-md text-on-surface">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 rounded text-primary"
                  />
                  <span>Mark as "Most Recommended" Highlight</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-full bg-primary text-on-primary font-bold shadow-sm hover:bg-primary-container"
                >
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
