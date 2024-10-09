import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Lyric from "./Lyrics";
import { Song } from "../../utils/FetchMockData";

const DynamicLyric = () => {
    const [songData, setSongData] = useState<Song | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const song = location.state as Song;
            setSongData(song);
        } else {
            setSongData(null);
        } 
    }, [location.state]);
    
    if (!songData) return <div>Song not found</div>;

    return (
        <Lyric 
            title={songData.title}
            artist={songData.artist}
            lyrics={songData.lyrics}
            genre={songData.genre}
            id={songData.id}
            year={songData.year}
            views={songData.views}
        />
    );
};

export default DynamicLyric;
