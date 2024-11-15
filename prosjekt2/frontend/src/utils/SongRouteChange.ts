import { SongData } from "./types/SongTypes";
import { NavigateFunction } from "react-router-dom";
import { songDataVar } from "../apollo/cache"; 

export const routeChange = (song: SongData, navigate: NavigateFunction) => {
  songDataVar([song]); 
  const path = `/${song.artist.name.toLowerCase().replace(/ /g, "-")}/${song.title.toLowerCase().replace(/ /g, "-")}`;
  navigate(path);
};
