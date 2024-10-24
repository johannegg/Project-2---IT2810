import React from 'react';
import './Playlist.css';
import { Song } from '../../utils/FetchMockData';

interface PlaylistProps {
    name: string;
    backgroundColor: string;
    icon: string;
    songs: Song[];
    onClick: () => void;
  }
  
  const Playlist: React.FC<PlaylistProps> = ({ name, backgroundColor, icon, onClick }) => {
    return (
      <article 
        className="playlist-card" 
        onClick={onClick} 
        style={{ backgroundColor: backgroundColor }} 
      >
        <div className="playlist-icon">{icon}</div> 
        <h3>{name}</h3>
      </article>
    );
  };
  
  export default Playlist;
