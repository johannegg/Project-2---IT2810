import { useState } from 'react';
import './Playlists.css';
import Playlist from '../../components/Playlist/Playlist';
import PlaylistForm from '../../components/PlaylistForm/PlaylistForm';
import { Song } from '../../utils/FetchMockData';
import { useNavigate } from 'react-router-dom';
import { routeChange } from '../../utils/PlaylistRouteChange';

export interface PlaylistData {
	name: string;
	backgroundColor: string;
	icon: string;
	songs: Song[];
  }
  
  const Playlists = () => {
	const navigate = useNavigate();
	const [playlists, setPlaylists] = useState<PlaylistData[]>([
		{ 
		  name: 'My playlist 1', 
		  backgroundColor: '#ffffff', 
		  icon: '🎵', 
		  songs: [{ title: "Song A", artist: "Artist 1", id: 5, year: 2015, views: 500, lyrics: "...", genre: "pop" }, { title: "Song B", artist: "Artist 2", id: 6, year: 2016, views: 500, lyrics: "...", genre: "pop"  }]
		},
		{ 
		  name: 'My playlist 2', 
		  backgroundColor: '#ffffff', 
		  icon: '🎧', 
		  songs: [{ title: "Song C", artist: "Artist 3", id: 7, year: 2015, views: 300, lyrics: "...", genre: "pop"  }, { title: "Song D", artist: "Artist 4", id: 5, year: 2015, views: 500, lyrics: "...", genre: "pop"  }]
		}
	  ]);
  
	const [showForm, setShowForm] = useState(false);
  
	const addNewPlaylist = (newPlaylistName: string, backgroundColor: string, icon: string) => {
	  setPlaylists([...playlists, { name: newPlaylistName, backgroundColor, icon, songs: [] }]);
	};
  
	const handlePlaylistClick = (playlist: PlaylistData) => {
		routeChange(playlist, navigate); 
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
