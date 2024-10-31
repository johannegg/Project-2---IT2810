import { SongData } from "./SongTypes";

// Define types for the GraphQL response
export type SongsQueryResponse = {
    songs: SongData[];
};