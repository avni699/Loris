import React, { useState } from 'react';
import { submitOrderFeedback } from '../services/api';

export default function OrderFeedback({ order, user, token, onFeedbackSubmitted, onClose }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [productQuality, setProductQuality] = useState(5);
  const [customerService, setCustomerService] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await submitOrderFeedback({
        orderId: order.id,
        rating,
        comment,
        deliveryRating,
        productQuality,
        customerService,
        token
      });
      setMessage('Thank you for your feedback!');
      setTimeout(() => {
        onFeedbackSubmitted();
      }, 1500);
    } catch (error) {
      setMessage(error.message || 'Failed to submit feedback');
    }

    setLoading(false);
  };

  const renderStars = (currentRating, setCurrentRating) => (
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setCurrentRating(star)}
          style={{
            fontSize: 24,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            opacity: star <= currentRating ? 1 : 0.3
          }}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: '#fff',
        padding: 32,
        borderRadius: 8,
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        <h2>Share Your Feedback</h2>
        <p style={{ color: '#666', marginBottom: 16 }}>
          Order #{order.id.slice(-8)} - Help us improve your shopping experience
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          {/* Overall Rating */}
          <div>
            <label style={{ fontWeight: 500 }}>Overall Rating</label>
            {renderStars(rating, setRating)}
          </div>

          {/* Delivery Rating */}
          <div>
            <label style={{ fontWeight: 500 }}>Delivery Experience</label>
            {renderStars(deliveryRating, setDeliveryRating)}
          </div>

          {/* Product Quality */}
          <div>
            <label style={{ fontWeight: 500 }}>Product Quality</label>
            {renderStars(productQuality, setProductQuality)}
          </div>

          {/* Customer Service */}
          <div>
            <label style={{ fontWeight: 500 }}>Customer Service</label>
            {renderStars(customerService, setCustomerService)}
          </div>

          {/* Comment */}
          <div>
            <label style={{ fontWeight: 500 }}>Your Feedback (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you think about your purchase..."
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                marginTop: 8,
                border: '1px solid #ddd',
                borderRadius: 4,
                fontFamily: 'inherit',
                fontSize: 14
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 16px',
                background: '#e0e0e0',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 16px',
                background: '#4f46e5',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>

        {message && (
          <p style={{
            marginTop: 16,
            padding: 12,
            background: message.includes('Thank you') ? '#e8f5e9' : '#ffebee',
            color: message.includes('Thank you') ? '#2e7d32' : '#c62828',
            borderRadius: 4,
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
