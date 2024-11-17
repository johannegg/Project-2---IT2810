import React, { useState, useCallback } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { SongData } from "../../utils/types/SongTypes";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import "./PlusMinusButton.css";

type PlusMinusButtonProps = {
	song: SongData;
	isInPlaylist?: boolean;
	playlistId?: string;
	onSongRemoved?: () => void;
	isSideBarOpen: boolean;
};

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({
	song,
	isInPlaylist,
	playlistId,
	onSongRemoved,
	isSideBarOpen,
}) => {
	const [showModal, setShowModal] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const getPlaylists = () => {
		const savedPlaylists = localStorage.getItem("playlists");
		return savedPlaylists ? JSON.parse(savedPlaylists) : [];
	};

	const updatePlaylists = (updatedPlaylists: PlaylistData[]) => {
		localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));
	};

	const debounce = (func: () => void, delay: number) => {
		let timer: NodeJS.Timeout;
		return () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func();
			}, delay);
		};
	};

	const clearFeedbackMessage = useCallback(
		debounce(() => setFeedbackMessage(""), 3000),
		[],
	);

	const handleAddSongToPlaylist = (playlistId: string) => {
		const currentPlaylists = getPlaylists();
		let songAdded = false;

		const updatedPlaylists = currentPlaylists.map((playlist: PlaylistData) => {
			if (playlist.id === playlistId) {
				const isSongAlreadyInPlaylist = playlist.songs.some((s) => s.id === song.id);
				if (!isSongAlreadyInPlaylist) {
					songAdded = true;
					return { ...playlist, songs: [...playlist.songs, song] };
				} else {
					setFeedbackMessage("Song is already in playlist.");
					clearFeedbackMessage();
					return playlist;
				}
			}
			return playlist;
		});

		if (songAdded) {
			setFeedbackMessage("Song successfully added!");
			clearFeedbackMessage();
		}

		updatePlaylists(updatedPlaylists);
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
			if (onSongRemoved) onSongRemoved();
		}
	};

	const toggleModal = () => setShowModal(!showModal);

	return (
		<>
			<button
				className="plusMinus-button"
				onClick={(e) => {
					e.stopPropagation();
					isInPlaylist ? handleRemoveSongFromPlaylist() : toggleModal();
				}}
			>
				{isInPlaylist ? <FiMinusCircle color="#afc188" /> : <FiPlusCircle color="#afc188" />}
			</button>

			{showModal && (
				<div className={`playlist-modal-overlay ${isSideBarOpen ? 'sidebar-open' : ''}`}  onClick={(e) => e.stopPropagation()}>
					<div className="playlist-modal-container">
						<h3>Select a playlist to add "{song.title}"</h3>
						{feedbackMessage && (
							<label
								className={`feedback-message ${feedbackMessage === "Song successfully added!" ? "success" : "error"}`}
							>
								{feedbackMessage}
							</label>
						)}
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
