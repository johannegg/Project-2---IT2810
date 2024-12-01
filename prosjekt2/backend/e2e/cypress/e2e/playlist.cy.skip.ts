/// <reference types="cypress" />
describe("Make and view playlists", () => {
	beforeEach(() => {
		//cy.visit("http://localhost:5173/project2"); // for testing locally
		cy.visit("http://it2810-12.idi.ntnu.no/project2"); // for testing on VM

		// Log in first
		cy.get(".profile-icon").click();
		cy.get(".login-input").type("testUserE2E");
		cy.get(".login-button").click();

		// Navigate to page
		cy.contains("Your playlists").click();
	});

	it("should make new playlist and delete it", () => { // TODO: fix this test. Doesn't delete playlist.
		// Click on the new playlist button
		cy.get(".new-playlist-button").click();
		cy.contains("Create new playlist").should("be.visible");

		// Make the playlist
		cy.get(".playlist-input").type("E2E-testing1");
		cy.get(".form-submit-button").click();

		// Check if the playlist is visible
		cy.contains("E2E-testing1").should("be.visible");

		// View the playlist
		//cy.contains("E2E-testing").click();
		cy.get(".playlist-card").click(); 

		// Delete the playlist
		cy.get(".delete-playlist-button", { timeout: 10000 }).click();
		cy.get(".confirm-button", { timeout: 10000 }).click();

		// Check if the playlist is gone
		cy.contains("E2E-testing1").should("not.exist");
	});

	it("should add and remove songs from playlist", () => { // TODO: Fix this test. Doesn't delete playlist, and gets error in adding songs. 
		// Make a playlist
		cy.get(".new-playlist-button").click();
		cy.contains("Create new playlist").should("be.visible");
		cy.get(".playlist-input").type("TestList");
		cy.get(".form-submit-button").click();

		// Add songs to the playlist
		cy.get(".sofa-icon").click();
		cy.get(".plusMinus-button").eq(1).click();
		cy.contains("TestList").click();
		//cy.contains("Song successfully added!").should("be.visible");
		cy.get(".closeBtn").click();

		// Check if the song is in the playlist
		cy.contains("Your playlists").click();
		cy.contains("TestList").click();
		cy.contains("Hound Dog").should("be.visible");

		// Remove the song from the playlist
		cy.get(".plusMinus-button").eq(0).click();

		// Delete the playlist
		cy.get(".delete-playlist-button").click();
		cy.get(".confirm-button").click();
	});
});
