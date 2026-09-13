import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService from '../services/productService';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderModalProduct, setOrderModalProduct] = useState(null);

  // Order modal state
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    county: '',
    deliveryAddress: '',
    quantity: 1,
    notes: '',
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState('');

  const categories = [
    { id: 'all', label: 'All Products', icon: 'inventory_2' },
    { id: 'pharmaceuticals', label: 'Pharmaceuticals', icon: 'vaccines' },
    { id: 'vaccines', label: 'Vaccines & Biologics', icon: 'biotech' },
    { id: 'supplements', label: 'Nutrition & Supplements', icon: 'nutrition' },
    { id: 'farm_equipment', label: 'Equipment & Supplies', icon: 'agriculture' },
    { id: 'diagnostic_kits', label: 'Diagnostic Kits', icon: 'science' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await productService.getProducts(params);
      if (res.success) {
        setProducts(res.data || []);
      } else {
        setError('Unable to load company products.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to reach AniHeal product service.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (product) => {
    setOrderModalProduct(product);
    setOrderSuccess(null);
    setOrderError('');
    setOrderForm({
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      county: '',
      deliveryAddress: '',
      quantity: 1,
      notes: '',
    });
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.county) {
      setOrderError('Please provide your name, phone number, and county.');
      return;
    }

    try {
      setOrderSubmitting(true);
      setOrderError('');

      const payload = {
        customerName: orderForm.customerName,
        customerPhone: orderForm.customerPhone,
        customerEmail: orderForm.customerEmail,
        county: orderForm.county,
        deliveryAddress: orderForm.deliveryAddress,
        items: [
          {
            productId: orderModalProduct._id,
            quantity: Number(orderForm.quantity) || 1,
          },
        ],
        notes: orderForm.notes,
      };

      const res = await productService.submitOrder(payload);
      if (res.success) {
        setOrderSuccess(res.data);
      } else {
        setOrderError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setOrderError(err.message || 'Error processing order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-surface-clinical via-surface-tinted/30 to-surface py-12 lg:py-16 border-b border-border-hairline">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>KVB Registered Veterinary Pharmacy &amp; Supplies</span>
              </div>
              <h1 className="font-headline-xl text-3xl sm:text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                Company Products &amp; Clinical Supplies
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant">
                Premium veterinary pharmaceuticals, field diagnostics, reproductive genetics, and herd health supplements formulated and approved for Kenyan agro-ecological zones.
              </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or active ingredient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-clinical border border-border-hairline focus:border-primary focus:outline-none text-body-md font-body-md shadow-sm"
                />
              </div>

              {/* Payment Methods Info Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-clinical border border-border-hairline text-label-sm font-label-sm text-secondary">
                <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
                <span>Accepted: M-Pesa Till <strong>894022</strong> • Cash on Farm Delivery • Bank Transfer</span>
              </div>
            </div>

            {/* Category Navigation Pills */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-label-md text-label-md font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-clinical text-on-surface-variant hover:bg-surface-tinted border border-border-hairline'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-body-md text-on-surface-variant font-medium">Loading catalog products...</p>
            </div>
          ) : error ? (
            <div className="p-8 rounded-2xl bg-surface-clinical border border-error/20 text-center max-w-lg mx-auto">
              <span className="material-symbols-outlined text-error text-[40px] mb-2">error</span>
              <h3 className="font-headline-sm font-bold text-on-surface">{error}</h3>
              <button
                onClick={fetchProducts}
                className="mt-4 px-6 py-2 rounded-full bg-primary text-on-primary font-label-md font-semibold"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center bg-surface-clinical rounded-2xl border border-border-hairline max-w-md mx-auto">
              <span className="material-symbols-outlined text-outline text-[48px]">inventory_2</span>
              <h3 className="mt-2 font-headline-sm font-bold text-on-surface">No Products Found</h3>
              <p className="mt-1 text-body-sm text-on-surface-variant">
                Try selecting a different category or clearing your search term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group flex flex-col bg-surface-clinical rounded-2xl border border-border-hairline hover:border-primary/40 hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative aspect-4/3 bg-surface-tinted/40 overflow-hidden flex items-center justify-center">
                    {product.images && product.images.length > 0 && product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-outline">
                        <span className="material-symbols-outlined text-[48px]">medication</span>
                        <span className="font-label-sm text-label-sm mt-1">AniHeal Certified</span>
                      </div>
                    )}
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-surface-clinical/90 backdrop-blur-sm text-primary font-label-sm text-label-sm font-bold uppercase tracking-wider border border-border-hairline shadow-sm">
                      {product.category?.replace('_', ' ')}
                    </span>
                    {product.stockQuantity > 0 ? (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-primary text-on-primary font-label-sm text-[11px] font-semibold">
                        In Stock ({product.stockQuantity})
                      </span>
                    ) : (
                      <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-error text-on-error font-label-sm text-[11px] font-semibold">
                        On Order
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="text-label-sm text-secondary font-mono uppercase font-semibold">
                        SKU: {product.sku}
                      </div>
                      <h3 className="font-headline-sm text-lg font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                        {product.description}
                      </p>

                      {product.features && product.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.features.slice(0, 2).map((feat, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-surface-tinted text-on-surface-variant font-medium"
                            >
                              <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                              {feat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-border-hairline flex items-center justify-between gap-3">
                      <div>
                        <span className="text-label-sm text-outline font-medium block">Price</span>
                        <span className="font-headline-sm text-xl font-bold text-primary">
                          KES {Number(product.price).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenOrder(product)}
                        className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Quick Order Modal */}
      {orderModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-lg w-full border border-border-hairline shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">Place Product Order</h3>
                <p className="font-label-sm text-label-sm text-on-primary/80 mt-0.5">
                  Farm gate dispatch &amp; veterinary courier service
                </p>
              </div>
              <button
                onClick={() => setOrderModalProduct(null)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h4 className="font-headline-sm text-xl font-bold text-on-surface">Order Received!</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Your order reference is <strong className="font-mono text-primary font-bold">{orderSuccess.orderNumber}</strong>.
                  Our pharmacy dispatch desk will contact you at <strong>{orderSuccess.customerPhone}</strong> to confirm dispatch and delivery details.
                </p>
                <div className="p-4 rounded-xl bg-surface-tinted text-label-sm text-left space-y-1">
                  <div><strong>Product:</strong> {orderModalProduct.name}</div>
                  <div><strong>Total Amount:</strong> KES {Number(orderSuccess.totalAmount).toLocaleString()}</div>
                  <div><strong>Payment Option:</strong> Pay via M-Pesa Till 894022 or Cash on Farm Delivery</div>
                </div>
                <button
                  onClick={() => setOrderModalProduct(null)}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                {orderError && (
                  <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error font-body-sm text-body-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Selected Product Summary */}
                <div className="p-3 rounded-xl bg-surface-tinted flex items-center justify-between">
                  <div>
                    <h5 className="font-label-lg font-bold text-on-surface line-clamp-1">{orderModalProduct.name}</h5>
                    <span className="text-label-sm text-secondary font-mono">KES {Number(orderModalProduct.price).toLocaleString()} / unit</span>
                  </div>
                  <div className="w-24">
                    <label className="text-[11px] font-bold text-outline uppercase block">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={orderForm.quantity}
                      onChange={(e) => setOrderForm({ ...orderForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="w-full px-2 py-1 bg-surface-clinical border border-border-hairline rounded-lg text-center font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Karanja"
                      value={orderForm.customerName}
                      onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000"
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      County / Farm Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nakuru, Rongai"
                      value={orderForm.county}
                      onChange={(e) => setOrderForm({ ...orderForm, county: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="farmer@domain.com"
                      value={orderForm.customerEmail}
                      onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-label-sm font-semibold text-on-surface block mb-1">
                    Special Delivery Instructions
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Provide any farm landmarks or preferred dispatch courier..."
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-body-sm focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                {/* Price Total */}
                <div className="p-3 rounded-xl bg-surface border border-border-hairline flex items-center justify-between">
                  <span className="font-label-md font-semibold text-on-surface">Estimated Total Amount:</span>
                  <span className="font-headline-sm text-xl font-bold text-primary">
                    KES {(Number(orderModalProduct.price) * (Number(orderForm.quantity) || 1)).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderModalProduct(null)}
                    className="px-5 py-2.5 rounded-xl text-on-surface-variant font-label-md font-semibold hover:bg-surface-tinted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                  >
                    {orderSubmitting ? 'Submitting...' : 'Confirm Order'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
