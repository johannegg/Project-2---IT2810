import { PlaylistData } from "../pages/Playlists/Playlists";
import { NavigateFunction } from "react-router-dom";

export const routeChange = (playlist: PlaylistData, navigate: NavigateFunction) => {
  const path = `/playlist/${playlist.name.toLowerCase().replace(/ /g, "-")}`;
  navigate(path, { state: playlist });
};
