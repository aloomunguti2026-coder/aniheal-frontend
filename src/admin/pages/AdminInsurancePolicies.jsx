import React, { useState, useEffect } from 'react';
import insuranceService from '../../services/insuranceService';

export default function AdminInsurancePolicies() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'policies'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [activeTab, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      if (activeTab === 'subscriptions') {
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        const res = await insuranceService.getSubscriptions(params);
        if (res.success) setSubscriptions(res.data?.subscriptions || []);
      } else {
        const res = await insuranceService.getPolicies();
        if (res.success) setPolicies(res.data?.policies || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load insurance policies & applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (subId) => {
    if (!window.confirm('Convert this application into an active policy and enroll the animal?')) return;
    try {
      const res = await insuranceService.convertSubscriptionToPolicy(subId);
      if (res.success) {
        alert('Application converted and policy issued successfully!');
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to convert application');
    }
  };

  const handleUpdateStatus = async (subId, status) => {
    try {
      const res = await insuranceService.updateSubscriptionStatus(subId, { status });
      if (res.success) {
        setSubscriptions(subscriptions.map((s) => (s._id === subId ? { ...s, status } : s)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update application status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">
            Insurance Applications &amp; Policies Registry
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Review farmer subscription applications, verify underwriting requirements, and issue active policy certificates.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
        <button
          onClick={() => {
            setActiveTab('subscriptions');
            setStatusFilter('all');
          }}
          className={`px-5 py-2.5 rounded-xl font-label-md font-bold transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-tinted'
          }`}
        >
          Public Applications ({subscriptions.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('policies');
            setStatusFilter('all');
          }}
          className={`px-5 py-2.5 rounded-xl font-label-md font-bold transition-all ${
            activeTab === 'policies'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-tinted'
          }`}
        >
          Active Enrolled Policies ({policies.length})
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium">{error}</div>
        ) : activeTab === 'subscriptions' ? (
          /* SUBSCRIPTIONS / APPLICATIONS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">App Ref</th>
                  <th className="py-3.5 px-4">Applicant &amp; County</th>
                  <th className="py-3.5 px-4">Species &amp; Tag ID</th>
                  <th className="py-3.5 px-4">Plan Scheme</th>
                  <th className="py-3.5 px-4">Application Status</th>
                  <th className="py-3.5 px-4 text-right">Underwriting Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {subscriptions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                      No insurance applications submitted yet.
                    </td>
                  </tr>
                ) : (
                  subscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-surface-tinted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {sub.applicationNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface">{sub.applicantName}</div>
                        <div className="text-[12px] text-on-surface-variant">{sub.applicantPhone} &bull; {sub.county}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold uppercase text-[11px] text-secondary">
                          {sub.species?.replace('_', ' ')}
                        </div>
                        <div className="text-[12px] font-mono">{sub.tagOrChipId || 'Pending Tagging'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface text-xs">{sub.insurancePlan?.name}</div>
                        <div className="text-[11px] text-outline uppercase">{sub.preferredBilling} Billing</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                            sub.status === 'converted'
                              ? 'bg-primary-container text-on-primary-container'
                              : sub.status === 'under_review'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        {sub.status !== 'converted' && (
                          <button
                            onClick={() => handleConvert(sub._id)}
                            className="px-3 py-1 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-secondary transition-colors"
                          >
                            Approve &amp; Issue Policy
                          </button>
                        )}
                        {sub.status === 'submitted' && (
                          <button
                            onClick={() => handleUpdateStatus(sub._id, 'under_review')}
                            className="px-3 py-1 rounded-xl bg-surface-tinted text-primary text-xs font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* POLICIES TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Policy Number</th>
                  <th className="py-3.5 px-4">Insured Animal</th>
                  <th className="py-3.5 px-4">Owner / Farmer</th>
                  <th className="py-3.5 px-4">Plan &amp; Premium</th>
                  <th className="py-3.5 px-4">Coverage Window</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {policies.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                      No active policies issued yet.
                    </td>
                  </tr>
                ) : (
                  policies.map((pol) => (
                    <tr key={pol._id} className="hover:bg-surface-tinted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {pol.policyNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface">{pol.animal?.tagOrChipId}</div>
                        <div className="text-[12px] text-on-surface-variant uppercase">
                          {pol.animal?.species?.replace('_', ' ')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface">{pol.owner?.name}</div>
                        <div className="text-[12px] text-on-surface-variant">{pol.owner?.phone} &bull; {pol.owner?.county}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-on-surface">{pol.insurancePlan?.name}</div>
                        <div className="text-[12px] text-primary font-bold">
                          KES {Number(pol.premium).toLocaleString()} / {pol.billingPeriod}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[12px] text-on-surface-variant">
                        <div>From: {new Date(pol.startDate).toLocaleDateString()}</div>
                        <div>To: {new Date(pol.expiryDate).toLocaleDateString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-bold text-[11px] uppercase">
                          {pol.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
