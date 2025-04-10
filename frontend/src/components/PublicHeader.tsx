import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import '../components/PublicHeader.css';

const PublicHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Don't render on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="public-header">
      <div className="header-container">
        <Link to="/" className="brand-logo">
          CineNiche
        </Link>

        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tv" className="nav-link">TV Shows</Link>
          <Link to="/movies" className="nav-link">Movies</Link>
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
                  placeholder="Search movies and TV..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </form>
            )}
          </div>
          <Link to="/login" className="nav-link">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;