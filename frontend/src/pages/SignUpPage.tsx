import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SignUpPage.css';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [step, setStep] = useState(1);
  const [pricingPlan, setPricingPlan] = useState<string | null>(null);
  const [cardDetails, setCardDetails] = useState<string>('');
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(
    null,
  );
  const [passwordMatchError, setPasswordMatchError] = useState<string | null>(
    null,
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Get the email passed from the LandingPage (use state instead of URLSearchParams)
  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleNextStep = () => {
    // Password match validation
    if (password !== confirmPassword) {
      setPasswordMatchError('Passwords do not match.');
      return;
    } else {
      setPasswordMatchError(null);
    }

    if (password.length < 16) {
      setPasswordMatchError(
        'Password must be at least 16 characters. Consider a passphrase.',
      );
      return;
    }

    setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Handle pricing plan selection
  const handlePricingPlanSelect = (plan: string) => {
    setPricingPlan(plan === pricingPlan ? null : plan); // Toggle selection
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
          credentials: 'include', // IMPORTANT: allows Identity cookie to be set
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
    <div className='sign-up-page container'>
      <header className='text-center mb-4'>
        <h2 className='fw-bold'>Create Your Account</h2>
      </header>

      {/* Display Email */}
      <div className='form-group'>
        <label>Email</label>
        <input
          type='email'
          className='form-control mb-3'
          value={email}
          readOnly
        />
      </div>

      {/* Steps for registration */}
      {/* Step 1: Set password */}
      {step === 1 && (
        <div className='step1'>
          <h3 className='mb-3'>Set Your Password</h3>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='password'
                placeholder='Enter A Long Password (Min 16 Characters)'
                className='form-control mb-3'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p
                className={`small ${password.length >= 16 ? 'text-success' : 'text-muted'}`}
              >
                {password.length} / 16 characters
              </p>
              <input
                type='password'
                placeholder='Confirm your password'
                className='form-control mb-3'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {/* Password match error */}
              {passwordMatchError && (
                <div className='error-message text-danger'>
                  {passwordMatchError}
                </div>
              )}
            </div>
            <div className='d-flex justify-content-between'>
              <button
                type='button'
                className='btn btn-light'
                onClick={handleBackStep}
              >
                Back
              </button>
              <button
                type='button'
                className='btn btn-primary'
                onClick={handleNextStep}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Select Pricing Plan */}
      {step === 2 && (
        <div className='step2'>
          <h3 className='mb-3'>Select Your Pricing Plan</h3>
          <div className='pricing'>
            <div className='card-container'>
              {/* Basic Plan Card */}
              <div
                className={`card ${pricingPlan === 'basic' ? 'selected' : ''}`}
                onClick={() => handlePricingPlanSelect('basic')}
              >
                <h3>Basic Plan</h3>
                <p>Perfect for individual use.</p>
                <div className='price'>$8.99/month</div>
                <button>Select</button>
              </div>

              {/* Premium Plan Card */}
              <div
                className={`card ${pricingPlan === 'premium' ? 'selected' : ''}`}
                onClick={() => handlePricingPlanSelect('premium')}
              >
                <h3>Premium Plan</h3>
                <p>Great for sharing with friends.</p>
                <div className='price'>$14.99/month</div>
                <button>Select</button>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className='d-flex justify-content-between'>
            <button
              type='button'
              className='btn btn-light'
              onClick={handleBackStep}
            >
              Back
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleNextStep}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Enter Payment Details */}
      {step === 3 && (
        <div className='step3'>
          <h3 className='mb-3'>Enter Your Payment Details</h3>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <input
                type='text'
                placeholder='Credit Card Number'
                className='form-control mb-3'
                value={cardDetails}
                onChange={(e) => setCardDetails(e.target.value)}
                disabled
              />
            </div>
            <div className='d-flex justify-content-between'>
              <button
                type='button'
                className='btn btn-light'
                onClick={handleBackStep}
              >
                Back
              </button>
              <button type='submit' className='btn btn-primary'>
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress bar */}
      <div className='progress-bar'>
        <div
          className='progress-bar-fill'
          style={{ width: `${(step - 1) * 33.33}%` }}
        ></div>
      </div>

      {/* Registration Status */}
      {registrationStatus === 'success' && (
        <div
          className='alert alert-success mt-3'
          style={{ color: 'green', fontWeight: 'bold' }}
        >
          Account successfully created! Redirecting...
        </div>
      )}

      {registrationStatus === 'error' && (
        <div className='alert alert-danger mt-3'>
          Error: Passwords don't match or pricing plan not selected. Please try
          again.
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
