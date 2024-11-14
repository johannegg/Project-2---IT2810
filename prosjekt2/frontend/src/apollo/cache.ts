import { InMemoryCache, makeVar } from "@apollo/client";

if (!sessionStorage.getItem("minViews")) {
  sessionStorage.setItem("minViews", "0");
}
if (!sessionStorage.getItem("maxViews")) {
  sessionStorage.setItem("maxViews", "3000000");
}
if (!sessionStorage.getItem("selectedGenres")) {
  sessionStorage.setItem("selectedGenres", "[]");
}

const savedGenres = JSON.parse(sessionStorage.getItem("selectedGenres") || "[]");
const savedMinViews = Number(sessionStorage.getItem("minViews"));
const savedMaxViews = Number(sessionStorage.getItem("maxViews"));

export const searchTermVar = makeVar<string>("");
export const genreFilterVar = makeVar<string[]>(savedGenres);
export const sortOptionVar = makeVar<string>("views_desc");
export const minViewsVar = makeVar<number>(savedMinViews);
export const maxViewsVar = makeVar<number>(savedMaxViews);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        searchTerm: {
          read() {
            return searchTermVar();
          },
        },
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
      },
    },
  },
});

genreFilterVar.onNextChange((newGenres) => {
  sessionStorage.setItem("selectedGenres", JSON.stringify(newGenres));
  console.log("Updated sessionStorage selectedGenres to:", sessionStorage.getItem("selectedGenres"));
});

minViewsVar.onNextChange((newMinViews) => {
  sessionStorage.setItem("minViews", String(newMinViews));
  console.log("Updated sessionStorage minViews to:", sessionStorage.getItem("minViews"));
});

maxViewsVar.onNextChange((newMaxViews) => {
  sessionStorage.setItem("maxViews", String(newMaxViews));
  console.log("Updated sessionStorage maxViews to:", sessionStorage.getItem("maxViews"));
});

export default cache;
