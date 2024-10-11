# Lyrical Lounge
Lyrical Lounge is an applicatin where you can discover new songs. So far, you can filter songs based on different genres and click on them to view song lyrics, release year, genre and views. 

## Running the project
If you want to install the project from your computer, clone as normal and then write the following in the terminal:
 
`cd prosjekt2`   
`cd frontend`   
`npm install`  
`npm run dev`

If the webpage doesn't open automatically, copy the link from the terminal (starting with http://localhost:..) and paste in browser. 

## Technology  
Technologies used are mainly TypeScript, React, CSS and HTML. 
Prettier and ESlint is used to maintain code quality. 

## Functionalities implemented

### View songs
When you click on a song in the all songs list, you are sent to a new page where more information about the song is displayed.

### Filtering
You can filter songs based on song genres, by usig the filter menu in the "Home" page

### Navigation
You can navigate between the pages "Home", "Favorited songs" and "Your Playlists". "Favorited songs" and "Your playlists" are currently empty. We will implement functionality for these soon.

## Data
### The dataset
The dataset we have chosen is from genius and after some manipulation it includes 24 753 songs. The information on each song is title, artist, genre, year, views (how many times someone have looked it up on genius) and songlyrics. We have also added an id for each song. The format is the same as the data we have mocked in ./public/mockdata.json. 

### Backend
We have talked about looking into GraphQL and Neo4j for backend, but have not started to implement this yet. 

## Next steps
Next, we will implement some more functionalities, that makes it possible for the user to:
- Search after songs by title or artist
- Sort songs by titles or artists
- Filter songs by views
- Favorite songs
- Make own playlists

We will also make sure to increment "views" when someone views a song.

Another future enhancement will be to address responsiveness, which is only included in the design of the home page. Currently, the layout and components does not adjust dynamically across different devices on the lyrics pages. For now, the design is best viewed on standard desktop resolutions.