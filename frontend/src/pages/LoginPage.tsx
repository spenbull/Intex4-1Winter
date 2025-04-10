import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import PublicHeader from '../components/PublicHeader';

// ✅ Deployed backend
const API_BASE_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!email || !password) {
      setErrorMessage('Please fill in all fields.');
      setLoading(false);
      return;
    }

    const loginUrl = rememberMe
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
    } catch (err: any) {
      setErrorMessage(err.message || 'Error logging in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <PublicHeader />
      <div className="login-container">
        <div className="login-form-wrapper">
          <h2>Sign In</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <p className="help-text">
              Need help?{' '}
              <a href="#" className="signup-link">
                Sign up now
              </a>
            </p>
          </form>
          <p className={`error ${errorMessage ? 'opacity-100' : 'opacity-0'}`}>
            {errorMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
