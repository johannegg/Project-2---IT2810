import React, { useState, useCallback } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { SongData } from "../../utils/types/SongTypes";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import { useReactiveVar} from "@apollo/client";
import { playlistsVar, isSidebarOpenVar } from "../../apollo/cache";
import "./PlusMinusButton.css";

type PlusMinusButtonProps = {
	song: SongData;
	isInPlaylist?: boolean;
	playlistId?: string;
	onSongRemoved?: () => void;
};

const PlusMinusButton: React.FC<PlusMinusButtonProps> = ({
	song,
	isInPlaylist,
	playlistId,
	onSongRemoved,
}) => {
	const playlists = useReactiveVar(playlistsVar);
	const isSidebarOpen = useReactiveVar(isSidebarOpenVar);
	const [showModal, setShowModal] = useState(false);
	const [feedbackMessage, setFeedbackMessage] = useState("");

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
		let songAdded = false;

		const updatedPlaylists = playlists.map((playlist: PlaylistData) => {
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
			playlistsVar(updatedPlaylists);
		}
	};

	const handleRemoveSongFromPlaylist = () => {
		if (playlistId) {
			const updatedPlaylists = playlists.map((playlist: PlaylistData) => {
				if (playlist.id === playlistId) {
					return { ...playlist, songs: playlist.songs.filter((s) => s.id !== song.id) };
				}
				return playlist;
			});
			playlistsVar(updatedPlaylists);
			if (onSongRemoved) onSongRemoved();
		}
	};

	const toggleModal = () => setShowModal(!showModal);

	return (
		<>
			<button
				className="plusMinus-button"
				data-label={isInPlaylist ? "Remove song" : "Add song"}
				onClick={(e) => {
					e.stopPropagation();
					if (isInPlaylist) {
						handleRemoveSongFromPlaylist();
					} else {
						toggleModal();
					}
				}}
			>
				{isInPlaylist ? <FiMinusCircle color="#afc188" /> : <FiPlusCircle color="#afc188" />}
			</button>

			{showModal && (
				<div className={`playlist-modal-overlay ${isSidebarOpen ? 'sidebar-open' : ''}`}  onClick={(e) => e.stopPropagation()}>
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
							{playlists.map((playlist: PlaylistData) => (
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
