describe('Make and view playlists', () => {
    beforeEach( () => {
      cy.visit("http://localhost:5173/project2/");
        // Log in first
        cy.get('.profile-icon').click();
        cy.get('.login-input').type('test');
        cy.get('.login-button').click();

        // Navigate to page
        cy.contains('Your playlists').click();

      });


      it('should make new playlist and delete it', () => {
        // Click on the new playlist button
        cy.get('.new-playlist-button').click();
        cy.contains('Create new playlist').should('be.visible');

        // Make the playlist
        cy.get('.playlist-input').type('Test playlist');
        cy.get('.form-submit-button').click();

        // Check if the playlist is visible
        cy.contains('Test playlist').should('be.visible');

        // View the playlist
        cy.contains('Test playlist').click();

        // Delete the playlist
        cy.get('.delete-playlist-button').click();
        cy.get('.confirm-button').click();
      });

      it('should add and remove songs from playlist', () => {
        //fjern denne linjen for å kjøre testen
        // Make a playlist
        cy.get('.new-playlist-button').click();
        cy.contains('Create new playlist').should('be.visible');
        cy.get('.playlist-input').type('Test playlist');
        cy.get('.form-submit-button').click();

        // Add songs to the playlist
        cy.get('.sofa-icon').click();
        cy.get('.plusMinus-button').eq(1).click();
        cy.contains('Test playlist').click();
        cy.get('.closeBtn').click();

        // Check if the song is in the playlist
        cy.contains('Your playlists').click();
        cy.contains('Test playlist').click();
        cy.contains('Hound Dog').should('be.visible');

        // Remove the song from the playlist
        cy.get('.plusMinus-button').eq(0).click();

        // Delete the playlist
        cy.get('.delete-playlist-button').click();
        cy.get('.confirm-button').click();

      });
    });