import React from 'react';

export default function Cart({ cartItems, onRemoveItem, onChangeQuantity, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Add products from the store to begin checkout.</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 16 }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: 12, padding: 16, display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: 16, alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                <div>
                  <h2 style={{ margin: 0 }}>{item.name}</h2>
                  <p style={{ margin: '8px 0 0', color: '#555' }}>{item.category}</p>
                  <p style={{ margin: '8px 0 0', fontWeight: 700 }}>${item.price.toFixed(2)}</p>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => onChangeQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onChangeQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button style={{ padding: '10px 14px' }} onClick={() => onRemoveItem(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, border: '1px solid #ddd', borderRadius: 12, background: '#fafafa' }}>
            <h2>Order Summary</h2>
            <p style={{ margin: '8px 0' }}>Items: {cartItems.length}</p>
            <p style={{ margin: '8px 0', fontSize: 18, fontWeight: 700 }}>Total: ${total.toFixed(2)}</p>
            <button style={{ padding: '12px 18px', marginTop: 12 }} onClick={onCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
