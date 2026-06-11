import React, { useState } from 'react';
import { signInApi, signUpApi, requestEmailVerification, verifyEmailCode, requestPhoneVerification, verifyPhoneCode, markPhoneVerified } from '../services/api';

export default function SignIn({ onSignIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0); // 0: form, 1: email verification, 2: phone verification
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState(false);

  const handleRequestEmailVerification = async () => {
    setLoading(true);
    setMessage('');
    try {
      await requestEmailVerification({ email });
      setMessage('Email verification code sent!');
      setVerificationStep(1);
    } catch (error) {
      setMessage(error.message || 'Failed to send verification code');
    }
    setLoading(false);
  };

  const handleVerifyEmail = async () => {
    setLoading(true);
    setMessage('');
    try {
      await verifyEmailCode({ email, code: emailCode });
      setVerifiedEmail(true);
      setMessage('Email verified successfully!');
      setTimeout(() => {
        setVerificationStep(2);
        setMessage('');
      }, 1000);
    } catch (error) {
      setMessage(error.message || 'Invalid verification code');
    }
    setLoading(false);
  };

  const handleRequestPhoneVerification = async () => {
    setLoading(true);
    setMessage('');
    try {
      await requestPhoneVerification({ phoneNumber });
      setMessage('SMS verification code sent to your phone!');
    } catch (error) {
      setMessage(error.message || 'Failed to send SMS');
    }
    setLoading(false);
  };

  const handleVerifyPhone = async () => {
    setLoading(true);
    setMessage('');
    try {
      await verifyPhoneCode({ phoneNumber, code: phoneCode });
      await markPhoneVerified({ phoneNumber });
      setVerifiedPhone(true);
      setMessage('Phone number verified successfully!');
      setVerificationStep(0);
    } catch (error) {
      setMessage(error.message || 'Invalid verification code');
    }
    setLoading(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        if (!verifiedEmail || !verifiedPhone) {
          setMessage('Please verify both email and phone number');
          setLoading(false);
          return;
        }
        const result = await signUpApi({ 
          name, 
          email, 
          password, 
          phoneNumber,
          emailVerificationCode: emailCode
        });
        onSignIn(result.user, result.token);
        setMessage('Account created successfully!');
      } else {
        const result = await signInApi({ email, password });
        onSignIn(result.user, result.token);
        setMessage('Signed in successfully!');
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed');
    }

    setLoading(false);
  };

  // Email Verification Step
  if (isSignUp && verificationStep === 1) {
    return (
      <div>
        <h1>Verify Email Address</h1>
        <p>We've sent a verification code to <strong>{email}</strong></p>
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyEmail(); }} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <label>
            Verification Code
            <input
              type="text"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength="6"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <button type="submit" style={{ padding: '12px 16px' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          <button
            type="button"
            onClick={() => setVerificationStep(0)}
            style={{ padding: '12px 16px', background: '#666', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Back
          </button>
        </form>
        {message && <p style={{ marginTop: 12, color: message.includes('success') || message.includes('verified') ? 'green' : 'red' }}>{message}</p>}
      </div>
    );
  }

  // Phone Verification Step
  if (isSignUp && verificationStep === 2) {
    return (
      <div>
        <h1>Verify Phone Number</h1>
        <p>We've sent a verification code to <strong>{phoneNumber}</strong></p>
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyPhone(); }} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
          <label>
            SMS Verification Code
            <input
              type="text"
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              maxLength="6"
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
          <button type="submit" style={{ padding: '12px 16px' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Phone'}
          </button>
          <button
            type="button"
            onClick={() => {
              setVerificationStep(1);
              handleRequestPhoneVerification();
            }}
            style={{ padding: '12px 16px', background: '#999', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Resend Code
          </button>
        </form>
        {message && <p style={{ marginTop: 12, color: message.includes('success') || message.includes('verified') ? 'green' : 'red' }}>{message}</p>}
      </div>
    );
  }

  // Main Form
  return (
    <div>
      <h1>{isSignUp ? 'Create Account' : 'Customer Sign In'}</h1>
      <p>{isSignUp ? 'Create a new account to start shopping.' : 'Sign in to place orders and track shipments.'}</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        {isSignUp && (
          <label>
            Full Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>
        )}
        <label>
          Email Address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        {isSignUp && (
          <>
            <label>
              Phone Number
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+256 or local format"
                required
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            {verifiedEmail && (
              <div style={{ padding: 12, background: '#e8f5e9', borderRadius: 4, color: '#2e7d32' }}>
                ✓ Email verified
              </div>
            )}
            {verifiedPhone && (
              <div style={{ padding: 12, background: '#e8f5e9', borderRadius: 4, color: '#2e7d32' }}>
                ✓ Phone verified
              </div>
            )}
          </>
        )}

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>

        {isSignUp ? (
          <>
            {!verifiedEmail ? (
              <button
                type="button"
                onClick={handleRequestEmailVerification}
                style={{ padding: '12px 16px', background: '#ff9800', color: '#fff', border: 'none', cursor: 'pointer' }}
                disabled={loading || !email}
              >
                {loading ? 'Sending...' : 'Verify Email'}
              </button>
            ) : !verifiedPhone ? (
              <button
                type="button"
                onClick={handleRequestPhoneVerification}
                style={{ padding: '12px 16px', background: '#ff9800', color: '#fff', border: 'none', cursor: 'pointer' }}
                disabled={loading || !phoneNumber}
              >
                {loading ? 'Sending...' : 'Verify Phone'}
              </button>
            ) : null}

            <button
              type="submit"
              style={{ padding: '12px 16px', opacity: verifiedEmail && verifiedPhone ? 1 : 0.5 }}
              disabled={loading || !verifiedEmail || !verifiedPhone}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </>
        ) : (
          <button type="submit" style={{ padding: '12px 16px' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        )}
      </form>
      <p style={{ marginTop: 16 }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setVerificationStep(0);
            setMessage('');
            setVerifiedEmail(false);
            setVerifiedPhone(false);
          }}
          style={{ border: 'none', background: 'none', color: '#4f46e5', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Sign In' : 'Create Account'}
        </button>
      </p>
      {message && <p style={{ marginTop: 12, color: message.includes('success') || message.includes('verified') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}
