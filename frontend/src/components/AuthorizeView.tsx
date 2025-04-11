import React, { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';

// Backend base URL for authentication endpoints
const API_BASE_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net';

// Define the shape of the user object stored in context
interface User {
  email: string;
}

// Create a context to share user info across components
const UserContext = createContext<User | null>(null);

// Component that authorizes any logged-in user before rendering children
function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const emptyuser: User = { email: '' };
  const [user, setUser] = useState(emptyuser);

  useEffect(() => {
    // Helper function to fetch user session and validate response
    async function fetchWithRetry(url: string, options: any) {
      try {
        const response = await fetch(url, options);

        // Ensure successful response
        if (!response.ok) {
          throw new Error(`Authorization failed: ${response.status} ${response.statusText}`);
        }

        // Validate content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }

        const data = await response.json();

        // Check for user email in response
        if (data.email) {
          setUser({ email: data.email });
          setAuthorized(true);
        } else {
          throw new Error('No email found in response');
        }
      } catch (error) {
        console.error('🔐 Authorization error:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    // Attempt to fetch authenticated user info
    fetchWithRetry(`${API_BASE_URL}/pingauth`, {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent
    });
  }, []);

  // Show loading state while verifying user
  if (loading) {
    return <p>Loading...</p>;
  }

  // If user is authorized, render children within context
  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  // Redirect to login page if user is not authorized
  return <Navigate to="/login" />;
}

// Component to display the user's email from context
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null;

  return props.value === 'email' ? <>{user.email}</> : null;
}

export default AuthorizeView;
