# Lyrical Lounge

## Link to Project on VM

http://it2810-12.idi.ntnu.no/project2/  
Our project is available on the link above, as long as you are connected to the NTNU Wifi or VPN from NTNU.

## Table of Contents

_Her kommer TOC_

## About the project

Lyrical Lounge is an application where you can discover new songs and read their lyrics. The songs are displayed in a list, and you can click each song to read the lyrics and find more information about it.

The main functionality of the application is viewing individual songs witht their lyrics, saving your favorites, and creating playlists. On the homepage, users can search for songs, filter by genre and number of views, and sort by title, artist, or views.

We’ve focused on sustainability with features like dark mode, efficient data fetching, and caching to save energy. Also, we’ve made the app more accessible with features such as labels and keyboard navigation.

### Features

- **View Songs**: Clicking on a song from the list takes you to a detailed page with lyrics and more information.
- **Filter, Sort, and Search**: Use the filter menu on the homepage to filter songs by genre or views. You can also sort the list by title, artist, or views. The search field allows you to find songs by typing the song's title or artist name.
- **Navigation**: You can navigate between the pages: "Home", "Favorited Songs", and "Your Playlists" to see different features.
- **Create Playlists**: Create your own playlists on the "Your Playlists" page using the "New Playlist" button. Songs can be added to playlists from either the homepage or favorite song-page, and they can also be removed from the playlist. Playlists can also be deleted.
- **Favorite Songs**: Mark your favorite songs by clicking the heart icon next to them. These favorited tracks appear on the "Favorited Songs" page.

### Technology

We have used the GRAND stack, with the technology GraphQL, React with TypeScript, Apollo and Neo4j Database. CSS and HTML is also used in frontend. Prettier and ESLint is used to maintain code quality.

## Running the Project

### Run Project

If you want to install the project from your computer, clone the project using git clone https://git.ntnu.no/IT2810-H24/T12-Project-2.git, and then write the following in the terminal to start the frontend:

`cd prosjekt2/frontend`  
`npm install`  
`npm run dev`

The backend is running on the virtual machine, so you need to be connected to NTNU network or VPN. If you want to run the backend on your computer, you have to replace line 8 in project2/frontend/src/main.tsx from ?? to `uri: "http://localhost:4000/",`.

### Run ESLint and Prettier

??

### Run Tests

??

## Database

As we have chosen the GRAND stack, we are using the Neo4j as database. From the beginning, as we imported our dataset, we had the labels **Artist**, **Song** and **Genre**, with the relations **PERFORMED_BY** (connects a Song to an Artist) and **HAS_GENRE** (connects a Song to a Genre). As we have implemented users, favorites and playlists in our application, the database was expanded with the new labels **User** and **Playlist**, as well as the relations **CONTAINS** (connects a Playlist to a Song), **OWNS** (connects a User to a Playlist) and **HAS_FAVORITES** (connects a User to a Song). Altogether our database contains 5 656 nodes and (at the moment) 5 955 relationships.

### The dataset

The dataset we have chosen is from Genius via Kaggle ([Kaggle: Genius Song Lyrics](https://www.kaggle.com/datasets/carlosgdcj/genius-song-lyrics-with-language-information/data?fbclid=IwY2xjawGmhStleHRuA2FlbQIxMAABHUqHd8QJKNwFXvGOQBCHINMiJyj2AavdahQAgUNSbD4UYXtmF86PlzyjSg_aem_J3KYHhgyLC8fxWh4w4b1XA)), and after some manipulation it includes 24 753 songs. The information on each song is title, artist, genre, year, views (how many times someone have looked it up on genius) and songlyrics. We have also added an id for each song. As the database on the virtual machine had limited space, it is 2 947 songs in the application right now. If we could start over with choosing the songs, we would have made sure to pick songs with an even distribution of views and genres, and maybe filter out songs from artists like “Genius English Translations” and such.

## Web Accessibility

We've put a lot of effort into making the site accessible for everyone. All icons and non-text elements have labels, so screen readers can easily understand what they are. We've also added ARIA labels to improve navigation for assistive technologies. Plus, the entire site is fully navigable using just the keyboard, so you don’t need a mouse to get around. This way, we make sure everyone can use our site comfortably. We have also tried to take into account which colors to use, to make sure the contrast sufficient, in order to make the content accessible for people with visual impairments.

## Sustainable Web Development

We've tried to make our project more sustainable by keeping things simple and efficient. To avoid making unecessary calls to the backend, the search field only works when you press Enter, and the views-filter fetches songs when you let go of the “thumbs” (instead of continously fetching). Caching is also used to speed things up and reduce server load. We’ve added dark mode and light mode that follow your system settings automatically to help save energy, and we’ve kept the design minimal by not using many images or animations and sticking mostly to neutral colors with lots of white space. This helps keep the site fast and light while being easier on energy use.
