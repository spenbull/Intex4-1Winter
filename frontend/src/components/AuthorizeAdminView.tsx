import React, { useState, useEffect, createContext } from 'react';

// Interface representing the authenticated user
interface User {
  email: string;
  roles: string[];
}

// Backend API base URL
const API_BASE_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net';

// Global context to store the authenticated user's data
const UserContext = createContext<User | null>(null);

// Component to wrap children with auth-only access for any logged-in user
function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser);

  useEffect(() => {
    // Checks user authentication status on mount
    async function fetchUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/pingauth`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        console.log('[AuthorizeView] Fetched user data:', data);

        // If a valid session exists, authorize user
        if (data.email) {
          setUser({ email: data.email, roles: data.roles ?? [] });
          setAuthorized(true);
        } else {
          throw new Error('Invalid user session');
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Show loading state while checking
  if (loading) return <p>Loading...</p>;

  // If authorized, expose user context to children
  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  // Show fallback message if not authorized
  console.log('[AuthorizeView] Not authorized. User:', user);
  return (
    <div>
      <h2>Access Denied</h2>
      <p>You must be logged in to view this page.</p>
    </div>
  );
}

// Same as AuthorizeView, but also checks for admin privileges
export function AdminAuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser);

  useEffect(() => {
    // Checks user authentication and role status on mount
    async function fetchAdminStatus() {
      try {
        // First ping to get logged-in email
        const pingRes = await fetch(`${API_BASE_URL}/pingauth`, {
          method: 'GET',
          credentials: 'include',
        });

        const pingData = await pingRes.json();
        if (!pingData.email) throw new Error('User not logged in');

        const email = pingData.email;
        console.log('[AdminAuthorizeView] Email from pingauth:', email);

        // Second request to check roles
        const roleRes = await fetch(`${API_BASE_URL}/role/getuserroles?email=${email}`, {
          method: 'GET',
          credentials: 'include',
        });

        const roleData = await roleRes.json();
        console.log('[AdminAuthorizeView] Roles for user:', roleData);

        // Authorize only if 'Administrator' is among the roles
        if (roleData.roles?.includes('Administrator')) {
          setUser({ email, roles: roleData.roles });
          setAuthorized(true);
        } else {
          throw new Error('Not an admin');
        }
      } catch {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminStatus();
  }, []);

  // Show loading indicator while verifying admin status
  if (loading) return <p>Loading...</p>;

  // If admin authorized, render children with user context
  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  // Implicitly returns undefined if not authorized — renders nothing
}

// Utility component to access current user info
export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null;

  if (props.value === 'email') return <>{user.email}</>;
  if (props.value === 'roles') return <>{user.roles.join(', ')}</>;

  return null;
}

export { UserContext };
export default AuthorizeView;
