import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Playlist.css';
import { Song } from '../../utils/FetchMockData';

interface PlaylistProps {
    id: string;
    name: string;
    backgroundColor: string;
    icon: string;
    songs: Song[];
    onClick: () => void;
}

const Playlist: React.FC<PlaylistProps> = ({ id, name, backgroundColor, icon, songs }) => {
    const navigate = useNavigate();

    const handleClick = () => {
      navigate(`/playlist/${id}`, {
          state: { playlist: { id, name, backgroundColor, icon, songs } }
      });
  };

    return (
      <article 
        className="playlist-card" 
        onClick={handleClick} 
        style={{ backgroundColor: backgroundColor }} 
      >
        <div className="playlist-icon">{icon}</div> 
        <h3>{name}</h3>
      </article>
    );
};

export default Playlist;
