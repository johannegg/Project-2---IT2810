import { InMemoryCache, makeVar } from "@apollo/client";
import { SongData } from "../utils/types/SongTypes";
import { PlaylistData } from "../pages/Playlists/Playlists";

// Initialiser sessionStorage og localStorage hvis verdier ikke allerede finnes
const initializeStorage = (key: string, defaultValue: string) => {
  if (!sessionStorage.getItem(key)) {
    sessionStorage.setItem(key, defaultValue);
  }
};
const initializeLocalStorage = (key: string, defaultValue: string) => {
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, defaultValue);
  }
};

initializeStorage("minViews", "0");
initializeStorage("maxViews", "1000000");
initializeStorage("selectedGenres", "[]");
initializeStorage("sortOption", "views_desc");
initializeStorage("homeSearchTerm", "");
initializeStorage("favoritesSearchTerm", "");
initializeLocalStorage("favoriteSongs", "[]");
initializeLocalStorage("playlists", "[]");

// Hent lagrede verdier fra sessionStorage og localStorage
const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
const savedMinViews = Number(sessionStorage.getItem("minViews"));
const savedMaxViews = Number(sessionStorage.getItem("maxViews"));
const savedSortOption = sessionStorage.getItem("sortOption") || "views_desc";
const savedHomeSearchTerm = sessionStorage.getItem("homeSearchTerm") || "";
const savedFavoritesSearchTerm = sessionStorage.getItem("favoritesSearchTerm") || "";
const savedFavoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");
const savedPlaylists = JSON.parse(localStorage.getItem("playlists") || "[]");

// Opprett Apollo reactive variabler
export const genreFilterVar = makeVar<string[]>(savedGenres);
export const sortOptionVar = makeVar<string>(savedSortOption);
export const minViewsVar = makeVar<number>(savedMinViews);
export const maxViewsVar = makeVar<number>(savedMaxViews);
export const homeSearchTermVar = makeVar<string>(savedHomeSearchTerm);
export const favoritesSearchTermVar = makeVar<string>(savedFavoritesSearchTerm);
export const favoriteSongsVar = makeVar<SongData[]>(savedFavoriteSongs);
export const playlistsVar = makeVar<PlaylistData[]>(savedPlaylists);

// Konfigurer cache med reactive variabler
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        genreFilter: {
          read() {
            return genreFilterVar();
          },
        },
        sortOption: {
          read() {
            return sortOptionVar();
          },
        },
        minViews: {
          read() {
            return minViewsVar();
          },
        },
        maxViews: {
          read() {
            return maxViewsVar();
          },
        },
        homeSearchTerm: {
          read() {
            return homeSearchTermVar();
          },
        },
        favoritesSearchTerm: {
          read() {
            return favoritesSearchTermVar();
          },
        },
        favoriteSongs: {
          read() {
            return favoriteSongsVar();
          },
        },
        playlists: {
          read() {
            return playlistsVar();
          },
        },
      },
    },
  },
});

// Sync reactive variabler med sessionStorage og localStorage
homeSearchTermVar.onNextChange((newHomeSearchTerm) => {
  sessionStorage.setItem("homeSearchTerm", newHomeSearchTerm);
});

favoritesSearchTermVar.onNextChange((newFavoritesSearchTerm) => {
  sessionStorage.setItem("favoritesSearchTerm", newFavoritesSearchTerm);
});

genreFilterVar.onNextChange((newGenres) => {
  sessionStorage.setItem("selectedGenres", JSON.stringify(newGenres));
});

minViewsVar.onNextChange((newMinViews) => {
  sessionStorage.setItem("minViews", String(newMinViews));
});

maxViewsVar.onNextChange((newMaxViews) => {
  sessionStorage.setItem("maxViews", String(newMaxViews));
});

sortOptionVar.onNextChange((newSortOption) => {
  sessionStorage.setItem("sortOption", newSortOption);
});

favoriteSongsVar.onNextChange((newFavorites) => {
  console.log("Syncing favoriteSongsVar to localStorage:", newFavorites);
  localStorage.setItem("favoriteSongs", JSON.stringify(newFavorites));
});

playlistsVar.onNextChange((newPlaylists) => {
  console.log("Syncing playlistsVar to localStorage:", newPlaylists);
  localStorage.setItem("playlists", JSON.stringify(newPlaylists));
  // Manuell utløsing av en "storage"-event for å informere andre faner om endringer
  window.dispatchEvent(new Event("storage"));
});

export default cache;
