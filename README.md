# Lyrical Lounge
Lyrical Lounge is an application where you can discover new songs and read their lyrics. The songs are displayed in a list, and you can click each song to read the lyrics and find more information about it. 

The main functionality of our application as of now, is to view a specific song, save your favorite songs and make playlists. On the homepage, you can search for songs, filter and sort. 

The project is available on http://it2810-12.idi.ntnu.no/project2/  
In order to see the project, you have to be on NTNU network or use VPN.

## Technology  
We have used the GRAND stack, with the technology GraphQL, React with TypeScript, Apollo and Neo4j Database. CSS and HTML is also used in frontend. Prettier and ESLint is used to maintain code quality. 

## Functionalities implemented

### View songs
When you click on a song in the all songs list, you are sent to a new page where more information about the song is displayed.

### Filte/Sort/Search
You can filter songs based on song genres, by using the filter menu in the "Home" page. You can also sort songs based on title, artist og views. You can search for songs in the search field by entering the song’s title or the name of the song’s artist.

### Navigation
You can navigate between the pages "Home", "Favorited songs" and "Your playlists". 

### Make playlists
You can make new playlists in the “Your playlists” page, by clicking on the “New playlist” button. You can also view the content of the playlist by clicking on it, but we have not yet implemented functionality for adding songs to the playlists.

### Favorite songs
You can favorite songs by clicking on the heart icon next to a song. Favorited songs are shown in the “Favorited songs” page.

## Data
### The dataset
The dataset we have chosen is from genius and after some manipulation it includes 24 753 songs. The information on each song is title, artist, genre, year, views (how many times someone have looked it up on genius) and songlyrics. We have also added an id for each song. As the databse on the virtual machine had limited space, it is 3000 songs in the application right now.


## Next steps
Next, we will implement some more functionalities, that makes it possible for the user to:
- Add songs to a playlist.
- Remove songs from a playlist.

## Running the project
If you want to install the project from your computer, clone as normal and then write the following in one terminal to start backend:

`cd prosjekt2/backend`   
`npm install`  
`npx ts-node src/index.ts`

Then open a new terminal and write the following to start frontend: 

`cd prosjekt2/frontend`   
`npm install`  
`npm run dev`

If the webpage doesn't open automatically, copy the link from the terminal (starting with http://localhost:5173) and paste in browser. 