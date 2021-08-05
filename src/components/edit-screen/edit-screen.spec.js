describe("Edit screen page tests", () => {
  it("It loads a screen", () => {
    cy.visit("/screen/new");
    cy.get("h1").should("not.be.empty");
    cy.get("h1")
      .invoke("text")
      .should("match", /^Opret ny skærm/);
    cy.visit("/screen/76");
    cy.get("h1").should("not.be.empty");
    cy.get("h1")
      .invoke("text")
      .should("match", /^Rediger følgende skærm: Asoka/);
  });

  it("It loads drag and drop table", () => {
    cy.visit("/screen/32");
    cy.get("#drag-and-drop-table").find("tr td").should("have.length", 12);
  });
  it("It drags and drops", () => {
    cy.visit("/screen/32");
    cy.get("#drag-and-drop-table")
      .find("tr td")
      .eq(0)
      .invoke("text")
      .should("match", /^Sommerplaylist/);
    cy.get("#drag-and-drop-table")
      .find("tr")
      .eq(0)
      .focus()
      .type(" ")
      .type("{downarrow}")
      .type(" ");
    cy.get("#drag-and-drop-table")
      .find("tr td")
      .eq(0)
      .invoke("text")
      .should("match", /^Ereolen/);
  });

  it("It removes from list", () => {
    cy.visit("/screen/32");
    cy.get("#drag-and-drop-table").find("tr td").should("have.length", 12);
    cy.get("#drag-and-drop-table").find("tr td button").eq(4).click();
    cy.get("#drag-and-drop-table").find("tr td").should("have.length", 6);
    cy.get("#drag-and-drop-table").find("tr td button").eq(4).click();
    cy.get("#drag-and-drop-table").should("have.length", 1);
  });

  it("It validates new screen", () => {
    cy.visit("/screen/new");
    cy.get("#save_screen")
      .invoke("text")
      .should("match", /^Gem skærm/);
    cy.get("#save_screen").click();
    cy.get("#save_screen")
      .invoke("text")
      .should("match", /^Gem skærm/);
    cy.get("#screenName").type("x");
    cy.get("#save_screen").click();
    cy.get("#save_screen")
      .invoke("text")
      .should("match", /^Gem skærm/);
    cy.get(".dropdown-heading").eq(0).click();
    cy.get('[type="checkbox"]').eq(0).check();
    cy.get(".dropdown-heading").eq(0).click();
    cy.get(".dropdown-heading").eq(1).click();
    cy.get('[type="checkbox"]').eq(0).check();
    cy.get(".dropdown-heading").eq(1).click();
    cy.get("#screenLayout").select("Footer");
    cy.get("#save_screen").click();
    cy.get("#save_screen").should("not.exist");
  });

  it("It validates already existing screen", () => {
    cy.visit("/screen/32");
    cy.get("#screenName").clear();
    cy.get(".container")
      .find("#save_screen")
      .invoke("text")
      .should("match", /^Gem skærm/);
    cy.get("#save_screen").click();
    cy.get(".container")
      .find("#save_screen")
      .invoke("text")
      .should("match", /^Gem skærm/);
    cy.get("#screenName").type("x");
    cy.get("#save_screen").click();
    cy.get("#save_screen").should("not.exist");
  });
});
