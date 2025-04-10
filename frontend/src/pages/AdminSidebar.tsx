import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface AdminSidebarProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: string;
  toggleTheme: () => void;
}

interface SidebarSection {
  title: string;
  icon: string;
  links: {
    path: string;
    label: string;
  }[];
}

const AdminSidebar = ({
  isSidebarCollapsed,
  toggleSidebar,
  theme,
  toggleTheme,
}: AdminSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    movies: true,
    users: false,
    analytics: false,
  });

  const location = useLocation();

  const sections: SidebarSection[] = [
    {
      title: 'Movies',
      icon: '🎬',
      links: [
        { path: '/admin/movies', label: 'All Movies' },
        { path: '/admin/movies?add=true', label: 'Add Movie' }, // 🔁 updated!
        { path: '/admin/movies/categories', label: 'Genres' },
      ],
    },
    {
      title: 'Users',
      icon: '👥',
      links: [
        { path: '/admin/users', label: 'All Users' },
        { path: '/admin/users/roles', label: 'User Roles' },
        { path: '/admin/users/feedback', label: 'Feedback' },
      ],
    },
    {
      title: 'Analytics',
      icon: '📊',
      links: [
        { path: '/admin/analytics/reports', label: 'View Reports' },
        { path: '/admin/analytics/trends', label: 'Watch Trends' },
        { path: '/admin/analytics/ratings', label: 'Ratings Dashboard' },
      ],
    },
  ];

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle.toLowerCase()]: !prev[sectionTitle.toLowerCase()],
    }));
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && !isSidebarCollapsed) {
      toggleSidebar();
    }
  };

  return (
    <aside className={`sidebar ${!isSidebarCollapsed ? 'visible' : ''}`}>
      <div className="sidebar-header">
        <a href="/" className="sidebar-logo">Movie Admin</a>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </div>
      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div key={section.title} className={`sidebar-section ${expandedSections[section.title.toLowerCase()] ? 'expanded' : ''}`}>
            <div 
              className="sidebar-section-header"
              onClick={() => toggleSection(section.title)}
            >
              <span>
                {section.icon} {section.title}
              </span>
              <span className="arrow">▼</span>
            </div>
            <div className="sidebar-section-content">
              {section.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;