import React, { useState } from "react";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";

interface DisplayPlaylistProps {
	playlist: PlaylistData;
	onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlist, onDelete }) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

	return (
		<section className="playlist-details">
			<button onClick={handleDeleteClick} className="delete-button">
				Delete Playlist
			</button>
			<h1>{playlist.name + " " + playlist.icon}</h1>
			<div className="songs-container">
				{playlist.songs.length > 0 ? (
					<AllSongsList songs={playlist.songs} genres={[]} />
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
		</section>
	);
};

export default DisplayPlaylist;
