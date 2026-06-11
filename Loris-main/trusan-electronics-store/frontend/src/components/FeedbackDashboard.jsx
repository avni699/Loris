import React, { useState, useEffect } from 'react';
import { getAllFeedback } from '../services/api';

export default function FeedbackDashboard({ token, user }) {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const result = await getAllFeedback({ token });
        setFeedback(result.feedback || []);
        setStats(result.stats || {});
      } catch (error) {
        setMessage(error.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    };

    if (token && user?.isAdmin) {
      fetchFeedback();
    }
  }, [token, user]);

  if (!user?.isAdmin) {
    return <div><p style={{ color: 'red' }}>Admin access required</p></div>;
  }

  if (loading) {
    return <div><p>Loading feedback data...</p></div>;
  }

  return (
    <div>
      <h2>Customer Feedback Dashboard</h2>
      
      {/* Statistics */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32
        }}>
          <div style={{
            background: '#f0f9ff',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #e0e7ff'
          }}>
            <div style={{ fontSize: 12, color: '#666' }}>Total Feedback</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af' }}>{stats.total}</div>
          </div>
          
          <div style={{
            background: '#fef3c7',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: 12, color: '#666' }}>Average Rating</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#b45309' }}>
              {stats.averageRating || '0'} ★
            </div>
          </div>

          <div style={{
            background: '#dbeafe',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ fontSize: 12, color: '#666' }}>Avg Delivery</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af' }}>
              {stats.averageDelivery || '0'} ★
            </div>
          </div>

          <div style={{
            background: '#dcfce7',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: 12, color: '#666' }}>Avg Quality</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#166534' }}>
              {stats.averageQuality || '0'} ★
            </div>
          </div>

          <div style={{
            background: '#ede9fe',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #ddd6fe'
          }}>
            <div style={{ fontSize: 12, color: '#666' }}>Avg Service</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#6d28d9' }}>
              {stats.averageService || '0'} ★
            </div>
          </div>
        </div>
      )}

      {/* Feedback List */}
      <div>
        <h3>All Customer Feedback</h3>
        {feedback.length === 0 ? (
          <p style={{ color: '#999' }}>No feedback received yet</p>
        ) : (
          <div style={{
            display: 'grid',
            gap: 16
          }}>
            {feedback.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  padding: 16
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12
                }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.customerName}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {item.customerEmail}
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      Order: {item.orderId.slice(-8)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20 }}>
                      {'★'.repeat(item.rating)}
                      {'☆'.repeat(5 - item.rating)}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {item.comment && (
                  <div style={{
                    background: '#f9fafb',
                    padding: 12,
                    borderRadius: 4,
                    marginBottom: 12,
                    fontSize: 14,
                    lineHeight: 1.5
                  }}>
                    "{item.comment}"
                  </div>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 12,
                  fontSize: 12
                }}>
                  <div>
                    <div style={{ color: '#666' }}>Delivery</div>
                    <div>{'★'.repeat(item.deliveryRating || 0)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Quality</div>
                    <div>{'★'.repeat(item.productQuality || 0)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#666' }}>Service</div>
                    <div>{'★'.repeat(item.customerService || 0)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <p style={{
          marginTop: 16,
          padding: 12,
          background: '#ffebee',
          color: '#c62828',
          borderRadius: 4
        }}>
          {message}
        </p>
      )}
    </div>
  );
}
