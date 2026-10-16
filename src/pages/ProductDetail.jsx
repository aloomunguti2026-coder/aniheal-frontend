import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../services/productService';
import { useContent } from '../hooks/useContent';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

export default function ProductDetail() {
  const { slug } = useParams();
  const { settings } = useContent();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Quick Order State
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    county: '',
    deliveryAddress: '',
    notes: '',
  });
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState('');

  const mpesaPaymentType = settings?.mpesaPaymentType || 'buygoods';
  const mpesaTill = settings?.mpesaTill || '894022';
  const mpesaPaybill = settings?.mpesaPaybill || '522533';
  const mpesaAccount = settings?.mpesaAccount || '81510310';
  const mpesaSummary =
    mpesaPaymentType === 'paybill'
      ? `Paybill ${mpesaPaybill} (Acc: ${mpesaAccount})`
      : mpesaPaymentType === 'both'
      ? `Till ${mpesaTill} / Paybill ${mpesaPaybill} (Acc: ${mpesaAccount})`
      : `Till ${mpesaTill}`;

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await productService.getProductBySlug(slug);
      if (res && res.success && res.data) {
        setProduct(res.data);
      } else {
        setError('Veterinary product not found in catalog.');
      }
    } catch (err) {
      console.error('Error fetching product by slug:', err);
      setError('Unable to load product details. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      const prevTitle = document.title;
      document.title = `${product.name} | AniHeal Veterinary Products Kenya`;

      let metaDesc = document.querySelector('meta[name="description"]');
      let createdDesc = false;
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
        createdDesc = true;
      }
      const prevDesc = metaDesc.getAttribute('content');
      metaDesc.setAttribute(
        'content',
        product.description?.slice(0, 155) ||
          `Order ${product.name} from AniHeal Vetspace. KVB accredited veterinary supplies with farm delivery in Kenya.`
      );

      return () => {
        document.title = prevTitle;
        if (createdDesc) {
          metaDesc.remove();
        } else if (prevDesc) {
          metaDesc.setAttribute('content', prevDesc);
        }
      };
    }
  }, [product]);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderForm.customerName || !orderForm.customerPhone || !orderForm.county) {
      setOrderError('Please provide your name, phone number, and farm location county.');
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
            productId: product._id,
            quantity: Number(orderQuantity) || 1,
          },
        ],
        notes: orderForm.notes,
      };

      const res = await productService.submitOrder(payload);
      if (res.success) {
        setOrderSuccess(res.data);
      } else {
        setOrderError(res.message || 'Failed to submit product order.');
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="font-body-md text-on-surface-variant font-medium">Loading product specifications...</p>
          </div>
        ) : error || !product ? (
          <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-error-container/40 text-error flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">inventory_2</span>
            </div>
            <h2 className="font-headline-sm text-2xl font-bold text-on-surface">Product Not Found</h2>
            <p className="text-body-md text-on-surface-variant">
              The requested pharmaceutical or clinical product could not be located in our inventory.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-md font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Products Catalog</span>
            </Link>
          </div>
        ) : (
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm text-outline pt-2">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Company Products</Link>
              <span>/</span>
              <span className="text-primary font-semibold truncate">{product.name}</span>
            </nav>

            {/* Product Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Left Column: Product Imagery */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-surface-clinical border border-border-hairline shadow-sm flex items-center justify-center">
                  {product.images && product.images.length > 0 && product.images[selectedImageIndex]?.url ? (
                    <img
                      src={product.images[selectedImageIndex].url}
                      alt={product.images[selectedImageIndex].altText || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-outline p-8">
                      <span className="material-symbols-outlined text-[64px]">medication</span>
                      <span className="font-label-md font-bold mt-2">AniHeal Certified Supply</span>
                    </div>
                  )}

                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-surface-clinical/90 backdrop-blur-md text-primary font-label-sm text-xs font-bold uppercase tracking-wider border border-border-hairline shadow-sm">
                    {product.category?.replace('_', ' ')}
                  </span>

                  {product.stockQuantity > 0 ? (
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm text-xs font-semibold shadow-sm">
                      In Stock ({product.stockQuantity} Available)
                    </span>
                  ) : (
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-error text-on-error font-label-sm text-xs font-semibold shadow-sm">
                      On Order / Farm Restock Active
                    </span>
                  )}
                </div>

                {/* Thumbnail strip if multiple images */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx ? 'border-primary shadow-sm scale-105' : 'border-border-hairline opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.url} alt={img.altText || `${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Information & Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold uppercase tracking-wider">
                      KVB Quality Standard
                    </span>
                    <span className="text-label-sm text-secondary font-mono uppercase font-semibold">
                      SKU: {product.sku}
                    </span>
                  </div>

                  <h1 className="font-headline-xl text-3xl sm:text-4xl font-extrabold text-on-surface leading-tight">
                    {product.name}
                  </h1>

                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-primary font-headline-xl">
                      KES {Number(product.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-on-surface-variant font-medium">per packaging unit</span>
                  </div>
                </div>

                {/* Features Badges */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
                      Key Clinical Advantages
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-surface-tinted/50 text-body-sm font-medium">
                          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-2 pt-2 border-t border-border-hairline">
                  <h2 className="font-label-sm text-xs uppercase tracking-wider text-outline font-bold">
                    Specifications &amp; Indication
                  </h2>
                  <p className="font-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Order & Dispatch Action Box */}
                <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-label-sm text-outline block">Order Quantity</span>
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                          className="w-9 h-9 rounded-lg bg-surface-tinted flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          -
                        </button>
                        <span className="font-headline-sm text-lg font-bold w-12 text-center">{orderQuantity}</span>
                        <button
                          onClick={() => setOrderQuantity(orderQuantity + 1)}
                          className="w-9 h-9 rounded-lg bg-surface-tinted flex items-center justify-center font-bold text-primary hover:bg-primary hover:text-on-primary transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-label-sm text-outline block">Total Estimate</span>
                      <span className="font-headline-sm text-xl font-bold text-primary">
                        KES {(Number(product.price) * orderQuantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setOrderModalOpen(true)}
                    className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-md font-bold text-base hover:bg-secondary transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">local_shipping</span>
                    <span>Order for Farm Gate Dispatch</span>
                  </button>

                  <div className="pt-2 text-center text-xs text-on-surface-variant flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">payments</span>
                    <span>M-Pesa {mpesaSummary} • Cash on Delivery • Regional Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Order Placement Modal */}
      {orderModalOpen && product && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-lg w-full border border-border-hairline shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">Confirm Farm Order</h3>
                <p className="text-xs text-on-primary/80 mt-0.5">{product.name} ({orderQuantity} unit{orderQuantity > 1 ? 's' : ''})</p>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto shadow-sm">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h4 className="font-headline-sm text-xl font-bold">Order Received!</h4>
                <p className="font-body-md text-sm text-on-surface-variant">
                  Order Reference: <strong className="font-mono text-primary font-bold">{orderSuccess.orderNumber}</strong>. Our clinical dispatch team will call <strong>{orderSuccess.customerPhone}</strong> to confirm transport logistics.
                </p>
                <button
                  onClick={() => {
                    setOrderModalOpen(false);
                    setOrderSuccess(null);
                  }}
                  className="w-full py-3 rounded-xl bg-primary text-on-primary font-label-md font-bold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                {orderError && (
                  <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-xs font-semibold">
                    {orderError}
                  </div>
                )}

                <div>
                  <label className="font-label-sm text-xs font-semibold block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Karanja"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-label-sm text-xs font-semibold block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000"
                      value={orderForm.customerPhone}
                      onChange={(e) => setOrderForm({ ...orderForm, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-xs font-semibold block mb-1">County / Farm Location *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nakuru, Rongai"
                      value={orderForm.county}
                      onChange={(e) => setOrderForm({ ...orderForm, county: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold block mb-1">Specific Delivery Address or Nearest Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Rongai Stage, Farm Gate 3"
                    value={orderForm.deliveryAddress}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-label-sm text-xs font-semibold block mb-1">Notes / Instructions</label>
                  <textarea
                    rows="2"
                    placeholder="Special delivery instructions or drug storage requirements..."
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-border-hairline text-sm focus:border-primary focus:outline-none"
                  ></textarea>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border-hairline flex items-center justify-between text-sm">
                  <span className="font-semibold">Total Payable Amount:</span>
                  <span className="font-bold text-primary text-base">
                    KES {(Number(product.price) * orderQuantity).toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="px-5 py-2 rounded-xl text-on-surface-variant font-semibold hover:bg-surface-tinted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={orderSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
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
