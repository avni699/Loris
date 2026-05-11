import React, { useState } from 'react';
import MobileMoneyPayment from '../components/MobileMoneyPayment';
import OrderFeedback from '../components/OrderFeedback';
import { sendOrderStatusSMS } from '../services/api';

export default function Checkout({ cartItems, user, onPlaceOrder, onSignIn }) {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: '', city: '', zip: '' });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showMobileMoney, setShowMobileMoney] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
    if (method === 'mobile-money') {
      setShowMobileMoney(true);
    }
  };

  const handleMobileMoneyComplete = (data) => {
    setPaymentData(data);
    setShowMobileMoney(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      onSignIn();
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }
    if (paymentMethod === 'mobile-money' && !paymentData) {
      alert('Please complete mobile money payment');
      return;
    }

    const orderData = {
      ...form,
      paymentMethod,
      paymentData,
      total
    };

    const order = onPlaceOrder(orderData);
    setPlacedOrder(order);
    setSubmitted(true);
    
    // Show feedback modal after a short delay
    setTimeout(() => {
      setShowFeedback(true);
    }, 1000);
    
    // Send SMS notification
    if (user?.phoneNumber) {
      sendOrderStatusSMS({
        phoneNumber: user.phoneNumber,
        orderId: order?.id,
        status: 'Order Received',
        message: 'Thank you for your purchase! We will contact you soon with delivery updates.'
      }).catch(err => console.log('SMS notification sent'));
    }
  };

  if (showMobileMoney) {
    return (
      <MobileMoneyPayment
        amount={total}
        onPaymentComplete={handleMobileMoneyComplete}
        onCancel={() => setShowMobileMoney(false)}
      />
    );
  }

  if (submitted) {
    return (
      <div>
        <h1>Checkout Complete</h1>
        <p>Thank you, {form.name || user?.name || 'Customer'}! Your order has been placed.</p>
        <p>Order total: ${total.toFixed(2)}</p>
        {paymentData && (
          <div style={{ marginTop: 16, padding: 16, background: '#f0f9ff', borderRadius: 8 }}>
            <h3>Payment Details</h3>
            <p><strong>Provider:</strong> {paymentData.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'}</p>
            <p><strong>Phone:</strong> {paymentData.phoneNumber}</p>
            <p><strong>Transaction ID:</strong> {paymentData.transactionId}</p>
          </div>
        )}
        {user && placedOrder && showFeedback && (
          <OrderFeedback
            order={placedOrder}
            user={user}
            token={localStorage.getItem('token')}
            onFeedbackSubmitted={() => setShowFeedback(false)}
            onClose={() => setShowFeedback(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add products before checking out.</p>
      ) : (
        <div style={{ display: 'grid', gap: 24 }}>
          <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, background: '#fff' }}>
            <h2>Order summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} style={{ marginBottom: 12 }}>
                <strong>{item.name}</strong> x {item.quantity}
                <div>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <p style={{ fontSize: 18, fontWeight: 700 }}>Total: ${total.toFixed(2)}</p>
            <p style={{ fontSize: 14, color: '#666' }}>≈ UGX {Math.round(total * 3700).toLocaleString()} (at current exchange rate)</p>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, background: '#fff' }}>
            <h2>Payment Method</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <button
                onClick={() => handlePaymentMethodSelect('cash-on-delivery')}
                style={{
                  padding: '16px',
                  border: paymentMethod === 'cash-on-delivery' ? '2px solid #059669' : '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 600 }}>💰 Cash on Delivery</div>
                <div style={{ fontSize: 14, color: '#666' }}>Pay when you receive your order</div>
              </button>

              <button
                onClick={() => handlePaymentMethodSelect('mobile-money')}
                style={{
                  padding: '16px',
                  border: paymentMethod === 'mobile-money' ? '2px solid #059669' : '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ fontWeight: 600 }}>📱 Mobile Money</div>
                <div style={{ fontSize: 14, color: '#666' }}>MTN Mobile Money or Airtel Money</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 500 }}>
            <label>
              Name
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              Address
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              City
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label>
              ZIP Code
              <input
                type="text"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <button
              type="submit"
              disabled={!paymentMethod}
              style={{
                padding: '12px 16px',
                background: paymentMethod ? '#059669' : '#9ca3af',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: paymentMethod ? 'pointer' : 'not-allowed'
              }}
            >
              Place Order
            </button>
          </form>
          {!user && (
            <div style={{ color: '#a00' }}>
              <p>You must sign in before placing an order.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
