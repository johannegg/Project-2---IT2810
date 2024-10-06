import React, { useState } from 'react';
import './NavBar.css';

const NavBar: React.FC = () => {
  const [activeLink, setActiveLink] = useState<string>('Home'); 

  const handleClick = (link: string) => {
    setActiveLink(link); 
  }

  return (
    <nav className="navbar">
      <ul className="navbar-menu">
        <li>
          <a
            href="/"
            className={activeLink === 'Home' ? 'active' : ''}
            onClick={() => handleClick('Home')}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/favorites"
            className={activeLink === 'Favorited songs' ? 'active' : ''}
            onClick={() => handleClick('Favorited songs')}
          >
            Favorited songs
          </a>
        </li>
        <li>
          <a
            href="/playlists"
            className={activeLink === 'Your playlists' ? 'active' : ''}
            onClick={() => handleClick('Your playlists')}
          >
            Your playlists
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
