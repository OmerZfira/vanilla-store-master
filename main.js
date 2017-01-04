import './style.scss'

import storeService from './store.service';
import templates from './templates';
import cartService from './cart.service';
// import DataService from './ajax-vanila.service';
import $ from 'jquery';
import toastr from 'toastr';

const renderCartTotal = () => {
  const el = document.querySelector('[data-cart-total]');
  el.textContent = cartService.getCartTotal();
}

const showCartStatus = () => {
  const el = document.querySelector('[data-cart-status]');
  if( cartService.getCartItems().length ) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
  }
}

const generateProductsDOM = products => {
  const elContainer = document.querySelector('.products');
  $(elContainer).empty();
  const fragment = document.createDocumentFragment();
  for( let product of products ) {
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
  for( let item of items ) {
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
  // add a click event to all ADD btns in the STORE  
  const addToCartBtns = document.querySelectorAll('[data-add]');
  
  // This function is called on click events on ADD buttons
  // It finds the specific productId by looking up the DOM for [data-id]
  const addToCart = function() {
    const productId = $(this).closest('[data-id]').data('id');
    storeService.getProductById(productId).then(product => {
      const { id, title, price } = product;
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
  for( let btn of addToCartBtns ) {
    btn.addEventListener('click', addToCart);
  }
  
  // This is event delegation strategy
  // For the cart buttons, we set the click to the parent (cart)
  $('.cart-items').on('click', '[data-add]', addToCart);

  const substractFromCartBtns = function() {
    const productId = $(this).closest('[data-id]').data('id');
    cartService.substractFromCart(productId);
    generateCartItemsDOM(cartService.getCartItems());
    renderCartTotal();
    showCartStatus();

  };
  $('[data-substract]').on('click', substractFromCartBtns);

  const clearItem = function() {
    const productId = $(this).closest('[data-id]').data('id');
    cartService.clearItem(productId);
    generateCartItemsDOM(cartService.getCartItems());
    renderCartTotal();
    showCartStatus();

  }
  // Jquery style event delegation!!
  $('.cart-items').on('click', '[data-clear]', clearItem);

  // document.querySelector('.cart-items')
  //         .addEventListener('click', function( event ) {
  //           if( event.target.matches('[data-clear]') ) {
  //             console.log('Fun stuff!!');
  //           }
  //         })

  const onDeleteSuccess = () => {
      toastr.options.closeButton = true;
      toastr.success('Product Deleted!');
   getProducts();
  }

  $('[data-delete]').on('click', function(_) {
      const productId = $(this).closest('[data-id]').data('id');
      storeService.deleteProduct(productId, onDeleteSuccess)
  });


}

const renderStore = products => {
  generateProductsDOM(products);
  clickHandlers();
  hideLoader();
}

const getProducts = () => {
    storeService.getProducts().then(renderStore).catch(err=>{
        console.log('Telling the user: Try again Later');
    });

}

// Initial rendering of the shop
getProducts();




// for (var i = 1; i <= 3; i++) {
//       document.getElementById("btn"+i).onclick = function() {
//                                                     alert(i);
//                                                 }
// }
