import './style.scss'

import storeService from './store.service';
import templates from './templates';
import cartService from './cart.service';
import $ from 'jquery';
import toastr from 'toastr';

const getProducts = () => {
  storeService.getProducts().then(renderStore).catch(err => {
    console.log('Try again Later');
  });

}

// Initial rendering of the shop
$(getProducts);

const renderStore = products => {
  generateProductsDOM(products);
  clickHandlers();
  hideLoader();
}

const renderCartTotal = () => {
  const el = document.querySelector('[data-cart-total]');
  el.textContent = cartService.getCartTotal();
}

const showCartStatus = () => {
  const el = document.querySelector('[data-cart-status]');
  if (cartService.getCartItems().length) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

const generateProductsDOM = products => {
  const elContainer = document.querySelector('.products');
  $(elContainer).empty();
  const fragment = document.createDocumentFragment();
  for (let product of products) {
    const template = document.createElement('template');
    template.innerHTML = templates.getProductTpl(product);
    fragment.appendChild(template.content);
  }
  elContainer.appendChild(fragment);
}

const generateCartItemsDOM = items => {
  const el = document.querySelector('.cart-items');
  $(el).empty();
  const fragment = document.createDocumentFragment();
  for (let item of items) {
    const template = document.createElement('template');
    template.innerHTML = templates.getCartTpl(item);
    fragment.appendChild(template.content);
  }
  el.appendChild(fragment);
}

const hideLoader = () => {
  const el = document.querySelector('.loader');
  el.style.display = 'none';
}

const clickHandlers = () => {

  $('[data-edit-product]').off('click');
  
  // add a click event to all ADD btns in the STORE  
  const addToCartBtns = document.querySelectorAll('[data-add]');

  // This function is called on click events on ADD buttons
  // It finds the specific productId by looking up the DOM for [data-id]
  const addProductToCart = function () {
    const productId = $(this).closest('[data-id]').data('id');
    storeService.getProductById(productId).then(product => {
      let { id, title, price } = product;
      cartService.addToCart({
        id,
        title,
        price
      });
      generateCartItemsDOM(cartService.getCartItems());
      renderCartTotal();
      showCartStatus();
    });
  }
  for (let btn of addToCartBtns) {
    btn.addEventListener('click', addProductToCart);
  }

  // This is event delegation strategy
  // For the cart buttons, we set the click to the parent (cart)
  $('.cart-items').on('click', '[data-add]', addProductToCart);

  const substractFromCartBtns = function () {
    const productId = $(this).closest('[data-id]').data('id');
    cartService.substractFromCart(productId);
    generateCartItemsDOM(cartService.getCartItems());
    renderCartTotal();
    showCartStatus();

  };
  $('[data-substract]').on('click', substractFromCartBtns);

  const clearItem = function () {
    const productId = $(this).closest('[data-id]').data('id');
    cartService.clearItem(productId);
    generateCartItemsDOM(cartService.getCartItems());
    renderCartTotal();
    showCartStatus();

  }
  // Jquery style event delegation!!
  $('.cart-items').on('click', '[data-clear]', clearItem);

  const onActionSuccess = (msg) => {
    toastr.options.closeButton = true;
    toastr.success(`${msg}`);
    clearForm();
    getProducts()
  }

  $('[data-delete]').on('click', function (_) {
    const productId = $(this).closest('[data-id]').data('id');
    storeService.deleteProduct(productId, onActionSuccess)
  });

  $('[data-edit]').on('click', function (_) {
    const productId = $(this).closest('[data-id]').data('id');
    let $formEditProduct = $('.formEditProductCont');
    storeService.getProductById(productId).then((product) => {

      var $elProductId = $formEditProduct.find('#product-id');
      var $elProductTitle = $formEditProduct.find('#product-title');
      var $elProductDesc = $formEditProduct.find('#product-desc');
      var $elProductPrice = $formEditProduct.find('#product-price');

      $elProductId.val(product.id);
      $elProductTitle.val(product.title);
      $elProductDesc.val(product.description);
      $elProductPrice.val(product.price)
    });
  });

$('[data-edit-product]').on('click', function (e) {
    e.preventDefault();
    const $formEditProduct = $('.formEditProductCont');
    let product =
      {
        id: $formEditProduct.find('#product-id').val(),
        title: $formEditProduct.find('#product-title').val(),
        description: $formEditProduct.find('#product-desc').val(),
        price: $formEditProduct.find('#product-price').val()
      }
    if (!product.id) storeService.addProduct(product, onActionSuccess);
    else storeService.editProduct(product, onActionSuccess)

  });

  $('[data-edit]').on('click', toggleForm);
}

const toggleForm = () => {
  $('.formEditProductCont').toggleClass('formShown')
};


  const clearForm = () => {
    $('#product-id, #product-title, #product-desc, #product-price').val('');
  }