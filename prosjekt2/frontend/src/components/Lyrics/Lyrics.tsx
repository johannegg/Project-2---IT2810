import { FaEye } from "react-icons/fa";
import "./Lyrics.css";
import { formatViews } from "../../utils/FormatViews";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import PlusMinusButton from "../PlusMinusButton/PlusMinusButton";
import { SongData } from "../../utils/types/SongTypes";
import BackButton from "../BackButton/BackButton";

type LyricProps = {
	songData: SongData;
};

const Lyric = ({ songData }: LyricProps) => {
	return (
		<div className="lyrics" aria-label={`Lyrics view for song: ${songData.title} by ${songData.artist.name}`}>
			<div className="lyrics-header">
				<BackButton aria-label="Back to previous page" />
				<div className="buttons-right-container">
					<FavoriteButton song={songData} aria-label={`Mark ${songData.title} as favorite`} />
					<PlusMinusButton song={songData} aria-label={`Add or remove ${songData.title} from playlist`} />
				</div>
			</div>
			<h1 aria-label={`Song title: ${songData.title}`}>{songData.title}</h1>
			<h2 aria-label={`Artist: ${songData.artist.name}`}>{songData.artist.name}</h2>
			<section className="songInfo" aria-label="Additional song information">
				<p aria-label={`Release year: ${songData.year}`}>Release year: {songData.year}</p>
				<p aria-label={`Genre: ${songData.genre.name}`}>Genre: {songData.genre.name}</p>
				<div className="viewsInfo" aria-label={`Total views: ${formatViews(songData.views)}`}>
					<FaEye style={{ marginRight: "5px" }} />
					<p>{formatViews(songData.views)} Views</p>
				</div>
			</section>
			<hr aria-hidden="true" />
			<section aria-label="Lyrics">
				<p>
					{songData.lyrics.split("\n").map((line, index) => (
						<span key={index}>
							{line}
							<br />
						</span>
					))}
				</p>
			</section>
		</div>
	);
};

export default Lyric;
