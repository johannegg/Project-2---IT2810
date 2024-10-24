import { useState } from 'react';
import './Playlists.css';
import Playlist from '../../components/Playlist/Playlist';
import PlaylistForm from '../../components/PlaylistForm/PlaylistForm';

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
  
	const [showForm, setShowForm] = useState(false);
  
	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
	  setPlaylists([...playlists, { name: newPlaylistName, backgroundColor, icon }]);
	};
  
	const handlePlaylistClick = (playlistName: string) => {
	  console.log(`Navigating to playlist: ${playlistName}`);
	  // Add navigation logic here later
	};
  
	return (
	  <section className="playlists-page">
		<button onClick={() => setShowForm(true)} className="new-playlist-button">New Playlist</button>
		<h2>Your Playlists</h2>
  
		<PlaylistForm
		  show={showForm} 
		  onClose={() => setShowForm(false)} 
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
	  </section>
	);
  };

  export default Playlists;
