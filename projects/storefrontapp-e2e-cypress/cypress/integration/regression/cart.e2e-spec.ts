import * as cart from '../../helpers/cart';

describe('Cart', () => {
  before(() => {
    cy.window().then(win => win.sessionStorage.clear());
    cy.visit('/');
  });

  it('should add products to cart via search autocomplete', () => {
    cart.addProductToCartViaAutoComplete();
  });

  it('should add products to cart through search result page', () => {
    cart.addProductToCartViaSearchPage();
  });

  it('should display empty cart if no items added and when items are removed', () => {
    cart.displayEmptyCart();
  });

  it('should add product to cart as anonymous and merge when logged in', () => {
    cart.usingRequiredLoggedIn();

    cart.viewProductInModal();

    cart.logOutAndNavigateToEmptyCart();

    cart.addProductToCartAsRandom();

    cart.verifyCartAsUser();

    cart.logOutAndEmptyCart();
  });

  it('should add product to cart and manipulate quantity', () => {
    cart.manipulateQuantity();
  });

  it('should be unable to add out of stock products to cart', () => {
    cart.outOfStock();
  });
});