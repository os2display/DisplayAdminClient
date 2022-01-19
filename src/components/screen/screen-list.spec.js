describe("Screen list loads", () => {
  beforeEach(() => {
    cy.intercept({
      method: "GET",
      url: "**/screen-groups*",
    }).as("screenGroupData");
    cy.visit("/screen/list");
    cy.wait([
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
      "@screenGroupData",
    ]);
  });
  it("It loads screens list", () => {
    cy.get("table").find("tbody").should("not.be.empty");
    cy.get("tbody").find("tr td").should("have.length", 70);
  });

  it("It goes to edit (screens list)", () => {
    cy.get("#screenTitle").should("not.exist");
    cy.get(".btn.btn-primary.edit-button").first().click();
    cy.get("#screenTitle").should("exist");
  });

  it("It opens delete modal (screens list)", () => {
    cy.get("#delete-modal").should("not.exist");
    cy.get("tbody").find("tr td button").eq(2).click();
    cy.get("#delete-modal").should("exist");
  });

  it("The correct amount of column headers loaded (screens list)", () => {
    cy.get("thead").find("th").should("have.length", 7);
  });

  it("It removes all selected", () => {
    cy.get("tbody").find("tr td button").eq(0).click();
    cy.get("tbody").find("tr").eq(0).should("have.class", "bg-light");
    cy.get("#clear-rows-button").click();
    cy.get("tbody").find("tr").eq(0).should("have.not.class", "bg-light");
  });
});
