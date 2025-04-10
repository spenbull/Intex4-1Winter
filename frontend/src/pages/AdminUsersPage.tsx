import { useEffect, useState } from 'react';
import { fetchUsers } from '../api/UsersAPI';
import { User } from '../types/User';
import '../components/admin-styles/admin-layout.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) return <div className="loading-spinner" />;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-text">
          <h1>Users</h1>
          <p className="subtitle">Review and manage all users registered in the system.</p>
        </div>
      </div>


      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h2 className="empty-state-message">No users found</h2>
          <p>No users have been added yet</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Location</th>
                <th>Services</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.name}</td>
                  <td title={u.email}>{u.email ?? '-'}</td>
                  <td title={u.phone}>{u.phone ?? '-'}</td>
                  <td>{u.age ?? '-'}</td>
                  <td>{u.gender ?? '-'}</td>
                  <td title={[u.city, u.state, u.zip].filter(Boolean).join(', ')}>
                    {[u.city, u.state, u.zip].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td title={Object.entries(u)
                    .filter(([, v]) => typeof v === 'boolean' && v)
                    .map(([key]) => key)
                    .join(', ')}>
                    {Object.entries(u)
                      .filter(([, v]) => typeof v === 'boolean' && v)
                      .map(([key]) => key)
                      .join(', ') || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default AdminUsersPage;