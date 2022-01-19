describe("media list tests", () => {
  it("It loads media list", () => {
    cy.visit("/media/list");
    cy.get(".media-list").should("not.be.empty");
    cy.get(".media-item").should("have.length", 10);
  });

  it("It selects images (media-list)", () => {
    cy.visit("/media/list");
    cy.get("#delete_media_button").should("be.disabled");
    cy.get(".media-list").find("button").eq(0).click();
    cy.get(".media-list").find(".card").should("have.class", "selected");
    cy.get("#delete_media_button").should("not.be.disabled");
  });

  it("It opens delete modal (media-list)", () => {
    cy.visit("/media/list");
    cy.get("#delete-modal").should("not.exist");
    cy.get(".media-list").find("button").eq(0).click();
    cy.get("#delete_media_button").click();
    cy.get("#delete-modal").should("exist");
  });
});
