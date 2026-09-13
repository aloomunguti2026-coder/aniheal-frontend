import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

export default function AdminProductSales() {
  const [analytics, setAnalytics] = useState(null);
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('payments'); // 'payments' | 'orders'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cash / Manual Payment Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    amount: '',
    paymentMethod: 'cash',
    referenceNumber: '',
    notes: '',
  });
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [analyticsRes, paymentsRes, ordersRes] = await Promise.all([
        productService.getPaymentAnalytics(),
        productService.getPayments(),
        productService.getOrders(),
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data?.payments || []);
      if (ordersRes.success) setOrders(ordersRes.data?.orders || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load sales and payment records.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCashModal = () => {
    setRecordError('');
    setFormData({
      customerName: '',
      customerPhone: '',
      amount: '',
      paymentMethod: 'cash',
      referenceNumber: `CSH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: 'Direct farm gate cash collection',
    });
    setModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!formData.amount || Number(formData.amount) <= 0 || !formData.referenceNumber) {
      setRecordError('Please enter a valid payment amount and reference receipt number.');
      return;
    }

    try {
      setRecording(true);
      setRecordError('');

      const payload = {
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber.trim().toUpperCase(),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        notes: formData.notes,
      };

      const res = await productService.recordPayment(payload);
      if (res.success) {
        setModalOpen(false);
        fetchData();
      } else {
        setRecordError(res.message || 'Failed to record payment transaction.');
      }
    } catch (err) {
      console.error(err);
      setRecordError(err.message || 'Error recording transaction.');
    } finally {
      setRecording(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await productService.updateOrderStatus(orderId, { orderStatus: status });
      if (res.success) {
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-2xl font-bold text-on-surface">Product Sales &amp; Revenue Desk</h1>
          <p className="font-body-md text-on-surface-variant text-sm">
            Track product revenue, M-Pesa receipts, and record manual cash collections into system records.
          </p>
        </div>

        <button
          onClick={handleOpenCashModal}
          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">point_of_sale</span>
          <span>Record Cash / Manual Payment</span>
        </button>
      </div>

      {/* Revenue Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Total Sales Revenue</span>
            <span className="material-symbols-outlined text-primary text-[24px]">payments</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-primary">
            KES {Number(analytics?.totalRevenue || 0).toLocaleString()}
          </div>
          <p className="text-label-sm text-on-surface-variant">
            From {analytics?.totalTransactions || 0} recorded payments
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">M-Pesa Receipts</span>
            <span className="material-symbols-outlined text-secondary text-[24px]">smartphone</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            KES{' '}
            {Number(
              analytics?.paymentMethodBreakdown?.find((b) => b._id === 'mpesa')?.totalAmount || 0
            ).toLocaleString()}
          </div>
          <p className="text-label-sm text-secondary font-medium">Till No: 894022</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Cash on Delivery / Gate</span>
            <span className="material-symbols-outlined text-primary text-[24px]">local_atm</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            KES{' '}
            {Number(
              analytics?.paymentMethodBreakdown?.find((b) => b._id === 'cash')?.totalAmount || 0
            ).toLocaleString()}
          </div>
          <p className="text-label-sm text-on-surface-variant">Direct farm cashier receipts</p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-clinical border border-border-hairline shadow-sm space-y-2">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm uppercase font-bold tracking-wider">Customer Orders</span>
            <span className="material-symbols-outlined text-primary text-[24px]">shopping_bag</span>
          </div>
          <div className="font-headline-xl text-3xl font-bold text-on-surface">
            {orders.length}
          </div>
          <p className="text-label-sm text-on-surface-variant">
            {orders.filter((o) => o.orderStatus === 'pending').length} pending dispatch
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border-hairline pb-2">
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-5 py-2.5 rounded-xl font-label-md font-bold transition-all ${
            activeTab === 'payments'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-tinted'
          }`}
        >
          Payment Transactions Log ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-label-md font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-tinted'
          }`}
        >
          Customer Product Orders ({orders.length})
        </button>
      </div>

      {/* Main Table Content */}
      <div className="bg-surface-clinical rounded-2xl border border-border-hairline overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error font-medium">{error}</div>
        ) : activeTab === 'payments' ? (
          /* PAYMENTS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Receipt / Ref No.</th>
                  <th className="py-3.5 px-4">Customer Name &amp; Phone</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Amount (KES)</th>
                  <th className="py-3.5 px-4">Date &amp; Recorded By</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                      No payment transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((pmt) => (
                    <tr key={pmt._id} className="hover:bg-surface-tinted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {pmt.referenceNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-on-surface">{pmt.customerName || 'Farm Gate Customer'}</div>
                        <div className="text-[12px] text-on-surface-variant">{pmt.customerPhone || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-surface-tinted text-on-surface font-semibold text-[11px] uppercase">
                          {pmt.paymentMethod?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-on-surface text-base">
                        KES {Number(pmt.amount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-[12px] text-on-surface-variant">
                        <div>{new Date(pmt.transactionDate || pmt.createdAt).toLocaleDateString()}</div>
                        <div className="text-secondary">{pmt.recordedBy?.name || 'System'}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-on-surface-variant">{pmt.notes || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ORDERS TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-hairline bg-surface-tinted/30 text-label-sm uppercase font-bold text-outline">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer &amp; County</th>
                  <th className="py-3.5 px-4">Purchased Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-hairline text-body-sm">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-on-surface-variant">
                      No customer orders placed yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-surface-tinted/20 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-on-surface">{ord.customerName}</div>
                        <div className="text-[12px] text-on-surface-variant">{ord.customerPhone} &bull; {ord.county}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {ord.items?.map((it, idx) => (
                            <div key={idx} className="text-[12px]">
                              <strong>{it.quantity}x</strong> {it.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">
                        KES {Number(ord.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                            ord.orderStatus === 'fulfilled'
                              ? 'bg-primary-container text-on-primary-container'
                              : ord.orderStatus === 'processing'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-outline'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {ord.orderStatus !== 'fulfilled' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'fulfilled')}
                            className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-bold hover:bg-secondary transition-colors"
                          >
                            Mark Fulfilled
                          </button>
                        )}
                        {ord.orderStatus === 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(ord._id, 'processing')}
                            className="px-3 py-1 rounded-lg bg-surface-tinted text-primary text-xs font-semibold hover:bg-primary hover:text-on-primary transition-colors"
                          >
                            Process
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Cash Payment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-clinical rounded-3xl max-w-lg w-full border border-border-hairline shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-6 bg-gradient-to-r from-primary to-secondary text-on-primary flex items-center justify-between">
              <div>
                <h3 className="font-headline-sm text-xl font-bold">Record Cash / Manual Payment</h3>
                <p className="font-label-sm text-label-sm text-on-primary/80 mt-0.5">
                  Direct ledger and cash receipt registry
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-on-primary/20 hover:bg-on-primary/30 flex items-center justify-center text-on-primary"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              {recordError && (
                <div className="p-3 rounded-xl bg-error-container/40 border border-error/20 text-error text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{recordError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Payment Method *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="cash">Cash on Farm</option>
                    <option value="mpesa">M-Pesa Till Receipt</option>
                    <option value="bank_transfer">Bank Wire Transfer</option>
                    <option value="card">Debit/Credit Card</option>
                  </select>
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Receipt / Ref No. *</label>
                  <input
                    type="text"
                    required
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm font-mono focus:outline-none focus:border-primary uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Amount Paid (KES) *</label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="e.g. 5400"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-base font-bold text-primary focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Customer / Farmer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Mutua"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-label-sm font-semibold text-on-surface block mb-1">Customer Phone</label>
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-surface rounded-xl border border-border-hairline text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-label-sm font-semibold text-on-surface block mb-1">Transaction Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  disabled={recording}
                  className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-label-md font-bold hover:bg-secondary transition-colors shadow-sm disabled:opacity-60"
                >
                  {recording ? 'Saving Record...' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
