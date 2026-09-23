import React, { useState, useEffect } from 'react';
import insuranceService from '../../services/insuranceService';
import { useConfirm } from '../../context/ConfirmContext';

export default function AdminInsurance() {
  const { confirm, alert: showAlert } = useConfirm();
  const [plans, setPlans] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Plan editor state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    targetSpecies: ['dairy_cattle', 'canine'],
    speciesPricing: [
      { species: 'dairy_cattle', monthlyPremium: 2500, annualPremium: 28000, coverageLimit: 200000, deductible: 1500 },
      { species: 'canine', monthlyPremium: 1200, annualPremium: 13500, coverageLimit: 80000, deductible: 800 },
    ],
    coverageDetails: '',
    exclusions: '',
    waitingPeriodDays: 14,
    basePrice: 28000,
    isActive: true,
    isPopular: false,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const speciesList = [
    { id: 'dairy_cattle', label: 'Dairy Cattle' },
    { id: 'beef_cattle', label: 'Beef Cattle' },
    { id: 'canine', label: 'Canines / Dogs' },
    { id: 'feline', label: 'Felines / Cats' },
    { id: 'equine', label: 'Equine / Horses' },
    { id: 'small_ruminants', label: 'Goats & Sheep' },
    { id: 'poultry', label: 'Commercial Poultry' },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [plansRes, analyticsRes] = await Promise.all([
        insuranceService.getPlansAdmin(),
        insuranceService.getInsuranceAnalytics(),
      ]);

      if (plansRes.success) setPlans(plansRes.data || []);
      if (analyticsRes.success) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load insurance plans and revenue telemetry.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormError('');
    setFormData({
      name: '',
      code: `SHIELD-${Math.floor(100 + Math.random() * 900)}`,
      description: '',
      targetSpecies: ['dairy_cattle', 'canine'],
      speciesPricing: [
        { species: 'dairy_cattle', monthlyPremium: 2500, annualPremium: 28000, coverageLimit: 200000, deductible: 1500 },
        { species: 'canine', monthlyPremium: 1200, annualPremium: 13500, coverageLimit: 80000, deductible: 800 },
      ],
      coverageDetails: 'Emergency Surgery & Field Anesthesia\nAnnual Core Vaccinations\nZero Ambulatory Callout Fees',
      exclusions: 'Pre-existing chronic genetic conditions',
      waitingPeriodDays: 14,
      basePrice: 28000,
      isActive: true,
      isPopular: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormError('');
    setFormData({
      name: plan.name || '',
      code: plan.code || '',
      description: plan.description || '',
      targetSpecies: plan.targetSpecies || ['dairy_cattle'],
      speciesPricing: plan.speciesPricing || [],
      coverageDetails: plan.coverageDetails ? plan.coverageDetails.join('\n') : '',
      exclusions: plan.exclusions ? plan.exclusions.join('\n') : '',
      waitingPeriodDays: plan.waitingPeriodDays ?? 14,
      basePrice: plan.basePrice ?? 28000,
      isActive: plan.isActive !== false,
      isPopular: Boolean(plan.isPopular),
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (plan) => {
    try {
      const res = await insuranceService.togglePlanStatus(plan._id, !plan.isActive);
      if (res.success) {
        setPlans(plans.map((p) => (p._id === plan._id ? { ...p, isActive: !p.isActive } : p)));
      }
    } catch (err) {
      await showAlert({
        title: 'Status Update Failed',
        message: err.message || 'Failed to toggle plan status',
        type: 'error',
      });
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirm({
      title: 'Delete Insurance Plan',
      message: name
        ? `Are you sure you want to permanently delete plan tier "${name}"?`
        : 'Are you sure you want to delete this insurance plan tier?',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel',
      type: 'danger',
    });

    if (!isConfirmed) return;

    try {
      const res = await insuranceService.deletePlan(id);
      if (res.success) {
        setPlans(plans.filter((p) => p._id !== id));
      }
    } catch (err) {
      await showAlert({
        title: 'Action Failed',
        message: err.message || 'Failed to delete plan',
        type: 'error',
      });
    }
  };

  const handleSpeciesPriceChange = (index, field, value) => {
    const updated = [...formData.speciesPricing];
    updated[index] = { ...updated[index], [field]: Number(value) || 0 };
    setFormData({ ...formData, speciesPricing: updated });
  };

  const handleAddSpeciesPricing = (speciesKey) => {
    if (formData.speciesPricing.some((sp) => sp.species === speciesKey)) return;
    setFormData({
      ...formData,
      speciesPricing: [
        ...formData.speciesPricing,
        { species: speciesKey, monthlyPremium: 1500, annualPremium: 16000, coverageLimit: 100000, deductible: 1000 },
      ],
    });
  };

  const handleRemoveSpeciesPricing = (index) => {
    setFormData({
      ...formData,
      speciesPricing: formData.speciesPricing.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.description) {
      setFormError('Please provide plan name, code, and description.');
      return;
    }

    try {
      setSaving(true);
      setFormError('');

      const payload = {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
        description: formData.description,
        targetSpecies: formData.speciesPricing.map((sp) => sp.species),
        speciesPricing: formData.speciesPricing,
        coverageDetails: formData.coverageDetails
          ? formData.coverageDetails.split('\n').map((c) => c.trim()).filter(Boolean)
          : [],
        exclusions: formData.exclusions
          ? formData.exclusions.split('\n').map((e) => e.trim()).filter(Boolean)
          : [],
        waitingPeriodDays: Number(formData.waitingPeriodDays) || 14,
        basePrice: Number(formData.basePrice) || 0,
        isActive: formData.isActive,
        isPopular: formData.isPopular,
      };

      let res;
      if (editingPlan) {
        res = await insuranceService.updatePlan(editingPlan._id, payload);
      } else {
        res = await insuranceService.createPlan(payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchData();
      } else {
        setFormError(res.message || 'Failed to save plan.');
      }
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Error saving insurance plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">Animal Insurance &amp; Subscription Plans</h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Configure pet and livestock insurance coverage limits, species pricing, and platform subscription revenue.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Create Insurance Plan</span>
        </button>
      </div>

      {/* Insurance Revenue Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Active Policies</span>
            <span className="material-symbols-outlined text-primary text-[24px]">health_and_safety</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-primary">
            {analytics?.activePoliciesCount || 0}
          </div>
          <p className="text-label-sm text-on-surface-variant">Underwritten live policies</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Enrolled Animals</span>
            <span className="material-symbols-outlined text-secondary text-[24px]">pets</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            {analytics?.totalSubscribersCount || 0}
          </div>
          <p className="text-label-sm text-on-surface-variant">Insured dairy cows, dogs &amp; equine</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Annual Premium Volume</span>
            <span className="material-symbols-outlined text-primary text-[24px]">account_balance_wallet</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-primary">
            KES {Number(analytics?.totalPremiumRevenue || 0).toLocaleString()}
          </div>
          <p className="text-label-sm text-secondary font-medium">Underwritten underwriting volume</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Plan Schemes</span>
            <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">{plans.length}</div>
          <p className="text-label-sm text-on-surface-variant">{plans.filter((p) => p.isActive).length} active tiers</p>
        </div>
      </div>

      {/* Plans List Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium bg-surface-clinical rounded-2xl border border-error/20">
            {error}
          </div>
        ) : plans.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant bg-surface-clinical rounded-2xl border border-border-hairline">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">shield</span>
            <p className="font-bold">No Insurance Plans Configured</p>
            <p className="text-sm">Click "Create Insurance Plan" to set up species pricing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="bg-surface-clinical rounded-2xl border border-border-hairline p-6 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Plan Top */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-secondary text-sm">{plan.code}</span>
                        {plan.isPopular && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-xl font-bold text-on-surface mt-1">{plan.name}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">{plan.description}</p>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(plan)}
                      className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                        plan.isActive
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Species Pricing Matrix */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase text-outline tracking-wider">
                      Species Pricing &amp; Coverage Limits
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {plan.speciesPricing?.map((sp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-surface-tinted/40 border border-border-hairline text-xs space-y-1">
                          <div className="font-bold text-on-surface uppercase flex items-center justify-between">
                            <span>{sp.species?.replace('_', ' ')}</span>
                            <span className="text-primary font-mono">KES {sp.monthlyPremium?.toLocaleString()} / mo</span>
                          </div>
                          <div className="text-on-surface-variant flex justify-between">
                            <span>Annual: KES {sp.annualPremium?.toLocaleString()}</span>
                            <span>Limit: KES {sp.coverageLimit?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coverage details */}
                  {plan.coverageDetails && plan.coverageDetails.length > 0 && (
                    <div className="text-xs space-y-1 text-on-surface-variant">
                      <span className="font-bold text-outline uppercase tracking-wider">Included Interventions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.coverageDetails.map((cov, ci) => (
                          <span key={ci} className="px-2 py-0.5 rounded-md bg-surface-tinted text-on-surface font-medium">
                            &bull; {cov}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border-hairline flex items-center justify-between">
                  <div className="text-xs text-outline font-medium">
                    Waiting Period: <strong>{plan.waitingPeriodDays || 14} days</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(plan)}
                      className="px-3 py-1.5 rounded-xl bg-surface-tinted text-primary text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                      <span>Edit Plan</span>
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-1.5 rounded-xl text-error hover:bg-error-container/30 transition-colors"
                      title="Delete Plan"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Plan Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-2xl w-full border border-border-hairline shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between shrink-0">
              <h3 className="font-headline-sm text-xl font-bold">
                {editingPlan ? 'Edit Insurance Plan' : 'Create Insurance Plan'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Plan Scheme Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AniHeal Comprehensive Dairy Shield"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Plan Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ANH-SHIELD-01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Plan Description *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              {/* Species Pricing Matrix Editor */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm font-bold uppercase tracking-wider text-primary">
                    Species Pricing &amp; Limit Matrix
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddSpeciesPricing(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="px-2.5 py-1 bg-surface-tinted rounded-lg text-xs font-bold text-primary border border-border-hairline focus:outline-none"
                  >
                    <option value="">+ Add Animal Category</option>
                    {speciesList.map((sp) => (
                      <option key={sp.id} value={sp.id}>{sp.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  {formData.speciesPricing.map((sp, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-surface-tinted/30 border border-border-hairline space-y-2">
                      <div className="flex items-center justify-between font-bold text-xs uppercase text-on-surface">
                        <span>{sp.species.replace('_', ' ')}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSpeciesPricing(idx)}
                          className="text-error hover:text-error/80 text-[11px] font-bold"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-outline uppercase font-semibold">Monthly (KES)</label>
                          <input
                            type="number"
                            value={sp.monthlyPremium}
                            onChange={(e) => handleSpeciesPriceChange(idx, 'monthlyPremium', e.target.value)}
                            className="w-full px-2 py-1 bg-surface rounded-lg border border-border-hairline font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-outline uppercase font-semibold">Annual (KES)</label>
                          <input
                            type="number"
                            value={sp.annualPremium}
                            onChange={(e) => handleSpeciesPriceChange(idx, 'annualPremium', e.target.value)}
                            className="w-full px-2 py-1 bg-surface rounded-lg border border-border-hairline font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-outline uppercase font-semibold">Claim Limit (KES)</label>
                          <input
                            type="number"
                            value={sp.coverageLimit}
                            onChange={(e) => handleSpeciesPriceChange(idx, 'coverageLimit', e.target.value)}
                            className="w-full px-2 py-1 bg-surface rounded-lg border border-border-hairline font-bold text-primary"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-outline uppercase font-semibold">Deductible (KES)</label>
                          <input
                            type="number"
                            value={sp.deductible}
                            onChange={(e) => handleSpeciesPriceChange(idx, 'deductible', e.target.value)}
                            className="w-full px-2 py-1 bg-surface rounded-lg border border-border-hairline font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">
                  Coverage Details (One benefit per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Emergency Field Surgery&#10;Full Prophylaxis &amp; Vaccination&#10;Zero Ambulatory Callout Fees"
                  value={formData.coverageDetails}
                  onChange={(e) => setFormData({ ...formData, coverageDetails: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary font-mono"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="font-label-md text-sm font-semibold">Active for Public Enrollment</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="rounded text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="font-label-md text-sm font-semibold">Highlight as Most Popular</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-on-surface-variant font-label-md font-semibold hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
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
