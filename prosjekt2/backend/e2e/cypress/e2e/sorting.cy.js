describe("Sorting", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/project2/");
  });

  it("should sort the songs based on sortoption", () => {
    // Open sidebar
    cy.get(".filterButtonContainer").click();

    // Check if the sort-components are visible
    cy.get(".sort-container").should("be.visible");

    // Check if the sortingOption is Views
    cy.get(".sort-container").within(() => {
      cy.contains("Views").should("exist");
    });

    // Check if the songs are sorted by views
    cy.get(".songTable").within(() => {
      cy.get(".tableRow").then(($rows) => {
        const rows = [...$rows].slice(1, 4);
        const views = rows.map((row) =>
          parseInt(
            Cypress.$(row)
              .find(".viewsCell")
              .text()
              .trim()
              .replace(/[^0-9]/g, ""),
            10,
          ),
        );
        expect(views[0]).to.be.at.least(views[1]);
        expect(views[1]).to.be.at.least(views[2]);
      });
    });

    // Click on the select, and chose another option for sorting, for example Artist Z-A
    cy.get(".sort-container").click();
    cy.get(".sort-container select").select("Artist Z-A");

    // Check if the songs are sorted by title
    cy.get(".songTable").within(() => {
      cy.get(".tableRow")
        .eq(1)
        .find(".artistCell")
        .should("be.visible")
        .then(($artist1) => {
          cy.get(".tableRow")
            .eq(2)
            .find(".artistCell")
            .should("be.visible")
            .then(($artist2) => {
              cy.get(".tableRow")
                .eq(3)
                .find(".artistCell")
                .should("be.visible")
                .then(($artist3) => {
                  const artist1 = $artist1.text().trim().charAt(0);
                  const artist2 = $artist2.text().trim().charAt(0);
                  const artist3 = $artist3.text().trim().charAt(0);

                  expect(artist2.localeCompare(artist1)).to.be.lessThan(0);
                  expect(artist3.localeCompare(artist2)).to.be.lessThan(0);
                });
            });
        });
    });
  });
});
