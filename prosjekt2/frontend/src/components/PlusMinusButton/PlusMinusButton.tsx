import React, { useState } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { SongData } from "../../utils/types/SongTypes";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./PlusMinusButton.css";

type PlusMinusButtonProps = {
	song: SongData;
	isInPlaylist: boolean;
	playlistId?: string;
	onSongRemoved?: () => void;
};

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({
	song,
	isInPlaylist,
	playlistId,
	onSongRemoved,
}) => {
	const [showModal, setShowModal] = useState(false);

	const getPlaylists = () => {
		const savedPlaylists = localStorage.getItem("playlists");
		return savedPlaylists ? JSON.parse(savedPlaylists) : [];
	};

	const updatePlaylists = (updatedPlaylists: PlaylistData[]) => {
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
	};

	const handleAddSongToPlaylist = (playlistId: string) => {
		const currentPlaylists = getPlaylists();
		const updatedPlaylists = currentPlaylists.map((playlist: PlaylistData) => {
			if (playlist.id === playlistId) {
				const isSongAlreadyInPlaylist = playlist.songs.some((s) => s.id === song.id);
				if (!isSongAlreadyInPlaylist) {
					return { ...playlist, songs: [...playlist.songs, song] };
				}
			}
			return playlist;
		});
		updatePlaylists(updatedPlaylists);
		setShowModal(false);
	};

	const handleRemoveSongFromPlaylist = () => {
		if (playlistId) {
			const currentPlaylists = getPlaylists();
			const updatedPlaylists = currentPlaylists.map((playlist: PlaylistData) => {
				if (playlist.id === playlistId) {
					return { ...playlist, songs: playlist.songs.filter((s) => s.id !== song.id) };
				}
				return playlist;
			});
			updatePlaylists(updatedPlaylists);
			if (onSongRemoved) onSongRemoved(); // Kall onSongRemoved når en sang fjernes
		}
	};

	const toggleModal = () => setShowModal(!showModal);

	return (
		<>
			{isInPlaylist ? (
				<FiMinusCircle
					color="#afc188"
					fontSize="28px"
					onClick={(e) => {
						e.stopPropagation();
						handleRemoveSongFromPlaylist();
					}}
				/>
			) : (
				<FiPlusCircle
					color="#afc188"
					fontSize="28px"
					onClick={(e) => {
						e.stopPropagation();
						toggleModal();
					}}
				/>
			)}

			{showModal && (
				<div className="playlist-modal-overlay" onClick={(e) => e.stopPropagation()}>
					<div className="playlist-modal-container">
						<h3>Select a playlist to add "{song.title}"</h3>
						<ul className="playlist-selection">
							{getPlaylists().map((playlist: PlaylistData) => (
								<li key={playlist.id}>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAddSongToPlaylist(playlist.id);
										}}
									>
										{playlist.name + " " + playlist.icon}
									</button>
								</li>
							))}
						</ul>
						<button
							onClick={(e) => {
								e.stopPropagation();
								toggleModal();
							}}
							className="closeBtn"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default PlusMinusButton;
