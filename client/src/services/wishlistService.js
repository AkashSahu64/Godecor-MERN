// Mock wishlist data
let wishlistItems = [];

const wishlistService = {
  getWishlist: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(wishlistItems);
      }, 500);
    });
  },
  
  addToWishlist: async (productId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Import mock products directly to avoid circular dependencies
        const products = [
          {
            id: '1',
            name: 'Japanese Bonsai',
            description: 'Beautiful artificial Japanese Bonsai tree, perfect for your desk or shelf.',
            price: 3999,
            category: 'bonsai',
            rating: 4.5,
            numReviews: 12,
            countInStock: 10,
            featured: true,
            imageUrl: 'https://images.pexels.com/photos/4751969/pexels-photo-4751969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          },
          {
            id: '2',
            name: 'Monstera Deliciosa',
            description: 'Realistic artificial Monstera Deliciosa plant for indoor decoration.',
            price: 3199,
            category: 'indoor',
            rating: 4.2,
            numReviews: 8,
            countInStock: 15,
            featured: true,
            imageUrl: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          },
          {
            id: '3',
            name: 'Outdoor Palm',
            description: 'Weather-resistant artificial palm tree for outdoor spaces.',
            price: 7199,
            category: 'outdoor',
            rating: 4.8,
            numReviews: 20,
            countInStock: 5,
            featured: true,
            imageUrl: 'https://images.pexels.com/photos/1034394/pexels-photo-1034394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          },
        ];
        
        // Check if product already exists in wishlist
        const existingItem = wishlistItems.find((item) => item.id === productId);
        
        if (existingItem) {
          reject({ message: 'Product already in wishlist' });
        } else {
          // Find the product by ID
          const product = products.find((p) => p.id === productId);
          
          if (product) {
            wishlistItems.push(product);
            resolve(product);
          } else {
            reject({ message: 'Product not found' });
          }
        }
      }, 500);
    });
  },
  
  removeFromWishlist: async (productId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = wishlistItems.length;
        wishlistItems = wishlistItems.filter((item) => item.id !== productId);
        
        if (wishlistItems.length < initialLength) {
          resolve(productId);
        } else {
          reject({ message: 'Item not found in wishlist' });
        }
      }, 500);
    });
  },
};

export default wishlistService;