/// <reference types="cypress" />
//const graphqlEndpoint = "http://localhost:3001/"; // for testing locally
const graphqlEndpoint = "http://it2810-12.idi.ntnu.no:3001/"; // for testing on VM

describe("GraphQL API mutation tests", () => {
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

	describe("User and FavoriteSongs", () => {
		it("Creates a new user and verifies favoriteSongs is empty", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation CreateUser($username: String!) {
						createUser(username: $username) {
							id
							username
							favoriteSongs {
								id
								title
							}
						}
                	}`,
					variables: {
						username: "John Doe",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const user = response.body.data.createUser;
				// Verify that a new user return correct username and has no favorite songs
				expect(user.username).to.eq("John Doe");
				expect(user.favoriteSongs).to.be.an("array").that.is.empty;
			});
		});

		it("Adds a favorite song for a user and verifies favoriteSongs is not Empty", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation AddFavoriteSong($username: String!, $songId: ID!) {
						addFavoriteSong(username: $username, songId: $songId)
					}`,
					variables: {
						username: "John Doe",
						songId: "1954",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				// Verify that the it returns true when adding song to favorites
				expect(response.body.data.addFavoriteSong).to.eq(true);
			});
		});

		it("Retrieves an existing user and verifies favoriteSongs is not empty", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation CreateUser($username: String!) {
						createUser(username: $username) {
							id
							username
							favoriteSongs {
								id
								title
								artist {
									name
								}
							}
						}
					}`,
					variables: {
						username: "John Doe",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const user = response.body.data.createUser;

				// Verify the user was retrieved with the expected username
				expect(user.username).to.eq("John Doe");

				// Verify favoriteSongs array is not empty for an existing user
				expect(user.favoriteSongs).to.be.an("array").that.is.not.empty;

				// Verify specific song data
				expect(user.favoriteSongs[0]).to.have.property("id", "1954");
				expect(user.favoriteSongs[0]).to.have.property("title", "Hound Dog");
				expect(user.favoriteSongs[0].artist).to.have.property("name", "Elvis Presley");
			});
		});

		it("Removes favorite song for a user", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation RemoveFavoriteSong($username: String!, $songId: ID!) {
						removeFavoriteSong(username: $username, songId: $songId)
					}`,
					variables: {
						username: "John Doe",
						songId: "1954",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				// Verify that removing song from favorites return true
				expect(response.body.data.removeFavoriteSong).to.eq(true);
			});
		});

		it("Verifies favoriteSongs is empty", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation CreateUser($username: String!) {
						createUser(username: $username) {
							id
							username
							favoriteSongs {
								id
								title
								artist {
									name
								}
							}
						}
					}`,
					variables: {
						username: "John Doe",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const user = response.body.data.createUser;
				expect(user.username).to.eq("John Doe");

				// Verify favoriteSongs array is empty for an existing user
				expect(user.favoriteSongs).to.be.an("array").that.is.empty;
			});
		});
	});

	describe("Playlists", () => {
		let playlistId;
		it("Creates a new playlist and verifies that it is empty", () => {
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
							songs {
								id
								title
							}
						}
					}`,
					variables: {
						username: "John Doe",
						name: "playlist1",
						backgroundcolor: "#FFFFFF",
						icon: "😎",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const playlist = response.body.data.createPlaylist;
				// Verify correct playlist properties
				expect(playlist).to.have.property("name", "playlist1");
				expect(playlist).to.have.property("backgroundcolor", "#FFFFFF");
				expect(playlist).to.have.property("icon", "😎");

				// Verify that songs is null
				expect(playlist.songs).to.eq(null);

				// Save playlistID to shared variable to be used later
				playlistId = playlist.id;
				expect(playlistId).to.not.be.undefined;
			});
		});
		it("Adds song to playlist", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation AddSongToPlaylist($username: String!, $playlistId: ID!, $songId: ID!) {
						addSongToPlaylist(username: $username, playlistId: $playlistId, songId: $songId) {
							id
							name
							songs {
								id
								title
								artist {
									name
								}
							}
						}
					}`,
					variables: {
						username: "John Doe",
						playlistId: playlistId,
						songId: "1954",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const playlist = response.body.data.addSongToPlaylist;
				expect(playlist.songs).to.be.an("array").that.is.not.empty;
				expect(playlist).to.have.property("name", "playlist1");
				// Verify specific song data
				expect(playlist.songs[0]).to.have.property("id", "1954");
				expect(playlist.songs[0]).to.have.property("title", "Hound Dog");
				expect(playlist.songs[0].artist).to.have.property("name", "Elvis Presley");
			});
		});

		it("Removes song from playlist", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation RemoveSongFromPlaylist($username: String!, $playlistId: ID!, $songId: ID!) {
						removeSongFromPlaylist(username: $username, playlistId: $playlistId, songId: $songId) {
							id
							name
							songs {
								id
								title
								artist {
									name
								}
							}
						}
					}`,
					variables: {
						username: "John Doe",
						playlistId: playlistId,
						songId: "1954",
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				const playlist = response.body.data.removeSongFromPlaylist;
				// An empty playlist should return null after removing the last song
				expect(playlist).to.be.null;
			});
		});

		it("Deletes playlist", () => {
			cy.request({
				method: "POST",
				url: graphqlEndpoint,
				body: {
					query: `
					mutation DeletePlaylist($username: String!, $playlistId: ID!) {
						deletePlaylist(username: $username, playlistId: $playlistId)
					}`,
					variables: {
						username: "John Doe",
						playlistId: playlistId,
					},
				},
			}).then((response) => {
				expect(response.status).to.eq(200);
				// Deleting playlist should return true
				expect(response.body.data.deletePlaylist).to.eq(true);
			});
		});
	});
});
