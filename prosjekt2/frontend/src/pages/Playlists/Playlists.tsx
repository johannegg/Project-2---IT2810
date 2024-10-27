import { useState } from 'react';
import './Playlists.css';
import Playlist from '../../components/Playlist/Playlist';
import PlaylistForm from '../../components/PlaylistForm/PlaylistForm';
import { Song } from '../../utils/FetchMockData';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export interface PlaylistData {
	id: string;
	name: string;
	backgroundColor: string;
	icon: string;
	songs: Song[];
	
  }
  
  const Playlists = () => {
	const navigate = useNavigate();
	const [playlists, setPlaylists] = useState<PlaylistData[]>([
		{ 
		  id: uuidv4(),
		  name: 'My playlist 1', 
		  backgroundColor: '#ffffff', 
		  icon: '🎵', 
		  songs: [
			{ id: 0, title: "Song A", artist: "Artist 1", year: 2015, views: 500, lyrics: "...", genre: "pop" }, 
			{ id: 1, title: "Song B", artist: "Artist 2", year: 2016, views: 500, lyrics: "...", genre: "pop" }
		  ]
		},
		{ 
		  id: uuidv4(), 
		  name: 'My playlist 2', 
		  backgroundColor: '#ffffff', 
		  icon: '🎧', 
		  songs: [
			{ id: 2, title: "Song C", artist: "Artist 3", year: 2015, views: 300, lyrics: "...", genre: "pop" }, 
			{ id: 3, title: "Song D", artist: "Artist 4", year: 2015, views: 500, lyrics: "...", genre: "pop" }
		  ]
		}
	  ]);
  
	const [showForm, setShowForm] = useState(false);
  
	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
		const newPlaylist = {
		  id: uuidv4(), 
		  name: newPlaylistName,
		  backgroundColor,
		  icon,
		  songs: []
		};
	  
		setPlaylists([...playlists, newPlaylist]);
	  };
  
	  const handlePlaylistClick = (playlist: PlaylistData) => {
		navigate(`/playlist/${playlist.id}`, { state: { playlist } });
	  };
  
	return (
	  <section className="playlists-page">
		<h2>Your Playlists</h2>
  
		<PlaylistForm
		  show={showForm} 
		  onClose={() => setShowForm(false)} 
		  onSubmit={addNewPlaylist} 
		/>
		<div className='outer-playlist-container'>
			<button onClick={() => setShowForm(true)} className="new-playlist-button">New Playlist</button>
				<div className="playlists-container">
				{playlists.map((playlist) => (
					<Playlist
					id={playlist.id}
					key={playlist.name} 
					name={playlist.name}
					backgroundColor={playlist.backgroundColor}
					icon={playlist.icon}
					songs={playlist.songs}
					onClick={() => handlePlaylistClick(playlist)} 
					/>
				))}
				</div>
		</div>
	  </section>
	);
  };

  export default Playlists;
