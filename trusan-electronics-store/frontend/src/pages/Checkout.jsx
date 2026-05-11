import React, { useState } from 'react';

export default function Checkout({ cartItems, user, onPlaceOrder, onSignIn }) {
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: '', city: '', zip: '' });
  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      onSignIn();
      return;
    }
    onPlaceOrder({ ...form, total });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <h1>Checkout Complete</h1>
        <p>Thank you, {form.name || user?.name || 'Customer'}! Your order has been placed.</p>
        <p>Order total: ${total.toFixed(2)}</p>
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
            <button type="submit" style={{ padding: '12px 16px' }}>
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
