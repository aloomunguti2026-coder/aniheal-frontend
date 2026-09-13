import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'pharmaceuticals',
    price: '',
    stockQuantity: 0,
    lowStockThreshold: 5,
    description: '',
    features: '',
    imageUrl: '',
    isActive: true,
    paymentMethods: ['cash', 'mpesa'],
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await productService.getProductsAdmin(params);
      if (res.success) {
        setProducts(res.data?.products || []);
      } else {
        setError('Failed to fetch products.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load products from server.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormError('');
    setFormData({
      name: '',
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: 'pharmaceuticals',
      price: '',
      stockQuantity: 0,
      lowStockThreshold: 5,
      description: '',
      features: '',
      imageUrl: '',
      isActive: true,
      paymentMethods: ['cash', 'mpesa'],
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormError('');
    setFormData({
      name: p.name || '',
      sku: p.sku || '',
      category: p.category || 'pharmaceuticals',
      price: p.price ?? '',
      stockQuantity: p.stockQuantity ?? 0,
      lowStockThreshold: p.lowStockThreshold ?? 5,
      description: p.description || '',
      features: p.features ? p.features.join('\n') : '',
      imageUrl: p.images && p.images[0] ? p.images[0].url : '',
      isActive: p.isActive !== false,
      paymentMethods: p.paymentMethods || ['cash', 'mpesa'],
    });
    setModalOpen(true);
  };

  const handleToggleStatus = async (p) => {
    try {
      const res = await productService.toggleProductStatus(p._id, !p.isActive);
      if (res.success) {
        setProducts(products.map((item) => (item._id === p._id ? { ...item, isActive: !item.isActive } : item)));
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle product status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      const res = await productService.deleteProduct(id);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || formData.price === '') {
      setFormError('Please fill in product name, SKU, and price.');
      return;
    }

    try {
      setSaving(true);
      setFormError('');

      const payload = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category,
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity) || 0,
        lowStockThreshold: Number(formData.lowStockThreshold) || 5,
        description: formData.description,
        features: formData.features
          ? formData.features.split('\n').map((f) => f.trim()).filter(Boolean)
          : [],
        images: formData.imageUrl ? [{ url: formData.imageUrl }] : [],
        isActive: formData.isActive,
        paymentMethods: formData.paymentMethods,
      };

      let res;
      if (editingProduct) {
        res = await productService.updateProduct(editingProduct._id, payload);
      } else {
        res = await productService.createProduct(payload);
      }

      if (res.success) {
        setModalOpen(false);
        fetchProducts();
      } else {
        setFormError(res.message || 'Failed to save product.');
      }
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Error saving product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">Company Products &amp; Catalog</h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Manage veterinary pharmaceuticals, vaccines, livestock supplements, and diagnostic kits.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-surface-clinical border border-border-hairline flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search SKU, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-surface rounded-xl border border-border-hairline text-body-sm focus:outline-none focus:border-primary font-medium"
          >
            <option value="all">All Categories</option>
            <option value="pharmaceuticals">Pharmaceuticals</option>
            <option value="vaccines">Vaccines &amp; Biologics</option>
            <option value="supplements">Supplements &amp; Nutrition</option>
            <option value="farm_equipment">Equipment &amp; Supplies</option>
            <option value="diagnostic_kits">Diagnostic Kits</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium">{error}</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] text-outline mb-2">inventory_2</span>
            <p className="font-bold">No Products Found</p>
            <p className="text-sm">Click "Add New Product" to populate your veterinary inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Product Info</th>
                  <th className="py-3.5 px-4">SKU / Code</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price (KES)</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-surface-tinted/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-tinted flex items-center justify-center overflow-hidden shrink-0">
                          {p.images && p.images[0] ? (
                            <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-primary text-[20px]">medication</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{p.name}</div>
                          <div className="text-[11px] text-on-surface-variant line-clamp-1">{p.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-secondary">{p.sku}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-surface-tinted text-on-surface-variant text-[11px] font-semibold uppercase">
                        {p.category?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      KES {Number(p.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          p.stockQuantity <= p.lowStockThreshold ? 'text-error' : 'text-on-surface'
                        }`}
                      >
                        {p.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.isActive
                            ? 'bg-primary-container text-on-primary-container'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {p.isActive ? 'check_circle' : 'do_not_disturb_on'}
                        </span>
                        <span>{p.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-primary hover:bg-surface-tinted transition-colors"
                        title="Edit Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-1.5 rounded-lg text-error hover:bg-error-container/30 transition-colors"
                        title="Delete Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-2xl w-full border border-border-hairline shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between shrink-0">
              <h3 className="font-headline-sm text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Product SKU / Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="pharmaceuticals">Pharmaceuticals</option>
                    <option value="vaccines">Vaccines &amp; Biologics</option>
                    <option value="supplements">Supplements &amp; Nutrition</option>
                    <option value="farm_equipment">Equipment &amp; Supplies</option>
                    <option value="diagnostic_kits">Diagnostic Kits</option>
                    <option value="clinical_supplies">Clinical Supplies</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Price (KES) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-bold text-primary focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Initial / Current Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Features (One per line)</label>
                <textarea
                  rows="2"
                  placeholder="Long-acting 72h&#10;KVB Certified&#10;Zero milk withdrawal"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
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
                  <span className="font-label-md text-sm font-semibold">Active &amp; Visible in Storefront</span>
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
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
