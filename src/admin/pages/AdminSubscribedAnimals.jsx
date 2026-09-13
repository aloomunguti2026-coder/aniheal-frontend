import React, { useState, useEffect } from 'react';
import animalService from '../../services/animalService';
import vetService from '../../services/vetService';

export default function AdminSubscribedAnimals() {
  const [animals, setAnimals] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('all');
  const [selectedAnimalDetail, setSelectedAnimalDetail] = useState(null);

  // Quick Register Modal state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [newAnimalData, setNewAnimalData] = useState({
    farmerName: '',
    farmerPhone: '',
    county: '',
    animalName: '',
    tagOrChipId: '',
    species: 'dairy_cattle',
    breed: '',
    age: '',
    healthStatus: 'healthy',
  });
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, [search, speciesFilter]);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (speciesFilter !== 'all') params.species = speciesFilter;

      const res = await animalService.getAnimals(params);
      if (res.success) {
        setAnimals(res.data?.animals || []);
      } else {
        setError('Failed to load animal health records.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach animal data service.');
    } finally {
      setLoading(false);
    }
  };

  const handleInspectAnimal = async (animalId) => {
    try {
      const res = await animalService.getAnimalById(animalId);
      if (res.success) {
        setSelectedAnimalDetail(res.data);
      }
    } catch (err) {
      alert('Failed to load full animal medical dossier');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!newAnimalData.farmerName || !newAnimalData.tagOrChipId || !newAnimalData.species) {
      setRegisterError('Please fill in Farmer Name, Tag/Microchip ID, and Species.');
      return;
    }

    try {
      setRegistering(true);
      setRegisterError('');

      // 1. Create or resolve Owner
      const ownerRes = await animalService.createOwner({
        name: newAnimalData.farmerName,
        phone: newAnimalData.farmerPhone || '+254700000000',
        county: newAnimalData.county || 'Nairobi',
      });

      if (!ownerRes.success) {
        setRegisterError(ownerRes.message || 'Failed to register owner.');
        return;
      }

      // 2. Create Animal
      const animalRes = await animalService.createAnimal({
        ownerId: ownerRes.data._id,
        tagOrChipId: newAnimalData.tagOrChipId.trim().toUpperCase(),
        animalName: newAnimalData.animalName,
        species: newAnimalData.species,
        breed: newAnimalData.breed,
        age: newAnimalData.age,
        healthStatus: newAnimalData.healthStatus,
      });

      if (animalRes.success) {
        setRegisterModalOpen(false);
        fetchAnimals();
      } else {
        setRegisterError(animalRes.message || 'Failed to register animal.');
      }
    } catch (err) {
      console.error(err);
      setRegisterError(err.message || 'Error registering animal.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">
            Animal Health &amp; Identification Management
          </h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Registry of all insured and clinically monitored animals, microchip identifiers, and medical dossiers.
          </p>
        </div>

        <button
          onClick={() => {
            setRegisterError('');
            setNewAnimalData({
              farmerName: '',
              farmerPhone: '',
              county: '',
              animalName: '',
              tagOrChipId: `TAG-${Math.floor(10000 + Math.random() * 90000)}`,
              species: 'dairy_cattle',
              breed: '',
              age: '',
              healthStatus: 'healthy',
            });
            setRegisterModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Register Animal Patient</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-4 rounded-2xl bg-surface-clinical border border-border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search Tag, Microchip ID, or Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary uppercase font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary font-medium"
          >
            <option value="all">All Species</option>
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

      {/* Animals Table */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium">{error}</div>
        ) : animals.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">pets</span>
            <p className="font-bold">No Animal Records Found</p>
            <p className="text-sm">Enrolled animals and clinical patients will be listed here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Tag / Microchip ID</th>
                  <th className="py-3.5 px-4">Animal Details</th>
                  <th className="py-3.5 px-4">Owner / Farm</th>
                  <th className="py-3.5 px-4">Species Category</th>
                  <th className="py-3.5 px-4">Health Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {animals.map((an) => (
                  <tr key={an._id} className="hover:bg-surface-tinted/20 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-base">
                      {an.tagOrChipId}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-on-surface">{an.animalName || 'Unnamed Patient'}</div>
                      <div className="text-[12px] text-on-surface-variant">
                        {an.breed || 'Standard Breed'} &bull; {an.age || 'Age N/A'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-on-surface">{an.owner?.name || 'Registered Owner'}</div>
                      <div className="text-[12px] text-on-surface-variant">{an.owner?.phone} &bull; {an.owner?.county}</div>
                    </td>
                    <td className="py-3 px-4 uppercase font-semibold text-[11px] text-secondary">
                      {an.species?.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          an.healthStatus === 'healthy'
                            ? 'bg-primary-container text-on-primary-container'
                            : an.healthStatus === 'critical'
                            ? 'bg-error-container text-error'
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">
                          {an.healthStatus === 'healthy' ? 'verified' : 'healing'}
                        </span>
                        <span>{an.healthStatus?.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleInspectAnimal(an._id)}
                        className="px-3 py-1.5 rounded-xl bg-surface-tinted text-primary text-xs font-bold hover:bg-primary hover:text-on-primary transition-colors inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">clinical_notes</span>
                        <span>Medical Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Dossier Modal */}
      {selectedAnimalDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-3xl w-full border border-border-hairline shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">
                  Animal Medical Dossier: {selectedAnimalDetail.animal.tagOrChipId}
                </h3>
                <p className="font-label-sm text-label-sm text-on-primary/80 mt-0.5">
                  Owner: {selectedAnimalDetail.animal.owner?.name} &bull; {selectedAnimalDetail.animal.species}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnimalDetail(null)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Vitals Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface-tinted/40 border border-border-hairline">
                  <span className="text-[10px] uppercase font-bold text-outline">Species / Breed</span>
                  <div className="font-bold text-on-surface text-sm mt-0.5">
                    {selectedAnimalDetail.animal.species?.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] text-on-surface-variant">{selectedAnimalDetail.animal.breed || '—'}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-tinted/40 border border-border-hairline">
                  <span className="text-[10px] uppercase font-bold text-outline">Health Condition</span>
                  <div className="font-bold text-primary text-sm mt-0.5 uppercase">
                    {selectedAnimalDetail.animal.healthStatus?.replace('_', ' ')}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-tinted/40 border border-border-hairline">
                  <span className="text-[10px] uppercase font-bold text-outline">Active Policies</span>
                  <div className="font-bold text-secondary text-sm mt-0.5">
                    {selectedAnimalDetail.policies?.length || 0} Policies
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-tinted/40 border border-border-hairline">
                  <span className="text-[10px] uppercase font-bold text-outline">Vaccinations</span>
                  <div className="font-bold text-on-surface text-sm mt-0.5">
                    {selectedAnimalDetail.vaccinations?.length || 0} Logged
                  </div>
                </div>
              </div>

              {/* Insurance Policies Section */}
              <div className="space-y-2">
                <h4 className="font-label-sm font-bold uppercase text-primary tracking-wider">
                  Enrolled Insurance Policies
                </h4>
                {selectedAnimalDetail.policies?.length === 0 ? (
                  <p className="text-xs text-on-surface-variant">No insurance policies active for this animal.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedAnimalDetail.policies.map((pol) => (
                      <div key={pol._id} className="p-3.5 rounded-xl bg-surface border border-border-hairline flex items-center justify-between text-xs">
                        <div>
                          <strong className="font-mono text-primary font-bold text-sm">{pol.policyNumber}</strong>
                          <div className="text-on-surface-variant">{pol.insurancePlan?.name} &bull; Premium: KES {pol.premium?.toLocaleString()}</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-bold uppercase text-[10px]">
                          {pol.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Clinical Records History */}
              <div className="space-y-2">
                <h4 className="font-label-sm font-bold uppercase text-primary tracking-wider">
                  Veterinary Medical History &amp; Field Visits ({selectedAnimalDetail.clinicalRecords?.length || 0})
                </h4>
                {selectedAnimalDetail.clinicalRecords?.length === 0 ? (
                  <p className="text-xs text-on-surface-variant">No clinical visit records logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedAnimalDetail.clinicalRecords.map((cr) => (
                      <div key={cr._id} className="p-4 rounded-xl bg-surface border border-border-hairline text-xs space-y-2">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-primary text-sm">{cr.diagnosis}</span>
                          <span className="text-outline">{new Date(cr.visitDate).toLocaleDateString()}</span>
                        </div>
                        <p className="text-on-surface-variant">{cr.chiefComplaint}</p>
                        {cr.medications && cr.medications.length > 0 && (
                          <div className="pt-1 text-[11px] text-secondary">
                            <strong>Prescribed:</strong> {cr.medications.map((m) => `${m.drugName} (${m.dosage})`).join(', ')}
                          </div>
                        )}
                        <div className="text-[11px] text-outline">Attending Clinician: {cr.vetUser?.name || 'Duty Vet'}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Animal Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-lg w-full border border-border-hairline shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between">
              <h3 className="font-headline-sm text-xl font-bold">Register Animal Patient</h3>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              {registerError && (
                <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{registerError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Farmer / Owner Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Kimani"
                    value={newAnimalData.farmerName}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, farmerName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Farmer Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={newAnimalData.farmerPhone}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, farmerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Tag / Microchip ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EAR-TAG-1049"
                    value={newAnimalData.tagOrChipId}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, tagOrChipId: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-mono focus:outline-none focus:border-primary uppercase"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Animal Name / Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g. Bella"
                    value={newAnimalData.animalName}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, animalName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Species *</label>
                  <select
                    value={newAnimalData.species}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, species: e.target.value })}
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
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Breed</label>
                  <input
                    type="text"
                    placeholder="e.g. Friesian"
                    value={newAnimalData.breed}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, breed: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">County</label>
                  <input
                    type="text"
                    placeholder="e.g. Nakuru"
                    value={newAnimalData.county}
                    onChange={(e) => setNewAnimalData({ ...newAnimalData, county: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border-hairline">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-on-surface-variant font-label-md font-semibold hover:bg-surface-tinted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                >
                  {registering ? 'Registering...' : 'Save Animal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
