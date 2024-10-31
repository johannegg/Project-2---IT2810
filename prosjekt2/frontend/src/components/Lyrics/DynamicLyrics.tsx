import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Lyric from "./Lyrics";
import { SongData } from "../../utils/types/SongTypes";

const DynamicLyric = () => {
    const [songData, setSongData] = useState<SongData | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const song = location.state as SongData;
            setSongData(song);
        } else {
            setSongData(null);
        } 
    }, [location.state]);
    
    if (!songData) return <div>Song not found</div>;

    return songData ? <Lyric songData={songData} /> : <div>Song not found</div>;
};

export default DynamicLyric;
