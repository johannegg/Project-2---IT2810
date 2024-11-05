import { SongData } from "./types/SongTypes";
import { NavigateFunction } from "react-router-dom";

export const routeChange = (song: SongData, navigate: NavigateFunction) => {
  const path = `/${song.artist.name.toLowerCase().replace(/ /g, "-")}/${song.title.toLowerCase().replace(/ /g, "-")}`;
  navigate(path, { state: song });
};