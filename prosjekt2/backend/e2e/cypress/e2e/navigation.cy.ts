/// <reference types="cypress" />
describe("Navigate", () => {
	beforeEach(() => {
		//cy.visit("http://localhost:5173/project2"); // for testing locally
		cy.visit("http://it2810-12.idi.ntnu.no/project2"); // for testing on VM

		// Log in first
		cy.get(".profile-icon").click();
		cy.get(".login-input").type("testUserE2E");
		cy.get(".login-button").click();
	});

	it("should navigate through favorite page, playlist page, and back to home", () => {
		// Navigate to favorite page
		cy.contains("Favorited songs").click();
		// cy.url().should("eq", "http://localhost:5173/project2/favorites"); // for testing locally
		cy.url().should("eq", "http://it2810-12.idi.ntnu.no/project2/favorites"); // for testing on VM

		// Navigate to playlist page
		cy.contains("Your playlists").click();
		// cy.url().should("eq", "http://localhost:5173/project2/playlists"); // for testing locally
		cy.url().should("eq", "http://it2810-12.idi.ntnu.no/project2/playlists"); // for testing on VM

		// Navigate back to home page
		cy.get(".sofa-icon").click();
		// cy.url().should("eq", "http://localhost:5173/project2"); // for testing locally
		cy.url().should("eq", "http://it2810-12.idi.ntnu.no/project2"); // for testing on VM
	});
});
