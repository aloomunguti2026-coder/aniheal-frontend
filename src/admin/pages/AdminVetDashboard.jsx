import React, { useState, useEffect } from 'react';
import vetService from '../../services/vetService';

export default function AdminVetDashboard() {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Daily log modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    farmerName: '',
    farmerPhone: '',
    farmLocation: '',
    county: '',
    animalName: '',
    tagOrChipId: '',
    species: 'dairy_cattle',
    symptoms: '',
    diagnosis: '',
    proceduresPerformed: ['clinical_exam'],
    drugName: '',
    drugDosage: '',
    withdrawalPeriodDays: 0,
    clinicalNotes: '',
    feeCharged: '',
    paymentStatus: 'paid_cash',
  });
  const [logging, setLogging] = useState(false);
  const [logError, setLogError] = useState('');

  const procedureOptions = [
    'clinical_exam',
    'field_surgery',
    'vaccination',
    'deworming',
    'artificial_insemination',
    'ultrasound_pregnancy_dx',
    'mastitis_treatment',
    'dystocia_intervention',
    'post_mortem_autopsy',
  ];

  useEffect(() => {
    fetchData();
  }, [speciesFilter, search]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (speciesFilter !== 'all') params.species = speciesFilter;
      if (search.trim()) params.search = search.trim();

      const [statsRes, logsRes] = await Promise.all([
        vetService.getVetStats(),
        vetService.getVetLogs(params),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (logsRes.success) setLogs(logsRes.data?.logs || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load veterinary daily operations data.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLogModal = () => {
    setLogError('');
    setFormData({
      farmerName: '',
      farmerPhone: '',
      farmLocation: '',
      county: '',
      animalName: '',
      tagOrChipId: `TAG-${Math.floor(1000 + Math.random() * 9000)}`,
      species: 'dairy_cattle',
      symptoms: '',
      diagnosis: '',
      proceduresPerformed: ['clinical_exam'],
      drugName: '',
      drugDosage: '',
      withdrawalPeriodDays: 0,
      clinicalNotes: '',
      feeCharged: '',
      paymentStatus: 'paid_cash',
    });
    setModalOpen(true);
  };

  const handleToggleProcedure = (proc) => {
    if (formData.proceduresPerformed.includes(proc)) {
      setFormData({
        ...formData,
        proceduresPerformed: formData.proceduresPerformed.filter((p) => p !== proc),
      });
    } else {
      setFormData({
        ...formData,
        proceduresPerformed: [...formData.proceduresPerformed, proc],
      });
    }
  };

  const handleLogSubmit = async (e) => {
    e.preventDefault();
    if (!formData.farmerName || !formData.diagnosis) {
      setLogError('Please fill in Farmer Name and Diagnosis.');
      return;
    }

    try {
      setLogging(true);
      setLogError('');

      const medications = [];
      if (formData.drugName.trim()) {
        medications.push({
          drugName: formData.drugName.trim(),
          dosage: formData.drugDosage.trim() || 'Standard Dose',
          withdrawalPeriodDays: Number(formData.withdrawalPeriodDays) || 0,
        });
      }

      const payload = {
        farmerName: formData.farmerName,
        farmerPhone: formData.farmerPhone,
        farmLocation: formData.farmLocation,
        county: formData.county,
        animalName: formData.animalName,
        tagOrChipId: formData.tagOrChipId,
        species: formData.species,
        symptoms: formData.symptoms,
        diagnosis: formData.diagnosis,
        proceduresPerformed: formData.proceduresPerformed,
        medicationsAdministered: medications,
        clinicalNotes: formData.clinicalNotes,
        feeCharged: Number(formData.feeCharged) || 0,
        paymentStatus: formData.paymentStatus,
      };

      const res = await vetService.logDailyActivity(payload);
      if (res.success) {
        setModalOpen(false);
        fetchData();
      } else {
        setLogError(res.message || 'Failed to save clinical log.');
      }
    } catch (err) {
      console.error(err);
      setLogError(err.message || 'Error saving clinical case log.');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">
            Veterinary Clinical Operations &amp; Daily Work Console
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Log farmer clinical field visits, diagnostic findings, administered medications, and surgical procedures.
          </p>
        </div>

        <button
          onClick={handleOpenLogModal}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Log Daily Clinical Case</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Today's Field Cases</span>
            <span className="material-symbols-outlined text-primary text-[24px]">crisis_alert</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-primary">
            {stats?.todayCasesCount || 0} Cases
          </div>
          <p className="text-label-sm text-on-surface-variant">Logged on duty today</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Total Clinical Records</span>
            <span className="material-symbols-outlined text-secondary text-[24px]">folder_special</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            {stats?.totalCasesCount || 0} Cases
          </div>
          <p className="text-label-sm text-on-surface-variant">Lifetime company clinical logs</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Clinical Fees Generated</span>
            <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-primary">
            KES {Number(stats?.totalClinicalRevenue || 0).toLocaleString()}
          </div>
          <p className="text-label-sm text-secondary font-medium">Field ambulatory procedure billing</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Procedures Executed</span>
            <span className="material-symbols-outlined text-primary text-[24px]">biotech</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            {stats?.proceduresBreakdown?.length || 0} Protocols
          </div>
          <p className="text-label-sm text-on-surface-variant">Surgeries, FTAI, deworming, vaccines</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-surface-clinical border border-border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search farmer, diagnosis, or tag ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary font-medium"
          >
            <option value="all">All Patient Species</option>
            <option value="dairy_cattle">Dairy Cattle</option>
            <option value="beef_cattle">Beef Cattle</option>
            <option value="canine">Canines / Dogs</option>
            <option value="feline">Felines / Cats</option>
            <option value="equine">Equine / Horses</option>
            <option value="small_ruminants">Small Ruminants</option>
            <option value="poultry">Poultry</option>
          </select>
        </div>
      </div>

      {/* Daily Logs Table */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">medical_services</span>
            <p className="font-bold">No Clinical Logs Found</p>
            <p className="text-sm">Click "Log Daily Clinical Case" to register field veterinary operations.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Date &amp; Vet</th>
                  <th className="py-3.5 px-4">Farmer / Farm Location</th>
                  <th className="py-3.5 px-4">Patient Tag &amp; Species</th>
                  <th className="py-3.5 px-4">Diagnosis &amp; Procedures</th>
                  <th className="py-3.5 px-4">Medications</th>
                  <th className="py-3.5 px-4">Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-surface-tinted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{new Date(log.logDate).toLocaleDateString()}</div>
                      <div className="text-[12px] text-secondary font-medium">{log.vetName || 'Duty Clinician'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{log.farmerName}</div>
                      <div className="text-[12px] text-on-surface-variant">{log.farmerPhone} &bull; {log.county || log.farmLocation || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-primary text-xs">{log.tagOrChipId || 'NO-TAG'}</div>
                      <div className="text-[11px] text-outline uppercase font-semibold">{log.species?.replace('_', ' ')}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface text-sm">{log.diagnosis}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {log.proceduresPerformed?.map((p, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-surface-tinted text-[11px] font-medium text-on-surface-variant">
                            {p.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {log.medicationsAdministered && log.medicationsAdministered.length > 0 ? (
                        <div className="space-y-0.5">
                          {log.medicationsAdministered.map((m, mi) => (
                            <div key={mi} className="text-secondary font-medium">
                              <strong>{m.drugName}</strong> ({m.dosage})
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-outline">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">KES {Number(log.feeCharged || 0).toLocaleString()}</div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container">
                        {log.paymentStatus?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Daily Clinical Case Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-2xl w-full border border-border-hairline shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">Log Daily Clinical Case</h3>
                <p className="font-label-sm text-label-sm text-on-primary/80 mt-0.5">
                  Veterinarian field record &amp; patient clinical dossier
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="p-6 space-y-4 overflow-y-auto">
              {logError && (
                <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{logError}</span>
                </div>
              )}

              <h4 className="font-label-sm font-bold uppercase tracking-wider text-outline">
                1. Farmer &amp; Farm Location
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Farmer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Julius Mwangi"
                    value={formData.farmerName}
                    onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Farmer Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.farmerPhone}
                    onChange={(e) => setFormData({ ...formData, farmerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">County</label>
                  <input
                    type="text"
                    placeholder="e.g. Kiambu, Nakuru"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Farm Landmarks / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Karatina Dairies"
                    value={formData.farmLocation}
                    onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <h4 className="font-label-sm font-bold uppercase tracking-wider text-outline pt-2">
                2. Patient Animal &amp; Clinical Diagnosis
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Species *</label>
                  <select
                    value={formData.species}
                    onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="dairy_cattle">Dairy Cattle</option>
                    <option value="beef_cattle">Beef Cattle</option>
                    <option value="canine">Canines / Dogs</option>
                    <option value="feline">Felines / Cats</option>
                    <option value="equine">Equine / Horses</option>
                    <option value="small_ruminants">Small Ruminants</option>
                    <option value="poultry">Poultry</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Tag / Chip ID</label>
                  <input
                    type="text"
                    placeholder="e.g. EAR-TAG-99"
                    value={formData.tagOrChipId}
                    onChange={(e) => setFormData({ ...formData, tagOrChipId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-mono focus:outline-none focus:border-primary uppercase"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Animal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Fresian 01"
                    value={formData.animalName}
                    onChange={(e) => setFormData({ ...formData, animalName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Clinical Diagnosis *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Mastitis / East Coast Fever / Dystocia"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Presenting Symptoms</label>
                <textarea
                  rows="2"
                  placeholder="Fever 40.2C, loss of appetite, swelling in right quarter..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              {/* Procedures Checkboxes */}
              <div className="space-y-2">
                <label className="font-label-sm font-semibold text-on-surface block">Procedures Performed</label>
                <div className="flex flex-wrap gap-2">
                  {procedureOptions.map((proc) => {
                    const active = formData.proceduresPerformed.includes(proc);
                    return (
                      <button
                        type="button"
                        key={proc}
                        onClick={() => handleToggleProcedure(proc)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border ${
                          active
                            ? 'bg-primary text-on-primary border-primary'
                            : 'bg-surface text-on-surface-variant border-border-hairline hover:bg-surface-tinted'
                        }`}
                      >
                        {proc.replace('_', ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Medication Administered */}
              <h4 className="font-label-sm font-bold uppercase tracking-wider text-outline pt-2">
                3. Medication &amp; Billing
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Drug Administered</label>
                  <input
                    type="text"
                    placeholder="e.g. PenStrep / Butalex"
                    value={formData.drugName}
                    onChange={(e) => setFormData({ ...formData, drugName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g. 20ml IM"
                    value={formData.drugDosage}
                    onChange={(e) => setFormData({ ...formData, drugDosage: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Withdrawal (Days)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={formData.withdrawalPeriodDays}
                    onChange={(e) => setFormData({ ...formData, withdrawalPeriodDays: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Clinical Fee (KES)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3500"
                    value={formData.feeCharged}
                    onChange={(e) => setFormData({ ...formData, feeCharged: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-bold text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Payment Status</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="paid_cash">Paid in Cash</option>
                    <option value="paid_mpesa">Paid via M-Pesa</option>
                    <option value="billed_to_insurance">Covered by Insurance</option>
                    <option value="unpaid">Unpaid / Farm Credit</option>
                    <option value="waived">Waived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Vet Clinical Notes</label>
                <textarea
                  rows="2"
                  placeholder="Prognosis good. Advised 48h isolation and follow-up on day 3."
                  value={formData.clinicalNotes}
                  onChange={(e) => setFormData({ ...formData, clinicalNotes: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-on-surface-variant font-label-md font-semibold hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={logging}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                >
                  {logging ? 'Saving Record...' : 'Save Clinical Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
