import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../services/api';

export default function OrderDetails({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#fbbf24';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#10b981';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Please sign in to view your orders</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            You haven't placed any orders yet.
          </p>
          <p style={{ color: '#888', marginTop: '10px' }}>
            Start shopping to see your order history here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: '#fff',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#4f46e5' }}>
                  Order #{order.id}
                </h3>
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: getStatusColor(order.status),
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {order.status}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <strong>Total:</strong> {formatCurrency(order.total)}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Items:</strong> {order.items?.length || 0}
                </div>
              </div>

              {selectedOrder?.id === order.id && (
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                  <h4 style={{ marginBottom: '15px' }}>Order Details</h4>

                  <div style={{ marginBottom: '20px' }}>
                    <h5>Items:</h5>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {order.items?.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                          <div>
                            <strong>{item.name}</strong> (x{item.quantity})
                          </div>
                          <div>{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.shipping && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5>Shipping Address:</h5>
                      <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                        <p style={{ margin: '5px 0' }}>{order.shipping.name}</p>
                        <p style={{ margin: '5px 0' }}>{order.shipping.address}</p>
                        <p style={{ margin: '5px 0' }}>{order.shipping.city}, {order.shipping.country}</p>
                        <p style={{ margin: '5px 0' }}>{order.shipping.phone}</p>
                      </div>
                    </div>
                  )}

                  {order.paymentMethod && (
                    <div style={{ marginBottom: '20px' }}>
                      <h5>Payment Method:</h5>
                      <p>{order.paymentMethod}</p>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <strong>Subtotal:</strong> {formatCurrency(order.subtotal || order.total)}
                    </div>
                    <div>
                      <strong>Total:</strong> {formatCurrency(order.total)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>
          Need help with an order? Contact our customer support: <strong>WhatsApp: 0780275685</strong>
        </p>
      </div>
    </div>
  );
}