import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Logout from './Logout';
import '../components/PublicHeader.css';
import { AdminAuthorizeView } from './AuthorizeAdminView';

const PublicHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          CineNiche
        </Link>

        <nav className="main-nav">
          <AdminAuthorizeView><Link to="/admin/movies" className="nav-link">Admin</Link></AdminAuthorizeView>
          <Link to="/HomePage" className="nav-link">Discover</Link>
          <Link to="/TvPage" className="nav-link">TV & Series</Link>
          <Link to="/MoviePage" className="nav-link">All Movies</Link>

          <div className="search-container">
            <button
              className="search-toggle"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="search-icon" />
            </button>
            {isSearchOpen && (
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search movies and shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </form>
            )}
          </div>

          <Logout>
            Logout
          </Logout>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
