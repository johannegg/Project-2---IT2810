import React from 'react';
import './Header.css'; 
import couchIcon from '../../assets/couch.svg'; 

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <img
          src={couchIcon} 
          alt="Sofa Icon"
          className="sofa-icon"
        />
        <h1 className="header-title">Lyrical Lounge</h1>
      </div>
    </header>
  );
};

export default Header;
