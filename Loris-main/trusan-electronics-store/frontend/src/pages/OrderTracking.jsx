import React, { useState } from 'react';
import { fetchOrderStatus } from '../services/api';

export default function OrderTracking() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await fetchOrderStatus(orderId, email);
      setResult(data);
    } catch (err) {
      setError(err.body?.message || err.message || 'Unable to track the order');
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Track Your Order</h1>
      <p>Enter your order ID and email to see the latest status and shipment updates.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 480 }}>
        <label>
          Order ID
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, marginTop: 4 }}
          />
        </label>
        <button type="submit" style={{ padding: '12px 18px', marginTop: 8 }}>Track Order</button>
      </form>
      {loading && <p>Checking order status…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 24, border: '1px solid #ddd', borderRadius: 16, padding: 20, background: '#fff' }}>
          <h2>Current Status: {result.status}</h2>
          {result.updates?.map((update, index) => (
            <div key={index} style={{ marginBottom: 12 }}>
              <p style={{ margin: '0 0 4px' }}><strong>{update.status}</strong></p>
              <p style={{ margin: 0 }}>{update.message}</p>
              <p style={{ margin: '4px 0 0', color: '#555' }}>{new Date(update.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
