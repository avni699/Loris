import React, { useState } from 'react';

export default function MobileMoneyPayment({ amount, onPaymentComplete, onCancel }) {

  const providers = [
    { id: 'mtn', name: 'MTN Mobile Money', color: '#ffc107', logo: '📱' },
    { id: 'airtel', name: 'Airtel Money', color: '#dc3545', logo: '📞' }
  ];

  const handleProviderSelect = (providerId) => {
    setSelectedProvider(providerId);
    setStep('confirm');
  };

  const handleConfirmPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setProcessing(true);
    setStep('processing');

    // Simulate mobile money processing
    setTimeout(() => {
      setStep('success');
      setProcessing(false);
      onPaymentComplete({
        provider: selectedProvider,
        phoneNumber,
        transactionId: `MM-${Date.now()}`,
        amount
      });
    }, 3000);
  };

  if (step === 'select') {
    return (
      <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #ddd' }}>
        <h3>Select Mobile Money Provider</h3>
        <p>Choose your mobile money service to complete payment of UGX {Math.round(amount * 3700).toLocaleString()}</p>
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {providers.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleProviderSelect(provider.id)}
              style={{
                padding: '16px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                background: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 16
              }}
            >
              <span style={{ fontSize: 24 }}>{provider.logo}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>{provider.name}</div>
                <div style={{ fontSize: 14, color: '#666' }}>Pay with mobile money</div>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          style={{ marginTop: 16, padding: '10px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (step === 'confirm') {
    const provider = providers.find(p => p.id === selectedProvider);
    return (
      <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #ddd' }}>
        <h3>Confirm Payment</h3>
        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{provider.logo}</span>
            <span style={{ fontWeight: 600 }}>{provider.name}</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            UGX {Math.round(amount * 3700).toLocaleString()}
          </div>
          <div style={{ color: '#666' }}>≈ ${amount.toFixed(2)} UGX</div>
        </div>

        <label style={{ display: 'block', marginBottom: 16 }}>
          Phone Number
          <input
            type="tel"
            placeholder="07XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{ width: '100%', padding: 12, marginTop: 4, border: '1px solid #d1d5db', borderRadius: 6 }}
            required
          />
        </label>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleConfirmPayment}
            style={{ flex: 1, padding: '12px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Pay Now
          </button>
          <button
            onClick={() => setStep('select')}
            style={{ padding: '12px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #ddd', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
        <h3>Processing Payment</h3>
        <p>Please check your phone for the payment prompt and enter your PIN to complete the transaction.</p>
        <div style={{ margin: '20px 0' }}>
          <div style={{
            display: 'inline-block',
            width: 40,
            height: 40,
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <p style={{ color: '#666', fontSize: 14 }}>This may take a few moments...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ padding: 20, background: '#fff', borderRadius: 12, border: '1px solid #ddd', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h3>Payment Successful!</h3>
        <p>Your mobile money payment has been processed successfully.</p>
        <button
          onClick={onCancel}
          style={{ marginTop: 16, padding: '12px 24px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Continue
        </button>
      </div>
    );
  }

  return null;
}

<style>
{`
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`}
</style>