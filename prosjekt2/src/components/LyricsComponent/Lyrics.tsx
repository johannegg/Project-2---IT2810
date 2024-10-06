import "./Lyrics.css"

export interface LyricProps {
    title: string,
    artist: string,
    lyrics: string,
}

const Lyric = (songData: LyricProps) => {
    
    return (
        <div className="lyrics">
            <h1>{songData.title}</h1>
            <h2>{songData.artist}</h2>
            <p>{songData.lyrics}</p>
        </div>
    )

}

export default Lyric;


