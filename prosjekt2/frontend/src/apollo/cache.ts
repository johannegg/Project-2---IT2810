import { InMemoryCache, makeVar } from "@apollo/client";
import { SongData } from "../utils/types/SongTypes";

// Initialiser sessionStorage hvis verdier ikke allerede finnes
if (!sessionStorage.getItem("minViews")) {
  sessionStorage.setItem("minViews", "0");
}
if (!sessionStorage.getItem("maxViews")) {
  sessionStorage.setItem("maxViews", "1000000");
}
if (!sessionStorage.getItem("selectedGenres")) {
  sessionStorage.setItem("selectedGenres", "[]");
}
if (!sessionStorage.getItem("sortOption")) {
  sessionStorage.setItem("sortOption", "views_desc");
}
if (!sessionStorage.getItem("homeSearchTerm")) {
  sessionStorage.setItem("homeSearchTerm", "");
}
if (!sessionStorage.getItem("favoritesSearchTerm")) {
  sessionStorage.setItem("favoritesSearchTerm", "");
}
if (!localStorage.getItem("favoriteSongs")) {
  localStorage.setItem("favoriteSongs", "[]");
}

// Hent lagrede verdier fra sessionStorage og localStorage
const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
const savedMinViews = Number(sessionStorage.getItem("minViews"));
const savedMaxViews = Number(sessionStorage.getItem("maxViews"));
const savedSortOption = sessionStorage.getItem("sortOption") || "views_desc";
const savedHomeSearchTerm = sessionStorage.getItem("homeSearchTerm") || "";
const savedFavoritesSearchTerm = sessionStorage.getItem("favoritesSearchTerm") || "";
const savedFavoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");

// Opprett Apollo reactive variabler
export const genreFilterVar = makeVar<string[]>(savedGenres);
export const sortOptionVar = makeVar<string>(savedSortOption);
export const minViewsVar = makeVar<number>(savedMinViews);
export const maxViewsVar = makeVar<number>(savedMaxViews);
export const homeSearchTermVar = makeVar<string>(savedHomeSearchTerm);
export const favoritesSearchTermVar = makeVar<string>(savedFavoritesSearchTerm);
export const favoriteSongsVar = makeVar<SongData[]>(savedFavoriteSongs); // Ny variabel for favorittsanger

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
    localStorage.setItem("favoriteSongs", JSON.stringify(newFavorites));
});

  
export default cache;
