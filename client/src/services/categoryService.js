// Mock categories data
let categories = [
  {
    id: '1',
    name: 'Indoor',
    slug: 'indoor',
    description: 'Perfect artificial plants for indoor decoration',
    imageUrl: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '2',
    name: 'Outdoor',
    slug: 'outdoor',
    description: 'Weather-resistant artificial plants for outdoor spaces',
    imageUrl: 'https://images.pexels.com/photos/1028599/pexels-photo-1028599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '3',
    name: 'Bonsai',
    slug: 'bonsai',
    description: 'Artificial bonsai trees for zen decoration',
    imageUrl: 'https://images.pexels.com/photos/4751969/pexels-photo-4751969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '4',
    name: 'Large Plants',
    slug: 'large-plants',
    description: 'Impressive artificial large plants for statement pieces',
    imageUrl: 'https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '5',
    name: 'Small Plants',
    slug: 'small-plants',
    description: 'Delicate artificial small plants for any space',
    imageUrl: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '6',
    name: 'Hanging Plants',
    slug: 'hanging-plants',
    description: 'Beautiful artificial hanging plants for vertical spaces',
    imageUrl: 'https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '7',
    name: 'Artificial Trees',
    slug: 'artificial-trees',
    description: 'Lifelike artificial trees for indoor and outdoor spaces',
    imageUrl: 'https://images.pexels.com/photos/1034394/pexels-photo-1034394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: '8',
    name: 'Artificial Flowers',
    slug: 'artificial-flowers',
    description: 'Stunning artificial flowers that never wilt',
    imageUrl: 'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  }
];

const categoryService = {
  getCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 500);
    });
  },
  
  createCategory: async (categoryData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCategory = {
          id: String(categories.length + 1),
          ...categoryData,
          slug: categoryData.name.toLowerCase().replace(/ /g, '-'),
        };
        
        categories.push(newCategory);
        resolve(newCategory);
      }, 1000);
    });
  },
  
  deleteCategory: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = categories.length;
        categories = categories.filter((category) => category.id !== id);
        
        if (categories.length < initialLength) {
          resolve(id);
        } else {
          reject({ message: 'Category not found' });
        }
      }, 1000);
    });
  },
};

export default categoryService;