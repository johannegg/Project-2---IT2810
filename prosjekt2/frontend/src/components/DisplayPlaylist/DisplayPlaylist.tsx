import React, { useState } from "react";
import "./DisplayPlaylist.css";
import { AllSongsList } from "../AllSongsComponents/AllSongsList";
import { AiOutlineDelete } from "react-icons/ai";
import BackButton from "../BackButton/BackButton";
import { useReactiveVar } from "@apollo/client";
import { playlistsVar } from "../../apollo/cache";
import { PlaylistData } from "../../pages/Playlists/Playlists";

interface DisplayPlaylistProps {
	playlistId: string;
	onDelete: () => void;
}

const DisplayPlaylist: React.FC<DisplayPlaylistProps> = ({ playlistId, onDelete }) => {
	const playlists = useReactiveVar(playlistsVar);
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const currentPlaylist = playlists.find((pl) => pl.id === playlistId);
	const allGenres = ["pop", "rap", "rb", "country", "rock"];

	if (!currentPlaylist) return <div>Playlist not found</div>;

	const handleSongRemoved = (songId: string) => {
		const updatedPlaylist: PlaylistData = {
			...currentPlaylist,
			songs: currentPlaylist.songs.filter((song) => song.id !== songId),
		};

		const updatedPlaylists = playlists.map((pl) => (pl.id === playlistId ? updatedPlaylist : pl));

		playlistsVar(updatedPlaylists);
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
	};

	return (
		<section
			className="playlist-details"
			aria-label={`Details for playlist ${currentPlaylist.name}`}
		>
			<div className="playlist-details-container">
				<header className="playlist-header">
					<BackButton />
					<button
						onClick={() => setShowConfirmDelete(true)}
						className="delete-playlist-button"
						aria-label="Delete playlist"
					>
						<AiOutlineDelete />
					</button>
				</header>
				<h1 aria-label={`Playlist name: ${currentPlaylist.name}`}>
					{currentPlaylist.name + " " + currentPlaylist.icon}
				</h1>
				<div className="songs-container" aria-label={`Songs in ${currentPlaylist.name}`}>
					{currentPlaylist.songs.length > 0 ? (
						<AllSongsList
							songs={currentPlaylist.songs}
							isInPlaylist
							playlistId={currentPlaylist.id}
							onSongRemoved={(songId: string) => handleSongRemoved(songId)}
							selectedGenres={allGenres}
							maxViews={10000000}
							minViews={0}
						/>
					) : (
						<p aria-label="No songs message">No songs here yet.</p>
					)}
				</div>
				{showConfirmDelete && (
					<div
						className="modal-overlay"
						aria-modal="true"
						role="dialog"
						aria-labelledby="delete-confirmation-title"
					>
						<div className="modal">
							<p id="delete-confirmation-title">Are you sure you want to delete this playlist?</p>
							<div className="modal-buttons">
								<button
									onClick={() => setShowConfirmDelete(false)}
									className="cancel-button"
									aria-label="Cancel delete"
								>
									No
								</button>
								<button
									onClick={() => {
										onDelete();
										setShowConfirmDelete(false);
									}}
									className="confirm-button"
									aria-label="Confirm delete"
								>
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
