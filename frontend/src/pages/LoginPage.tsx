import React, { useState } from 'react';
import './LoginPage.css';
import PublicHeader from '../components/PublicHeader';
import { useNavigate } from 'react-router-dom';

// ✅ Hardcoded deployed backend URL
const API_BASE_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberme, setRememberme] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRememberme(checked);
    } else if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const loginUrl = rememberme
      ? `${API_BASE_URL}/login?useCookies=true`
      : `${API_BASE_URL}/login?useSessionCookies=true`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const contentLength = response.headers.get('content-length');
      const data =
        contentLength && parseInt(contentLength, 10) > 0 ? await response.json() : null;

      if (!response.ok) {
        throw new Error(data?.message || 'Invalid email or password.');
      }

      navigate('/homepage');
    } catch (error: any) {
      setError(error.message || 'Error logging in.');
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-body'>
      <div className='login-container'>
        <PublicHeader />
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              autoComplete='email'
              placeholder='Enter your email'
              value={email}
              onChange={handleChange}
              required
            />
          </div>

          <div className='mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              autoComplete='current-password'
              placeholder='Enter your password'
              value={password}
              onChange={handleChange}
              required
            />
          </div>

          <div className='mb-3 form-check'>
            <input
              type='checkbox'
              className='form-check-input'
              id='rememberme'
              name='rememberme'
              checked={rememberme}
              onChange={handleChange}
            />
            <label className='form-check-label' htmlFor='rememberme'>
              Remember me
            </label>
          </div>

          <button type='submit' className='btn-login btn-goldenrod' disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className='social-buttons'>
          <button className='btn-social btn-google'>
            <span className='icon'>{/* Google icon here */}</span>
            Sign In with Google
          </button>
          <button className='btn-social btn-facebook'>
            <span className='icon'>{/* Facebook icon here */}</span>
            Sign In with Facebook
          </button>
        </div>

        {error && <p className='error opacity-100'>{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
