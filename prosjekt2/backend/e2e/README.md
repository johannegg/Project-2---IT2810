# More on Testing

## Component Tests

The component tests are written with the tool Vitest. We have implemented snapshot testing and validating of our own components. To achieve this, we have utilized mocking to ensure that the tests do not fetch external data, allowing us to create controlled and reliable test scenarios. We have chosen to focus the testing on the components, and have not tested the pages explicitly, because the elements that make up the pages are tested on their own. The pages are also tested further in the E2E-tests.

The following components have been tested, and they all have test coverage >= 80%:

- AllSongsList.tsx
- BackButton.tsx
- DisplayPlaylist.tsx
- FavoriteButton.tsx
- GenreFilter.tsx
- Header.tsx
- Lyrics.tsx
- Playlist.tsx
- PlaylistForm.tsx
- PlusMinusButton.tsx
- Profile.tsx
- SearchBar.tsx
- SideBar.tsx
- Sort.tsx
- ViewsFilter.tsx

## End-To-End Tests

The E2E-tests are written in Cypress. We have chosen to test interactions with the key-features. The exception is the "Create user", because this is implicitly tested in several tests. The different "specs" are:

- **favorite**
  - The user can mark a song as a favorite and later remove it from the favorites list.
- **filter**
  - The user can open the sidebar and see the available filtering options.
  - The user can apply a genre filter and clear all applied filters using the "Clear Filters" button.
  - When a genre filter is applied, only songs matching the selected genre are shown.
- **navigation**
  - The user can seamlessly navigate between different pages of the application (Home, Favorites, and Playlists).
- **playlist**
  - The user can create a new playlist and delete it when no longer needed.
  - The user can add songs to a playlist and remove them as well.
- **search**
  - When the user searches, only songs with the search term in the title or artist are displayed.
  - If the user searches for something that doesn't exist, a message is displayed indicating no results were found.
- **sorting**
  - The user can select a sorting option (e.g., Title A-Z, Views, etc.), and the songs are displayed in the correct order according to the chosen criterion.
- **viewSong**
  - The user can click on a song to view its details and navigate back to the previous list or page.
  - The user can mark a song as a favorite or add it to a playlist directly from the song detail page.

**NOTE**: Some of the tests stopped working when we updated them to work on the VM for simplicity. If you wish to run all the tests locally, follow [this](cypress/README.md) guide.  

## API Tests

The API tests are also written using Cypress by interacting with the GraphQL resolvers through HTTP requests. The tests cover mutations and queries for **users**, **favorite songs**, and **playlists**, and ensure proper structure and correctness of returned data.

### Mutation tests

The mutations tests are testing these scenarios

- **User management**
  - Create a user and check that a newly created user has no favorite songs and correct username
  - Add a favorite song to a user and check if it updates correctly
  - Remove a favorite song and confirm that the favoriteSongs list is empty afterwards
- **Playlist management**
  - Create a new playlist with specific properties (backgroundcolor, icon, etc) and verify that it returns the right properties and has no songs
  - Add song to playlist and verify that it is present with correct properties
  - Remove song from playlist and verify its absence
  - Delete a playlist and verify that the operation returns true

### Query tests

The query tests are testing these operations:

- Fetching songs with filters (with a simple scenario of genre, views range and sorting choice)
- Fetching the count of songs that matches the criteria
- Fetching an users playlists, including their songs, and validates correct song data
