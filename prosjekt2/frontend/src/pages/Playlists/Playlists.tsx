import { useState } from 'react';
import './Playlists.css';
import Playlist from '../../components/Playlist/Playlist';
import Modal from '../../components/MakePlaylist/MakePlaylist';

interface PlaylistData {
	name: string;
	backgroundColor: string;
	icon: string;
  }
  
  const Playlists = () => {
	const [playlists, setPlaylists] = useState<PlaylistData[]>([
	  { name: 'My playlist 1', backgroundColor: '#ffffff', icon: '🎵' },
	  { name: 'My playlist 2', backgroundColor: '#ffffff', icon: '🎧' }
	]);
  
	const [showModal, setShowModal] = useState(false);
  
	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
	  setPlaylists([...playlists, { name: newPlaylistName, backgroundColor, icon }]);
	};
  
	const handlePlaylistClick = (playlistName: string) => {
	  console.log(`Navigating to playlist: ${playlistName}`);
	  // Add navigation logic here later
	};
  
	return (
	  <div className="playlists-page">
		<button onClick={() => setShowModal(true)} className="new-playlist-button">New Playlist</button>
		<h2>Your Playlists</h2>
  
		<Modal 
		  show={showModal} 
		  onClose={() => setShowModal(false)} 
		  onSubmit={addNewPlaylist} 
		/>
  
		<div className="playlists-container">
		  {playlists.map((playlist) => (
			<Playlist 
			  key={playlist.name} 
			  name={playlist.name}
			  backgroundColor={playlist.backgroundColor}
			  icon={playlist.icon}
			  onClick={() => handlePlaylistClick(playlist.name)} 
			/>
		  ))}
		</div>
	  </div>
	);
  };

  export default Playlists;
