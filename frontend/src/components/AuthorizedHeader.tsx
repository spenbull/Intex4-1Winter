import React from 'react';
import { Link } from 'react-router-dom';
import './AuthorizedHeader.css';
import Logout from './Logout';

const AuthorizedHeader: React.FC = () => {
  return (
    <header className='private-header'>
      <div className='header-container'>
        {/* Brand logo on the left */}
        <div className='brand-logo'>
          <Link to='/'>CineNiche</Link>
        </div>
        {/* Navigation links */}
        <nav className='navigation'>
          <ul>
            <li>
              <Link to='/MoviePage'>Movies</Link>
            </li>
            <li>
              <Link to='/TvPage'>TV Shows</Link>
            </li>
            <li>
              <Link to='/originals'>Originals</Link>
            </li>
          </ul>
        </nav>
        {/* User menu */}
        <div className='user-menu'>
          <Link to='/profile' className='profile-link'>
            Profile
          </Link>
          <Logout>Logout</Logout>
        </div>
      </div>
    </header>
  );
};

export default AuthorizedHeader;