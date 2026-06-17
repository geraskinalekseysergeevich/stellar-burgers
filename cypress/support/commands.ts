declare global {
  namespace Cypress {
    interface Chainable {
      seedAuth(tokens: { accessToken: string; refreshToken: string }): Chainable<void>;
      clearAuth(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('seedAuth', ({ accessToken, refreshToken }) => {
  cy.window().then((window) => {
    window.localStorage.setItem('refreshToken', refreshToken);
  });

  cy.setCookie('accessToken', accessToken);
});

Cypress.Commands.add('clearAuth', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

export {};
