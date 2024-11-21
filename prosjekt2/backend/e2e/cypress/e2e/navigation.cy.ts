/// <reference types="cypress" />
describe("Navigate", () => {
	beforeEach(() => {
		cy.visit("http://localhost:5173/project2/");

		// Log in first
		cy.get(".profile-icon").click();
		cy.get(".login-input").type("testUserE2E");
		cy.get(".login-button").click();
	});

	it("should navigate through favorite page, playlist page, and back to home", () => {
		// Navigate to favorite page
		cy.contains("Favorited songs").click();
		cy.url().should("eq", "http://localhost:5173/project2/favorites");

		// Navigate to playlist page
		cy.contains("Your playlists").click();
		cy.url().should("eq", "http://localhost:5173/project2/playlists");

		// Navigate back to home page
		cy.get(".sofa-icon").click();
		cy.url().should("eq", "http://localhost:5173/project2");
	});
});
