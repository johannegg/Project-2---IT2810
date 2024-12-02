/// <reference types="cypress" />
describe("Favorites", () => {
	beforeEach(() => {
		//cy.visit("http://localhost:5173/project2"); // for testing locally
		cy.visit("http://it2810-12.idi.ntnu.no/project2"); // for testing on VM

		cy.get(".profile-icon").click();
		cy.get(".login-input").type("testUserE2E");
		cy.get(".login-button").click();
	});

	it("should favorite a song and remove it", () => {
		// Add a song to favorites
		cy.get(".favoriteButton").eq(10).click();

		// Check if the song is in favorites
		cy.contains("Favorited songs").click();
		cy.contains("Odd Look").should("be.visible");

		// Remove song from favorites
		cy.get(".favoriteButton").first().click();

		// Check if the song is removed from favorites
		cy.contains("You have no favorited songs").should("be.visible");
	});
});
