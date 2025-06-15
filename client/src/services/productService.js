// Mock product data
const products = [
  // Indoor Plants
  {
    id: '1',
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
    id: '2',
    name: 'Bamboo Grove',
    description: 'Elegant artificial bamboo plants perfect for modern interiors.',
    price: 4799,
    category: 'indoor',
    rating: 4.3,
    numReviews: 10,
    countInStock: 8,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/11617886/pexels-photo-11617886.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    name: 'Zen Ficus Tree',
    description: 'Detailed artificial ficus tree with realistic trunk and leaves.',
    price: 5599,
    category: 'indoor',
    rating: 4.7,
    numReviews: 18,
    countInStock: 12,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    name: 'Peace Lily',
    description: 'Beautiful artificial peace lily with white flowers.',
    price: 2799,
    category: 'indoor',
    rating: 4.1,
    numReviews: 12,
    countInStock: 20,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Outdoor Plants
  {
    id: '5',
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
  {
    id: '6',
    name: 'Garden Fern',
    description: 'UV-resistant artificial fern perfect for outdoor gardens.',
    price: 3679,
    category: 'outdoor',
    rating: 4.4,
    numReviews: 15,
    countInStock: 10,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '7',
    name: 'Outdoor Lavender',
    description: 'Realistic artificial lavender bushes for outdoor decoration.',
    price: 2639,
    category: 'outdoor',
    rating: 4.3,
    numReviews: 8,
    countInStock: 18,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Bonsai
  {
    id: '8',
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
    id: '9',
    name: 'Juniper Bonsai',
    description: 'Elegant artificial juniper bonsai with detailed foliage.',
    price: 4479,
    category: 'bonsai',
    rating: 4.6,
    numReviews: 9,
    countInStock: 7,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/4751969/pexels-photo-4751969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Large Plants
  {
    id: '10',
    name: 'Giant Monstera',
    description: 'Large artificial monstera plant perfect as a statement piece.',
    price: 10399,
    category: 'large-plants',
    rating: 4.9,
    numReviews: 25,
    countInStock: 3,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '11',
    name: 'Large Fiddle Leaf Fig',
    description: 'Impressive artificial fiddle leaf fig tree for large spaces.',
    price: 11999,
    category: 'large-plants',
    rating: 4.8,
    numReviews: 18,
    countInStock: 4,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Small Plants
  {
    id: '12',
    name: 'Succulent Set',
    description: 'Set of 5 small artificial succulents in decorative pots.',
    price: 2399,
    category: 'small-plants',
    rating: 4.0,
    numReviews: 15,
    countInStock: 20,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1459495/pexels-photo-1459495.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '13',
    name: 'Mini Cactus Collection',
    description: 'Adorable collection of small artificial cacti.',
    price: 1999,
    category: 'small-plants',
    rating: 4.2,
    numReviews: 22,
    countInStock: 25,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '14',
    name: 'Small Herb Garden',
    description: 'Miniature artificial herb garden for kitchen decoration.',
    price: 1599,
    category: 'small-plants',
    rating: 4.1,
    numReviews: 11,
    countInStock: 30,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Hanging Plants
  {
    id: '15',
    name: 'Hanging Ivy',
    description: 'Beautiful artificial hanging ivy with cascading vines.',
    price: 3439,
    category: 'hanging-plants',
    rating: 4.4,
    numReviews: 16,
    countInStock: 12,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '16',
    name: 'Hanging Fern',
    description: 'Lush artificial hanging fern perfect for any room.',
    price: 3119,
    category: 'hanging-plants',
    rating: 4.3,
    numReviews: 13,
    countInStock: 15,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Artificial Trees
  {
    id: '17',
    name: 'Olive Tree',
    description: 'Realistic artificial olive tree with detailed branches.',
    price: 15999,
    category: 'artificial-trees',
    rating: 4.9,
    numReviews: 30,
    countInStock: 2,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/1034394/pexels-photo-1034394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '18',
    name: 'Cherry Blossom Tree',
    description: 'Stunning artificial cherry blossom tree with pink flowers.',
    price: 14399,
    category: 'artificial-trees',
    rating: 4.7,
    numReviews: 24,
    countInStock: 3,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1034394/pexels-photo-1034394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },

  // Artificial Flowers
  {
    id: '19',
    name: 'Rose Bouquet',
    description: 'Elegant artificial rose bouquet in various colors.',
    price: 2879,
    category: 'artificial-flowers',
    rating: 4.5,
    numReviews: 28,
    countInStock: 22,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '20',
    name: 'Sunflower Arrangement',
    description: 'Bright artificial sunflower arrangement for cheerful decoration.',
    price: 2319,
    category: 'artificial-flowers',
    rating: 4.3,
    numReviews: 19,
    countInStock: 18,
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '21',
    name: 'Tulip Garden',
    description: 'Colorful artificial tulip arrangement for spring vibes.',
    price: 2559,
    category: 'artificial-flowers',
    rating: 4.4,
    numReviews: 21,
    countInStock: 16,
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

const productService = {
  getProducts: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProducts = [...products];
        
        // Apply search filter
        if (filters.search) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
              product.description.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        // Apply category filter
        if (filters.category) {
          filteredProducts = filteredProducts.filter(
            (product) => product.category === filters.category
          );
        }
        
        // Apply price range filter
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(
            (product) =>
              (filters.minPrice === undefined || product.price >= filters.minPrice) &&
              (filters.maxPrice === undefined || product.price <= filters.maxPrice)
          );
        }
        
        // Apply rating filter
        if (filters.rating) {
          filteredProducts = filteredProducts.filter(
            (product) => product.rating >= filters.rating
          );
        }
        
        // Apply sorting
        if (filters.sort) {
          switch (filters.sort) {
            case 'price-low-to-high':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-high-to-low':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'rating':
              filteredProducts.sort((a, b) => b.rating - a.rating);
              break;
            default:
              break;
          }
        }
        
        const total = filteredProducts.length;
        
        // Apply pagination
        if (filters.page && filters.limit) {
          const start = (filters.page - 1) * filters.limit;
          const end = start + filters.limit;
          filteredProducts = filteredProducts.slice(start, end);
        }
        
        resolve({
          products: filteredProducts,
          total,
        });
      }, 1000);
    });
  },
  
  getFeaturedProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const featuredProducts = products.filter((product) => product.featured);
        resolve(featuredProducts);
      }, 1000);
    });
  },
  
  getProductById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p) => p.id === id);
        if (product) {
          resolve(product);
        } else {
          reject({ message: 'Product not found' });
        }
      }, 500);
    });
  },
  
  createProduct: async (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct = {
          id: String(products.length + 1),
          ...productData,
          rating: 0,
          numReviews: 0,
        };
        products.push(newProduct);
        resolve(newProduct);
      }, 1000);
    });
  },
  
  updateProduct: async (id, productData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
          const updatedProduct = {
            ...products[index],
            ...productData,
          };
          products[index] = updatedProduct;
          resolve(updatedProduct);
        } else {
          reject({ message: 'Product not found' });
        }
      }, 1000);
    });
  },
  
  deleteProduct: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = products.findIndex((p) => p.id === id);
        if (index !== -1) {
          products.splice(index, 1);
          resolve(id);
        } else {
          reject({ message: 'Product not found' });
        }
      }, 1000);
    });
  },
};

export default productService;