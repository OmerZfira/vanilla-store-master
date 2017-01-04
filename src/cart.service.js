

const cartItems = [];

const getCartItems = () => cartItems;

// If the item already in cart, increase quantity, else addto cart
const addToCart = item => {
  const itemInCart = cartItems.find(currentItem => item.id === currentItem.id);
  if( itemInCart ) {
    itemInCart.quantity++;
    itemInCart.price = item.price;
    itemInCart.title = item.title;
  } else {
    item.quantity = 1;
    cartItems.push(item);
  }
}

// Decrease quantity, if 0, remove from cart
const substractFromCart = itemId => {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if( itemIndex > -1 ) {
    if( cartItems[itemIndex].quantity > 1 ) {
      cartItems[itemIndex].quantity--;
    } else {
      cartItems.splice(itemIndex, 1);
    }
  }
}

const clearItem = itemId => {
  const itemIndex = cartItems.findIndex(item => item.id === itemId);
  if( itemIndex > -1 ) {
    cartItems.splice(itemIndex, 1);
  }
}

const getCartTotal = () => {
  return cartItems.reduce(( acc, item ) => {
    return acc + (item.quantity * +item.price);
  }, 0);
}

export default {
  substractFromCart,
  getCartItems,
  clearItem,
  addToCart,
  getCartTotal
}