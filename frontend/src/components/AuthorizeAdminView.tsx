import React, { useState, useEffect, createContext } from 'react';

interface User {
  email: string;
  roles: string[];
}

const API_BASE_URL = 'https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net';
const UserContext = createContext<User | null>(null);

function AuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/pingauth`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json();
        console.log('[AuthorizeView] Fetched user data:', data);

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

  if (loading) return <p>Loading...</p>;

  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  console.log('[AuthorizeView] Not authorized. User:', user);
  return (
    <div>
      <h2>Access Denied</h2>
      <p>You must be logged in to view this page.</p>
    </div>
  );
}

export function AdminAuthorizeView(props: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const emptyuser: User = { email: '', roles: [] };
  const [user, setUser] = useState<User>(emptyuser);

  useEffect(() => {
    async function fetchAdminStatus() {
      try {
        const pingRes = await fetch(`${API_BASE_URL}/pingauth`, {
          method: 'GET',
          credentials: 'include',
        });

        const pingData = await pingRes.json();
        if (!pingData.email) throw new Error('User not logged in');

        const email = pingData.email;
        console.log('[AdminAuthorizeView] Email from pingauth:', email);

        const roleRes = await fetch(`${API_BASE_URL}/role/getuserroles?email=${email}`, {
          method: 'GET',
          credentials: 'include',
        });

        const roleData = await roleRes.json();
        console.log('[AdminAuthorizeView] Roles for user:', roleData);

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

  if (loading) return <p>Loading...</p>;

  if (authorized) {
    return (
      <UserContext.Provider value={user}>
        {props.children}
      </UserContext.Provider>
    );
  }

  console.log('[AdminAuthorizeView] Not authorized. User:', user);
  return (
    <div>
      <h2>Admin Access Required</h2>
      <p>You do not have permission to view this page.</p>
      <p>Check the console for user data and roles.</p>
    </div>
  );
}

export function AuthorizedUser(props: { value: string }) {
  const user = React.useContext(UserContext);

  if (!user) return null;

  if (props.value === 'email') return <>{user.email}</>;
  if (props.value === 'roles') return <>{user.roles.join(', ')}</>;

  return null;
}

export { UserContext };
export default AuthorizeView;
