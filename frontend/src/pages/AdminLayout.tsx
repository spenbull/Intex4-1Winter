import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import '../components/admin-styles/admin-layout.css';

interface AdminLayoutProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  children: React.ReactNode;
}

const AdminLayout = ({ theme, setTheme, children }: AdminLayoutProps) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar open by default for dev

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="admin-wrapper" data-theme={theme}>

      <AdminSidebar
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isSidebarCollapsed ? '☰' : '×'}
      </button>

      <div
        className={`sidebar-overlay ${!isSidebarCollapsed ? 'visible' : ''}`}
        onClick={toggleSidebar}
      />

      <main className={`main-content ${!isSidebarCollapsed ? 'sidebar-visible' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;