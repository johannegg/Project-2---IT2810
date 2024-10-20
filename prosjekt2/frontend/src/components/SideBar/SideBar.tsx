import React, { useState } from 'react';
import './Sidebar.css';
import { Filter } from '../Filter/Filter';
import Sort from '../Sort/Sort';
import { Song } from '../../utils/FetchMockData';

type SidebarProps = {
  onGenreChange: (selectedGenres: string[]) => void;
  sortOption: string;
  onSortChange: (newSort: string, sortedSongs: Song[]) => void;
  songs: Song[];
};
export function Sidebar ({onGenreChange, sortOption, onSortChange, songs}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  

  return (
    <div className="sidebar-menu">
      <button className="hamburger-icon" onClick={toggleMenu}>
        {/* Hamburger icon (3 lines) */}
        <div className={isOpen ? 'line open' : 'line'} />
        <div className={isOpen ? 'line open' : 'line'} />
        <div className={isOpen ? 'line open' : 'line'} />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Filter onGenreChange={onGenreChange} />
          <br />
        <Sort
        songs={songs}
        sortOption={sortOption}
        onSortChange={onSortChange}
        />  
      </div>
      {/* Overlay to close the sidebar */}
      {isOpen && <div className="overlay" onClick={toggleMenu} />}
    </div>
  );
};
