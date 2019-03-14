import * as addedToCartModal from '../../helpers/added-to-cart-modal';

describe('Added to cart modal', () => {
  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });
    cy.visit(`/product/${addedToCartModal.productId}`);
  });

  it('basic modal behavior', () => {
    addedToCartModal.basicBehavior();
  });

  it('adding same product twice to cart', () => {
    addedToCartModal.productTwice();
  });

  it('adding different products to cart', () => {
    addedToCartModal.differentProduct();
  });

  it('refreshing page should not show modal', () => {
    addedToCartModal.refreshPage();
  });

  it('total price is correctly estimated', () => {
    addedToCartModal.totalPrice();
  });
});