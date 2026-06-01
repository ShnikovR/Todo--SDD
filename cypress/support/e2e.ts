beforeEach(() => {
  cy.request({
    method: "POST",
    url: "/api/test/reset",
    failOnStatusCode: false,
  });
});
