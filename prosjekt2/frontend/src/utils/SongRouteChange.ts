import { Song } from "./FetchMockData";
import { NavigateFunction } from "react-router-dom";

export const routeChange = (song: Song, navigate: NavigateFunction) => {
  const path = `/${song.artist.toLowerCase().replace(/ /g, "-")}/${song.title.toLowerCase().replace(/ /g, "-")}`;
  navigate(path, { state: song });
};