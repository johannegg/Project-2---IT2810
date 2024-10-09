import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar: React.FC = () => {
  const location = useLocation(); 

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <Link
            to="/"
            className={location.pathname === '/' ? 'active' : ''}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/favorites"
            className={location.pathname === '/favorites' ? 'active' : ''}
          >
            Favorited songs
          </Link>
        </li>
        <li>
          <Link
            to="/playlists"
            className={location.pathname === '/playlists' ? 'active' : ''}
          >
            Your playlists
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
