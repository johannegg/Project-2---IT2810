describe('filter on genre', () => {
    beforeEach( () => {
      cy.visit("http://localhost:5173/project2/");
    });

    it('should show the sidebar with the genrefilter', () => {
        // Open sidebar
        cy.get(".filterButton").click();
    
        // Check that the genre filter is visible
        cy.get(".filterContainer").should('be.visible');
      });

      it('should allow selecting and clearing genre filters', () => {
        // Open sidebar
        cy.get(".filterButton").click();
    
        // Click on the songs
        cy.contains("Country").click();
        cy.contains("Pop").click();
        cy.contains("Rap").click();
        cy.contains("Rb").click();
        cy.contains("Rock").click();
    
        // Click on the clear filters button
        cy.contains("Clear filters").click();
      });

      it.only('should click on the genre filter and show the correct songs', () => {
        const genre = "Country";
        const genreLower = genre.toLowerCase();

        // Click on the filter button
        cy.get(".filterButton").click();
        cy.contains(genre).click();
      
        // Iterate through the first 5 songs and check that their genre matches "Country"
        for (let i = 0; i < 30; i++) {
          cy.get(".tableRow").eq(i).click();
          cy.get('.songInfo').should('contain', genreLower);

        // Navigate back to the filtered list
         cy.go('back');
        }
      });
      
  });