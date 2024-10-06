import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Lyric, {LyricProps} from "./Lyrics";

const DynamicLyric = () => {
    const [songData, setSongData] = useState<LyricProps | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state) {
            const song = location.state as LyricProps;
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
        />
    );
};

export default DynamicLyric;
