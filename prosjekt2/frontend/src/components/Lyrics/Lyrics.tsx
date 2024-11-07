import { FaEye } from "react-icons/fa";
import "./Lyrics.css";
import { formatViews } from "../../utils/FormatViews";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import PlusMinusButton from "../PlusMinusButton/PlusMinusButton";
import { SongData } from "../../utils/types/SongTypes";

type LyricProps = {
	songData: SongData;
	isInPlaylist: boolean;
	playlistId?: string;
	onSongRemoved?: () => void;
};

const Lyric = ({ songData, isInPlaylist, playlistId, onSongRemoved }: LyricProps) => {
	return (
		<div className="lyrics">
			<div className="button-container">
				<FavoriteButton song={songData} size="large" />
				<PlusMinusButton
					song={songData}
					isInPlaylist={isInPlaylist}
					playlistId={playlistId}
					onSongRemoved={onSongRemoved}
				/>
			</div>
			<h1>{songData.title}</h1>
			<h2>{songData.artist.name}</h2>
			<section className="songInfo">
				<p>Release year: {songData.year}</p>
				<p>Genre: {songData.genre.name}</p>
				<div className="viewsInfo">
					<FaEye style={{ marginRight: "5px" }} />
					<p>{formatViews(songData.views)} Views</p>
				</div>
			</section>
			<hr />
			<p>
				{songData.lyrics.split("\n").map((line, index) => (
					<span key={index}>
						{line}
						<br />
					</span>
				))}
			</p>
		</div>
	);
};


export default Lyric;
