import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { formatViews } from "../../utils/FormatViews";
import "./AllSongsList.css";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { routeChange } from "../../utils/SongRouteChange";
import { SongData } from "../../utils/types/SongTypes";
import { PlaylistData } from "../../pages/Playlists/Playlists"; // Importer PlaylistData-type

type AllSongsListProps = {
    songs: SongData[];
    genres: string[];
    isInPlaylist: boolean;
    playlists: PlaylistData[]; // Ny prop for tilgjengelige spillelister
};

export function AllSongsList({ songs, genres, isInPlaylist, playlists }: AllSongsListProps) {
    const navigate = useNavigate();
    const [selectedSong, setSelectedSong] = useState<SongData | null>(null);
    const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);

    const filteredSongs =
        genres.length > 0 ? songs.filter((song) => genres.includes(song.genre.name)) : songs;

    const handleAddToPlaylistClick = (song: SongData) => {
        setSelectedSong(song);
        setShowAddToPlaylistModal(true);
    };

    const handleCloseModal = () => {
        setShowAddToPlaylistModal(false);
        setSelectedSong(null);
    };

    const handleAddSongToPlaylist = (playlistId: string) => {
        const updatedPlaylists = playlists.map((playlist) => {
            if (playlist.id === playlistId) {
                return { ...playlist, songs: [...playlist.songs, selectedSong!] };
            }
            return playlist;
        });

        // Oppdater localStorage eller en funksjon for å håndtere oppdateringen eksternt
        localStorage.setItem("playlists", JSON.stringify(updatedPlaylists));

        // Lukk modal og nullstill valgt sang
        handleCloseModal();
    };

    return (
        <section className="songContainer">
            {songs.length === 0 ? (
                <p>No songs found</p>
            ) : (
                <table className="songTable">
                    {filteredSongs.map((song) => (
                        <tr key={song.id} className="tableRow" onClick={() => routeChange(song, navigate)}>
                            <td className="title-artist-cell">
                                <span className="titleCell">{song.title}</span>
                                <span className="artistCell">{song.artist.name}</span>
                            </td>
                            <td>{song.year}</td>
                            <td className="viewsCell">
                                <FaEye style={{ marginRight: "5px" }} />
                                {formatViews(song.views)}
                            </td>
                            <td className="plusMinusCell">
                                {isInPlaylist ? (
                                    <FiMinusCircle color="#afc188" fontSize="28px" />
                                ) : (
                                    <FiPlusCircle
                                        color="#afc188"
                                        fontSize="28px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToPlaylistClick(song);
                                        }}
                                    />
                                )}
                            </td>
                            <td>
                                <FavoriteButton song={song} />
                            </td>
                        </tr>
                    ))}
                </table>
            )}

            {showAddToPlaylistModal && selectedSong && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Select a playlist to add "{selectedSong.title}"</h3>
                        <ul className="playlist-selection">
                            {playlists.map((playlist) => (
                                <li key={playlist.id}>
                                    <button
                                        onClick={() => handleAddSongToPlaylist(playlist.id)}
                                    >
                                        {playlist.name + " " + playlist.icon}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleCloseModal} className="closeBtn">Close</button>
                    </div>
                </div>
            )}
        </section>
    );
}
