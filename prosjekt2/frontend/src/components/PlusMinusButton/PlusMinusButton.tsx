import React, { useRef, useState } from "react";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { SongData } from "../../utils/types/SongTypes";
import { PlaylistData } from "../../pages/Playlists/Playlists";
import { useReactiveVar } from "@apollo/client";
import { playlistsVar, isSidebarOpenVar } from "../../apollo/cache";
import { ADD_SONG_TO_PLAYLIST, REMOVE_SONG_FROM_PLAYLIST } from "../../utils/Queries";
import { useMutation } from "@apollo/client";
import "./PlusMinusButton.css";

type PlusMinusButtonProps = {
	song: SongData;
	isInPlaylist?: boolean;
	playlistId?: string;
	onSongRemoved?: (songId: string) => void;
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

	const [addSongToPlaylist] = useMutation(ADD_SONG_TO_PLAYLIST, {
		onCompleted: () => {
			setFeedbackMessage("Song successfully added!");
			clearFeedbackMessage();
		},
		onError: () => {
			setFeedbackMessage("Error adding song to playlist.");
			clearFeedbackMessage();
		},
	});

	const [removeSongFromPlaylist] = useMutation(REMOVE_SONG_FROM_PLAYLIST, {
		onCompleted: () => {
			setFeedbackMessage("Song removed from playlist.");
			clearFeedbackMessage();
			if (onSongRemoved) onSongRemoved(song.id);
		},
		onError: () => {
			setFeedbackMessage("Error removing song from playlist.");
			clearFeedbackMessage();
		},
	});

	const useDebounce = (func: () => void, delay: number) => {
		const timerRef = useRef<NodeJS.Timeout | null>(null);

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			timerRef.current = setTimeout(() => {
				func();
			}, delay);
		};
	};

	const clearFeedbackMessage = useDebounce(() => setFeedbackMessage(""), 3000);

	const isUserLoggedIn = () => {
		const username = localStorage.getItem("profileName");
		return username && username !== "";
	};

	const handleAddSongToPlaylist = async (playlistId: string) => {
		if (!isUserLoggedIn()) {
			alert("You need to be logged in to add songs to playlists");
			return;
		}

		let songAdded = false;
		await addSongToPlaylist({
			variables: { username: localStorage.getItem("profileName"), playlistId, songId: song.id },
		});

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

	const handleRemoveSongFromPlaylist = async () => {
		if (!isUserLoggedIn()) {
			alert("You need to be logged in to remove songs from playlists");
			return;
		}
		if (playlistId) {
			await removeSongFromPlaylist({
				variables: { username: localStorage.getItem("profileName"), playlistId, songId: song.id },
			});
			const updatedPlaylists = playlists.map((playlist: PlaylistData) => {
				if (playlist.id === playlistId) {
					return { ...playlist, songs: playlist.songs.filter((s) => s.id !== song.id) };
				}
				return playlist;
			});
			playlistsVar(updatedPlaylists);
			if (onSongRemoved) onSongRemoved(song.id);
		}
	};

	const toggleModal = () => {
		if (isUserLoggedIn()) {
			setShowModal(!showModal);
		} else {
			alert("You need to be logged in to add songs to playlists");
		}
	};

	return (
		<>
			<button
				className="plusMinus-button"
				aria-label={isInPlaylist ? "Remove song" : "Add song"}
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
				<div
					className={`playlist-modal-overlay ${isSidebarOpen ? "sidebar-open" : ""}`}
					onClick={(e) => e.stopPropagation()}
					aria-label="Select a playlist to add the song"
				>
					<div
						className="playlist-modal-container"
						aria-modal="true"
						role="dialog"
						aria-labelledby="modal-title"
					>
						<h3 id="modal-title">Select a playlist to add "{song.title}"</h3>
						{feedbackMessage && (
							<label
								className={`feedback-message ${feedbackMessage === "Song successfully added!" ? "success" : "error"}`}
								aria-live="polite"
							>
								{feedbackMessage}
							</label>
						)}
						<ul className="playlist-selection" aria-label="List of playlists">
							{playlists.map((playlist: PlaylistData) => (
								<li key={playlist.id}>
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleAddSongToPlaylist(playlist.id);
										}}
										aria-label={`Add song to playlist ${playlist.name} ${playlist.icon ? playlist.icon : ""}`}
									>
										{playlist.name} {playlist.icon ? playlist.icon : ""}
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
							aria-label="Close playlist selection"
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
