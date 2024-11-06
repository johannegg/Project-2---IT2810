import React, { useState, useEffect } from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";

interface DisplayPlaylistProps {
	playlist: PlaylistData;
	onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist, onDelete }) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistData>(playlist); 

	useEffect(() => {
		const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
		const updatedPlaylist = storedPlaylists.find((pl: PlaylistData) => pl.id === playlist.id);
		if (updatedPlaylist) {
			setCurrentPlaylist(updatedPlaylist);
		}
	}, [playlist.id]);

	const handleDeleteClick = () => {
		setShowConfirmDelete(true);
	};

	const handleConfirmDelete = () => {
		onDelete();
		setShowConfirmDelete(false);
	};

	const handleCancelDelete = () => {
		setShowConfirmDelete(false);
	};

	const handleSongRemoved = (songId: string) => {
		const updatedPlaylist = {
			...currentPlaylist,
			songs: currentPlaylist.songs.filter((song) => song.id !== songId),
		};
		setCurrentPlaylist(updatedPlaylist);

		const storedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");
		const updatedPlaylists = storedPlaylists.map((pl: PlaylistData) =>
			pl.id === playlist.id ? updatedPlaylist : pl
		);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
	};

	return (
		<section className="playlist-details">
			<div className="playlist-details-container">
				<button onClick={handleDeleteClick} className="delete-button">
					Delete Playlist
				</button>
				<h1>{currentPlaylist.name + " " + currentPlaylist.icon}</h1>
				<div className="songs-container">
					{currentPlaylist.songs.length > 0 ? (
						<AllSongsList
							songs={currentPlaylist.songs}
							genres={[]}
							isInPlaylist
							playlistId={currentPlaylist.id}
							onSongRemoved={handleSongRemoved} 
						/>
					) : (
						<p>No songs here yet.</p>
					)}
				</div>

				{showConfirmDelete && (
					<div className="modal-overlay">
						<div className="modal">
							<p>Are you sure you want to delete this playlist?</p>
							<div className="modal-buttons">
								<button onClick={handleCancelDelete} className="cancel-button">
									No
								</button>
								<button onClick={handleConfirmDelete} className="confirm-button">
									Yes
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	);
};

export default DisplayPlaylist;
