/// <reference types="cypress" />
describe("View a song", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/project2/");
  });

  it("should show a song when you click on it, and then go back", () => {
    cy.get(".tableRow").eq(1).as("selectedRow");
    cy.get("@selectedRow")
      .find(".titleCell")
      .invoke("text")
      .then((title) => {
        expect(title).to.exist;
        cy.get("@selectedRow").click();
        cy.contains(title).should("be.visible");
      });
    cy.get(".back-button").should("be.visible");
    cy.get(".back-button").click();
  });

  it("should add song to favorite from song page", () => {
    // Log in first
    cy.get(".profile-icon").click();
    cy.get(".login-input").type("testUserE2E");
    cy.get(".login-button").click();

    // Add a song to favorites
    cy.get(".tableRow").eq(1).click();
    cy.get(".favoriteButton").click();

    // Check if the song is in favorites
    cy.contains("Favorited songs").click();
    cy.get(".tableRow")
      .find(".titleCell")
      .invoke("text")
      .then((title) => {
        expect(title).to.exist;
        cy.contains(title).should("be.visible");

        // Unfavorite the song to clean up
        cy.get(".favoriteButton").click();
      });
  });

  it("should add song to playlist from song page", () => {
    // Log in first
    cy.get(".profile-icon").click();
    cy.get(".login-input").type("testUserE2E");
    cy.get(".login-button").click();

    // Make a playlist
    cy.contains("Your playlists").click();
    cy.get(".new-playlist-button").click();
    cy.contains("Create new playlist").should("be.visible");
    cy.get(".playlist-input").type("E2E-testing");
    cy.get(".form-submit-button").click();

    // Add song to playlist
    cy.get(".sofa-icon").click();
    cy.get(".tableRow")
      .eq(4)
      .find(".titleCell")
      .invoke("text")
      .then((title) => {
        expect(title).to.exist;
        cy.get(".tableRow").eq(4).click();
        cy.get(".plusMinus-button").click();
        cy.contains("E2E-testing").click();
        cy.get(".closeBtn").click();

        // Check if the song is in the playlist
        cy.contains("Your playlists").click();
        cy.contains("E2E-testing").click();
        cy.contains(title).should("be.visible");

        // Remove the song from the playlist
        cy.get(".plusMinus-button").click();

        // Delete the playlist
        cy.get(".delete-playlist-button").click();
        cy.get(".confirm-button").click();
      });
  });
});
