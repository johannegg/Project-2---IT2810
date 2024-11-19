describe('search for a song', () => {
    beforeEach( () => {
      cy.visit("http://localhost:5173/project2/");
    });

    it('should show the song you searched for', () => {
        // Search for a song
        cy.get('.searchForm').click();
        cy.get('.searchInput').type('hello');
        cy.get('.searchIcon').click();

        // Check that the songs shown are the ones we searched for
        cy.get('.tableRow').each(($row) => {
            cy.wrap($row).find('.titleCell').invoke('text').then((titleText) => {
              cy.wrap($row).find('.artistCell').invoke('text').then((artistText) => {
                const titleLower = titleText.trim().toLowerCase();
                const artistLower = artistText.trim().toLowerCase();
                expect(titleLower.includes('hello') || artistLower.includes('hello')).to.be.true;
              });
            });
          });
        });

    it('should show a message when no songs are found', () => {
        // Search for a song that doesn't exist
        cy.get('.searchForm').click();
        cy.get('.searchInput').type('thissongdoesnotexist');
        cy.get('.searchIcon').click();

        // Check that the message is shown
        cy.get('.tableRow').should('not.exist');
        cy.contains('No songs found').should('exist');
    });

  });