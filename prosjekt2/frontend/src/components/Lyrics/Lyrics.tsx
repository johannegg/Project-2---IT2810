import { FaEye } from "react-icons/fa";
import "./Lyrics.css"
import { formatViews } from "../../utils/FormatViews";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { SongData } from "../../utils/types/SongTypes";


type LyricProps = {
    songData: SongData;
};

const Lyric = ({songData}: LyricProps) => {
    return (
        <div className="lyrics">
            <FavoriteButton song={songData} size="large"/>
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
            <hr/>
            <p>
                {songData.lyrics.split("\n").map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}
            </p>
        </div>
    )

}

export default Lyric;


