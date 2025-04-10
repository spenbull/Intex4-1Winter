import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css'; // ✅ Reuse LoginPage styles
import PublicHeader from '../components/PublicHeader';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [step, setStep] = useState(1);
  const [pricingPlan, setPricingPlan] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleNextStep = () => {
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    } else {
      setPasswordMatchError(null);
    }

    if (password.length < 16) {
      setPasswordMatchError('Password must be at least 16 characters. Consider a passphrase.');
      return;
    }

    setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePricingPlanSelect = (plan: string) => {
    setPricingPlan(plan === pricingPlan ? null : plan);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword || !pricingPlan) {
      setRegistrationStatus('error');
      return;
    }

    try {
      const response = await fetch(
        'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
            rememberMe: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Registration failed.');
      }

      const result = await response.json();
      console.log('✅ Registration success:', result);
      setRegistrationStatus('success');

      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('🚨 Registration error:', error);
      setRegistrationStatus('error');
    }
  };

  return (
    <div className="login-body">
      <PublicHeader />
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2>Create Your Account</h2>

          {/* Email Field */}
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              value={email}
              readOnly
              placeholder="Email"
            />
          </div>

          {/* Step 1: Set Password */}
          {step === 1 && (
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Enter a long password (min 16 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className={`small ${password.length >= 16 ? 'text-success' : 'text-muted'}`}>
                  {password.length} / 16 characters
                </p>
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {passwordMatchError && (
                <p className="error opacity-100">{passwordMatchError}</p>
              )}

              <button type="button" className="login-btn" onClick={handleNextStep}>
                Next
              </button>
            </form>
          )}

          {/* Step 2: Select Pricing Plan */}
          {step === 2 && (
            <div className="login-form">
              <h3 className="mb-3">Select Your Pricing Plan</h3>
              <div className="pricing card-container">
                <div
                  className={`card ${pricingPlan === 'basic' ? 'selected' : ''}`}
                  onClick={() => handlePricingPlanSelect('basic')}
                >
                  <h3>Basic Plan</h3>
                  <p>Perfect for individual use.</p>
                  <div className="price">$8.99/month</div>
                </div>

                <div
                  className={`card ${pricingPlan === 'premium' ? 'selected' : ''}`}
                  onClick={() => handlePricingPlanSelect('premium')}
                >
                  <h3>Premium Plan</h3>
                  <p>Great for sharing with friends.</p>
                  <div className="price">$14.99/month</div>
                </div>
              </div>

              <button type="button" className="login-btn" onClick={handleNextStep}>
                Next
              </button>
              <button type="button" className="login-btn" onClick={handleBackStep} style={{ backgroundColor: '#666', marginTop: '1rem' }}>
                Back
              </button>
            </div>
          )}

          {/* Step 3: Enter Payment Details */}
          {step === 3 && (
            <form className="login-form" onSubmit={handleSubmit}>
              <h3 className="mb-3">Enter Your Payment Details</h3>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Credit Card Number"
                  value={cardDetails}
                  onChange={(e) => setCardDetails(e.target.value)}
                  disabled
                />
              </div>

              <button type="submit" className="login-btn">
                Complete Registration
              </button>
              <button type="button" className="login-btn" onClick={handleBackStep} style={{ backgroundColor: '#666', marginTop: '1rem' }}>
                Back
              </button>
            </form>
          )}

          {/* Status messages */}
          {registrationStatus === 'success' && (
            <p className="error opacity-100" style={{ color: 'lightgreen' }}>
              Account successfully created! Redirecting...
            </p>
          )}
          {registrationStatus === 'error' && (
            <p className="error opacity-100">
              Error: Passwords don't match or pricing plan not selected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
