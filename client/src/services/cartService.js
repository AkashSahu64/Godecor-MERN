// Mock cart data
let cartItems = [];

const cartService = {
  getCart: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...cartItems]); // Return a copy of the array
      }, 500);
    });
  },
  
  addToCart: async (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if the product is already in the cart
        const existingItemIndex = cartItems.findIndex((item) => item.id === productData.id);
        
        if (existingItemIndex !== -1) {
          // Create new array with updated item
          cartItems = cartItems.map((item) =>
            item.id === productData.id
              ? { ...item, quantity: item.quantity + (productData.quantity || 1) }
              : item
          );
          resolve(cartItems[existingItemIndex]);
        } else {
          // Add new item to cart by creating a new array
          const newItem = {
            ...productData,
            quantity: productData.quantity || 1,
          };
          cartItems = [...cartItems, newItem];
          resolve(newItem);
        }
      }, 500);
    });
  },
  
  updateCartItem: async (productId, quantity) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const itemIndex = cartItems.findIndex((item) => item.id === productId);
        
        if (itemIndex !== -1) {
          // Create new array with updated item
          cartItems = cartItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          );
          resolve(cartItems[itemIndex]);
        } else {
          reject({ message: 'Item not found in cart' });
        }
      }, 500);
    });
  },
  
  removeFromCart: async (productId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = cartItems.length;
        // Create new array without the removed item
        cartItems = cartItems.filter((item) => item.id !== productId);
        
        if (cartItems.length < initialLength) {
          resolve(productId);
        } else {
          reject({ message: 'Item not found in cart' });
        }
      }, 500);
    });
  },
  
  clearCart: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        cartItems = [];
        resolve();
      }, 500);
    });
  },
};

export default cartService;