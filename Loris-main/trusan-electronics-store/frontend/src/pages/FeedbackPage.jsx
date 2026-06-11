import React, { useState, useEffect } from 'react';
import { getUserFeedback } from '../services/api';

export default function FeedbackPage({ user }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserFeedback();
    }
  }, [user]);

  const loadUserFeedback = async () => {
    try {
      setLoading(true);
      const data = await getUserFeedback();
      setFeedback(data);
    } catch (err) {
      setError('Failed to load feedback');
      console.error('Error loading feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Please sign in to view your feedback</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading your feedback...</p>
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>My Feedback</h1>

      {feedback.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            You haven't submitted any feedback yet.
          </p>
          <p style={{ color: '#888', marginTop: '10px' }}>
            Feedback will appear here after you complete orders and share your experience.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {feedback.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#4f46e5' }}>
                  Order #{item.orderId}
                </h3>
                <div style={{ fontSize: '24px', color: '#fbbf24' }}>
                  {renderStars(item.rating)}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <strong>Rating:</strong> {item.rating}/5 stars
              </div>

              {item.comment && (
                <div style={{ marginBottom: '15px' }}>
                  <strong>Comment:</strong>
                  <p style={{ margin: '5px 0', padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>
                    {item.comment}
                  </p>
                </div>
              )}

              <div style={{ color: '#666', fontSize: '14px' }}>
                Submitted on {new Date(item.createdAt).toLocaleDateString()} at{' '}
                {new Date(item.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ color: '#666' }}>
          Need help? Contact our customer support: <strong>WhatsApp: 0780275685</strong>
        </p>
      </div>
    </div>
  );
}