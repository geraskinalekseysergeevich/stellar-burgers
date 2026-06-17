describe('Constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    cy.clearAuth();
  });

  it('adds ingredients from list to constructor', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((item: { type: string }) => item.type === 'bun');
      const filling = data.find((item: { type: string }) => item.type === 'main');

      expect(bun).to.exist;
      expect(filling).to.exist;

      cy.contains(bun!.name).parents('li').within(() => {
        cy.contains('Добавить').click();
      });

      cy.contains(filling!.name).parents('li').within(() => {
        cy.contains('Добавить').click();
      });

      cy.contains(`${bun!.name} (верх)`).should('be.visible');
      cy.contains(`${bun!.name} (низ)`).should('be.visible');
      cy.contains('Выберите булки').should('not.exist');
      cy.contains('Выберите начинку').should('not.exist');
    });
  });

  it('opens and closes ingredient modal', () => {
    cy.fixture('ingredients.json').then(({ data }) => {
      const ingredient = data.find(
        (item: { type: string }) => item.type === 'main'
      );

      expect(ingredient).to.exist;

      cy.contains(ingredient!.name).click();

      cy.contains('Детали ингредиента').should('be.visible');
      cy.contains(ingredient!.name).should('be.visible');
      cy.contains('Калории, ккал')
        .parent()
        .contains(String(ingredient!.calories))
        .should('be.visible');

      cy.contains('Детали ингредиента').parent().find('button').click();
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  it('creates order and clears constructor after closing modal', () => {
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.fixture('ingredients.json').then(({ data }) => {
      const bun = data.find((item: { type: string }) => item.type === 'bun');
      const filling = data.find((item: { type: string }) => item.type === 'main');

      expect(bun).to.exist;
      expect(filling).to.exist;

      cy.seedAuth({
        accessToken: 'Bearer test-access-token',
        refreshToken: 'test-refresh-token'
      });

      cy.contains(bun!.name).parents('li').within(() => {
        cy.contains('Добавить').click();
      });

      cy.contains(filling!.name).parents('li').within(() => {
        cy.contains('Добавить').click();
      });

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.fixture('order.json').then(({ order }) => {
        cy.contains(String(order.number)).should('be.visible');
      });

      cy.get('body').type('{esc}');

      cy.contains('424242').should('not.exist');
      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
