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

## Next steps ##
Next, we will implement some more functionalities, that makes it possible for the user to:
- Search after songs by title or artist
- Sort songs by titles or artists
- Filter songs by views
- Favorite songs
- Make own playlists

We will also implemant a database and create a proper backend.