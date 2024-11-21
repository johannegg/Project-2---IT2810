/// <reference types="cypress" />
const graphqlEndpoint = "http://localhost:3001/";

describe("GraphQL API query tests", () => {
	before(() => {
		// Create a test user
		cy.request({
			method: "POST",
			url: graphqlEndpoint,
			body: {
				query: `
              mutation CreateUser($username: String!) {
                createUser(username: $username) {
                  id
                }
              }`,
				variables: {
					username: "John Doe",
				},
			},
		});
	});

	after(() => {
		// Delete the test user
		cy.request({
			method: "POST",
			url: graphqlEndpoint,
			body: {
				query: `
              mutation DeleteUser($username: String!) {
                deleteUser(username: $username)
              }`,
				variables: {
					username: "John Doe",
				},
			},
		});
	});

	describe("Fetching songs", () => {
		it("Fetches songs with filters applied", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
                query GetSongs(
                  $skip: Int
                  $limit: Int
                  $genres: [String]
                  $sortBy: SortBy
                  $searchTerm: String
                  $minViews: Int
                  $maxViews: Int
                ) {
                  songs(
                    skip: $skip
                    limit: $limit
                    genres: $genres
                    sortBy: $sortBy
                    searchTerm: $searchTerm
                    minViews: $minViews
                    maxViews: $maxViews
                  ) {
                    id
                    title
                    views
                    year
                    lyrics
                    artist {
                      name
                    }
                    genre {
                      name
                    }
                  }
                }`,
					variables: {
						skip: 0,
						limit: 5,
						genres: ["pop"],
						sortBy: "views_desc",
						searchTerm: "",
						minViews: 10000,
						maxViews: 100000,
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const songs = response.body.data.songs;
				expect(songs).to.be.an("array").that.is.not.empty;

				// Verify correct amount of songs returned
				expect(songs.length).to.eq(5);

				// Verify that songs has required data
				songs.forEach((song) => {
					expect(song).to.have.property("id");
					expect(song).to.have.property("title");
					expect(song).to.have.property("lyrics");
					expect(song).to.have.property("views").to.be.within(10000, 100000);
					expect(song.artist).to.have.property("name");
					expect(song.genre).to.have.property("name", "pop");
				});
			});
		});

		it("Fetches the count of songs matching filters", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
                query GetSongCount($genres: [String], $searchTerm: String, $minViews: Int, $maxViews: Int) {
                  songCount(genres: $genres, searchTerm: $searchTerm, minViews: $minViews, maxViews: $maxViews)
                }`,
					variables: {
						genres: ["pop"],
						searchTerm: "the",
						minViews: 1000,
						maxViews: 1000000,
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const songCount = response.body.data.songCount;

				// Should return the number of songs that match larger than 0
				expect(songCount).to.be.a("number").that.is.greaterThan(0);
			});
		});
	});

	describe("Fetching playlists", () => {
		const username = "John Doe";
		let playlistId1;
		let playlistId2;

		// Create multiple playlists
		before(() => {
			const playlists = [
				{ name: "Chill Vibes", backgroundcolor: "#FFFFFF", icon: "🎵" },
				{ name: "Workout Beats", backgroundcolor: "#FF0000", icon: "💪" },
			];

			playlists.forEach((playlist, index) => {
				cy.request({
					method: "POST",
					url: graphqlEndpoint,
					body: {
						query: `
                mutation CreatePlaylist(
                  $username: String!
                  $name: String!
                  $backgroundcolor: String!
                  $icon: String!
                ) {
                  createPlaylist(
                    username: $username
                    name: $name
                    backgroundcolor: $backgroundcolor
                    icon: $icon
                  ) {
                    id
                    name
                    backgroundcolor
                    icon
                  }
                }`,
						variables: {
							username,
							name: playlist.name,
							backgroundcolor: playlist.backgroundcolor,
							icon: playlist.icon,
						},
					},
				}).then((response) => {
					expect(response.status).to.eq(200);
					const createdPlaylist = response.body.data.createPlaylist;
					expect(createdPlaylist).to.have.property("id");
					expect(createdPlaylist.name).to.eq(playlist.name);

					// Assign playlist IDs
					if (index === 0) {
						playlistId1 = createdPlaylist.id;
					} else if (index === 1) {
						playlistId2 = createdPlaylist.id;
					}
				});
			});
		});

		// Add songs to the first playlist
		before(() => {
			const songs = [{ id: "860" }, { id: "1843" }];

			songs.forEach((song) => {
				cy.request({
					method: "POST",
					url: graphqlEndpoint,
					body: {
						query: `mutation AddSongToPlaylist(
                  $username: String!
                  $playlistId: ID!
                  $songId: ID!
                ) {
                  addSongToPlaylist(username: $username, playlistId: $playlistId, songId: $songId) {
                    id
                    name
                  }
                }`,
						variables: {
							username,
							playlistId: playlistId1, // Add songs to the first playlist
							songId: song.id,
						},
					},
				}).then((response) => {
					expect(response.status).to.eq(200);
					const updatedPlaylist = response.body.data.addSongToPlaylist;
					expect(updatedPlaylist.id).to.eq(playlistId1);
				});
			});
		});

		// Fetch playlists and validate songs
		it("Fetches playlists and verifies the correct songs are returned", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
          query FetchPlaylists($username: String!) {
        fetchPlaylists(username: $username) {
          id
          name
          backgroundcolor
          icon
          songs {
            id
            title
            views
            year
            artist {
              name
            }
            genre {
              name
            }
          }
        }
      }`,
					variables: {
						username,
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const playlists = response.body.data.fetchPlaylists;

				// Validate the playlists
				expect(playlists).to.be.an("array").that.is.not.empty;
				expect(playlists.length).to.eq(2);

				playlists.forEach((playlist) => {
					expect(playlist).to.have.property("id");
					expect(playlist).to.have.property("name");
					expect(playlist).to.have.property("backgroundcolor");
					expect(playlist).to.have.property("icon");

					if (playlist.id === playlistId1) {
						// Validate songs for the first playlist
						expect(playlist.songs).to.be.an("array").that.is.not.empty;
						expect(playlist.songs.length).to.eq(2);

						// Define expected songs for validation
						const expectedSongs = [
							{ id: "1843", title: "5AM", views: 686968, year: 2013, genre: "rap" },
							{
								id: "860",
								title: "American Pie",
								views: 1000000,
								year: 1971,
								genre: "rock",
							},
						];

						// Compare fetched songs with expected songs
						playlist.songs.forEach((song, index) => {
							const expectedSong = expectedSongs[index];
							expect(song.id).to.eq(expectedSong.id);
							expect(song.title).to.eq(expectedSong.title);
							expect(song.views).to.eq(expectedSong.views);
							expect(song.year).to.eq(expectedSong.year);
							expect(song.genre.name).to.eq(expectedSong.genre);
						});
					} else if (playlist.id === playlistId2) {
						// Validate no songs for the second playlist
						expect(playlist.songs).to.be.an("array").that.is.empty;
					}
				});
			});
		});
	});
});
