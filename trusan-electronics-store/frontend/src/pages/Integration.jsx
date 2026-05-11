import React, { useEffect, useState } from 'react';
import { fetchUgandaIntegrations } from '../services/api';

export default function Integration() {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUgandaIntegrations()
      .then((items) => {
        setIntegrations(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Unable to load integrations');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>Uganda Ecommerce Integration</h1>
      <p>Designed to solve the biggest ecommerce problems in Uganda with local payments, logistics, and price sourcing.</p>
      {loading && <p>Loading solutions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'grid', gap: 16 }}>
        {integrations.map((item) => (
          <div key={item.title} style={{ border: '1px solid #ddd', borderRadius: 16, padding: 20, background: '#fff' }}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <p style={{ fontWeight: 700 }}>{item.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
