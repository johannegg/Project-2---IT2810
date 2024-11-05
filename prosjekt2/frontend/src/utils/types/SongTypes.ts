export type Artist = {
    id: string;
    name: string;
};

export type Genre = {
    name: string;
};

export type SongData = {
    id: string;
    title: string;
    views: number;
    year: number;
    artist: Artist;
    genre: Genre;
    lyrics: string;
};